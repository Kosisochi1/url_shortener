import crypto from 'crypto'
import { buffer } from 'stream/consumers'
  


export async function url_short(reqBody: any) {



    const uKey = crypto.randomBytes(4).toString('hex').slice(0,7)
    // /s/s.com
    
        if (reqBody !== '') {
            return `/s.com/${reqBody}/${uKey}`
        } else {
            return `/s.com/${uKey}`
        }
}

    
    
  