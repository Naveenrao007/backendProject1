const express = require("express");
const fs = require("fs");
const app = express();

const incommingRequestLogger = (req, res, next) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  fs.appendFileSync(
    "./logfile.txt",
    `${req.method}  ${req.url}  ${new Date().toLocaleString()}\n`
  );

  next();
};

module.exports = { incommingRequestLogger };
