import TikiToken from '@models/tiki/tikiToken.model'
import { ITikiToken } from "@models/tiki/tikiToken.model";

class TikiTokenRepo {
  async findOne(query: ITikiToken) {
    const tikiToken = await TikiToken.findOne(query).lean();
    return tikiToken;
  }

  async saveTikiAccessToken(userId: string, accessToken: string, expire: number, refreshToken: string) {
    let tikiToken = await TikiToken.findOne({ userId });

    if (tikiToken) {
      tikiToken.accessToken = accessToken;
      tikiToken.accessTokenExpire = expire;
      tikiToken.refreshToken = refreshToken;

      return await tikiToken.save();
    }

    tikiToken = new TikiToken({
      userId,
      accessToken,
      accessTokenExpire: expire,
      refreshToken,
    })

    return tikiToken.save();
  }
}

const tikiTokenRepo = new TikiTokenRepo();
export { tikiTokenRepo };