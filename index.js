const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const app = express();
const ObjectId = require('mongodb').ObjectId;
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
        const favouritefilterCollection = database.collection('favouritefilters')

        //GET API for geting filters item from db
        app.get('/filters', async (req,res)=>{
            const cursor = filtersCollection.find({}) 
            const filters = await cursor.toArray()
            res.send(filters)
        })

        app.get('/filtermanagement/:id', async (req,res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const filter = await favouritefilterCollection.findOne(query)
            // console.log('load users with id', id);
            res.send(filter)
        })


        //POST API for posting filters into db
        app.post('/filters', async (req,res)=>{
            const newFilter = req.body
            const result = await filtersCollection.insertOne(newFilter)
            // console.log('new filter added', req.body)
            res.json(result)
        })

        //POST API for posting favourite filters into db
        app.post('/favouritefilters', async(req,res)=>{
            const newFabouriteFilter = req.body
            const result = await favouritefilterCollection.insertOne(newFabouriteFilter)
            res.json(result)
        })
        //GET API for geting favourite filters item from db
        app.get('/favouritefilters', async (req,res)=>{
            const cursor = favouritefilterCollection.find({})
            const favouritefilters = await cursor.toArray()
            res.send(favouritefilters)
        })

        //UPDATE API
        app.put('/filtermanagement/:id', async(req,res)=>{
            const id = req.params.id
            const updatedFilter = req.body
            // console.log(updatedFilter);
            const filter = {_id: ObjectId(id)}
            // console.log(filter)
            const options = {upsert: true}
            const updateDoc = {
                $set: {
                  title: updatedFilter.title,
                  request: updatedFilter.request,
                  transportation: updatedFilter.transportation,
                  cities: updatedFilter.cities
                },
              };
              const result = await favouritefilterCollection.updateOne(filter, updateDoc, options)
            //  console.log('updating user', id)
             res.json(result)
        })

        //DELETE API for deleting favourite filter
        app.delete('/favouritefilters/:id', async(req,res)=>{
         const id = req.params.id
         const query ={_id: ObjectId(id)}
         const result = await favouritefilterCollection.deleteOne(query)
        //  console.log('deleting filters id', id)
         res.json(result)
        })
        //DELETE API for deleting filter
        app.delete('/filters/:id', async(req,res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await filtersCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("running my filter server");
  });
  
  app.listen(port, () => {
    console.log("Running server on port", port);
  });



