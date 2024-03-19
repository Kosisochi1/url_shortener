import UserModel from "../model/userModel";
import express, { Express,Request,Response,NextFunction } from "express";
import jwt, { Secret } from 'jsonwebtoken'
import * as  dotenv from 'dotenv'
import { ok } from "assert";
import { logger } from "../logger";
// import { NextFunction } from "express";


dotenv.config();
const secrete_key:any = process.env.SECRETE_KEY



async function authenticateUser   (req: any, res: any, next: NextFunction){
    try {
        const authHeaders = req.headers
    if (!authHeaders) {
        return res.status(401).json( {
            massage: ' You are not Authorize',
            // code: 401
        })
        }
        const token:any= authHeaders.authorization.split(' ')[1]
        const verifyToken:any = jwt.verify(token, secrete_key)
        
        
        // console.log(verifyToken.Email)
        const verifyUser: any = await UserModel.findOne({ Email: verifyToken.Email})
        
        
        // console.log(verifyUser)
        if (!verifyUser) {
            return res.status(401).json( {
            massage: 'You are not Authorize',
            // code : 401
        })
    }
        
    req.userExist = verifyToken
    next()
    } catch (error) {
        return {
            massage: 'Server Error',
            code :500
        }
    }
}

const authenticate = async (req:any, res:any, next:NextFunction) => {
	logger.info('[check]=> Available  Cookies  ');

    const token = req.cookies.jwt;
    try {
	if (token) {
		logger.info('[Cookies]=> Available    ');

			logger.info('[Auth Process]=> started    ');

			const decodeValue = await jwt.verify(token, secrete_key);
			res.locals.loginUser = decodeValue;
			logger.info('[Auth Process]=> completed    ');

        } else {
            return res.status(401).json({massage:'Not Authorize'})
        }
        next();
    } catch (error) {
        logger.info('[Auth Process]=> Server Error    ');

        return res.status(500).json({
            massage: 'Server',
        });
    }
};

 export default {authenticateUser,authenticate}