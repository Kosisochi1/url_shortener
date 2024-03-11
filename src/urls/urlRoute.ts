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






router.get('/s.com/*',

    ShortUrl.redirectShortUrl
 
)




router.get('/history_list',
    authenticateUser.authenticateUser,ShortUrl.historyList
   
)
router.get('/analytic',
    authenticateUser.authenticateUser,ShortUrl.analytic
   
)
router.get('/analytic/:id',
    authenticateUser.authenticateUser,ShortUrl.analyticDetails
   
)

router.patch('/update/:id',
    authenticateUser.authenticateUser,
    ShortUrl.editUrl
   
)
router.delete('/delete',
    authenticateUser.authenticateUser,
    ShortUrl.deleteAll
   
)
router.delete('/deleteOneItem/:id',
    authenticateUser.authenticateUser,
    ShortUrl.deleteOne

)

export default router