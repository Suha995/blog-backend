const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
    });

    const result = await user.save(); //return the new user
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // !user && res.status(400).json("Wrong credentials");
    if (!user) {
      res.status(400).json("Wrong credentials");
      return;
    }

    const validated = await bcrypt.compare(req.body.password, user.password);
    // !validated && res.status(400).json("Wrong credentials");
    if (!validated) {
      res.status(400).json("Wrong credentials");
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
