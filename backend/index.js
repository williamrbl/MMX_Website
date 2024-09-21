const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const ExcelJS = require("exceljs");
const fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { v4: UUID } = require("uuid");
const busboy = require("busboy");
const os = require("os");
const nodemailer = require("nodemailer");
const utils = require("./utils.ts");
require("dotenv").config({ path: "./.env" });

/*
config express
*/

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

//MONGO

const { ConnectionString } = require("mongodb-connection-string-url");

const connectionString = process.env.MONGO_URI;

if (!connectionString) {
  console.error("MONGO_URI environment variable is not set");
  process.exit(1);
}

let url;
try {
  const connectionUrl = new ConnectionString(connectionString);
  url = connectionUrl.toString();
} catch (error) {
  console.error("Error parsing connection string:", error.message);
  process.exit(1);
}

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

connectToMongoDB();

// Firestorage setup

const serviceAccountKey = process.env.VUE_APP_serviceAccountKey;

if (!serviceAccountKey) {
  console.error("No serviceAccountKey defined");
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountKey);
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
});

const firebase_db = admin.firestore();
let bucket = admin.storage().bucket();

//Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//COLLECTION SETUP-------------------------------------------------------------------------------------------------------

// Get list of collections
app.get("/listCollections", async (req, res) => {
  try {
    const database = client.db(process.env.DATABASE);
    const collections = await database.listCollections().toArray();
    res.json(collections);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get photos
app.get("/photos/:name", async (req, res) => {
  try {
    const database = client.db(process.env.DATABASE);
    const collection = database.collection(req.params.name);
    const documents = await collection.find({}).toArray();
    res.json(documents);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create collection
app.post("/createCollection", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const uuid = UUID();
  const bb = busboy({ headers: req.headers });

  const fields = {};
  let fileData = {};
  let collectionName = "";

  // Handle file upload
  bb.on("file", (name, file, info) => {
    const { mimeType } = info;
    console.log(`File [${name}]: mimeType: %j`, mimeType);

    if (!collectionName) {
      console.error("Collection name not provided");
      return res.status(400).send("Collection name is required");
    }

    const filepath = path.join(os.tmpdir(), `${collectionName}.png`); // Use collection name
    const writeStream = fs.createWriteStream(filepath);

    file.pipe(writeStream);

    fileData = { filepath, mimeType, filename: `${collectionName}.png` }; // Use the collection name

    // writeStream.on("close", () => {
    //   console.log(`File [${collectionName}.png] written to ${filepath}`);
    // });
  });

  bb.on("field", (fieldname, val) => {
    fields[fieldname] = val;
    if (fieldname === "name") {
      collectionName = val; // Capture the collection name from the form field
    }
  });

  bb.on("close", async () => {
    try {
      if (!collectionName) {
        console.error("Collection name is not provided");
        return res.status(400).send("Collection name is required");
      }

      await bucket.upload(fileData.filepath, {
        destination: `collections/${collectionName}.png`, // Use collection name
        uploadType: "media",
        metadata: {
          contentType: fileData.mimeType,
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
      });
      await createCollection();

      res
        .status(201)
        .send(`Collection ${fields.name} created successfully with data`);
    } catch (err) {
      console.error("Error during file upload or database operation:", err);
      res.status(500).send(err.message);
    } finally {
      if (fs.existsSync(fileData.filepath)) {
        fs.unlinkSync(fileData.filepath);
      }
    }
  });

  req.pipe(bb);

  async function createCollection() {
    try {
      const database = client.db(process.env.DATABASE);
      const { name, date } = fields;
      const imgURL = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(
        `collections/${collectionName}.png`
      )}?alt=media&token=${uuid}`;

      const newCollection = {
        _id: "Titre",
        date: new Date(date),
        img: imgURL,
        nom: name,
      };

      await database.collection(name.toLowerCase()).insertOne(newCollection);
    } catch (err) {
      throw new Error(
        "Error inserting collection into database: " + err.message
      );
    }
  }
});

app.post("/deleteCollection", async (req, res) => {
  try {
    const collectionName = req.body.name;

    if (!collectionName) {
      return res.status(400).send("Collection name is required");
    }

    const collectionFolderPath = `photos/${collectionName}/`;
    const collectionFilePath = `collections/${collectionName}.png`;

    const [files] = await bucket.getFiles({ prefix: collectionFolderPath });
    const deletePromises = files.map((file) => file.delete());

    deletePromises.push(bucket.file(collectionFilePath).delete());

    await Promise.all(deletePromises);
    console.log(
      `All files and ${collectionFilePath} deleted from Firebase Storage`
    );

    // Delete the MongoDB collection
    const database = client.db(process.env.DATABASE);
    await database.collection(collectionName).drop();
    console.log(`Collection ${collectionName} removed from database`);

    res
      .status(200)
      .send(`Collection ${collectionName} and its images removed successfully`);
  } catch (err) {
    console.error("Error deleting collection or file:", err);
    res.status(500).send(err.message);
  }
});

app.post("/uploadPhotos", upload.any(), async (req, res) => {
  try {
    const { collection } = req.body;
    const files = req.files;

    if (!collection || !files || files.length === 0) {
      return res.status(400).send("Collection and files are required");
    }

    await client.connect();
    const db = client.db(process.env.DATABASE);
    const mongoCollection = db.collection(collection);

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uuid = UUID();
        const fileName = `photos/${collection}/${collection}-${uuid}.jpg`;
        const fileUpload = bucket.file(fileName);

        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        stream.on("error", (err) => {
          console.error("Error uploading file to Firebase Storage:", err);
          reject(err);
        });

        stream.on("finish", async () => {
          try {
            await fileUpload.makePublic();
            const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            const photo = {
              _id: uuid,
              photo: fileUrl,
            };
            const result = await mongoCollection.insertOne(photo);

            if (result.insertedCount === 0) {
              reject(new Error("Failed to insert document into MongoDB"));
            } else {
              resolve();
            }
          } catch (err) {
            reject(err);
          }
        });

        stream.end(file.buffer);
      });
    });

    await Promise.all(uploadPromises);
    res.status(200).send("Photos uploaded successfully");
  } catch (err) {
    console.error("Error in /uploadPhotos route:", err);
    res.status(500).send(err.message);
  }
});

//CAROUSSEL SETUP -----------------------------------------------------------------------------------------------------------
// Get articles
app.get("/articles", async (req, res) => {
  try {
    const collection = client.db("Caroussel").collection("articles");
    const objects = await collection.find({}).toArray();
    res.json(objects);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching objects");
  }
});

// Add caroussel page

app.post("/addCaroussel", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const bb = busboy({ headers: req.headers });

  const fields = {};
  let fileData = {};
  let photoFile = null;

  const uuid = UUID();

  // Handle file upload
  bb.on("file", (name, file, info) => {
    const { mimeType } = info;

    const tempFilePath = path.join(os.tmpdir(), name);
    const writeStream = fs.createWriteStream(tempFilePath);

    file.pipe(writeStream);

    fileData = { tempFilePath, mimeType };

    // writeStream.on("close", () => {
    //   console.log(`File [${name}] written to ${tempFilePath}`);
    // });
  });

  // Handle form fields
  bb.on("field", (fieldname, val) => {
    fields[fieldname] = val;
  });

  bb.on("finish", async () => {
    try {
      const { description, _id } = fields;

      let photoURL = "";
      if (fileData.tempFilePath) {
        const destinationFileName = `${_id}.png`; // Use _id as the filename

        await bucket.upload(fileData.tempFilePath, {
          destination: `caroussel/${destinationFileName}`,
          uploadType: "media",
          metadata: {
            contentType: fileData.mimeType,
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
        });

        photoURL = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(
          `caroussel/${destinationFileName}`
        )}?alt=media&token=${uuid}`;
      }

      const newArticle = {
        _id: _id,
        type: "article",
        article: "",
        description: description,
        photo: photoURL,
      };

      const collection = client.db("Caroussel").collection("articles");
      await collection.insertOne(newArticle);

      res.status(201).send("Caroussel item added successfully");
    } catch (err) {
      console.error("Error adding caroussel item:", err);
      res.status(500).send("Error adding caroussel item");
    } finally {
      // Clean up the temporary file
      if (fileData.tempFilePath && fs.existsSync(fileData.tempFilePath)) {
        fs.unlinkSync(fileData.tempFilePath);
      }
    }
  });

  req.pipe(bb);
});

app.post("/updateArticlePhoto", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const bb = busboy({ headers: req.headers });
  const fields = {};
  let fileData = {};
  const uuid = UUID();

  // Handle file upload
  bb.on("file", (name, file, info) => {
    const { mimeType } = info;
    const tempFilePath = path.join(os.tmpdir(), name);
    const writeStream = fs.createWriteStream(tempFilePath);

    file.pipe(writeStream);

    fileData = { tempFilePath, mimeType };

    // writeStream.on("close", () => {
    //   console.log(`File [${name}] written to ${tempFilePath}`);
    // });
  });

  bb.on("field", (fieldname, val) => {
    fields[fieldname] = val;
  });

  bb.on("finish", async () => {
    try {
      const { _id } = fields;
      let photoURL = "";

      if (fileData.tempFilePath) {
        const destinationFileName = `${_id}.png`;

        await bucket.upload(fileData.tempFilePath, {
          destination: `caroussel/${destinationFileName}`,
          uploadType: "media",
          metadata: {
            contentType: fileData.mimeType,
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
        });

        photoURL = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(
          `caroussel/${destinationFileName}`
        )}?alt=media&token=${uuid}`;
      }

      const collection = client.db("Caroussel").collection("articles");
      await collection.updateOne({ _id }, { $set: { photo: photoURL } });

      res.status(200).json({ message: "Article photo updated successfully" });
    } catch (err) {
      console.error("Error updating article photo:", err);
      res.status(500).send("Error updating article photo");
    } finally {
      // Clean up the temporary file
      if (fileData.tempFilePath && fs.existsSync(fileData.tempFilePath)) {
        fs.unlinkSync(fileData.tempFilePath);
      }
    }
  });

  req.pipe(bb);
});

app.post("/updateCaroussel", async (req, res) => {
  try {
    const articles = req.body;
    if (!Array.isArray(articles)) {
      return res
        .status(400)
        .send("Invalid input format. 'articles' should be an array.");
    }
    const collection = client.db("Caroussel").collection("articles");
    await collection.deleteMany({});
    await collection.insertMany(articles);
    res.status(200).send("Articles updated successfully");
  } catch (err) {
    console.error("Error updating articles:", err);
    res.status(500).send("Error updating articles");
  }
});

// Delete article
app.post("/deleteCaroussel", async (req, res) => {
  try {
    const articleId = req.body._id;
    if (!articleId) {
      return res.status(400).send("Article name is required");
    }
    const collection = client.db("Caroussel").collection("articles");
    const filePath = `caroussel/${articleId}.png`;

    await bucket.file(filePath).delete();
    console.log(`File ${filePath} deleted from Firebase Storage`);

    await collection.deleteOne({ _id: articleId });
    res.status(200).send("Article deleted successfully");
  } catch (err) {
    console.error("Error deleting article:", err);
  }
});

// Delete photo caroussel
app.post("/deletePhotoCaroussel", async (req, res) => {
  try {
    const photoID = req.body._id;
    const collection = client.db("Caroussel").collection("articles");
    await collection.updateOne({ _id: photoID }, { $set: { photo: "" } });
    res.status(200).send("Article deleted successfully");
  } catch (err) {
    console.error("Error deleting article:", err);
  }
});

//Locations---------------------------------------------------------------------------------------------------
app.get("/locations", async (req, res) => {
  try {
    const collection = client.db("Locations").collection("locations");
    const objects = await collection.find({}).toArray();
    res.json(objects);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching objects");
  }
});

app.post("/addLocation", upload.none(), async (req, res) => {
  try {
    const {
      _id,
      typeLocataire,
      association,
      start,
      end,
      paye,
      caution,
      contrat,
      pret,
      rendu,
      daterendu,
      prix,
      isRetard,
      suppRetard,
      materiel,
      demande,
      description,
      email,
    } = req.body;

    if (!_id || !association || !start || !end) {
      return res.status(400).send("Missing required fields");
    }

    const collection = client.db("Locations").collection("locations");
    const payeBool = paye === "true";
    const cautionBool = caution === "true";
    const pretBool = pret === "true";
    const renduBool = rendu === "true";
    const isRetardBool = isRetard === "true";
    const prixInt = parseInt(prix, 10) || 0;
    const suppRetardInt = parseInt(suppRetard, 10) || 0;

    let parsedMateriel;
    try {
      parsedMateriel = JSON.parse(materiel);
    } catch (err) {
      return res.status(400).send("Invalid materiel format");
    }

    const updateDoc = {
      $set: {
        typeLocataire: typeLocataire,
        association: association,
        start: start,
        end: end,
        paye: payeBool,
        caution: cautionBool,
        contrat: null,
        prete: pretBool,
        rendu: renduBool,
        daterendu: daterendu,
        prix: prixInt,
        isRetard: isRetardBool,
        suppRetard: suppRetardInt,
        materiel: parsedMateriel,
        demande: demande === "true",
        description: description,
      },
    };

    if (email && email.trim() !== "") {
      updateDoc.$set.email = email;
    }

    const result = await collection.updateOne({ _id: _id }, updateDoc, {
      upsert: true,
    });

    if (result.matchedCount > 0) {
      res.status(200).send("Location updated successfully");
    } else {
      res.status(201).send("Location added successfully");
    }
  } catch (err) {
    console.error("Error adding/updating location: ", err);
    res.status(500).send("Internal server error");
  }
});

let transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

app.post("/sendMailNewDemande", upload.none(), async (req, res) => {
  const data = req.body;
  const materiel = JSON.parse(data.materiel);

  const generateEmailContent = (data, materiel) => {
    let materialList = [];
    if (materiel.nbSB != 0) {
      materialList.push(`<li>Soundboks : ${materiel.nbSB}</li>`);
    }
    if (materiel.nbSatellite != 0) {
      materialList.push(
        `<li>FBT X-LITE 115A (Satellites) : ${materiel.nbSatellite}</li>`
      );
    }
    if (materiel.isCaisson) {
      materialList.push(
        `<li>FBT X-SUB 118SA (Caisson de basses) : ${utils.boolToNumber(
          materiel.isCaisson
        )}</li>`
      );
    }
    if (materiel.isScarlett) {
      materialList.push(
        `<li>Focusrite Scarlett 18i20 (Carte Son) : ${utils.boolToNumber(
          materiel.isScarlett
        )}</li>`
      );
    }
    if (materiel.nbMicro != 0) {
      materialList.push(`<li>Micro + Câble XLR : ${materiel.nbMicro}</li>`);
    }

    const materialListHtml =
      materialList.length > 0 ? `<ul>${materialList.join("")}</ul>` : "";

    return `
    <html>
      <body>
        <h1>Nouvelle demande de location : ${data.association}</h1>
        <p>Demande de ${data.association} du ${utils.formatDate(
      data.start
    )} jusqu'au ${utils.formatDate(data.end)} pour le matériel suivant :</p>
        ${materialListHtml}
        <p>Descrption de l'évenement : ${data.description}</p>
        <p>Magnez vous pour traiter ça sur le site bande de feignasses ...</p>
        <p>Bisous<br>Le robot des locations de Musique Mix</p>
        <img src="${process.env.LOGO_URL}" alt="Logo" />    
      </body>
    </html>
  `;
  };

  const emailContent = generateEmailContent(data, materiel);

  let mailOptions = {
    from: process.env.USER,
    to: process.env.MAIL_ASSO,
    subject: `Nouvelle demande de location - ${data.association}`,
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent: " + info.response);
    res.status(200).send("Mail envoyé");
  });
});

app.post("/sendMailDemande", upload.none(), async (req, res) => {
  const data = req.body;
  const materiel = JSON.parse(data.materiel);

  const generateEmailContent = (data, materiel) => {
    let materialList = [];
    if (materiel.nbSB != 0) {
      materialList.push(`<li>Soundboks : ${materiel.nbSB}</li>`);
    }
    if (materiel.nbSatellite != 0) {
      materialList.push(
        `<li>FBT X-LITE 115A (Satellites) : ${materiel.nbSatellite}</li>`
      );
    }
    if (materiel.isCaisson) {
      materialList.push(
        `<li>FBT X-SUB 118SA (Caisson de basses) : ${utils.boolToNumber(
          materiel.isCaisson
        )}</li>`
      );
    }
    if (materiel.isScarlett) {
      materialList.push(
        `<li>Focusrite Scarlett 18i20 (Carte Son) : ${utils.boolToNumber(
          materiel.isScarlett
        )}</li>`
      );
    }
    if (materiel.nbMicro != 0) {
      materialList.push(`<li>Micro + Câble XLR : ${materiel.nbMicro}</li>`);
    }

    const materialListHtml =
      materialList.length > 0 ? `<ul>${materialList.join("")}</ul>` : "";

    return `
    <html>
      <body>
        <h1>Hello ${data.association}!</h1>
        <p>Vous venez de faire une demande de location du ${utils.formatDate(
          data.start
        )} jusqu'au ${utils.formatDate(data.end)} pour le matériel suivant :</p>
        ${materialListHtml}
        <p>Nous avons bien pris en compte la demande et nous vous répondrons sous les plus brefs délais.</p>
        <p>A bientôt !<br>Musique Mix</p>
        <img src="${process.env.LOGO_URL}" alt="Logo" />    
      </body>
    </html>
  `;
  };

  const emailContent = generateEmailContent(data, materiel);

  let mailOptions = {
    from: process.env.USER,
    to: data.email,
    subject: "Demande de location MMX",
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent: " + info.response);
    res.status(200).send("Mail envoyé");
  });
});

app.post("/sendMailAccepte", upload.none(), async (req, res) => {
  const data = req.body;
  const materiel = data.materiel;

  const generateMaterialList = (materiel) => {
    let materialList = [];
    if (materiel.nbSB != 0) {
      materialList.push(`<li>Soundboks : ${materiel.nbSB}</li>`);
    }
    if (materiel.nbSatellite != 0) {
      materialList.push(
        `<li>FBT X-LITE 115A (Satellites) : ${materiel.nbSatellite}</li>`
      );
    }
    if (materiel.isCaisson) {
      materialList.push(
        `<li>FBT X-SUB 118SA (Caisson de basses) : ${utils.boolToNumber(
          materiel.isCaisson
        )}</li>`
      );
    }
    if (materiel.isScarlett) {
      materialList.push(
        `<li>Focusrite Scarlett 18i20 (Carte Son) : ${utils.boolToNumber(
          materiel.isScarlett
        )}</li>`
      );
    }
    if (materiel.nbMicro != 0) {
      materialList.push(`<li>Micro + Câble XLR : ${materiel.nbMicro}</li>`);
    }

    return materialList.length > 0 ? `<ul>${materialList.join("")}</ul>` : "";
  };

  const materialListHtml = generateMaterialList(materiel);

  let mailOptions = {
    from: process.env.USER,
    to: data.email,
    subject: "Demande de location MMX - Acceptée",
    html: `
    <html>
      <body>
        <h1>Hello ${data.association}!</h1>
        <p>Vous avez fait une demande de location du ${utils.formatDate(
          data.start
        )} jusqu'au ${utils.formatDate(data.end)} pour le matériel suivant :</p>
        ${materialListHtml}
        <p>Cette demande à été acceptée. Le prix à régler est de ${
          data.prix
        } euros avec une caution de 1000 euros à déposer par chèque. Vous trouverez aussi ci-joint le contrat à remplir et à nous faire parvenir lors de la récupération du matériel. Pour récupérer le matériel, envoyez-nous un message sur Instagram pour que nous fixions un horaire !</p>
        <p>A bientôt !<br>Musique Mix</p>
         <img src="${process.env.LOGO_URL}" alt="Logo" />    
      </body>
    </html>
  `,
    attachments: [
      {
        filename: "contrat.pdf",
        path: process.env.CONTRAT_URL,
        contentType: "application/pdf",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error: " + error);
    }
    console.log("Email sent: " + info.response);
  });
  res.status(200).send("Mail envoyé");
});

app.post("/sendMailRefus", upload.none(), async (req, res) => {
  const { location, justification } = req.body;
  const materiel = location.materiel;

  const generateMaterialList = (materiel) => {
    let materialList = [];
    if (materiel.nbSB != 0) {
      materialList.push(`<li>Soundboks : ${materiel.nbSB}</li>`);
    }
    if (materiel.nbSatellite != 0) {
      materialList.push(
        `<li>FBT X-LITE 115A (Satellites) : ${materiel.nbSatellite}</li>`
      );
    }
    if (materiel.isCaisson) {
      materialList.push(
        `<li>FBT X-SUB 118SA (Caisson de basses) : ${utils.boolToNumber(
          materiel.isCaisson
        )}</li>`
      );
    }
    if (materiel.isScarlett) {
      materialList.push(
        `<li>Focusrite Scarlett 18i20 (Carte Son) : ${utils.boolToNumber(
          materiel.isScarlett
        )}</li>`
      );
    }
    if (materiel.nbMicro != 0) {
      materialList.push(`<li>Micro + Câble XLR : ${materiel.nbMicro}</li>`);
    }

    return materialList.length > 0 ? `<ul>${materialList.join("")}</ul>` : "";
  };

  const materialListHtml = generateMaterialList(materiel);

  let mailOptions = {
    from: process.env.USER,
    to: location.email,
    subject: "Demande de location MMX - Refusée",
    html: `
    <html>
      <body>
        <h1>Hello ${location.association}!</h1>
        <p>Vous aviez fait une demande de location du ${utils.formatDate(
          location.start
        )} jusqu'au ${utils.formatDate(
      location.end
    )} pour le matériel suivant :</p>
        ${materialListHtml}
        <p>Malheureusement, nous ne pouvons pas y donner suite pour la raison suivante :</p>
        <p>${justification}</p>
        <p>Désolé et à bientôt !<br>Musique Mix</p>
         <img src="${process.env.LOGO_URL}" alt="Logo" />    
      </body>
    </html>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error: " + error);
    }
    console.log("Email sent: " + info.response);
  });
  res.status(200).send("Mail envoyé");
});

app.post("/updateLocation", async (req, res) => {
  try {
    let locations = req.body;
    if (Array.isArray(locations)) {
    } else if (typeof locations === "object" && locations !== null) {
      locations = [locations];
    } else {
      return res
        .status(400)
        .send(
          "Invalid input format. 'locations' should be an array or a single object."
        );
    }
    const bulkOps = locations.map((location) => ({
      updateOne: {
        filter: { _id: location._id },
        update: { $set: location },
        upsert: true,
      },
    }));
    const collection = client.db("Locations").collection("locations");
    await collection.bulkWrite(bulkOps);
    res.status(200).send("Locations updated successfully");
  } catch (err) {
    console.error("Error updating locations:", err);
    res.status(500).send("Error updating locations");
  }
});

app.post("/deleteLocation", async (req, res) => {
  try {
    const locationId = req.body._id;
    if (!locationId) {
      return res.status(400).send("Location name is required");
    }
    const collection = client.db("Locations").collection("locations");

    await collection.deleteOne({ _id: locationId });
    res.status(200).send("Location deleted successfully");
  } catch (err) {
    console.error("Error deleting renting:", err);
    res.status(500).send("Error deleting renting");
  }
});

app.post("/uploadContrat", upload.single("contrat"), async (req, res) => {
  try {
    // Check if the file and other required fields are present
    if (!req.file || !req.body._id || !req.body.association) {
      return res
        .status(400)
        .send("File, location ID, and association are required");
    }

    const file = req.file; // Use req.file to access the uploaded file
    const locationId = req.body._id;
    const asso = req.body.association;

    const fileName = `contrats/${asso}-${locationId}.pdf`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("Error uploading file to Firebase Storage:", err);
      res.status(500).send("Error uploading file");
    });

    stream.on("finish", async () => {
      try {
        await fileUpload.makePublic();
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        await client.connect();
        const db = client.db("Locations");
        const collection = db.collection("locations");

        const result = await collection.updateOne(
          { _id: locationId },
          { $set: { contrat: fileUrl } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).send("Location not found");
        }

        res
          .status(200)
          .send("Contract uploaded and location updated successfully");
      } catch (err) {
        console.error("Error updating database:", err);
        res.status(500).send("Error updating database");
      }
    });

    stream.end(file.buffer);
  } catch (err) {
    console.error("Error in /uploadContrat endpoint:", err);
    res.status(500).send("Error processing request");
  }
});

