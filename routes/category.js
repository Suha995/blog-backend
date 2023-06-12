const router = require("express").Router();
const Category = require("../models/Category");

//get
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

//post
router.post("/", async (req, res) => {
  try {
    const category = new Category({ name: req.body.name });
    const newCategory = await category.save();
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
