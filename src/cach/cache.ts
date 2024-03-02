import { NextFunction } from 'express'
import NodeCache from 'node-cache'

const Cache = new NodeCache()


export const cacheMiddleWare = async (req: any, res: any, next: NextFunction) => {
    try {
        const { id } = req.params
    const dKey = `cache-${id}`
    const cachedData = Cache.get(dKey)

    if (cachedData) {
        console.log('cache hit')
        return res.redirect(cachedData)
        
    }
    next()
    
   } catch (error) {
    return res.status(500).json({
        massage: 'Server error',
    });
   }
}
export default Cache