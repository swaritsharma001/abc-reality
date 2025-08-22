import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js"
import dataRouter from "./routes/dataRouter.js"
import pageRouter from "./routes/pageRouter.js"
import teamRouter from "./routes/teamRouter.js"
import aiRouter from "./routes/aiRouter.js"
import session from "express-session"


async function connect() {
  await mongoose.connect("mongodb+srv://thegangstaguy001:NuLcOmlDKV6UGNoi@cluster0.nh1ewxi.mongodb.net/RoreReality?retryWrites=true&w=majority");
  console.log('Connected to MongoDB');
}

connect()

const app = express();
app.use(express.json())
app.use(session({
  secret: "my-secret",
  resave: false,
}))


app.use(cors({
  origin: "https://roarrealty.ae"
}));

app.use("/user", userRouter)
app.use("/property", dataRouter)
app.use("/page", pageRouter)
app.use("/team", teamRouter)
app.use("/chat", aiRouter)

app.get("/api", (req, res)=>{
  res.json({message: "Hello from server"})
});

app.listen(3000, ()=>{
  console.log("Server is running on port 3000")
})