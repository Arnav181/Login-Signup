import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/register",async(req,res)=>{
    try{
        
        
        const{name,email,password} = req.body;
        console.log("REQ BODY ", req.body);

        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(req.body.password, saltRounds);


        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }
        const user = await User.create({
            name,email,password:hashedPass
        });

        return res.status(200).json({message:"User registered successfully",userId: user._id});
    }catch (error) {
  console.error("REGISTER ERROR ", error);
  res.status(500).json({
    message: error.message
  });
}

});


router.post("/login",async(req,res)=>{
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message:"User not found!"});
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const jwtoken = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        )

        return res.status(200).json({message:"Login successful",userId:user._id,jwtoken});
    }catch(error){
        return res.status(500).json({message:"Server error"});
    }
});

router.get("/user-profile",authMiddleware,(req,res)=>{
    res.status(200).json({
    message : "User profile accessed",
    userId: req.user.userId,
    });
});

export default router;