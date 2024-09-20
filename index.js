const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const bodyParser = require("body-parser")
const { log } = require("console");
const { incommingRequestLogger } = require("./middleware/index.js");
const  indexrouter  = require("./routes/index.js");
const userRouter = require("./routes/user.js")
const app = express();
dotenv.config();

app.use(incommingRequestLogger);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use("/api/v1", indexrouter);
app.use("/api/v1/user", userRouter);
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("hello Naveen raw");
});

app.listen(port, (req, res) => {
  console.log(`server is up and running on ${port}`);
  mongoose.connect(process.env.MONGOOSE_URI_STRING,{
    
  })
  mongoose.connection.on("error", (err)=>{
    console.log(err);
    
  })
});
