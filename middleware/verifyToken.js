const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const verifyToken = (req, res, next) => {
  //get token from client
  const token = req.cookies.jwt;
  console.log(token);
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

module.exports = { verifyToken };
