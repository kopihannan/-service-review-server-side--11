const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());
require('dotenv').config();

//4QXgCUS5PQYU2fu8
app.get('/', (res, req) => {
  req.send(`${port} Food forest server is running`)
})

app.listen(port, () => {
  console.log(`Server now is runnig ${port}`);
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.risshmy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    console.log("mongoDB connected by express js kopi");


  }
  catch (error) {

  }
}

run().catch(console.dir);


const Foods = client.db('service').collection('foods');
const Review = client.db('review').collection('user');

app.get('/foods', async (req, res) => {
  try {

    const size = parseInt(req.query.limit)

    const cursor = Foods.find().limit(size);
    const foods = await cursor.toArray();
    res.send(foods);
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error: error.message
    })
  }
})

app.get('/foods/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) }
    const food = await Foods.findOne(query)
    res.send(food)
  }
  catch (error) {
    console.log(error);
  }
})

app.get('/reviews', async (req, res) => {
  try {
    let query = {};

    // if (req.query.email) {
    //   query = {
    //     email: req.query.email
    //   }
    // }

    console.log(req.query.service);

    if (req.query.service) {
      query = {
        service: req.query.service
      }
    }

    const cursor = Review.find(query);
    const reviews = await cursor.toArray();
    res.send(reviews)
  } catch (error) {

  }
})

app.post('/reviews', async (req, res) => {
  try {
    const review = req.body;
    const result = await Review.insertOne(review);
    res.send(result)
  } catch (error) {
    console.log(error);
  }
})