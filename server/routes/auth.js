const express = require("express");
const router = express.Router();

const User = require("../models/user");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

//config

const config = require("config");

// register api
router.post("/register", async (req, res) => {
  try {
    // check code was added for registering user
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send("user with this email is already registered");
    }

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
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    // find the user without password and then check it
  });

  if (!user) {
    return res, json({ status: "error", error: "invalid login" });
  }
  //Check if password entered is corrrect or not
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  // is password is correct-- give the token
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: req.body.name,
        email: req.body.email,
      },
      config.get("jwtprivatekey")
    );

    // ideally our jwt key should be stored in an  env variable
    //"secretjwtkey" replaced with config appln setting

    return res.json({ status: "OK", user: token });
  }

  //////////////
  else {
    return res.json({ status: "error", user: false });
  }
});

module.exports = router;
