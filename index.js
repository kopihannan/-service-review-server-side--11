const express = require("express");
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());
require('dotenv').config();


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
    console.log("mongoDB connected by express js ");


  }
  catch (error) {

  }
}

run().catch(console.dir);


const Foods = client.db('service').collection('foods');
const Review = client.db('review').collection('user');
const UserCollection = client.db('review').collection('email');



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

app.post('/foods', async (req, res) => {
  try {
    const foods = req.body;
    const result = await Foods.insertOne(foods);
    res.send(result)
  } catch (error) {
    console.log(error);
  }
})

//jwt token user email



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

app.put('/reviews/:email', async (req, res) => {
  try {
    const email = req.params.email
    const user = req.body
    const filter = { email: email }
    const options = { upsert: true }
    const updateDoc = {
      $set: user,
    }
    const result = await UserCollection.updateOne(filter, updateDoc, options)
    console.log(result)

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    })
    console.log(token)
    res.send({ result, token })

  } catch (error) {
    console.log(error);
  }
})

app.get('/reviews', async (req, res) => {
  try {
    let query = {};

    if (req.query.email) {
      query = {
        email: req.query.email
      }
    }

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

app.get('/reviews/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const user = await Review.findOne(query);
    res.send(user);
  } catch (error) {

  }
})

app.put('/reviews/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const user = req.body;
    const option = { upsert: true };
    const updateReview = {
      $set: {
        message: user.message
      }
    }
    const result = await Review.updateOne(filter, updateReview, option);
    res.send(result);
  } catch (error) {

  }
})



app.delete('/reviews/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await Review.deleteOne(query);
    res.send(result)
  } catch (error) {

  }
})

