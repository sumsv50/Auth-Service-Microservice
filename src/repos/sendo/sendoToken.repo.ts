import SendoToken from '@models/sendo/sendoToken.model'
import { ISendoToken } from "@models/sendo/sendoToken.model";

class SendoTokenRepo {
  async findOne(query: ISendoToken) {
    const sendoToken = await SendoToken.findOne(query).lean();
    return sendoToken;
  }

  async saveSendoAccessToken(userId: string, data: any) {
    let sendoToken = await SendoToken.findOne({ userId });

    if (sendoToken) {
      sendoToken.accessToken = data.token;
      sendoToken.accessTokenExpire = data.expires;

      return await sendoToken.save();
    }

    sendoToken = new SendoToken({
      userId,
      accessToken: data.token,
      accessTokenExpire: data.expires,
    })

    return await sendoToken.save();
  }

  async saveTokenAndKeys(userId: string, data: any) {

    let sendoToken = await SendoToken.findOne({ userId });

    if (sendoToken) {
      sendoToken.accessToken = data.token;
      sendoToken.accessTokenExpire = data.expires;
      sendoToken.shopName = data.shopName;

      return await sendoToken.save();
    }

    sendoToken = new SendoToken({
      userId,
      accessToken: data.token,
      accessTokenExpire: data.expires,
      shopKey: data.shop_key,
      secretKey: data.secret_key,
      shopName: data.shopName
    })

    return await sendoToken.save();
  }
}

const sendoTokenRepo = new SendoTokenRepo();
export { sendoTokenRepo };