const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const middilewareError = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());

// route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

app.use("/api", product);
app.use("/api", user);

// middileware for errors
app.use(middilewareError);

module.exports = app;
