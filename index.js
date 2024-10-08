 const express = require('express');
 const app =express();
 const cors = require("cors")

 const stripe = require('stripe')('sk_test_51Q3IOXE68OleLO4O5LskrzTejaxlvEAXGXMK5dZrW5lSLvHc2vRsNVmpDF0trmt6WyMfQhCos57krJtuk54Shgyx00RUF2LrKH');

 const port = 5000

//  middleware

app.use (cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://MoazzemBhuiyan:QcJhmtPr3KGVLjCN@cluster0.7kns6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// const uri = "mongodb://localhost:27017/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const packegeCollection = client.db("traveldb").collection("packege")

    const cartsCollection = client.db("traveldb").collection("bookingcarts")


// packege related api

app.get('/packege',async (req, res) => {
    const result = await packegeCollection.find().toArray();
    res.send(result);

});

// carts related apii

app.post('/addcarts',async (req, res) => {

    const cartinfo = req.body;
    const result =await cartsCollection.insertOne(cartinfo)
    res.send(result)
    
});

app.get('/addcarts',async (req, res) => {
    const email = req.query.email;
    const query = {email:email}
    const result = await cartsCollection.find(query).toArray();
    res.send(result)
    
});

app.delete('/addcarts/:id', async(req, res) => {

  const id =req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await cartsCollection.deleteOne(query)
  res.send(result)
  
});


// payment related Api 
app.post('/create-payment-intent', async (req, res) => {
  const { price } = req.body;
  console.log('Received price:', price); // Check the received price
  const amount = parseInt(price * 100); // Convert to cents
  console.log('Converted amount:', amount); // Check the converted amount

  if (amount < 50) {
      return res.status(400).send({ error: "Minimum charge amount is $0.50." });
  }

  try {
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'usd',
          payment_method_types: ['card']
      });

      res.send({
          clientSecret: paymentIntent.client_secret
      });
  } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).send({ error: error.message });
  }
});













    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Server is Running");
  });
  
  app.listen(port,() => {
    console.log(`Server started on port${port}`);
  });
  