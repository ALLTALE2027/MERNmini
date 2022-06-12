const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 5, maxlength: 20 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { collection: "user-data" } // name of collection which will be stored in database
);

const model = mongoose.model("User-data", User);

// User-data is name of model  and User is schema associated with it

module.exports = model;
