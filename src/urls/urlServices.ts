
import * as dotenv from "dotenv"
import UserModel from "../model/userModel"
dotenv.config({ path: __dirname + '/./../../.env' })
import crypto from "crypto"
import UrlModel from "../model/urlModel"
import { checkUrl } from "../utils/validUrl"
import { url_short } from "../utils/shortUrl"
import axios, { AxiosResponse } from "axios"
import { request } from "https"
import { RequestListener } from "http"
import { Type } from "typescript"
import { Types } from "mongoose"
import { logger } from "../logger"



interface IUrl extends Document{
    _id:string,
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



const createShortUrl = async (long_url: any,custom_url:any, userId: any) => {
    try {
        logger.info('[Short Url Creation process ]=>  Started    ');

    const shortUrlGen = await url_short(custom_url)
    logger.info('[Short Url Genareted ]=>  Genareted    ');

    
    const shortUrl =`http://localhost:4500${shortUrlGen}`
        const options = `http://api.qrserver.com/v1/create-qr-code/?data=${shortUrl}&size=100x100`
        logger.info('[Qr Code  process]=>  Started    ');

		// const response = await axios.get<AxiosResponse>(options);
        // console.log(response)
		
    const QR_code = options
    logger.info('[QR Code  ]=>  Genareted    ');

        checkUrl(long_url)
        logger.info('[Long Url Validity  process ]=>  Started    ');

        if (!checkUrl) {
            return {
                massage: 'Url not valid',
                code :400
            }
        }
        logger.info('[Long Url Validity  process ]=>  Completed    ');


        const url_exist:any = await UrlModel.findOne({ Long_url: long_url })
        
        if (url_exist) {
            logger.info('[Long Url  ]=>  Exist    ');

            return {
                massage: 'short url exist',
                code: 409,
                url_exist:url_exist
            }
        }

       
        const short_url = await UrlModel.create({
            Long_url: long_url,
            Custom_url: custom_url,
            Qr_code: QR_code,
           
            Short_url: shortUrlGen,
            Short_url_link:shortUrl,
            User_id:userId
            
            
        })
        logger.info('[Short Url  process ]=>  Completed    ');


        return {
            massage: 'Short Url',
            code:201,
            data:{Short_url_link:short_url.Short_url_link,Long_url:short_url.Long_url,qRcode:short_url.Qr_code}
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
    // const reqBody = reqBody
    // const reqParam = req.get('sec-ch-ua-platform')
    // const reqParam2 = req.get('user-agent')
    // const reqParam3 = req.url
    // const { id } = req.params
    // const dKey = `cache-${id}`

    try {
        const getShortUrl = await UrlModel.findOne({ Short_url: reqBody })
    
    
        if (getShortUrl) {
            getShortUrl.User_agent = reqParam2
            getShortUrl.Click_by = reqParam
            getShortUrl.Url_click_count += 1
            
            getShortUrl.save()
        }
        logger.info('[Redirect Url  process ]=>  COmpleted    ');

        //  const goto = `http://${getShortUrl?.Long_url}`
        //  Cache.set(dKey,goto,24*60*60)
       
        return {
            code: 308,
            massage: 'Please redirect ',
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
async function redirectCustom(reqBody: any, reqParam2: any, reqParam: any, reqParam3: any) {
    logger.info('[Redirect Url  process ]=>  Started    ');
    // const reqBody = reqBody
    // const reqParam = req.get('sec-ch-ua-platform')
    // const reqParam2 = req.get('user-agent')
    // const reqParam3 = req.url
    // const { id } = req.params
    // const dKey = `cache-${id}`

     try {
        const getShortUrl = await UrlModel.findOne({Short_url:reqBody})
    console.log(getShortUrl)
    
        if (getShortUrl) {
            getShortUrl.User_agent = reqParam2
            getShortUrl.Click_by = reqParam
            getShortUrl.Url_click_count +=1
            
            getShortUrl.save()
         }
         logger.info('[Redirect Url  process ]=>  COmpleted    ');

        //  const goto = `http://${getShortUrl?.Long_url}`
        //  Cache.set(dKey,goto,24*60*60)
       
         return {
           code:308,
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
            code:404
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
        const findUrl = await UrlModel.findOneAndUpdate({ Short_url: id }, reqBody, { new: true })
        if (findUrl) {
            
            logger.info('[Edit Url  Process ]=>  Completed    ');
    
        return {
            massage: 'Url updated',
            code: 200,
            data:findUrl
        }
        } else {
            return {
                massage: 'No Record Found',
                code:404,
            }
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

        await UrlModel.deleteMany({ User_id: reqParam.User_id })
       
            
            logger.info('[Delete Url  Process ]=>  Completed    ');
    
        return {
            massage: 'Delete List',
            code: 200,
        }
           
        
    
    } catch (error) {
        logger.info('[Server Error ]=> Delete Url ');

        return {
			massage: 'Server Error',
			code: 500,
		};
    
   }
}

async function deleteOne(reqParam: any) {
    // const { _id }= reqParam
    try {
        logger.info('[Delete One Url  Process ]=>  Started    ');

        await UrlModel.findByIdAndDelete({_id:reqParam._id})
        // if (deleteItem) {
            
            logger.info('[Delete One Url  Process ]=>  Completed    ');
    
        return {
            massage: 'Item Deleted',
            code : 200
        }
        // } else {
        //     return {
        //         massage: 'No Record FOund',
        //         code: 404
        //     }
        // }
    
        
    } catch (error) {
        logger.info('[Server Error ]=> Delete One Url ');

        return {
			massage: 'Server Error',
			code: 500,
		};
    
        
    }
}
async function findLongUrl(reqBody:any) {
    try {
        const findUrl = await UrlModel.findById({ _id: reqBody._id })

    if (findUrl) {
        return {
            massage: 'Url detail Information',
            code: 200,
            data:findUrl
        }
        
    } else {
        
        return {
            massage: 'User Found',
            code: 409,
            
        }
}
    
    } catch (error) {
        return {
			massage: 'Server Error Analytic',
			code: 500,
		};
    
   }

    
}

export default {
    findLongUrl,
    createShortUrl,
    redirectShortUrl,
    historyList,
    editUrl,
    deleteAll,
    deleteOne,
    redirectCustom
}