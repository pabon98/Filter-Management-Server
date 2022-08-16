const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const app = express();
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzm3u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect()
        const database = client.db('filtersdb')
        const filtersCollection = database.collection('filters')

        //GET API for geting filters item from db
        app.get('/filters', async (req,res)=>{
            const cursor = filtersCollection.find({}) 
            const filters = await cursor.toArray()
            res.send(filters)
        })

        //POST API for posting filters into db
        app.post('/filters', async (req,res)=>{
            const newFilter = req.body
            const result = await filtersCollection.insertOne(newFilter)
            // console.log('new filter added', req.body)
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("running filter server");
  });
  
  app.listen(port, () => {
    console.log("Running server on port", port);
  });



