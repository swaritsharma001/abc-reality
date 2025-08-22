import jwt from "jsonwebtoken";
import User from "../models/User.js";

const tokenSecret = process.env.JWT_SECRET || "your-default-secret";

// Function to create token
export  async function createToken(user){
  const token = jwt.sign({
    _id: user._id
  }, tokenSecret, {
    expiresIn: "30d"
  });
  
  return token;
}

// Middleware to verify token
export  async function verifyToken(req, res, next){
  const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: "Please login first -- no token" });

  try {

    const decoded = jwt.verify(token, tokenSecret);

    
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ message: "User not found" });
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

export async function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: "Please login" })
  }

  try {
    const decoded = jwt.verify(token, tokenSecret);
    const user = await User.findById(decoded._id);
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.role !== "admin" && user.role !== "OWNER") return res.status(401).json({ message: "You are not an admin" })
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" })
  }
}