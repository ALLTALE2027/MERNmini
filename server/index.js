const express = require("express");
const app = express();

const mongoose = require("mongoose");

//config

const config = require("config");

const cors = require("cors");

app.use(cors()); // to allow cross origin

app.use(express.json()); // this parse anything that comes as body into json

mongoose.connect("mongodb://localhost:27017/MERNmini");

//check if env variable is set or not before starting
if (!config.get("jwtprivatekey")) {
  console.log("FATAL ERROR: jwtprivatekey is not set");
  process.exit(1);
}

//register and login
app.use("/api/auth", require("./routes/auth"));

//quotes
app.use("/api/quote", require("./routes/quotes"));

app.listen(5000, () => {
  console.log("server started at 5000");
});
