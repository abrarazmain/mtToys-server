const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PUSS}@cluster0.wa4fr1c.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
      const toyCollection = client.db("toyDB").collection("toys");
      

      app.get('/allToys/:category', async (req, res) => { 
          const category = req.params.category;
          if (category == 'Sports Car' || category == 'Truck' || category == 'Regular Car') {
              const result = await toyCollection.find({ category: category }).toArray();
              return res.send(result)
          }
          const result = await toyCollection.find({}).toArray()
          console.log(category);
          res.send(result)
      })

    app.post("/toys", async (req, res) => {
      const toy = req.body;
      const result = await toyCollection.insertOne(toy);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toys is running");
});

app.listen(port, () => {
  console.log(`myToys is running on port ${port}`);
});
