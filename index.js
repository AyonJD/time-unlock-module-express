const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

const corsFonfig = {
    origin: true,
    Credentials: true,
}
app.use(cors(corsFonfig));
app.options("*", cors(corsFonfig));
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y4mhh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db("module");
        const classesCollection = db.collection("classes");

        app.get("/", (req, res) => {
            res.send("Server is Running");
        });

        app.get("/classes", async (req, res) => {
            const cursor = classesCollection.find({});
            const classes = await cursor.toArray();
            res.send(classes);
        });


        app.put("/classes/:id", async (req, res) => {
            const id = req.params.id;
            const unlockStatus = req.body.is_unlock;
            const query = { _id: ObjectId(id) };
            const classToUpdate = await classesCollection.findOne(query);
            const updateDoc = {
                $set: {
                    is_unlock: unlockStatus,
                },
            };
            const result = await classesCollection.updateOne(query, updateDoc);
            res.json({data: classToUpdate, result: result, status: 200, message: "New Module Unlocked"});
        });

        app.put("/classes", async (req, res) => {
            const id = req.query.id;
            const completeStatus = req.body.is_complete;
            console.log(id, completeStatus);
            const query = { _id: ObjectId(id) };
            const classToUpdate = await classesCollection.findOne(query);
            const updateDoc = {
                $set: {
                    is_complete: completeStatus,
                },
            };
            const result = await classesCollection.updateOne(query, updateDoc);
            res.json({data: classToUpdate, result: result, status: "success"});
        });


    } finally {
        // await client.close()
    }
}
run().catch(console.dir);
app.listen(port, () => console.log(`Listening on port ${port}`));