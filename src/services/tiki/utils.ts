const https = require('https');
import { tikiTokenRepo } from '@repos/tiki/tikiTokens.repo';

export default class Utils { 
    httpsRequestPromise(options: any) {
        return new Promise(function(resolve, reject) {
            const req = https.request(options, function(res:any) {
    
                // cumulate data
                let data: Array<any> = [];
                res.on('data', function(chunk:any) {
                    data.push(chunk);
                });
    
                // resolve on end
                res.on('end', function() {
                    try {
                        data = JSON.parse(Buffer.concat(data).toString());
                    } catch (e) {
                        reject(e);
                    }
                    resolve(data);
                });
            });
    
            // reject on request error
            req.on('error', function(error: any) {
                reject(error);
            });
            
            req.end();
        })
    }

    async getAccessTokenByUserId(userId: string) {
        const tikiToken = await tikiTokenRepo.findOne({ userId });
        if (tikiToken.accessToken) {
            return tikiToken.accessToken;
        } else return '';
    }
}