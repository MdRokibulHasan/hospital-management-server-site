const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const usersCollection = database.collection("users");
    const reviewsCollection = database.collection("reviews");

    // user post database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // user get data
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const doctors = await cursor.toArray();
      res.send(doctors);
      //   console.log(doctors.name);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    // get user admin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // Make admin api
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

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

    // user get his appointment
    app.get("/appointment", async (req, res) => {
      const cursor = appointmentCollection.find({});
      const appointment = await cursor.toArray();
      res.json(appointment);
      //   console.log(doctors.name);
    });
    // delete user appointment
    app.delete("/appointment/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await appointmentCollection.deleteOne(query);
      res.json(result);
      // console.log(result);
    });
    // added doctors
    app.post("/doctors", async (req, res) => {
      const doctors = req.body;
      const result = await doctorsCollection.insertOne(doctors);
      res.json(result);
    });
    // delete order  Product
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await doctorsCollection.deleteOne(query);
      res.json(result);
      // console.log(result);
    });
    // user review POST API

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    });
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
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
