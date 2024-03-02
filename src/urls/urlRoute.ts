import express, { Express, Request, Response } from 'express'

import authenticateUser from '../auth/auth'
import ShortUrl from '../urls/urlController'
import redirectUrl from '../urls/urlServices'
import history from '../urls/urlServices'
import update from '../urls/urlServices'
import Cache from '../cach/cache'
import { cacheMiddleWare } from '../cach/cache'
import { get } from 'node:http'
import { request } from 'node:https'
import { platform, userInfo } from 'node:os'
import mongoose, { ObjectId } from 'mongoose'


const router = express.Router()



router.post('/short_url', authenticateUser.authenticateUser,
ShortUrl.createShortUrl
//     authenticateUser.authenticateUser, async (req: any, res: any) => {
//     const createUrl = await ShortUrl.createShortUrl(req.body,     req.userExist._id
//         )
//     res.status(200).json({createUrl})
    // }
   )






router.get('/s.com/:id',
    authenticateUser.authenticateUser,
    cacheMiddleWare,ShortUrl.redirectShortUrl
    // async (req: any, res: any) => {
   
    // const reqBody = req.params.id
    // const reqParam = req.get('sec-ch-ua-platform')
    // const reqParam2 = req.get('user-agent')
    // const reqParam3 = req.url
    // const { id } = req.params
    // const dKey = `cache-${id}`
    

    // const redirectShortUrl = await redirectUrl.redirectShortUrl(reqBody,reqParam2,reqParam, reqParam3)
    // const goto = `http://${redirectShortUrl.data?.Long_url}`
    // Cache.set(dKey,goto,24*60*60)

    // res.redirect(goto)
    // }
)




router.get('/history_list',
    authenticateUser.authenticateUser,ShortUrl.historyList
    // async (req: any, res: any) => {

    // const allLinkList = await history.historyList({User_id:req.userExist._id})
    
    // res.status(200).json({allLinkList})
    // }
)

router.patch('/update/:id',
    authenticateUser.authenticateUser,
    ShortUrl.editUrl
    // async (req: any, res: any) => {
    // const id = req.params.id
    // const urlUpdate = await history.editUrl({_id:id}, req.body)
    
    //     res.status(200).json({urlUpdate})
    // // res.send('done')
    
    // }
)
router.delete('/delete',
    authenticateUser.authenticateUser,
    ShortUrl.deleteAll
    // async (req: any, res: any) => {
    // const id = req.userExist._id

    // const urlDelete = await history.deleteAll({User_id:id})
    // res.status(200).json({
    //     massage: 'History List cleared',
        
    // })

    // }
)
router.delete('/deleteOneItem/:id',
    authenticateUser.authenticateUser,
    ShortUrl.deleteOne
//     async (req: Request, res: Response) => {
//     const  id = req.params.id
//     const deleteOne = history.deleteOne({ _id: id })
//     res.status(200).json({massage:'Item Deleted',code:200})
// }
)

export default router