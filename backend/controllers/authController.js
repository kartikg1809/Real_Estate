import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup=async (req,res,next)=>{
    const {username,email,password}=req.body;
    const hashPass=bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password:hashPass});
    try {
        await newUser.save();
        res.status(201).json("User created successfully");
    } catch (error) {
        next(error);
    }  
};

export const signin=async (req,res,next)=>{
    const {email,password}=req.body;
    try {
        const validUser=await User.findOne({email});
        if(!validUser) return next(errorHandler(404, "User not found"));
            const validPass=bcryptjs.compareSync(password,validUser.password);
            if(!validPass){
                return next(errorHandler(401,"Wrong credentials"));
            }
            const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
            const { password: pass , ...rest}=validUser._doc;   //cause we dont want to send the password to the user
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}