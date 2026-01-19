import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";



dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev (Vite)
      "https://sparkling-stroopwafel-e3c14a.netlify.app" // 🔴 YOUR NETLIFY URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);


app.get("/",(req,res) =>{
    res.send("Server is running! Hello world");
});

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on ${process.env.PORT}` );
});

