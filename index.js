const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Vromon Server is running")
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.risshmy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('vromon').collection('service');

        app.get('/service', async (req, res)=>{
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = serviceCollection.find(query);
            const service = await cursor.skip(page*size).limit(size).toArray();
            const count = await serviceCollection.estimatedDocumentCount();
            res.send({service, count}) 
        });

        app.get('/service/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })
    }
    finally{

    }
}
run().catch(err =>console.error(err));

app.listen(port, () => {
    `Vromon server is runnig ${port}`
})