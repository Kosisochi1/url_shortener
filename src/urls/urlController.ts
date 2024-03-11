
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




const createShortUrl = async (req: any, res:any) => {
    try {
        const { Long_url,Custom_url }= req.body
        logger.info('[Short Url Creation process ]=>  Started    ');

    const shortUrlGen = await url_short(Custom_url)
    logger.info('[Short Url Genareted ]=>  Genareted    ');

    const shortUrl =`http://localhost:4500/url/v1/api${shortUrlGen}`
    const options = `http://api.qrserver.com/v1/create-qr-code/?data=${shortUrl}&size=100x100`
    logger.info('[Qr Code  process]=>  Started    ')

        
		
    const QR_code = options
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

            return res.status(409).json( {
                massage: 'short url exist',
            })
        }

       
        const short_url = await UrlModel.create({
            Long_url: Long_url,
            Custom_url: Custom_url,
            Qr_code: QR_code,
           
            Short_url: shortUrlGen,
                        Short_url_link:shortUrl,

            User_id:req.userExist._id
            
            
        })
        logger.info('[Short Url  process ]=>  Completed    ');


        return res.status(201).json({
            massage:'Short Url',
            data:{Short_url_link:short_url.Short_url_link,Long_url:short_url.Long_url,qRcode:short_url.Qr_code}

           
        })

    } catch (error) {
        logger.info('[Server Error ]=> Short Url    ');

        return res.status(500).json({
			massage: 'Server Error'})
        
    }
}
async function redirectShortUrl(req: any, res: any) {
    console.log(req.url)
    logger.info('[Redirect Url  process ]=>  Started    ');
    const reqBody = req.url
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
        //  Cache.set(dKey,goto,24*60*60)
       
       return res.status(308).redirect(goto)
        
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
        return res.status(404).json({
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
async function analytic(req: any,res:any) {
    try {
        logger.info('[Get all Url  History ]=>  Started    ');


        const history = await UrlModel.find({ User_id: req.userExist._id })
    if (history.length<=0) {
        return res.status(404).json({
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
        const findUrl = await UrlModel.findOne({_id:req.params.id })
        if (!findUrl) {
            return res.status(404).json({massage:'Not Found'})
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
        if (deleteList) {
            
            logger.info('[Delete Url  Process ]=>  Completed    ');
    
        return  res.status(200).json( {
            massage: 'Delete List',
            data:deleteList
        })
        } else {
            return res.status(404).json({                massage: 'No Record Found',
        })
        }
        
    
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

        const deleteItem = await UrlModel.deleteOne({ _id: req.params.id })
        if (deleteItem) {
            
            logger.info('[Delete One Url  Process ]=>  Completed    ');
    
        return res.status(200).json( {
            massage: 'Item Deleted',})
        } else {
            return res.status(404).json({                massage: 'No Record FOund',
        })
        }
    
        
    } catch (error) {
        logger.info('[Server Error ]=> Delete One Url ');

        return  res.status(500).json({
			massage: 'Server Error',
		});
    
        
    }
}
async function analyticDetails(req: any, res: any) {
    try {
        const findUrl = await UrlModel.findById({ _id: req.params.id })

        if (findUrl) {
            return res.status(200).json({massage: 'Url detail Information',
            data: findUrl})
                
            
        
        } else {
        
            return res.status(409).json({massage: 'User Found'})
            
            
        }
    
    } catch (error) {
        return  res.status(409).json({massage: 'User Found'})
        
    
    }
}

export default {
    createShortUrl,
    redirectShortUrl,
    historyList,
    editUrl,
    deleteAll,
    deleteOne,
    analyticDetails,
    analytic
}