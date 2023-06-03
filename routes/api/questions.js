const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

//Get Questions
router.get("/", async (req, res) => {
  const questions = await loadQuestionsCollection();
  res.send(await questions.find({}).toArray());
});

//Get Question by ID
router.get("/:id", async (req, res) => {
  const questions = await loadQuestionsCollection();
  res.send(
    await questions.find({ _id: new mongodb.ObjectId(req.params.id) }).toArray()
  );
});

//Add Question
router.post("/", async (req, res) => {
  const questions = await loadQuestionsCollection();
  await questions.insertOne({
    text: req.body.data.text,
    createdAt: new Date(),
    answerAt: "",
    comment: "",
    status: 0,
    likes: 0,
    dislikes: 0,
    title: req.body.data.title,
    name: req.body.data.name,
    views: 0,
  });
  res.status(201).send();
});

//Delete Question
router.delete("/:id", async (req, res) => {
  const questions = await loadQuestionsCollection();
  await questions.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
  res.status(200).send();
});

//Add view
router.put("/view/:id", async (req, res) => {
  const questions = await loadQuestionsCollection();
  const $set = {
    views: req.body.views,
  };
  await questions.findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.params.id) },
    {
      $set,
    },
    {
      new: true,
      upsert: true,
      rawResult: true,
    }
  );
  res.status(204).send();
});

//Change Like
router.put("/like/:id", async (req, res) => {
  const questions = await loadQuestionsCollection();
  const $set = {
    likes: req.body.likes,
    dislikes: req.body.dislikes,
  };
  await questions.findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.params.id) },
    {
      $set,
    },
    {
      new: true,
      upsert: true,
      rawResult: true,
    }
  );
  res.status(204).send();
});

//Change Dislike
router.put("/dislike/:id", async (req, res) => {
  const questions = await loadQuestionsCollection();
  const $set = {
    likes: req.body.likes,
    dislikes: req.body.dislikes,
  };
  await questions.findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.params.id) },
    {
      $set,
    },
    {
      new: true,
      upsert: true,
      rawResult: true,
    }
  );
  res.status(204).send();
});


const url = process.env.MONGO_URL || `mongodb://localhost:27017/allquestions`;


async function  loadQuestionsCollection() {
    const client = await mongodb.MongoClient.connect(url, {
        useNewUrlParser: true
    });

    return client.db('allquestions').collection('questions');
    
}

module.exports = router;