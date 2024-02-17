import mongoose from "mongoose";
import dotenv from "dotenv"
// .config({ path: __dirname + '/./../../.env' });




dotenv.config({ path: __dirname + '/./../../.env' })

export const connect = async (url: any) => {
    mongoose.connect(url || process.env.DB_URL)
    mongoose.connection.on('connected', () => {
        console.log("DB connected")
    })
    mongoose.connection.on("error", () => {
        console.log('DB not connected')
    })
}


module.exports= {connect}