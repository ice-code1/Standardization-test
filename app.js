const express = require("express");
const speakeasy = require("speakeasy");
const uuid = require("uuid");
const mongoose = require("mongoose");
//const User = require("./models/UserModels");
const dotenv = require("dotenv");
const crypto = require('crypto')
const userRoutes = require("./routes/UserRoute")
const nodemailer = require("nodemailer")

dotenv.config();

const transporter = nodemailer.createTransport({
  service:"gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

const mailOptions = {
  from:{
    name:"Timmy",
    address:process.env.USER
  },
  to:["something@gmail.com"],
  subject:"Login Token",
  text:`Your token is ${'token'}`
}

const sendMail = async (transporter,mailOptions) => {
  try{
    await transporter.sendMail()
    console.log("Email has been sent")
  } catch(error) { 
    console.error(error)
  }
}

sendMail(transporter,mailOptions)

const app = express();



app.use(express.urlencoded({extended:false}))
app.use(express.json());

app.use("/api/users",userRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
 // useNewUrlParser: true,
 // useUnifiedTopology: true,
 // useCreateIndex: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

const Port = process.env.PORT || 5000;

app.listen(Port, () => console.log(`Server running on port ${Port}`));
  

