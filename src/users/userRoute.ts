import express, { Express, Request, Response } from 'express'
import userController from './userController'
import {validateLogin,validateUser} from "./userMiddleware"
import rateLimit from 'express-rate-limit'

const router = express.Router()
interface CustomRequest extends Request{
    userExist:Request;
}
const limiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders:false
})


router.post('/signup', validateUser, userController.createUser)


router.post('/login',validateLogin, userController.login)
router.post('/verify_email',userController.verifyMail)
router.post('/forget_password', userController.forgot_password)
    

router.get('/forget_password', async (req: Request, res: Response) => {
   
    res.send(`<div>
    <form >
    <input type= 'text'>
    <button>Reset</button>
    </form>
    </div>`)

    
})
router.post('/reset_password', userController.resetPassword)


export default router