var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectId;

/* GET home page. */

router.get("/", async (req, res) => {
  try {
    const limit = 3;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    const params = [];
    const query = {};

    if (req.query.checkId && req.query.number) {
      params.push({ number: parseInt(req.query.number) });
      query.number = parseInt(req.query.number);
    }
    if (req.query.checkStr && req.query.string) {
      params.push(req.query.string);
      query.string = { $regex: req.query.string, $options: "i" };
    }
    if (req.query.checkInt && req.query.integer) {
      params.push({ integer: parseInt(req.query.integer) });
      query.integer = parseInt(req.query.integer);
    }
    if (req.query.checkFloat && req.query.float) {
      params.push({ float: parseFloat(req.query.float) });
      query.float = parseFloat(req.query.float);
    }
    if (req.query.checkDate && req.query.startDate && req.query.endDate) {
      params.push(new Date(req.query.startDate));
      params.push(new Date(req.query.endDate));
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    } else if (req.query.startDate) {
      params.push(new Date(req.query.startDate));
      query.date = {
        $gte: new Date(req.query.startDate),
      };
    } else if (req.query.endDate) {
      params.push(new Date(req.query.endDate));
      query.date = {
        $lte: new Date(req.query.endDate),
      };
    }

    if (req.query.checkBol && req.query.boolean) {
      if (req.query.boolean === "true") {
        params.push({ boolean: true });
        query.boolean = true;
      } else if (req.query.boolean === "false") {
        params.push({ boolean: false });
        query.boolean = false;
      } else {
        console.log("Invalid boolean value");
      }
    }

    const collection = req.app.locals.db.collection("bread");

    const countData = await collection.countDocuments(query);
    const totalPages = Math.ceil(countData / limit);

    const sortField = req.query.sortField || "number";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const data = await collection
      .find(query)
      .sort({ [sortField]: sortOrder })
      .skip(offset)
      .limit(limit)
      .toArray();

    res.json({
      data: data,
      pages: totalPages,
      page: parseInt(page),
      offset,
      query: req.query,
      sortField: sortField,
      sortOrder: sortOrder,
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
      float: parseFloat(float),
      date: new Date(date),
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
          float: parseFloat(float),
          date: new Date(date),
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
