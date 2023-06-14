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

module.exports = router;
