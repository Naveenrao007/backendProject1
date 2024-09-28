const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../schema/user.schema");
const dotenv = require("dotenv");
dotenv.config();
//  Register a user
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  try {
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(400).json({ message: "user already exits" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A user with this email already exists",
        keyValue: error.keyValue,
      });
    }
    res.status(500).json({ message: "Internal Server Error", error });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User created successfully" });
});
//  get all user
router.get("/all", async (req, res) => {
  const alluser = await User.find().select("-password -_id");
  console.log(alluser)
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
//  get user by email
router.get("/:email", async (req, res) => {
  const { email } = req.params
  console.log(email)
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "user not found" })
  }
  res.status(200).json(user)
})
//  login user

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "wrong email or password" });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    res.status(400).json({ message: "wrong email or password" });
  }
  const payload = { id: user._id }
  console.log(payload)
  const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET)
  res.status(200).json({
    message: "user logged in successfully",
    token: token
  });

});
//  update user details
router.put("/update/:id", async (req, res) => {
  const { id } = req.params
  const { name, email, password } = req.body
  console.log(id)
  try {
    const user = await User.findById(id)
    if (!user) { res.status(400).json({ message: "user not found" }) }
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkedData = user.name ===name && user.email=== email && (await bcrypt.compare(user.password , password))
   
    if(!checkedData){ return  res.status(400).json({message:"No changes found"})}
    user.name = name,
      user.email = email
    user.password = hashedPassword
    console.log(user);

    await user.save();
    res.status(200).json({ message: "user data updated", user: user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }

})
//  delete user
router.delete("/delete/:id", async (req, res) => {
  const {id} = req.params
  const user = await User.findByIdAndDelete(id)
     console.log(user);
     
     if(!user){ 
      return res.status(400).json({message:"user not found"})
     }
     res.status(200).json({message:"user deleted successfully"})
  // console.log(userId)
})
module.exports = router;
