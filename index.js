const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors());
app.use(express.json());

//4QXgCUS5PQYU2fu8
app.get('/', (res, req) => {
    req.send(`${port} Food forest server is running`)
})

app.listen(port, () => {
    console.log(`Server now is runnig ${port}`);
})


const uri = "mongodb+srv://foods:4QXgCUS5PQYU2fu8@cluster0.risshmy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try {
        await client.connect();
        console.log("mongoDB connected by express js kopi");


    } 
    catch (error) {
        
    }
}

run().catch(console.dir);


const Foods = client.db('service').collection('foods');

app.get('/foods', async(req, res)=>{
    try {

        const size = parseInt(req.query.limit)
 
        const cursor = Foods.find().limit(size);
        const foods = await cursor.toArray();
        res.send(foods)
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            error: error.message
        })
    }
})