var express = require("express");
var router = express.Router();
var moment = require("moment");
const ObjectID = require("mongodb").ObjectId;

/* GET home page. */

router.get("/", async (req, res) => {
  try {
    const limit = 3;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    const params = [];
    const query = {};

    if (req.query.id) {
      params.push({ _id: parseInt(req.query.id) });
      query.id = parseInt(req.query.id);
    }
    // if (req.query._id) {
    //   const idValue = req.query._id;
    //   params.push({ _id: idValue });
    //   query._id = idValue;
    // }
    // if (req.query.id) {
    //   params.push({ number: parseInt(req.query.id) });
    // }
    if (req.query.number) {
      params.push({ number: parseInt(req.query.number) });
      query.number = parseInt(req.query.number);
    }
    if (req.query.string) {
      params.push(req.query.string);
      query.string = { $regex: req.query.string, $options: "i" };
    }
    if (req.query.integer) {
      params.push({ integer: parseInt(req.query.integer) });
      query.integer = parseInt(req.query.integer);
    }
    if (req.query.float) {
      params.push({ float: parseFloat(req.query.float) });
      query.float = parseFloat(req.query.float);
    }
    if (req.query.dateS) {
      params.push(req.query.dateS);
      params.push(req.query.dateE);
      query.date = {
        $gte: new Date(req.query.dateS),
        $lte: new Date(req.query.dateE),
      };
    }
    if (req.query.boolean) {
      params.push(req.query.boolean);
      query.boolean = req.query.boolean;
    }

    const collection = req.app.locals.db.collection("bread");

    const countData = await collection.countDocuments(query);
    console.log(countData);
    const totalPages = Math.ceil(countData / limit);

    const sortOrder = req.query.sortOrder || "asc";
    const sortBy = req.query.sortBy || "number";

    const sort = sortOrder === "asc" ? 1 : -1;

    const data = await collection
      .find(query)
      .sort({ [sortBy]: sort })
      .skip(offset)
      .limit(limit)
      .toArray();

    res.json({
      data: data,
      pages: totalPages,
      page,
      offset,
      query: req.query,
      sortOrder: sortOrder,
      sortBy: sortBy,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
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

//to get the predata
router.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Periksa apakah id sesuai dengan format yang diharapkan
    if (!ObjectID.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const db = req.app.locals.db;
    const collection = db.collection("bread");

    const result = await collection.findOne({ _id: new ObjectID(id) });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
