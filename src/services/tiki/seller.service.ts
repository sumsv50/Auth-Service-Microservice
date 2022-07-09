import Utils from "./utils";

//define constance
const utils = new Utils();

const hostname = 'api.tiki.vn';

export default class TikiSellerService {

    async getInformation(userId: string): Promise<any> {

        const accessToken = await utils.getAccessTokenByUserId(userId);

        return await utils.httpsRequestPromise({
            hostname,
            path: '/integration/v2/sellers/me',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

    async getWarehouses(limit: String, page: String, userId: string) {

        const accessToken = await utils.getAccessTokenByUserId(userId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/sellers/me/warehouses?status=1&type=1&limit=${limit}&page=${page}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

}