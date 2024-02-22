import mongoose,{ Schema, Document,model  } from "mongoose";


interface IUrl extends Document{
    Long_url: string,
    Custom_url: string,
    Qr_code: any,
    Short_url: string,
    Url_click_count: number,
    Click_by: any,
    Date_clicked: Date,
    User_agent: string
    User_id:string
}

const UrlSchema: Schema = new Schema({
    Long_url: {
        type: String,
        require: true
    },
    Custom_url: {
        type: String
    },
    Qr_code: {
        type: String,
        // require: true
    },
    Short_url: {
        type: String,
        // require:true
    },
    Url_click_count: {
        type: Number,
        default: 0
    },
    Click_by: {
        type: String,
        default:''
    },
    Date_clicked: {
        type: Date,
        default:Date.now()
    },
    User_agent: {
        type: String,
        default:''
    },
    User_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
        
    }
    
})

const UrlModel = mongoose.model<IUrl>('url', UrlSchema)

export default UrlModel