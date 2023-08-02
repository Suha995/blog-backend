const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  //email is not unique//duplicate error code
  if (err.code === 11000) {
    errors.email = "this email is already registered";
    return errors;
  }

  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message; //updating errors object.
    });
  }
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  //sign takes payload object/secret key/options
  //header is automatically created
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
    //in seconds not in ms.
  });
};

//Register
router.post("/register", async (req, res) => {
  const { password, email } = req.body;
  try {
    //Mongoose Pre Hook is fired here //1:validate credentials and hash password
    //2: save new user doc in db
    const user = await User.create({ email, password });
    //3: create JWT token
    const token = createToken(user._id);

    //4: set cookie
    res.cookie("jwt", token, {
      maxAge: maxAge * 1000,
      httpOnly: true,
    });

    res.status(201).json({ user });
  } catch (err) {
    console.log(err.message);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // !user && res.status(400).json("Wrong credentials");
    const errors = { email: "", password: "" };
    if (!user) {
      errors.email = "The email is not correct";
      res.status(400).json({ errors });
      return;
    }
    const validated = await bcrypt.compare(req.body.password, user.password);
    // !validated && res.status(400).json("Wrong credentials");
    if (!validated) {
      errors.password = "The password is not correct";
      res.status(400).json({ errors });
      return;
    }
    const token = createToken(user._id);
    res.cookie("jwt", token, { maxAge: maxAge * 1000 });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
