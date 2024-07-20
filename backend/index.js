import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listingRoutes.js";
import cors from "cors";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json()); //to allow json to the server
app.use(cors());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use((err, req, res, next) => {
  const statuscode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});

export default app;
