const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nxlicpz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run() {
  try {
    await client.connect();
    console.log("db connected");
    const taskCollection = client.db("taskManager").collection("tasks");
    const completedCollection = client
      .db("taskManager")
      .collection("completedTasks");

    app.post("/addTask", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.json(result);
    });
    app.get("/addTask/:email", async (req, res) => {
      const email = req.params.email;
      const result = await taskCollection.find({ email: email }).toArray();
      res.json(result);
    });

    app.post("/completedTask/:id", async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.findOne({ _id: ObjectId(id) }) ;
      const result2 = await completedCollection.insertOne(result);
      const result3 = await taskCollection.deleteOne({ _id: ObjectId(id) });
      res.json(result3);
    });
    app.get("/completedTask/:email", async (req, res) => {
      const email = req.params.email;
      const result = await completedCollection.find({ email: email }).toArray();
      res.json(result);
    });
    app.delete("/completedTask/:id", async (req, res) => {
        const id = req.params.id;
        const result = await completedCollection.deleteOne({ _id: ObjectId(id) });
        res.json(result);
    })
    app.patch("/addTask/:id", async (req, res) => {
      const id = req.params.id;
      const task = req.body;
      const result = await taskCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: task }
      );
      res.json(result);
    })
   
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Smart task");
});

app.listen(port, () => {
  console.log(`Smart task listening on port ${port}`);
});
