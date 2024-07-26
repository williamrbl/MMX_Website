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

console.log("=======>", uri)

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

//Get content
app.get("/data", async (req, res) => {
	try {
		await client.connect()
		const database = client.db(process.env.DATABASE)
		const collection = database.collection("Arena")
		const data = await collection.find({}).toArray()
		res.json(data)
	} catch (err) {
		res.status(500).send(err.message)
	} finally {
		await client.close()
	}
})

//Listen
app.listen(3000)
