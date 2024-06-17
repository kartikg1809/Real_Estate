import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listingRoutes.js';
import path from 'path';
dotenv.config();

const app = express();

app.use(express.json());    //to allow json to the server

app.use(cookieParser());

app.listen(3000,()=>{
    console.log("Listening on port 3000");
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("Connected to Database");
    }).catch((err)=>{
        console.log(err);
    });
})


app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/listing',listingRouter);

const __dirname=path.resolve();

app.use(express.static(path.join(__dirname,'/client/dist')));

app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'client','dist','index.html'));  
})

app.use((err,req,res,next)=>{
    const statuscode=err.statusCode||500;
    const message=err.message||'Internal server error';
    return res.status(statuscode).json({
        success:false,
        statuscode,
        message, 
    })
})