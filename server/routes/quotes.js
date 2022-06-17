const express = require("express");
const router = express.Router();

const User = require("../models/user");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

//config

const config = require("config");

//api to get the quote
router.get("/", async (req, res) => {
  //we need token from request to  verify it

  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, config.get("jwtprivatekey"));

    //get email
    const email = decoded.email;

    //find user with email
    const user = await User.findOne({ email: email });
    return res.json({ status: "OK", quote: user.quote });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

//api to post the quote
router.post("/", async (req, res) => {
  //we need token from request to  verify it

  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, config.get("jwtprivatekey"));

    //get email
    const email = decoded.email;

    //update or write the quote to DB for respective user
    await User.updateOne({ email: email }, { $set: { quote: req.body.quote } });
    return res.json({ status: "OK" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

module.exports = router;
