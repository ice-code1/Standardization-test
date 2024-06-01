const express = require("express");
const speakeasy = require("speakeasy");
const uuid = require("uuid");
const mongoose = require("mongoose");
const User = require("../models/UserModels");
const dotenv = require("dotenv");
const crypto = require('crypto')
const UserServices = require("../services/UserServices")
const jwt = require('jsonwebtoken')
const bcrypt =require('bcryptjs')

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


class UserController{

    async userRegistration (req, res){
      //  const id = uuid.v4()
        try {
            const id = uuid.v4()
            const {email} = req.body
            const secretKey = crypto.randomBytes(32);
            const hash = crypto.createHash('sha256').update(secretKey).digest('hex')
            
            const newUser = await UserServices.create(req.body)
            newUser.id = uuid.v4()
             
            await newUser.save();
            console.log(`User registered with ID: ${id}, Secret: ${secretKey.toString('hex')}`);
            res.status(201).json({
                success:true,
                message:"user registered successfully",
                data:{ id, temp_secretKey: secretKey.toString('hex') }
            });
          } catch (error) {
            console.log(error);
            res.status(500).json({ 
                success:false,
                message: "Problem generating secret" });
          }
        }


        async userLogin(req,res){
            const {email,temp_secretKey} = req.body
            const secretKey = crypto.randomBytes(32).hex
            const user = await UserServices.fetchOne({email:email})

            function compareTempSecretKey(tempSecretKey, userTempSecretKey){
                tempSecretKey = temp_secretKey
                userTempSecretKey = user.temp_secretKey

                return tempSecretKey === userTempSecretKey
            }
            if(!compareTempSecretKey){
                return res.status(401).json({
                    message:"Invalid credentials"
                })
            }

            const token = jwt.sign(
                {userId:user.id},
                temp_secretKey,
                {expiresIn:'1hr'})

            user.token = token

            const mailOptions = {
                from:{
                  name:"Timmy",
                  address:process.env.USER
                },
                to:[user.email],
                subject:"Login Token",
                text:`Your token is ${token}`
              }
              
              const sendMail = async (transporter,mailOptions) => {
                try{
                  await transporter.sendMail(mailOptions)
                  console.log("Email has been sent")
                } catch(error) { 
                  console.error(error)
                }
              }
             
              await sendMail(transporter,mailOptions)
              

            await user.save()
            
            console.log(token)


            
            res.status(200).json({
                success:true,
                message:'user login success',
                data:user,
                //token
            })

            
            if(!user){
                return res.status(401).json({
                    message:"Invalid credentials"
                })
            }
               
        
    }

}
    module.exports = new UserController()
