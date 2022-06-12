const express = require("express");
const app = express();

const mongoose = require("mongoose");
const User = require("./models/user");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const cors = require("cors");

app.use(cors()); // to allow cross origin

app.use(express.json()); // this parse anything that comes as body into json

mongoose.connect("mongodb://localhost:27017/MERNmini");

// register api
app.post("/api/register", async (req, res) => {
  console.log(req.body);

  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "OK" });
  } catch (err) {
    res.json({ status: "error", error: "duplicate email" });
  }
});

//login api
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    // find the user without password and then check it
  });

  if (!user) {
    return res, json({ status: "error", error: "invalid login" });
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: req.body.name,
        email: req.body.email,
      },
      "secretjwtkey"
    );

    // ideally our jwt key should be stored in an  env variable

    return res.json({ status: "OK", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

//api to get the quote
app.get("/api/quote", async (req, res) => {
  //we need token from request to  verify it

  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secretjwtkey");

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
app.post("/api/quote", async (req, res) => {
  //we need token from request to  verify it

  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secretjwtkey");

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

app.listen(5000, () => {
  console.log("server started at 5000");
});
