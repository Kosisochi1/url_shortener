import { NextFunction } from 'express'
import Joi, { ErrorReport, options } from 'joi'



 export async function validateUser(req: any, res: any, next: NextFunction) {
    try {
        const schema = Joi.object({
            Name: Joi.string().required().alphanum().min(4).max(20),
            Email: Joi.string().required().email().required(),
            Password: Joi.string().min(4).max(15).required(),
            verificationToken: Joi.string(),
            isVerified: Joi.boolean()
        })
        await schema.validateAsync(req.body, { abortEarly: true })
        next()
    } catch (err) {
        return res.status(422).json({ err })
    }
}
        
export async function validateLogin (req: any, res: any, next: NextFunction){
    try {
        const schema = Joi.object({
            Email: Joi.string().required().email(),
            Password:Joi.string().required()
        })
        await schema.validateAsync(req.body,{abortEarly:true})
        next()
    } catch (err:any) {
        return  res.status(422).json({err:err.details[1]})

        
    }
}




