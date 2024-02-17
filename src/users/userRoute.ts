import express, { Express, Request, Response } from 'express'
import userController from './userController'
import {validateLogin,validateUser} from "./userMiddleware"
import authenticateUser from '../auth/auth'

const router = express.Router()
interface CustomRequest extends Request{
    userExist:Request;
}


router.post('/signup', validateUser, async (req: any, res: any) => {
    const createUser = await userController.createUser(req.body)
    res.status(201).json({createUser})
})


router.post('/login', async (req: Request, res: any) => {
    // const reqBody = req.body
  const loginUser  = await userController.login(req.body)
    // console.log(await userController.login(req.body))
res.json({loginUser})
})
router.post('/verify_email', async (req: any, res: any) => {
    const verifyMail=await userController.verifyMail(req.body)
    res.json({verifyMail})
})


export default router