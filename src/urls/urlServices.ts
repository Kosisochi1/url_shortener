
import * as dotenv from "dotenv"
import UserModel from "../model/userModel"
dotenv.config({ path: __dirname + '/./../../.env' })
import crypto from "crypto"
import UrlModel from "../model/urlModel"
import { checkUrl } from "../utils/validUrl"
// import { qrCode } from "../utils/QrCode"
import { url_short } from "../utils/shortUrl"
import axios, { AxiosResponse } from "axios"
import { request } from "https"
import { RequestListener } from "http"
import { Type } from "typescript"
import { Types } from "mongoose"
import { logger } from "../logger"



interface IUrl extends Document{
    Long_url: any,
    Custom_url: string,
    Qr_code: any,
    Short_url: string,
    Url_click_count: number,
    Click_by: any,
    Date_clicked: Date,
    User_agent: string,
    User_id:Types.ObjectId
}
// declare global {
//     namespace Express{
//         interface Request{
//             userExist:IUrl
//         }
//     }
// }





const createShortUrl = async (reqBody: IUrl, userId: any) => {
    try {
        logger.info('[Short Url Creation process ]=>  Started    ');

    const shortUrlGen = await url_short(reqBody.Custom_url)
    logger.info('[Short Url Genareted ]=>  Genareted    ');

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
        
        logger.info('[Qr Code  process]=>  Started    ');

		const response = await axios.request<AxiosResponse>(options);
		
    const QR_code = response.data
    logger.info('[QR Code  ]=>  Genareted    ');

	
        checkUrl(reqBody.Long_url)
        logger.info('[Long Url Validity  process ]=>  Started    ');

        if (!checkUrl) {
            return {
                massage: 'Url not valid',
                code :400
            }
        }
        logger.info('[Long Url Validity  process ]=>  Completed    ');


        const url_exist:any = await UrlModel.findOne({ Long_url: reqBody.Long_url })
        
        if (url_exist) {
            logger.info('[Long Url  ]=>  Exist    ');

            return {
                massage: 'short url exist',
                code : 401
            }
        }

       
        const short_url = await UrlModel.create({
            Long_url: reqBody.Long_url,
            Custom_url: reqBody.Custom_url,
            Qr_code: QR_code,
           
            Short_url: shortUrlGen,
            User_id:userId
            
            
        })
        logger.info('[Short Url  process ]=>  Completed    ');


        return {
            massage:'Short Url',
            data:`http://localhost:4500/s/s.com/${short_url.Short_url}`
        }

    } catch (error) {
        logger.info('[Server Error ]=> Short Url    ');

        return {
			massage: 'Server Error',
			code: 500,
		};
        
    }
}
async function redirectShortUrl(reqBody: any, reqParam2: any, reqParam: any, reqParam3: any) {
    logger.info('[Redirect Url  process ]=>  Started    ');

     try {
        const getShortUrl = await UrlModel.findOne({ Short_url:reqBody})
    
    
        if (getShortUrl) {
            getShortUrl.User_agent = reqParam2
            getShortUrl.Click_by = reqParam
            getShortUrl.Url_click_count +=1
            
            getShortUrl.save()
         }
         logger.info('[Redirect Url  process ]=>  COmpleted    ');

       
       
       return {
           massage:'Please redirect ',
           data: getShortUrl
       }
        
     } catch (error) {
        logger.info('[Server Error ]=> Redirecte Url    ');

        return {
			massage: 'Server Error',
			code: 500,
		};
        
     }
    

   
}




async function historyList(reqParam: any) {
    try {
        logger.info('[Get all Url  History ]=>  Started    ');

        const history = await UrlModel.find({ User_id: reqParam.User_id })
    if (history.length<=0) {
        return {
            massage: 'No record found',
            code:422
        }
        }
        logger.info('[Get all Url  History ]=>  Completed    ');

    
    return {
        massage: 'short link List',
        code: 200,
        data: 
            history
        
    }
    
    } catch (error) {
        logger.info('[Server Error ]=> Url History     ');

        return {
			massage: 'Server Error',
			code: 500,
		};
    
  }
}

async function editUrl(id: any, reqBody: IUrl) {
    logger.info('[Edit Url  Process ]=>  Started    ');

    
    try {
        const findUrl = await UrlModel.findOneAndUpdate({Short_url:id }, reqBody,{new:true} )
    
        logger.info('[Edit Url  Process ]=>  Completed    ');

    return {
        massage: 'Url updated',
        code: 200,
        data:findUrl
    }
    
    
    } catch (error) {
        logger.info('[Server Error ]=> Url Edit ');

        return {
			massage: 'Server Error',
			code: 500,
		};
    
   }
    
     
   

}
async function deleteAll(reqParam: any) {
    try {
        logger.info('[Delete Url  Process ]=>  Started    ');

        const deleteList = await UrlModel.deleteMany({ User_id: reqParam.User_id })
        
        logger.info('[Delete Url  Process ]=>  Completed    ');

    return {
        massage: 'Delete List',
        code: 200,
        data:deleteList
    }
    
    } catch (error) {
        logger.info('[Server Error ]=> Delete Url ');

        return {
			massage: 'Server Error',
			code: 500,
		};
    
   }
}

async function deleteOne(reqParam:any) {
    try {
        logger.info('[Delete One Url  Process ]=>  Started    ');

        const deleteItem = await UrlModel.deleteOne({ _id: reqParam._id })
    
        logger.info('[Delete One Url  Process ]=>  Completed    ');

    return {
        massage: 'Item Deleted',
        code : 200
    }
        
    } catch (error) {
        logger.info('[Server Error ]=> Delete One Url ');

        return {
			massage: 'Server Error',
			code: 500,
		};
    
        
    }
}

export default {
    createShortUrl,
    redirectShortUrl,
    historyList,
    editUrl,
    deleteAll,
    deleteOne
}