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

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' });
    }
    req.decoded = decoded;
    next();
  })
}


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
const UserCollection = client.db('email').collection('users');

// jwt token email user
app.post('/user', (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
    res.send({ token })
  } catch (error) {
    console.log("tokennnn", error);
  }
})

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

app.get('/reviews', verifyJWT, async (req, res) => {
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

app.post('/reviews', verifyJWT, async (req, res) => {
  try {
    const review = req.body;
    const result = await Review.insertOne(review);
    res.send(result)
  } catch (error) {
    console.log(error);
  }
})

app.get('/reviews/:id', verifyJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const user = await Review.findOne(query);
    res.send(user);
  } catch (error) {

  }
})

app.put('/reviews/:id', verifyJWT, async (req, res) => {
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



app.delete('/reviews/:id', verifyJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await Review.deleteOne(query);
    res.send(result)
  } catch (error) {

  }
})

