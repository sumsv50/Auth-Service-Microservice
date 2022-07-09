import FormData from 'form-data';
import https from 'https';
import crypto from 'crypto'
import AuthConfig from '@configs/authentication';
import Utils from './utils';
import { tikiTokenRepo } from '@repos/tiki/tikiTokens.repo';

const utils = new Utils();

export default class TikiAuthService {

  constructor() {}

  async getAccessToken(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('grant_type', 'authorization_code');
      formData.append('code', code);
      formData.append('redirect_uri', <string>AuthConfig.TIKI_REDIRECT_URI);
      formData.append('client_id', <string>AuthConfig.TIKI_CLIENT_ID);
      formData.append('client_secret', <string>AuthConfig.TIKI_CLIENT_SECRET);

      formData.submit('https://api.tiki.vn/sc/oauth2/token', (err:any, res:any) => {
        var body = '';
        if (err) {
          reject(err);
        }

        res.on('data', function (chunk:any) {
          body += chunk;
        });
        res.on('end', function () {
          const bodyJson = JSON.parse(body);

          if (bodyJson.status_code === 400) {
            console.log(bodyJson);
            resolve(null);
          }
          resolve({
            accessToken: bodyJson.access_token,
            expiresIn: bodyJson.expires_in,
            refreshToken: bodyJson.refresh_token,
          });
        });
      })
    })
  }

  async getUserInfo(accessToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      https.get({
        host: 'api.tiki.vn',
        path: '/integration/v2/sellers/me',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }, (res) => {
        var body = '';
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', function () {
          const userData = JSON.parse(body);
          resolve(userData);
        })
      })
    })
  }

  async refreshToken(userId: string) {

    const tikiToken = await utils.getAccessTokenByUserId(userId);

    return new Promise((resolve, reject) => {

      if (!tikiToken) reject();

      const formData = new FormData()
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', tikiToken.refreshToken);
      formData.append('client_id', <string>AuthConfig.TIKI_CLIENT_ID);
      formData.append('client_secret', <string>AuthConfig.TIKI_CLIENT_SECRET);

      formData.submit('https://api.tiki.vn/sc/oauth2/token', (err:any, res:any) => {
        var body = '';
        if (err) {
          reject(err);
        }

        res.on('data', function (chunk:any) {
          body += chunk;
        });
        res.on('end', function () {
          const bodyJson = JSON.parse(body);

          if (bodyJson.status_code === 400) {
            console.log(bodyJson);
            resolve(null);
          }
          resolve({
            accessToken: bodyJson.access_token,
            expiresIn: bodyJson.expires_in,
            refreshToken: bodyJson.refresh_token,
          });
        });
      })
    })
  }

  async getTokenByUserId(userId: string) {
    return await tikiTokenRepo.findOne({
      userId
    });
  }

}