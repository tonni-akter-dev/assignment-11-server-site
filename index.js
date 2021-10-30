const { MongoClient } = require('mongodb');
const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());
// tourPlanner services
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qtpo1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("tourPlanner");
        const servicesCollection = database.collection("services");
        const bookingCollection = database.collection("totalBooking");
        const blogCollection = database.collection("blog");
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.json(result);
        });
        // my place api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query);
            res.json(result)
        });
        // total booking
        app.post('/totalBooking', async (req, res) => {
            const place = req.body;
            const result = await bookingCollection.insertOne(place);
            res.json(result);
        });
        app.get('/totalBooking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        // for update
        app.put('/totalBooking/:id', async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            console.log(req.params.id);
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'Approve'
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        app.delete('/totalBooking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query);
            res.send(result)
        })
        // blog
        app.get('/blog', async (req, res) => {
            const cursor = blogCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

























app.get('/', (req, res) => {
    res.send('Runnig the surver')
})
app.listen(port, () => {
    console.log('hitting the port', port)
})