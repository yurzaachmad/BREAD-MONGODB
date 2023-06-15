var express = require("express");
var router = express.Router();
var moment = require("moment");
const ObjectID = require("mongodb").ObjectId;

/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const collection = db.collection("bread");
    const data = await collection.find().toArray();
    const processData = [];
    data.forEach((item) => {
      const formatedData = moment(item.date).format("YYYY-MMMM-DD");
      processData.push({ ...item, date: formatedData });
    });
    // res.render("list", { data: processData, moment });
    res.json(processData);
    console.log(processData);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { number, string, integer, float, date, boolean } = req.body;
    const db = req.app.locals.db;
    const collection = db.collection("bread");

    const result = await collection.insertOne({
      number: parseInt(number),
      string: string,
      integer: parseInt(integer),
      float: parseInt(float),
      date: date,
      boolean: boolean === "true",
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { number, string, integer, float, date, boolean } = req.body;
    const db = req.app.locals.db;
    const collection = db.collection("bread");

    const result = await collection.updateMany(
      { _id: new ObjectID(id) },
      {
        $set: {
          number: parseInt(number),
          string: string,
          integer: parseInt(integer),
          float: parseInt(float),
          date: date,
          boolean: boolean === "true",
        },
      }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { number, string, integer, float, date, boolean } = req.body;
    const db = req.app.locals.db;
    const collection = db.collection("bread");

    const result = await collection.deleteMany({ _id: new ObjectID(id) });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting the data" });
  }
});

module.exports = router;
