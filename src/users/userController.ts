// import express, {Express, req: Request, res: Response } from "express"
import * as dotenv from "dotenv"
import UserModel from "../model/userModel"
import jwt from "jsonwebtoken"
dotenv.config({ path: __dirname + '/./../../.env' })
import crypto from "crypto"
import { date, object } from "joi"
import { mailSender,sendVerification } from "../utils/mailling"



interface Iuser extends Document{
    Name: string,
    Email: string,
    Password: string,
    verificationToken: string,
    isVerified: boolean,
    verifiedDate: Date
    isValidPassword():string
}

interface CustomRequest extends Request{
    userExist: Request
}
const secrete_key:any = process.env.SECRETE_KEY

const createUser = async (reqBody:Iuser) => {
    

    try {
        
        const userExist = await UserModel.findOne({ Email: reqBody.Email })
        if (userExist) {
            return {
                massage: 'User Exist',
                code:401
            }
        }


        const verificationToken = crypto.randomBytes(16).toString("hex")

        const newUser = await UserModel.create({
            Name: reqBody.Name,
            Email: reqBody.Email,
            Password: reqBody.Password,
            verificationToken: verificationToken,
            // isVerified: reqBody.isVerified,
        })
        const token = jwt.sign({ Email: newUser.Email, _id: newUser._id },
            secrete_key)



            const origin = 'http://localhost:4500'
            sendVerification({
            name: newUser.Name,
            verificationToken: newUser.verificationToken,
            origin: origin,
            to: newUser.Email,
            subject: ' Mail Verification',
            html: ` <h4>Hi ${newUser.Name}</h4> </br><p>Please verify your mail!!!  <a href="${origin}/user/verify_email?verificationToken=${verificationToken}&to=${newUser.Email}">here</a></p>`
        })

        // mailSender(newUser.Email,'verify',`<p>check<p>`)

        return {
            massage: ' User Created, Check  your Mail and Verify',
            code: 201,
            data:{token,newUser}
        }
    } catch (error) {
        return {
            massage: ' Server Error',
            code:501
       }
        
    }
}
const verifyMail = async (reqBody: Iuser) => {
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
        return {
            massage: 'User Verified',
            code :200
        }
        
    } catch (error) {
        
    }
}

 async function login (reqBody:Iuser)  {
    try {
            const userExit:any = await UserModel.findOne({ Email:reqBody.Email })
        if (!userExit) {
            return { 
                massage: 'Not Matched User',
                code :401
            }
        }
        
            
            const validaUser = userExit.isValidPassword(reqBody.Password)
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



        return {
            massage: 'Login Successful',
            code: '200',
            data: {
                userExit,
                token
            }
            
        }
    } catch (error) {
        return {
            massage: ' Server Error',
            code:501
       }
    }
}
export default {createUser,login,verifyMail}