import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mongodbintegration.felnr4x.mongodb.net/?retryWrites=true&w=majority&appName=mongodbIntegration`;
const dbName = "mongodbIntegration";
const client = new MongoClient(uri);

app.use(express.json());

app.get("/getUsers", async (req, res) => {
  try {
    await client.connect();
    const myDB = client.db(dbName);
    const cursor = myDB.collection("usersCollection").find({});
    const users = [];
    for await (const user of cursor) {
      users.push(user);
    }
    res.json(users);
  } catch (error) {
    res.status(500).send({ error: "Users is not found!" });
  }
}); // CURSOR

app.get("/average_age", async (req, res) => {
  try {
    await client.connect();
    const myDB = client.db(dbName);
    const users = myDB.collection("usersCollection");
    const result = await users
      .aggregate([
        { $addFields: { ageNumeric: { $toInt: '$age' } } },
        { $group: { _id: "$position", averageAge: { $avg: "$ageNumeric" } } },
        { $sort: { averageAge: 1 } },
      ])
      .toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Error during aggregation" });
  }
}); // AGREGATTOR

app.listen(3000, () => {
  console.log(`Server started on 3000 PORT`);
});
