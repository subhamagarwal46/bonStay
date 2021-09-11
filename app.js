const express = require("express");
const router = require("./Routes/router");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", router);

const port = process.env.port || 3000;

app.listen(port, (req, res) => {
  console.log(`App is listening in port ${port}`);
});
