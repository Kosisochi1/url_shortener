
import * as dotenv from "dotenv"
import UserModel from "../model/userModel"
import jwt from "jsonwebtoken"
dotenv.config({ path: __dirname + '/./../../.env' })
import crypto from "crypto"
import { date, object, string } from "joi"
import { mailSender,sendVerification,passwordReset } from "../utils/mailling"
import { logger } from "../logger"
import bcrypt, { hash } from "bcrypt";

import mongoose from "mongoose"





interface CustomRequest extends Request{
    userExist: Request
}
const secrete_key: any = process.env.SECRETE_KEY



const createUser = async (req:any,res:any) => {
    

    try {
        logger.info('[Create User Process]=> started    ');
        const { Name, Email,Password } = req.body
        
        const userExist = await UserModel.findOne({ Email: req.body.Email })
        if (userExist) {
            return res.status(409).json({massage:'User Exist',})
                
            
        }
       

        const verificationToken = crypto.randomBytes(16).toString("hex")
        const newUser = await UserModel.create({
            Name: Name,
            Email: Email,
            Password:Password,
            
            verificationToken: verificationToken,
            // isVerified: reqBody.isVerified,
        })
        const token = jwt.sign({ Email: newUser.Email, _id: newUser._id },
            secrete_key)
            logger.info('[Create User Process]=> completed    ');




        const origin = 'http://localhost:4500'
        logger.info('[ Mail verification Process]=> started    ');

            sendVerification({
            name: newUser.Name,
            verificationToken: newUser.verificationToken,
            origin: origin,
            to: newUser.Email,
            subject: ' Mail Verification',
                html: ` <h4>Hi ${newUser.Name}</h4> </br>
            <p>Please verify your mail!!!  <a href="${origin}/verify_email?verificationToken=${newUser.verificationToken}&Email=${newUser.Email}">here</a></p>`
        })

        logger.info('[Verification Mail ]=> Sent    ');

        return res.status(201).json({massage:' User Created, Check  your Mail and Verify',data:{token}})
        
        
        
    } catch (error) {
        logger.info('[Server Error ]=> Create User    ');

        return res.status(500).json({massage:'Server Error'})
           
        
    }
}
const verifyMail = async (req:any , res:any) => {
    try {
        const {Email,verificationToken}= req.body
        const verifyUser = await UserModel.findOne({ Email: Email })
        if (!verifyUser) {
            return res.status(401).json({massage:' Mail not Verified one'})
               
            
        }
        if (verifyUser.verificationToken !== verificationToken) {
            return res.status(401).json({massage:'Mail not Verified'})
               
        }
        verifyUser.isVerified = true
        verifyUser.verifiedDate = new Date()
        verifyUser.verificationToken = ''
        verifyUser.save()
        logger.info('[Mail Verification Process]=> Completed    ');

        return res.status(200).json({massage:'User Verified'})
            
        
        
    } catch (error) {
        logger.info('[Server Error ]=> Mail Verification    ');

        return res.status(500).json({massage:'Server Error'})
           
       
        
    }
}

async function forgot_password(req: any, res: any) {
    const {Email}= req.body
    try {
        if (!Email) {
            return {massage : 'Enter Valid Mail',code :404}
        }
        const user:any = await UserModel.findOne({ Email: Email })
        
        if (user) {
            const passwordToken = crypto.randomBytes(16).toString("hex")
            const origin = 'http://localhost:4500'
            logger.info('[ Mail verification Process]=> started    ');
    
                passwordReset({
                name: user.Name,
                passwordToken: passwordToken,
                origin: origin,
                to: user.Email,
                subject: ' Mail Verification',
                    html: ` <h4>Hi ${user.Name}</h4> </br>
                <p>Please verify your mail!!!  <a href="${origin}/user/reset_password?passwordToken=${user.passwordToken}&Email=${user.Email}"> Click Reset Password</a></p>`
            })
    
            const tenMinutes = 1000 * 60 * 10
            const passwordTokenExpDate = new Date(Date.now() + tenMinutes)
            user.passwordToken = passwordToken
            user.passwordTokenExpDate = passwordTokenExpDate
            user.save()
            
            
    
            
    
            
        }
        return res.status(200).json({ massage: 'Check Your Mail for Reset Link',})
           
        
        
    } catch (error) {
        logger.info('[Server Error ]=> Forgot Password    ');

        return res.status(500).json({            massage: ' Server Error' })
       
        
    }
}
async function resetPassword(req: any, res: any) {
    const { Password ,Email }= req.body
    try {
        const timeNow = Date.now()
        const newPassword: any = await UserModel.findOne({ Email: Email })

        if (!newPassword) {
            return res.status(404).json({massage: 'No User Matched'})
            
        }



        if (newPassword.Email == Email && newPassword.passwordTokenExpDate < timeNow) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(Password, saltRounds)
            newPassword.Password = hashedPassword
            newPassword.passwordTokenExpDate = null
            newPassword.passwordToken = null
            newPassword.save()
            
            return res.status(200).json({
                massage: 'Reset completed',
                newPassword
            })
        }else{
            return res.status(422).json({massage:'Not Authorize'})
        }
        
        
    } catch (error) {
        logger.info('[Server Error ]=> Reser Password ');

        return res.status(500).json({ massage: ' Server Error',})
       }
    
}

async function login(req:any, res:any) {
    
     
   
    try {
        // const { Email, Password }= req.body
        logger.info('[ Login Process]=> started    ');

        const userExit:any = await UserModel.findOne({ Email: req.body.Email })
        
        
        
        if (!userExit) {
            return res.status(404).json({ massage: 'Not  User Matched' })

        }
        logger.info('[ Login Process]=> User Exist    ');

        
        
        
        const validaUser =  await userExit.isValidPassword(req.body.Password)
        
        console.log(validaUser)
        if (!validaUser) {
            
            return res.status(422).json({ massage: 'Not Matched User' })
        }
        
        logger.info('[ Login Process]=> Valid Password    ');

        
        
        if (userExit.isVerified == false) {
            return res.status(401).json({ massage: 'User not verified'})
            
        }        logger.info('[ Login Process]=> User nott verified    ');

        console.log(userExit.isVerified)
        
        const token = jwt.sign({ Email: userExit.Email, _id: userExit._id }, secrete_key, { expiresIn: '1h' })


        logger.info('[ Login Process]=> Completed    ');

        return res.status(200).json({ massage: 'Login Successful', data: {
            userExit,
            token
        }
    })
           
            
        
     } catch (error) {
        logger.info('[Server Error ]=> Login    ');

        return res.status(500).json({ massage: '  login Server Error'})
       
    }
}
export default {
    createUser,
    login,
    verifyMail,
    forgot_password,
    resetPassword
}


