const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// const admin = require("firebase-admin");
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@shabitahtashamsongi.g8drgqr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        console.log(' data ar connected')
        const database = client.db("songi");
        const ContactCollection = database.collection("contacts");


        //Get contact API
        app.get('/contacts', async (req, res) => {
            const cursor = ContactCollection.find({});
            const contact = await cursor.toArray();
            res.send(contact);
        });
        // get limited contact Api
        app.get('/contacts/limited', async (req, res) => {
            const cursor = ContactCollection.find({}).limit(6);
            const contact = await cursor.toArray();
            res.send(contact);
        });
        //Post contacts API
        app.post('/contacts', async (req, res) => {
            const contacts = req.body;
            const result = await ContactCollection.insertOne(contacts);
            res.json(result);
        });

        //Delete Single API 
        app.delete('/contacts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ContactCollection.deleteOne(query);
            res.json(result);

        });





    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)


//Server Root Directory
app.get('/', (req, res) => {
    res.send(' Running Server Root Directorys');
});
// Server Port Listening
app.listen(port, () => {
    console.log(`Server Listening The Port`, port);
});