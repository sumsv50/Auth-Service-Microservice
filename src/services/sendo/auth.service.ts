import FormData from 'form-data';
import https from 'https';
import AuthConfig from '@configs/authentication';

import { sendoTokenRepo } from '@repos/sendo/sendoToken.repo';

//define constant
const hostname = 'open.sendo.vn';

export default class SendoAuthService {

  constructor() {}

  async initialSave(userId: string, token: string, expires: Date, keys: any) {
    const data = {
      userId,
      token,
      expires,
      ...keys
    }
    return await sendoTokenRepo.saveTokenAndKeys(userId, data);
  }

  async saveAccessToken(usreId: string, tokens: any) {
    return await sendoTokenRepo.saveSendoAccessToken(usreId, tokens);
  }

  async getAccessToken(data: any): Promise<any> {
    const postData = JSON.stringify(data);
    const options = {
      hostname,
      path: `/login`,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
    }
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
      
      req.write(postData);
      req.end();
    })
  }

  async refreshToken(userId: string) {

    const tokenInfo = await sendoTokenRepo.findOne({userId});
    let data: any = {};

    if (tokenInfo.shopKey && tokenInfo.secretKey) {
      data.shop_key = tokenInfo.shopKey;
      data.secret_key = tokenInfo.secretKey;
    } else {
      return new Promise(function(resolve, reject) {
        reject({
          error: {
            message: 'User has not registered sendo yet'
          }
        })
      })
    }

    const postData = JSON.stringify(data);
    const options = {
      hostname,
      path: `/login`,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
    }
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
      
      req.write(postData);
      req.end();
    })

  }

  async getTokenByUserId(userId: string) {
    return await sendoTokenRepo.findOne({
      userId
    });
  }

}