const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  //get token from client
  const token = req.cookies.jwt;
  //verify if token exist
  if (token) {
    //check if verified
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login"); //modify it
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    console.log("token is not exist");
    res.redirect("/login"); //modify it
  }
};

//to be applied on every get request// to enject user data in the views
//I think it works only if we have views inside the server
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    //check if verified
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { verifyToken, checkUser };
