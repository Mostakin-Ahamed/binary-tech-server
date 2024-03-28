const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
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

    const products = client.db("Binary-Tech-DB").collection("Products")
    const phones = client.db("Binary-Tech-DB").collection("Phones")
    const mobo = client.db("Binary-Tech-DB").collection("Mother-Boards")
    const cpu = client.db("Binary-Tech-DB").collection("CPU")
    const gpu = client.db("Binary-Tech-DB").collection("GPU")
    const ram = client.db("Binary-Tech-DB").collection("RAM")
    const cpucooler = client.db("Binary-Tech-DB").collection("CPU-Cooler")

    app.get('/products', async(req, res)=>{
        const result = await products.find().toArray()
        res.send(result)

    })
    app.get('/phones', async(req, res)=>{
        const result = await phones.find().toArray()
        res.send(result)
    })
    app.get('/motherBoard', async(req, res)=>{
        const result = await mobo.find().toArray()
        res.send(result)
    })
    app.get('/cpu', async(req, res)=>{
        const result = await cpu.find().toArray()
        res.send(result)
    })
    app.get('/gpu', async(req, res)=>{
        const result = await gpu.find().toArray()
        res.send(result)
    })
    app.get('/ram', async(req, res)=>{
        const result = await ram.find().toArray()
        res.send(result)
    })
    app.get('/cpu_cooler', async(req, res)=>{
        const result = await cpucooler.find().toArray()
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


app.get('/',(req, res) =>{
    res.send("Binary Tech Server is running")
})

app.listen(port, ()=>{
    console.log(`Binary Tech Server is running on port ${port}`);
})