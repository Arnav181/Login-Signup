import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI_LOCAL);
        console.log("MongoDB connected");
        console.log("DB NAME 👉", conn.connection.name);
        console.log("DB HOST 👉", conn.connection.host);
        console.log("DB PORT 👉", conn.connection.port);
    }catch{
        console.log("MongoDB connection failed");
        process.exit(1);
    }
};

export default connectDB;