app.post("/removeContract", upload.none(), async (req, res) => {
  try {
    const { _id, association } = req.body;

    if (!_id || !association) {
      return res.status(400).send("Location ID and association are required");
    }

    const fileName = `contrats/${association}-${_id}.pdf`;
    const file = bucket.file(fileName);

    await file.delete();

    await client.connect();
    const db = client.db("Locations");
    const collection = db.collection("locations");

    const result = await collection.updateOne(
      { _id: _id },
      { $set: { contrat: null } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send("Location not found or contract was already null");
    }

    res.status(200).send("Contract removed and location updated successfully");
  } catch (err) {
    console.error("Error in /removeContract endpoint:", err);
    res.status(500).send("Error processing request");
  }
});

app.post("/exportExcel", async (req, res) => {
  try {
    const db = client.db("Locations");
    const collection = db.collection("locations");

    const data = await collection.find().toArray();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Locations");

    if (data.length > 0) {
      const columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key: key,
      }));
      worksheet.columns = columns;

      data.forEach((item) => worksheet.addRow(item));
    }

    const excelFilePath = "Locations.xlsx";
    await workbook.xlsx.writeFile(excelFilePath);

    res.status(200).send("Data exported to Excel successfully");
  } catch (err) {
    console.error("Error in /exportExcel endpoint:", err);
    res.status(500).send("Error processing request");
  }
});

app.post("/accepterDemande", async (req, res) => {
  try {
    id = req.body._id;

    if (!id) {
      return res.status(400).send("ID is required");
    }
    const db = client.db("Locations");

    const result = await db
      .collection("locations")
      .updateOne({ _id: id }, { $unset: { demande: "" } });

    if (result.modifiedCount === 0) {
      return res.status(404).send("No document found with the given ID");
    }

    res.status(200).send("Demande validée");
  } catch (err) {
    console.error("Erreur lors de la validation de la demande", err);
    res.status(500).send("Error processing request");
  }
});

// Listen-----------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
