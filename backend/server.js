import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";



dotenv.config();
connectDB();

const app = express();

app.use(
  cors()
);
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/tasks",taskRoutes)


app.get("/",(req,res) =>{
    res.send("Server is running! Hello world");
});

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on ${process.env.PORT}` );
});

