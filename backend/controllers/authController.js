import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup=async (req,res,next)=>{
    const {username,email,password}=req.body;
    const hashPass=bcryptjs.hash(password,10);
    const newUser=new User({username,email,password:hashPass});
    try {
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch (error) {
        next(error);
    }  
};