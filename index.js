const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mostakinahamed.fo1obhn.mongodb.net/?retryWrites=true&w=majority&appName=MostakinAhamed`;

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

    const productsDB = client.db("Binary-Tech-DB").collection("Products")
    const phones = client.db("Binary-Tech-DB").collection("Phones")
    const cart = client.db("Binary-Tech-DB").collection("user-cart")
    const categories = client.db("Binary-Tech-DB").collection("category")
    const popular = client.db("Binary-Tech-DB").collection("Popular")
    const userCollection = client.db("Binary-Tech-DB").collection("User-Info")

    app.get('/products', async (req, res) => {
      const result = await productsDB.find().toArray()
      res.send(result)
    })
    app.get('/phones', async (req, res) => {
      const result = await phones.find().toArray()
      res.send(result)
    })
    app.get('/cart', async (req, res) => {
      const result = await cart.find().toArray()
      res.send(result)
    })
    app.get('/popular', async (req, res) => {
      const result = await popular.find().toArray()
      res.send(result)
    })
    app.get('/category', async (req, res) => {
      const result = await categories.find().toArray()
      res.send(result)
    })
    app.get('/userList', async (req, res) => {
      const result = await userCollection.find().toArray()
      res.send(result)
    })


    app.get('/allProducts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsDB.findOne(query);
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'Email already exists!' })
      }
      const result = await userCollection.insertOne(user);
      res.send(result);

    })

    app.post('/addToCart', async (req, res) => {
      const cartItem = req.body;
      const result = await cart.insertOne(cartItem)
      res.send(result)
    })
    app.get('/myCart', async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (req.query?.email) {
        query = { userEmail: email }
      }
      const result = await cart.find(query).toArray()
      res.send(result);
    })


    app.delete('/Wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cart.deleteOne(query);
      res.send(result)
    })
    app.get('/Wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await cart.find(query).toArray();
      res.send(result)
    })




    app.get("/allProducts", async (req, res) => {
      const name = req.query.category;
      let products = [];
      if (name == "all products") {
        products = await productsDB.find({}).toArray();
        return res.send(products);
      }
      products = await productsDB
        .find({ category: { $regex: name, $options: "i" } })
        .toArray();
      res.send(products);
    });

    app.patch('/adminCart/pending/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedRole = {
        $set: {
          status: 'Pending'
        }
      }
      const result = await cart.updateOne(filter, updatedRole)
      res.send(result)
    })
    app.patch('/adminCart/delivered/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedRole = {
        $set: {
          status: 'Delivered'
        }
      }
      const result = await cart.updateOne(filter, updatedRole)
      res.send(result)
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
  res.send("Binary Tech Server is running")
})

app.listen(port, () => {
  console.log(`Binary Tech Server is running on port ${port}`);
})