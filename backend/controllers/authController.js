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

export const google=async(req,res,next)=>{
    try {
        const user=await User.findOne({email:req.body.email})
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
            const { password: pass , ...rest}=user._doc;   //cause we dont want to send the password to the user
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }
        else{
            const generatePassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
            const hashPass=bcryptjs.hashSync(generatePassword,10);
            const newUser=new User({
                username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),//to make unique name
                email:req.body.email,
                password:hashPass,
                avatar:req.body.avatar
            });
            await newUser.save();
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const { password: pass , ...rest}=newUser._doc;   //cause we dont want to send the password to the user
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }
}