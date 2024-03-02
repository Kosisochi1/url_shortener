import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'


dotenv.config()



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.MAILUSER ,
        pass: process.env.MAILPASSWORD
    }
})

export const mailSender = async (to: any,subject: any,html: any) => {
    
        
    
    return await transporter.sendMail({
        from: process.env.MAILUSER,
        to,
        subject,
        html,
    })
}



export const sendVerification = async (mailObj: { name: any; verificationToken: any; origin: string; to: any; subject: string; html: string }) => {
  
   

    
return mailSender(mailObj.to,mailObj.subject,mailObj.html)
}
export const passwordReset = async (mailObj: { name: any; passwordToken: any; origin: string; to: any; subject: string; html: string }) => {
  
   

    
return mailSender(mailObj.to,mailObj.subject,mailObj.html)
}