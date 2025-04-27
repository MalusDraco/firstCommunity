const {MongoClient} = require("mongodb");
const express = require("express")
const app = express();
let client;

async function establishConnection() {
    const uri = "mongodb://localhost:27017/?appName=firstResponderApp&directConnection=true&serverSelectionTimeoutMS=2000";
    client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected successfully to server");
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    return client
}

async function test() {
    try {
        await insertEMTEvent("testDesc", "path/testPic", "testTitle", "testAddr", 1, 1, "2025-04-25", "testTime", "testOrg");
        let arr = await getEMTEvents();
        console.log(arr)

        console.log("==========================")

        // await deleteDone();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function getEMTEvents() {
    const db = client.db("events");
    const events = db.collection("EMT");
    const result = await events.find().project({_id: 0});
    return result.toArray();
}

async function insertEMTEvent(desc, pic, title, addr, long, lat, date, time, org) {
    const db = client.db("events");
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

    let result = await events.insertOne(doc);
    console.log(result);
}

async function getFireEvents() {
    const db = client.db("events");
    const events = db.collection("Fire");
    const result = await events.find().project({_id: 0});
    return result.toArray();
}

async function insertFireEvent(desc, pic, title, addr, long, lat, date, time, org) {
    const db = client.db("events");
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

    let result = await events.insertOne(doc);
    console.log(result);
}

async function getPoliceEvents() {
    const db = client.db("events");
    const events = db.collection("Police");
    const result = await events.find().project({_id: 0});
    return result.toArray();
}

async function insertPoliceEvent(desc, pic, title, addr, long, lat, date, time, org) {
    const db = client.db("events");
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

    let result = await events.insertOne(doc);
    console.log(result);
}

async function getCommunityEvents() {
    const db = client.db("events");
    const events = db.collection("Community");
    const result = await events.find().project({_id: 0});
    return result.toArray();
}

async function insertCommunityEvent(desc, pic, title, addr, long, lat, date, time, org) {
    const db = client.db("events");
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

    let result = await events.insertOne(doc);
    console.log(result);
}

async function deleteDone() {
    const db = client.db('events');
    const events = db.collection("EMT");

    let currDate = new Date().toISOString();

    let result = await events.deleteMany({date: {$lt: currDate}});
    console.log(result);

}

establishConnection();
test();

// This is similar to RestAPI in Java
/* ==================================
            Event Getters
 ================================== */

app.get("/emtEvents", async (req, res) => {
    let client = establishConnection();
    let arr = await getEMTEvents();
    res.send(arr);
});

/* ==================================
            Event Setters
 ================================== */


app.listen(3000, () => {
    console.log("Server running on port 3000");
})