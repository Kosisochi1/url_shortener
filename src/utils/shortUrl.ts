import crypto from 'crypto'
import { buffer } from 'stream/consumers'
  


export async function url_short(reqBody: any) {



    const uKey = crypto.randomBytes(4).toString('hex').slice(0,7)
    
        if (reqBody == '') {
            return `s.eke.${uKey}` 
        } else {
            return`s.eke.${reqBody}`
        }
}

    
    
  