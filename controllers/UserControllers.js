const express = require("express")
const speakeasy = require("speakeasy")
const uuid = require("uuid")
const mongoose = require("mongoose")
const User = require("../models/UserModels")
const dotenv = require("dotenv")
const crypto = require('crypto')
const UserServices = require("../services/UserServices")
const jwt = require('jsonwebtoken')
const bcrypt =require('bcryptjs')
const multer = require("multer")
const ImageModels = require("../models/ImageModels")
const nodemailer = require("nodemailer")
const fs = require("fs").promises

dotenv.config()

const transporter = nodemailer.createTransport({
  service:"gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
})



class UserController{

    async userRegistration (req, res){
      //  const id = uuid.v4()
        try {
            const id = uuid.v4()
            const {email} = req.body
            const secretKey = crypto.randomBytes(32)
            const hash = crypto.createHash('sha256').update(secretKey).digest('hex')
            
            const newUser = await UserServices.create(req.body)
            newUser.id = uuid.v4()
            //newUser.temp_secretKey = secretKey
             
            await newUser.save()
            console.log(`User registered with ID: ${id}, Secret: ${secretKey.toString('hex')}`)
            res.status(201).json({
                success:true,
                message:"user registered successfully",
                data:{ id, temp_secretKey: secretKey.toString('hex') }
            })
          } catch (error) {
            console.log(error)
            res.status(500).json({ 
                success:false,
                message: "Problem generating secret" })
          }
      }


    async VerifyUser(req,res){
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
                {userId:user._id},
                temp_secretKey,
                {expiresIn:'1hr'})

            user.token = token

            const mailOptions = {
                from:{
                  name:"Timmy",
                  address:process.env.USER
                },
                to:[user.email],
                subject:"5m",
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
                message:'token sent',
                data:user,
                //token
            })

            
            if(!user){
                return res.status(401).json({
                    message:"Invalid credentials"
                })
            }
    }    
        

    async UserLogin(req,res){
      const {token} = req.body
      const user = await UserServices.fetchOne({token:token})

      function compareToken(Token, userToken){
        Token = token
        userToken = user.token

        return Token === userToken
      }

      if(!compareToken){
        return res.status(401).json({
            message:"Invalid Token"
        })
      }

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

   

    async userUpload(req,res){
 
      
      const filePath = req.file?.path
    const filename = req.file?.originalname
    const { email } = req.body

  if (!email || !filePath || !filename) {
    return res.status(400).json({ error: 'Email and file are required' })
  }

  try {
    console.log('Reading file:', filePath)
    const fileContent = await fs.readFile(filePath)

    console.log('File read successfully. Converting to base64.')
    const base64Content = fileContent.toString('base64')

    console.log('Finding user with email:', email)
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    console.log('Updating user image.')
    user.image = { filename, content: base64Content }
    await user.save()

    console.log('Deleting file from system:', filePath)
    await fs.unlink(filePath)

    res.status(200).json({ message: `Image for user with email ${email} uploaded, stored as base64, and deleted from the system.`,
    data: {
      filename: filename,
      content: base64Content
    }
   })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'An error occurred while processing the file.' })
  }
  }

  async fetchImage(req,res){
    const { email } = req.body

    if(!email){
        return res.status(404).json({message:'user not found'})
    }

    const user = await User.findOne({ email: email })

    if (!user || !user.image) {
      return res.status(404).json({ success: false, message: 'User or image not found' })
  }
  
    res.status(200).json({message:"success",
                          data:user.image
    })

  }

  async fetchAllImage (req,res){
    const  users = await UserServices.findAll({})
    const images = users.map(user => user.image).filter(image => image)
    res.status(200).json({
      success:true,
      message:"All users fetched Successfully",
      data:images
    })
  }
  }

    module.exports = new UserController()
