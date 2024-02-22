import express, { Express, Request, Response } from 'express'

import authenticateUser from '../auth/auth'
import {createShortUrl, redirectShortUrl} from '../urls/urlServices'
import { get } from 'node:http'

const router = express.Router()


router.post('/short_url',  async (req: any, res: any) => {
    const createUrl = await createShortUrl(req.body)
    res.status(200).json({createUrl})
})


router.get('/:short_url', async (req: any, res: any) => {
    console.log(req.params.short_url)
    console.log(Headers)
    const reqBody= req.params.short_url
    const redirectUrl = await redirectShortUrl(reqBody)
    console.log(redirectUrl.data?.Long_url)

    res.redirect(`http://${redirectUrl.data?.Long_url}`)
})

export default router