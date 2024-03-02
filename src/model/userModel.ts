import mongoose,{ Schema, Document,model  } from "mongoose";
import bcrypt, { hash } from "bcrypt";
import { any, string } from "joi";



interface Iuser extends mongoose.Document{
    Name: string,
    Email: string,
    Password: string,
    verificationToken: string,
    isVerified: boolean,
    verifiedDate: Date,
    passwordToken: string,
    passwordTokenExpDate:Date
}
interface UserMode extends mongoose.Model<Iuser>{
    isValidPassword(Password: string, hashPassword: string): Promise<boolean>;

}

const UserSchema = new mongoose.Schema<Iuser,UserMode>({
    
    Name:
    {
        type: String,
        require: true
    },
    Email:
    {
        type: String,
        require: true
    },
    Password:
    {
        type: String,
        require: true
    },
    verificationToken:
    {
        type: String,
        require: true
    },
    isVerified:
    {
        type: Boolean,
        default: false
    },
    verifiedDate: {
        type:Date
    },
    passwordToken: {
        type: String,
        default:''
    },
    passwordTokenExpDate: {
        type: Date,
        default:Date.now()
    }

})

UserSchema.pre<Iuser>('save', async function (next) {
    const user:any = this;
    if (user.isModified('Password')) return next()
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(user.Password, saltRounds)
        user.Password = hash
        next()
    } catch (error) {
        return next()
    }
    
      
    
    
});


UserSchema.methods.isValidPassword = async function (Password: string): Promise<boolean> {
    const user:any = this
return await bcrypt.compare(Password, this.Password)
    
    
}

const UserModel =mongoose.model<Iuser,UserMode>('user', UserSchema)
export default UserModel