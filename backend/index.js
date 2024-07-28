require("dotenv").config({path: "./.env"})

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

//Express setup

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())

//MongoDB setup

const {MongoClient, ServerApiVersion} = require("mongodb")
const uri = process.env.URI

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
})

async function run() {
	try {
		await client.connect()
		await client.db("admin").command({ping: 1})
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		)
	} finally {
		await client.close()
	}
}
run().catch(console.dir)

//Get list of collections
app.get("/listCollections", async (req, res) => {
	try {
		await client.connect()
		const database = client.db(process.env.DATABASE)
		const collections = await database.listCollections().toArray()
		res.json(collections)
	} catch (err) {
		res.status(500).send({message: err.message})
	}
})

//Get photos
app.get("/photos/:name", async (req, res) => {
	try {
		await client.connect()
		const database = client.db(process.env.DATABASE)
		const collections = await database.listCollections().toArray()
		res.json(collections)
	} catch (err) {
		res.status(500).send(err.message)
	} finally {
		await client.close()
	}
})

// Create a new collection

app.post("/createCollection", async (req, res) => {
	try {
		await client.connect()
		const database = client.db(process.env.DATABASE)
		await database.createCollection(req.body.name)
		res.status(201).send(`Collection ${req.body.name} created successfully`)
	} catch (err) {
		res.status(500).send(err.message)
	} finally {
		await client.close()
	}
})

//Delete a collection
app.post("/deleteCollection", async (req, res) => {
	try {
		await client.connect()
		const database = client.db(process.env.DATABASE)
		await database.collection.remove(req.body.name)
		res.status(201).send(`Collection ${req.body.name} removed successfully`)
	} catch (err) {
		res.status(500).send(err.message)
	} finally {
		await client.close()
	}
})

//Listen
app.listen(3000)
