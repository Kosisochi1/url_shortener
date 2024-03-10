// import express, {Express, req: Request, res: Response } from "express"
import * as dotenv from "dotenv"
import UserModel from "../model/userModel"
import jwt from "jsonwebtoken"
dotenv.config({ path: __dirname + '/./../../.env' })
import crypto from "crypto"
import { date, object } from "joi"
import { mailSender, sendVerification, passwordReset } from "../utils/mailling"
import { logger } from "../logger"
import bcrypt, { hash } from "bcrypt";

import mongoose from "mongoose"



interface Iuser extends Document{
    Name: string,
    Email: string,
    Password: string,
    verificationToken: string,
    isVerified: boolean,
    verifiedDate: Date,
    passwordToken:string,
    passwordTokenExpDate: Date,
    
    // isValidPassword():string
}
interface UserMode extends mongoose.Model<Iuser>{
    isValidPassword(Password: string, hashPassword: string): Promise<boolean>;

}

interface CustomRequest extends Request{
    userExist: Request
}
const secrete_key: any = process.env.SECRETE_KEY



const createUser = async (reqBody:any) => {
    

    try {
        logger.info('[Create User Process]=> started    ');

        
        const userExist = await UserModel.findOne({ Email: reqBody.Email })
        if (userExist) {
            return {
                massage: 'User Exist',
                code:409
            }
        }
       

        const verificationToken = crypto.randomBytes(16).toString("hex")
console.log(reqBody.Password)
        const newUser = await UserModel.create({
            Name: reqBody.Name,
            Email: reqBody.Email,
            Password: reqBody.Password,
            
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

        return {
            massage: ' User Created, Check  your Mail and Verify',
            code: 201,
            data:{token}
        }
    } catch (error) {
        logger.info('[Server Error ]=> Create User    ');

        return {
            massage: ' Server Error',
            code:500
       }
        
    }
}
const verifyMail = async (reqBody: any) => {
    try {
        const verifyUser = await UserModel.findOne({ Email: reqBody.Email })
        if (!verifyUser) {
            return {
                massege: ' Mail not Verified',
                code :401
            }
        }
        if (verifyUser.verificationToken !== reqBody.verificationToken) {
            return {
                massage: 'Mail not Verified',
                code:401
            }
        }
        verifyUser.isVerified = true
        verifyUser.verifiedDate = new Date()
        verifyUser.verificationToken = ''
        verifyUser.save()
        logger.info('[Mail Verification Process]=> Completed    ');

        return {
            massage: 'User Verified',
            code :200
        }
        
    } catch (error) {
        logger.info('[Server Error ]=> Mail Verification    ');

        return {
            massage: ' Server Error',
            code:500
       }
        
    }
}

async function forgot_password(reqBody: any) {
    try {
        if (!reqBody) {
            return {massage : 'Enter Valid Mail',code :404}
        }
        const user:any = await UserModel.findOne({ Email: reqBody })
        
        if (user) {
            const passwordToken = crypto.randomBytes(16).toString("hex")
            const origin = 'http://localhost:4500'
            logger.info('[ Mail verification Process]=> started    ');
    
                passwordReset({
                name: user.Name,
                passwordToken: user.passwordToken,
                origin: origin,
                to: user.Email,
                subject: ' Mail Verification',
                    html: ` <h4>Hi ${user.Name}</h4> </br>
                <p>Please verify your Account!!!  <a href="${origin}/reset_password?passwordToken=${user.passwordToken}&Email=${user.Email}"> Click Reset Password</a></p>`
            })
    
            const tenMinutes = 1000 * 60 * 10
            const passwordTokenExpDate = new Date(Date.now() + tenMinutes)
            user.passwordToken = passwordToken
            user.passwordTokenExpDate = passwordTokenExpDate
            user.save()
            
            
    
            
    
            
            return {
                massage: 'Check Your Mail for Reset Link',
                code : 200
            }
        }
        
    } catch (error) {
        logger.info('[Server Error ]=> Forgot Password    ');

        return {
            massage: ' Server Error',
            code:500
       }
        
    }
}
async function resetPassword(reqBody: any) {
    try {
        const timeNow = new Date()
        const newPassword: any = await UserModel.findOne({ Email: reqBody.Email })
        console.log(newPassword)
        if (!newPassword) {
            return {
                massage: 'No User Matched',
                code:404
            }
        }

        if (newPassword.Email === reqBody.Email && newPassword.passwordTokenExpDate > timeNow) {
            
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(reqBody.Password, saltRounds)

            newPassword.Password = hashedPassword
            newPassword.passwordTokenExpDate = null
            newPassword.passwordToken = null
            newPassword.save()
            
        }
        return {
            massage: 'Reset completed',
            code: 200,
            newPassword
        }
        
    } catch (error) {
        logger.info('[Server Error ]=> Reset Password    ');

        return {
            massage: ' Server Error',
            code:500
       }
        
    }
    
}

async function login(reqBody: any,reqBody2:any) {
    
     
   
     try {
        logger.info('[ Login Process]=> started    ');

         const userExit:any = await UserModel.findOne({ Email: reqBody })
         
        
         
        if (!userExit) {
            return { 
                massage: 'Not User matched',
                code :404
            }
         }
        
        
            
         const validaUser =  await userExit.isValidPassword(reqBody2)
         console.log(validaUser)
         
         if (!validaUser) {
                
                return {
                    massage: 'Incorrect Login Details',
                    code : 422
                }
            }
        
        
       
        if (userExit.isVerified == false) {
            return {
                massage: 'User not verified',
                code : 401
                
            }
        }
        const token = jwt.sign({ Email: userExit.Email, _id: userExit._id }, secrete_key, { expiresIn: '1h' })


        logger.info('[ Login Process]=> Completed    ');

        return {
            massage: 'Login Successful',
            code: 200,
            data: {
                userExit,
                token
            }
            
        }
     } catch (error) {
        logger.info('[Server Error ]=> Login    ');

        return {
            massage: ' Server Error',
            code:500
       }
    }
}
export default {
    createUser,
    login,
    verifyMail,
    forgot_password,
    resetPassword
}


