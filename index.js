var express = require("express");
var app = express();

app.use("/assets", express.static("assets"));

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ============ Supaya bisa upload file
const upload = require("express-fileupload");
app.use(upload());
// ============ Supaya bisa dapat unique id ketika uplod file
const uniqid = require("uniqid");

const routes = require("./routes.js");

app.use("/", routes);

app.listen(3001, console.log("> SERVER STARTED AT PORT 3001"));
