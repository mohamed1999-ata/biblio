var express = require("express");
var app = express();
const mongoose = require("mongoose");
require("dotenv").config();
require("./app/config/passport");
require("./app/config/facebook");
const bodyParser = require("body-parser");
const authRoute = require("./routes/routing");

const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(cors());
app.use(bodyParser.json());
app.use("/", authRoute);

app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect("mongodb://localhost:27017/PROJET1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log("Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });
const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("http://localhost:5000");
});
