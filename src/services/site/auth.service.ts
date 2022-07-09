import {FB} from "@shared/fb";
import AuthConfig from "@configs/authentication";



async function getUserFBInfo(fbAccessToken: string) {
  const profile = await FB.api('me', { fields: ['id', 'name'], access_token: fbAccessToken });
  const picture = `https://graph.facebook.com/${profile.id}/picture?access_token=${fbAccessToken}&type=large`
  return { ...profile, picture, fbAccessToken };
}

async function getLongTimeToken(accessToken: string) {
  const longTimeToken = await FB.api('oauth/access_token', {
    client_id: AuthConfig.FB_CLIENT_ID,
    client_secret: AuthConfig.FB_CLIENT_SECRET,
    grant_type: 'fb_exchange_token',
    fb_exchange_token: accessToken
  })
  return longTimeToken;
}

export default {
  getUserFBInfo,
  getLongTimeToken
} as const;