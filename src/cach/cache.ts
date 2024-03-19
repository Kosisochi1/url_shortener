import { NextFunction } from 'express'
import NodeCache from 'node-cache'

const Cache = new NodeCache()


export const cacheMiddleWare = async (req: any, res: any, next: NextFunction) => {
    try {
        const key  = req.url
        const dKey = `cache-${key}`
        console.log(dKey)
    const cachedData = Cache.get(dKey)

    if (cachedData) {
        console.log('cache hit')
		return res.render('history',{Data: cachedData})
        
    }
    next()
    
   } catch (error) {
    return res.status(500).json({
        massage: 'Server error',
    });
   }
}
export default Cache