require("dotenv").config({path: "./.env"})

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const multer = require("multer")
const mongoose = require("mongoose")
const path = require("path")
const crypto = require("crypto")
const fs = require("fs")
const {
	MongoClient,
	ServerApiVersion,
	GridFSBucket,
	ObjectId,
} = require("mongodb")
const {GridFsStorage} = require("multer-gridfs-storage")

// Express setup
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())

// MongoDB setup
const uri = process.env.URI

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
})

async function connectToDatabase() {
	try {
		await client.connect()
		console.log("Connected to MongoDB")
	} catch (err) {
		console.error("Error connecting to MongoDB", err)
	}
}

connectToDatabase().catch(console.dir)

// Get list of collections
app.get("/listCollections", async (req, res) => {
	try {
		const database = client.db(process.env.DATABASE)
		const collections = await database.listCollections().toArray()
		res.json(collections)
	} catch (err) {
		res.status(500).send({message: err.message})
	}
})

// Get photos
app.get("/photos/:name", async (req, res) => {
	try {
		const database = client.db(process.env.DATABASE)
		const collection = database.collection(req.params.name)
		const documents = await collection.find({}).toArray()
		res.json(documents)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

// Create a new collection
app.post("/createCollection", upload.single("cover"), async (req, res) => {
	try {
		const database = client.db(process.env.DATABASE)
		const {name, date} = req.body
		const cover = req.file

		if (!cover) {
			return res.status(400).json({message: "Cover image is required"})
		}

		// Construct image URL
		const imgURL = `${req.protocol}://${req.get("host")}/uploads/${
			cover.filename
		}`

		const newCollection = {
			_id: new Date().getTime().toString(), // Using current timestamp as a unique _id
			date: new Date(date),
			img: imgURL,
			nom: name,
		}

		await database.collection(name).insertOne(newCollection)
		res.status(201).send(`Collection ${name} created successfully with data`)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

// Delete a collection
app.post("/deleteCollection", async (req, res) => {
	try {
		const database = client.db(process.env.DATABASE)
		await database.collection(req.body.name).drop()
		res.status(201).send(`Collection ${req.body.name} removed successfully`)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

// Get articles
app.get("/articles", async (req, res) => {
	try {
		const collection = client.db("Caroussel").collection("articles")
		const objects = await collection.find({}).toArray()
		res.json(objects)
	} catch (err) {
		console.error(err)
		res.status(500).send("Error fetching objects")
	}
})

// Add caroussel page
const articleSchema = new mongoose.Schema({
	_id: String,
	type: String,
	description: String,
	article: String,
	photo: String,
})
const Article = mongoose.model("Article", articleSchema, "articles")

app.post("/addCarousselPage", upload.none(), async (req, res) => {
	try {
		await mongoose.connect(`${uri}`, {
			useUnifiedTopology: true,
		})
		const {_id, type, description, article, photo} = req.body
		const newArticle = new Article({
			_id,
			type,
			description,
			article: article || "",
			photo: photo || "",
		})
		const collection = client.db("Caroussel").collection("articles")
		collection.insertOne(newArticle)
		res.status(200).send("Article added successfully")
	} catch (error) {
		console.error("Error adding article:", error)
		res.status(500).send("Server error")
	}
})

// Delete article
app.post("/deleteCarousselPage", upload.none(), async (req, res) => {
	try {
		const articleId = req.body._id
		const collection = client.db("Caroussel").collection("articles")
		collection.deleteOne({_id: articleId})
		res.status(200).send("Article deleted successfully")
	} catch (err) {
		console.error("Error deleting article:", err)
	}
})

// Delete photo caroussel
app.post("/deletePhotoCaroussel", upload.none(), async (req, res) => {
	try {
		const photoID = req.body._id
		const collection = client.db("Caroussel").collection("articles")
		await collection.updateOne({_id: photoID}, {$set: {photo: ""}})
		res.status(200).send("Article deleted successfully")
	} catch (err) {
		console.error("Error deleting article:", err)
	}
})

// add photo to caroussel
app.post("/addPhotoCaroussel", upload.single("photo"), async (req, res) => {})

// Listen
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

// Debugging and error handling for GridFS
GridFSBucket.prototype.emitFile = function (f) {
	if (!f) {
		console.error("File object is undefined")
		return
	}
	console.log("File object:", f)
	this.emit("file", {
		id: f._id,
		filename: f.filename,
		metadata: f.metadata,
		bucketName: this.bucketName,
	})
}
