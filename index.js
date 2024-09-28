const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { log } = require("console");
const { incommingRequestLogger } = require("./middleware/index.js");
const indexrouter = require("./routes/index.js");
const userRouter = require("./routes/user.js");
const jobRouter = require("./routes/jobs.js")
const app = express();
dotenv.config();

app.use(incommingRequestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", indexrouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("hello Naveen raw");
});

// by gpt

mongoose
  .connect(process.env.MONGOOSE_URI_STRING)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is up and running on ${port}`);
    });
  })
  .catch((err) => {
    console.error("failed to connect to MongoDB", err);
  });
mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});
// by sir
// app.listen(port, (req, res) => {
//   console.log(`server is up and running on ${port}`);
//   mongoose.connect(process.env.MONGOOSE_URI_STRING,{

//   })
//   mongoose.connection.on("error", (err)=>{
//     console.log(err);

//   })
// });
