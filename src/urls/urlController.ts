
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
import { cacheMiddleWare } from '../cach/cache'
import Cache from '../cach/cache'





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





const createShortUrl = async (req: any, res:any) => {
    try {
        const { Long_url,Custom_url }= req.body
        logger.info('[Short Url Creation process ]=>  Started    ');

    const shortUrlGen = await url_short(Custom_url)
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

	
        checkUrl(Long_url)
        logger.info('[Long Url Validity  process ]=>  Started    ');

        if (!checkUrl) {
            return res.status(400).json({ massage: 'Url not valid',
        })
            
        }
        logger.info('[Long Url Validity  process ]=>  Completed    ');


        const url_exist:any = await UrlModel.findOne({ Long_url:Long_url })
        
        if (url_exist) {
            logger.info('[Long Url  ]=>  Exist    ');

            return res.status(401).json( {
                massage: 'short url exist',
            })
        }

       
        const short_url = await UrlModel.create({
            Long_url: Long_url,
            Custom_url: Custom_url,
            Qr_code: QR_code,
           
            Short_url: shortUrlGen,
            User_id:req.userExist._id
            
            
        })
        logger.info('[Short Url  process ]=>  Completed    ');


        return res.status(201).json({
            massage:'Short Url',
            data:`http://localhost:4500/s/s.com/${short_url.Short_url}`
        })

    } catch (error) {
        logger.info('[Server Error ]=> Short Url    ');

        return res.status(500).json({
			massage: 'Server Error'})
        
    }
}
async function redirectShortUrl(req: any, res: any) {
    logger.info('[Redirect Url  process ]=>  Started    ');
    const reqBody = req.params.id
    const reqParam = req.get('sec-ch-ua-platform')
    const reqParam2 = req.get('user-agent')
    const reqParam3 = req.url
    const { id } = req.params
    const dKey = `cache-${id}`

    try {
         
        // const {Short_url} =req.params.id
        const getShortUrl = await UrlModel.findOne({ Short_url:reqBody})
    
    
        if (getShortUrl) {
            getShortUrl.User_agent = reqParam2
            getShortUrl.Click_by = reqParam
            getShortUrl.Url_click_count +=1
            
            getShortUrl.save()
         }
         logger.info('[Redirect Url  process ]=>  COmpleted    ');

        const goto = `http://${getShortUrl?.Long_url}`
         Cache.set(dKey,goto,24*60*60)
       
       return res.status(200).redirect(goto)
        
     } catch (error) {
        logger.info('[Server Error ]=> Redirecte Url    ');

        return res.status(500).json( {
			massage: 'Server Error',
        })
        
     }
    

   
}




async function historyList(req: any,res:any) {
    try {
        logger.info('[Get all Url  History ]=>  Started    ');


        const history = await UrlModel.find({ User_id: req.userExist._id })
    if (history.length<=0) {
        return res.status(422).json({
            massage: 'No record found',
        })
        }
        logger.info('[Get all Url  History ]=>  Completed    ');

    
    return  res.status(200).json( {
        massage: 'short link List',
        data:  history
        })
    
    } catch (error) {
        logger.info('[Server Error ]=> Url History     ');

        return  res.status(500).json({
			massage: 'Server Error',
		});
    
  }
}

async function editUrl(req: any, res: any) {
    logger.info('[Edit Url  Process ]=>  Started    ');

    // const { id } = req.params.id
    
    try {
        const findUrl = await UrlModel.findOne({Short_url:req.params.id })
        if (!findUrl) {
            return res.status(401).json({massage:'Not Found'})
        }
        const updatedUrl = await UrlModel.updateOne({_id:findUrl._id},{Long_url:req.body.Long_url})
        logger.info('[Edit Url  Process ]=>  Completed    ');

    return res.status(200).json({
        massage: 'Url updated',
        data:updatedUrl
    })
    
    
    } catch (error) {
        logger.info('[Server Error ]=> Url Edit ');

        return  res.status(500).json( {
			massage: 'Server Error',
		});
    
   }
    
     
   

}
async function deleteAll(req: any,res:any) {
    try {
        logger.info('[Delete Url  Process ]=>  Started    ');

        const deleteList = await UrlModel.deleteMany({ User_id: req.userExist._id })
        
        logger.info('[Delete Url  Process ]=>  Completed    ');

    return  res.status(200).json( {
        massage: 'Delete List',
        data:deleteList
    })
    
    } catch (error) {
        logger.info('[Server Error ]=> Delete Url ');

        return  res.status(500).json({
			massage: 'Server Error',
		});
    
   }
}

async function deleteOne(req:any,res:any) {
    try {
        logger.info('[Delete One Url  Process ]=>  Started    ');

        const deleteItem = await UrlModel.deleteOne({ _id: req.params._id })
    
        logger.info('[Delete One Url  Process ]=>  Completed    ');

    return res.status(200).json( {
        massage: 'Item Deleted',})
        
    } catch (error) {
        logger.info('[Server Error ]=> Delete One Url ');

        return  res.status(500).json({
			massage: 'Server Error',
		});
    
        
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