const https = require('https');
import { sendoTokenRepo } from '@repos/sendo/sendoToken.repo';
import SendoAuthService from './auth.service';

const authService = new SendoAuthService();

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
        const sendoToken = await sendoTokenRepo.findOne({ userId });
        if (sendoToken.accessTokenExpire <= Date.now()) {
            return authService.refreshToken(userId)
            .then((data: any) => authService.saveAccessToken(userId, data.result))
            .then((tokens: any) => tokens.accessToken)
            .catch((e) => '');
        }
        if (sendoToken.accessToken) {
            return sendoToken.accessToken;
        } else return '';
    }
}