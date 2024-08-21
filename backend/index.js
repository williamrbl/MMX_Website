require("dotenv").config({ path: "./.env" });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");

const fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { v4: UUID } = require("uuid");
const busboy = require("busboy");
const os = require("os");

// Express setup
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MongoDB setup
const uri = process.env.URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

connectToDatabase().catch(console.dir);

//Multer setup

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload variable with multer settings
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

// Firestorage setup

const serviceAccount = JSON.parse(process.env.VUE_APP_serviceAccountKey);
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
});

const firebase_db = admin.firestore();
let bucket = admin.storage().bucket();

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
  // Set CORS headers to allow requests from any origin
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

    writeStream.on("close", () => {
      console.log(`File [${collectionName}.png] written to ${filepath}`);
    });
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

// Delete a collection
app.post("/deleteCollection", async (req, res) => {
  try {
    const collectionName = req.body.name;

    if (!collectionName) {
      return res.status(400).send("Collection name is required");
    }

    const filePath = `collections/${collectionName}.png`;

    await bucket.file(filePath).delete();
    console.log(`File ${filePath} deleted from Firebase Storage`);

    const database = client.db(process.env.DATABASE);
    await database.collection(collectionName).drop();
    console.log(`Collection ${collectionName} removed from database`);

    res
      .status(200)
      .send(`Collection ${collectionName} and its image removed successfully`);
  } catch (err) {
    console.error("Error deleting collection or file:", err);
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
const articleSchema = new mongoose.Schema({
  _id: String,
  type: String,
  description: String,
  article: String,
  img: String,
});
const Article = mongoose.model("Article", articleSchema);

app.post("/addCaroussel", async (req, res) => {
  try {
    await mongoose.connect(`${uri}`, {
      useUnifiedTopology: true,
    });
    const { _id, type, description, article, photo } = req.body;
    const newArticle = new Article({
      _id,
      type,
      description,
      article: article || "",
      photo: photo || "",
    });
    const collection = client.db("Caroussel").collection("articles");
    collection.insertOne(newArticle);
    res.status(200).send("Article added successfully");
  } catch (error) {
    console.error("Error adding article:", error);
    res.status(500).send("Server error");
  }
});

app.post("/updateCaroussel", upload.none(), async (req, res) => {
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
app.post("/deleteCaroussel", upload.none(), async (req, res) => {
  try {
    const articleId = req.body._id;
    const collection = client.db("Caroussel").collection("articles");
    collection.deleteOne({ _id: articleId });
    res.status(200).send("Article deleted successfully");
  } catch (err) {
    console.error("Error deleting article:", err);
  }
});

// Delete photo caroussel
app.post("/deletePhotoCaroussel", upload.none(), async (req, res) => {
  try {
    const photoID = req.body._id;
    const collection = client.db("Caroussel").collection("articles");
    await collection.updateOne({ _id: photoID }, { $set: { photo: "" } });
    res.status(200).send("Article deleted successfully");
  } catch (err) {
    console.error("Error deleting article:", err);
  }
});

// Listen-----------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
