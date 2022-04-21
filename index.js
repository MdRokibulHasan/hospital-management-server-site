const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lpvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const database = client.db("online_Hospital");
    const doctorsCollection = database.collection("doctors");
    const appointmentCollection = database.collection("appointment");

    // GET doctors API
    app.get("/doctors", async (req, res) => {
      const cursor = doctorsCollection.find({});
      const doctors = await cursor.toArray();
      res.send(doctors);
      //   console.log(doctors.name);
    });
    // user book appointment
    app.post("/appointment", async (req, res) => {
      const book = req.body;
      const result = await appointmentCollection.insertOne(book);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hospital server is running");
});

app.listen(port, () => {
  console.log("server running port", port);
});
