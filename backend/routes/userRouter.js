import express from "express";
import User from "../models/User.js";
import {verifyToken, verifyAdmin} from "../jwt/jwt.js"
import passport from "../passport.js"

const router = express.Router()

router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}))

router.get("/auth/google/callback", passport.authenticate("google", {failureRedirect: "/login"}), (req, res)=>{
  res.redirect(`https://roarrealty.ae?token=${req.user.token}`)
})


/*async function admin(){
  const user = await User.findOneAndUpdate({email: "maheshreplit@gmail.com"}, {role: "admin"})

  console.log(user)
}
admin()*/

router.get("/user", verifyToken, async (req, res)=>{
  const user = await User.findById(req.user._id)
  res.json(user)
})

router.post("/update", verifyAdmin, async (req, res)=>{
  try {
    const {_id, ...rest} = req.body
    const user = await User.findByIdAndUpdate(_id, rest, {new: true})
    if(!user) return res.status(404).json({message: "User not found"})
    res.status(200).json("User updated successfully")
  } catch (error) {
    res.status(500).json({message: "Server error"})
  }
  
})

router.get("/allUsers", verifyAdmin, async (req, res)=>{
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message: "Server error"})
  }
})




export default router