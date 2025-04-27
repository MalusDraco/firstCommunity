const {MongoClient} = require("mongodb");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express(); // Enable resource access from client

// Post req Parsers
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});


class db {

    constructor() {
        this.establishConnection();
    }

    async establishConnection() {
        const uri = "mongodb://localhost:27017/?appName=firstResponderApp&directConnection=true&serverSelectionTimeoutMS=2000";
        this.client = new MongoClient(uri);
        try {
            await this.client.connect();
            console.log("Connected successfully to server");
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    async test() {
        try {
            await this.insertEMTEvent("testDesc", "path/testPic", "testTitle", "testAddr", 1, 1, "2025-04-25", "testTime", "testOrg");
            let arr = await this.getEMTEvents();
            console.log(arr)

            console.log("==========================")

            // await this.deleteDone();
        } catch (e) {
            console.error(e);
        } finally {
            await this.client.close();
        }
    }

    async getEMTEvents() {
        const db = this.client.db("events");
        const events = db.collection("EMT");
        const result = await events.find().project({_id: 0});
        return result.toArray();
    }

    insertEMTEvent(desc, pic, title, addr, long, lat, date, time, org) {
        const db = this.client.db("events");
        const events = db.collection("EMT");
        date = new Date(date).toISOString();

        const doc = {
            "description": desc,
            "picture": pic,
            "title": title,
            "location": [{"address": addr, "long": long, "lat": lat}],
            "date": date,
            "time": time,
            "organization": org
        }

        let result = events.insertOne(doc);
        console.log(result);
    }

    async getFireEvents() {
        const db = this.client.db("events");
        const events = db.collection("Fire");
        const result = await events.find().project({_id: 0});
        return result.toArray();
    }

    insertFireEvent(desc, pic, title, addr, long, lat, date, time, org) {
        const db = this.client.db("events");
        const events = db.collection("Fire");
        date = new Date(date).toISOString();

        const doc = {
            "description": desc,
            "picture": pic,
            "title": title,
            "location": [{"address": addr, "long": long, "lat": lat}],
            "date": date,
            "time": time,
            "organization": org
        }

        let result = events.insertOne(doc);
        console.log(result);

    }

    async getPoliceEvents() {
        const db = this.client.db("events");
        const events = db.collection("Police");
        const result = await events.find().project({_id: 0});
        return result.toArray();
    }

    insertPoliceEvent(desc, pic, title, addr, long, lat, date, time, org) {
        const db = this.client.db("events");
        const events = db.collection("Police");
        date = new Date(date).toISOString();

        const doc = {
            "description": desc,
            "picture": pic,
            "title": title,
            "location": [{"address": addr, "long": long, "lat": lat}],
            "date": date, // YYYY-MM-DD
            "time": time,
            "organization": org
        }

        let result = events.insertOne(doc);
        console.log(result);
    }

    async getCommunityEvents() {
        const db = this.client.db("events");
        const events = db.collection("Community");
        const result = await events.find().project({_id: 0});
        return result.toArray();
    }

    insertCommunityEvent(desc, pic, title, addr, long, lat, date, time, org) {
        const db = this.client.db("events");
        const events = db.collection("Community");
        date = new Date(date).toISOString();

        const doc = {
            "description": desc,
            "picture": pic,
            "title": title,
            "location": [{"address": addr, "long": long, "lat": lat}],
            "date": date, // YYYY-MM-DD
            "time": time,
            "organization": org
        }

        let result = events.insertOne(doc);
        // console.log(result);
    }

    async deleteDone() {
        const db = this.client.db('events');
        const events = db.collection("EMT");

        let currDate = new Date().toISOString();

        let result = await events.deleteMany({date: {$lt: currDate}});
        console.log(result);

    }

    async close() {
        this.client.close();
        console.log("Connection closed");
    }
}

// establishConnection();
// test();

// This is similar to RestAPI in Java
let Mongo = new db(); // Client connection used by all Getters/Setters

app.use(cors());
app.use(express.json());

/* ==================================
            Event Getters
 ================================== */

app.get("/emtEvents", async (req, res) => {
    let arr = await Mongo.getEMTEvents();
    res.send(arr);
});

/* ==================================
            Event Setters
 ================================== */

app.post("/newCommunityEvent", jsonParser,
    function (req,res) {

    // const {desc, pic, title, addr, long, lat, date, time, org} = req.body;
    // Mongo.insertCommunityEvent(desc, pic, title, addr, long, lat, date, time, org);

    console.log(req.body);

    res.send("Event added");
})

/* ==================================
           Server settings
 ================================== */
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running on port 3000");
})

// Close Mongo Connection on server stop
process.on('SIGINT', async () => {
    await Mongo.close();
    process.exit(0);
});
