import mongoose,{  Document,model  } from "mongoose";
import bcrypt, { hash } from "bcrypt";
import { any, string } from "joi";



interface Iuser extends Document{
    Name: string,
    Email: string,
    Password: string,
    createdAt:Date
    verificationToken: string,
    isVerified: boolean,
    verifiedDate: Date,
    passwordToken: string,
    passwordTokenExpDate: Date
    isValidPassword(PasswordEntry: string): Promise<boolean>;

    // }
}
// interface UserMode extends mongoose.Model<Iuser>{
//     isValidPassword(Password: string): Promise<boolean>;

// }
const Schema = mongoose.Schema

const UserSchema = new Schema<Iuser>({
    
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
    createdAt: {
        type: Date,
        default:Date.now()
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
    const user = this;
    
    if (user.isModified('Password')) return next()
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(user.Password, saltRounds)
        this.Password = hash
        next()
    } catch (error) {
        return next()
    }
    
    
      
    
    
});


UserSchema.methods.isValidPassword = async function (PasswordEntry: string) {
    // const user:any = this
return await bcrypt.compare(PasswordEntry, this.Password)
    
    
}

const UserModel = mongoose.model<Iuser>('user', UserSchema)

export default UserModel