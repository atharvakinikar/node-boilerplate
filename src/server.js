const express = require("express");
const Router = require("./routers");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./database/connect")();
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//run npm i and also install cors

app.use("/api", Router);

let port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log("Server is up and running at port:", port);
});
