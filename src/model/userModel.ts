import mongoose,{ Schema, Document,model  } from "mongoose";
import bcrypt from "bcrypt";
import { any } from "joi";



interface Iuser extends Document{
    Name: string,
    Email: string,
    Password: string,
    verificationToken: string,
    isVerified: boolean,
    verifiedDate: Date,
    isValidPassword():boolean
}

const UserSchema:Schema = new Schema({
    Name: { type: String, require: true },
    Email: { type: String, require: true },
    Password: { type: String, require: true },
    verificationToken: { type: String, require: true },
    isVerified: { type: Boolean, default: false },
    verifiedDate: {
        type:Date
    }
})

UserSchema.pre<Iuser>('save', async function (next) {
      
    const user = this
    
    const hash =  await bcrypt.hash(this.Password, 10)
    this.Password= hash
    
    next()
})
UserSchema.methods.isValidPassword = async function (Password: string) {
    const comparePassword = await bcrypt.compare(Password, this.Password)
    return comparePassword
    
}

const UserModel = mongoose.model<Iuser>('user', UserSchema)
export default UserModel