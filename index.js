require('dotenv').config()
const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//artCraft
//MyORTn0mr1StBrjh

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elzgrcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const artCollection = client.db('artDB').collection('art');

    //get craft
    app.get("/craft", async (req, res) => {
      const cursor = artCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    //specific craft
    app.get("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.findOne(query);
      res.send(result)
    })
    //find customization
    app.get("/myValue/:customization", async (req, res) => {
      const result = await artCollection.find({ customization: req.params.customization }).toArray();
      res.send(result);
    })
    //my added craft item
    app.get("/myCraft/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await artCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })

    //update myCraft
    app.put("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const craft = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCraft = {
        $set: {
          userName: craft.userName,
          itemName: craft.itemName,
          subcategory: craft.subcategory,
          price: craft.price,
          rating: craft.rating,
          processTime: craft.processTime,
          image: craft.image,
          customization: craft.customization,
          stockStatus: craft.stockStatus,
          description: craft.description,
        }
      }
      const result = await artCollection.updateOne(filter, updateCraft, options);
      res.send(result);
    })

    //delete craft
    app.delete("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await artCollection.deleteOne(query);
      res.send(result);
    })

    //create craft
    app.post("/craft", async (req, res) => {
      const craftItem = req.body;
      const result = await artCollection.insertOne(craftItem);
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Art and Craft is Running')
})

app.listen(port, () => {
  console.log(`Running port on ${port}`);
})