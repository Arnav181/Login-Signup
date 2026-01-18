import authMiddleware from '../middleware/authMiddleware.js';
import express from 'express';
const router = express.Router();


router.get("/profile",authMiddleware,(req,res)=>{
    res.status(200).json({
    message : "User profile accessed",
    userId: req.user.userId,
    });
});

export default router;