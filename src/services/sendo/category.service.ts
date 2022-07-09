import Utils from "./utils";

//define constance
const utils = new Utils();
const hostname = 'open.sendo.vn';

export default class SendoCategoryService {

    constructor() {

    }

    async getRecentCategories(userId: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        const options = {
            hostname,
            path: '/api/partner/category',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        return utils.httpsRequestPromise(options)
        .then(async (data: any) => {
            return data;
        })  
        .catch((e: any) => {
            return e;
        })
    }

    async getRootCategories(userId: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        const options = {
            hostname,
            path: '/api/partner/category/0',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        return utils.httpsRequestPromise(options)
        .then(async (data: any) => {
            return data;
        })  
        .catch((e: any) => {
            return e;
        })
    }

    async getCategoryById(categoryId: string, userId: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        const options = {
            hostname,
            path: '/api/partner/category/' + categoryId,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        return utils.httpsRequestPromise(options)
        .then(async (data: any) => {
            return data;
        })  
        .catch((e: any) => {
            return e;
        })
    }

}