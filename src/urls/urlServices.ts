
import * as dotenv from "dotenv"
import UserModel from "../model/urlModel"
dotenv.config({ path: __dirname + '/./../../.env' })
import crypto from "crypto"
import UrlModel from "../model/urlModel"
import { checkUrl } from "../utils/validUrl"
// import { qrCode } from "../utils/QrCode"
import { url_short } from "../utils/shortUrl"
import axios, { AxiosResponse } from "axios"
import { request } from "https"



interface IUrl extends Document{
    Long_url: any,
    Custom_url: string,
    Qr_code: any,
    Short_url: string,
    Url_click_count: number,
    Click_by: any,
    Date_clicked: Date,
    User_agent: string
    User_id:any
}




export const createShortUrl = async (reqBody: IUrl) => {
    const shortUrlGen = await url_short(reqBody.Custom_url)
    console.log(shortUrlGen)

    const data = {
        frame_name: 'no-frame',
		qr_code_text: shortUrlGen,
		image_format: 'SVG',
		qr_code_logo: 'scan-me-square',
	};

	const options = {
		method: 'POST',
		url: 'https://api.qr-code-generator.com/v1/create?access-token=k11u-0kcrtKLiXkpPEZnnNUH9RTpYxOOwxf8_zL52Jx2LzVjxvOaiD2lXyc69TMf',

		headers: {
			'content-type': 'application/json',
		},
		data: data,
	};

		const response = await axios.request<AxiosResponse>(options);
		
    const QR_code = response.data
    console.log(QR_code)
    
	
    try {
        checkUrl(reqBody.Long_url)
        if (!checkUrl) {
            return {
                massage: 'Url not valid',
                code :400
            }
        }


        const url_exist:any = await UrlModel.findOne({ Long_url: reqBody.Long_url, User_id: reqBody.User_id })
        
        if (url_exist) {
            return {
                massage: 'short url exist',
                code : 401
            }
        }

       
        const short_url = await UrlModel.create({
            Long_url: reqBody.Long_url,
            Custom_url: reqBody.Custom_url,
            Qr_code: QR_code,
            Short_url: shortUrlGen
            
            
        })

        return {
            massage:'Short Url',
            data:short_url
        }

    } catch (error) {
        
    }
}
export async function redirectShortUrl(reqBody: any) {
    
    const getShortUrl = await UrlModel.findOne({ Short_url:reqBody})
    
    
    
    
    return {
        massage:'Please redirect ',
        data: getShortUrl
    }
}