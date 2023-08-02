const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
//we can build here custom validation
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true, //we can't use custom validation for this error
      required: [true, "Please enter an email"], //custom validation
      validate: [isEmail, "Please enter a valid email"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimun password length is 6"], //this doesn't work
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

//Mongoose Hooks
//fire a function after doc saved to the db
// "save": the type of event
// UserSchema.post("save", (doc, next) => {
//   console.log("a new user was craeted and saved", doc);
//   next(); // to get to the next middleware in the stack
//   //if we dont use it the res will not be sended to the client
// });

//fire a function before doc is saved to the db
UserSchema.pre("save", async function (next) {
  //this //refers to the local instance of the user
  //we dont use arrow function in order to have access to this
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("user", UserSchema);
