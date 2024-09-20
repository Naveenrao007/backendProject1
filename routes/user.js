const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../schema/user.schema");

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    res.status(400).json({ message: "user already exits" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User created successfully" });
});

router.get("/all", async (req, res) => {
  const alluser = await User.find().select("-password -_id");
  // if u dont want to send pass

//   const userList = alluser.map((item) => {
//     return {
//       name: item.name,
//       email: item.email,
//       creationDate: item.creationDate,
//     };
//   });
//   res.status(200).json(userList);
  res.status(200).json(alluser);
});

module.exports = router;
