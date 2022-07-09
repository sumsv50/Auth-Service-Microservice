import Utils from "./utils";
import TikiCategory from "@models/tiki/category.model";

//define constance
const utils = new Utils();

const hostname = 'api.tiki.vn';

export default class TikiCategoryService {

    categories: Array<TikiCategory> = [];

    constructor() {

    }

    async getAllCategories(userId: string) {

        const accessToken = await utils.getAccessTokenByUserId(userId);

        return utils.httpsRequestPromise({
            hostname,
            path: '/integration/v2/categories',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then((body: any) => {
            this.categories = body.data;
            return this.categories;
        })  
        .catch((e: any) => {
            return e;
        })
    }

    getRootCategories() {
        return this.categories.filter((category) => category.parent_id == 2);
    }

    getChildCategories(parentId: number) {
        const category = this.categories.find((category) => category.id == parentId);
        if (!category) return null 
        else if (category!.is_primary) return null;
        return this.categories.filter((category) => category.parent_id == parentId)
    }

    async getCategoryById(categoryId: string, userId: string) {

        const accessToken = await utils.getAccessTokenByUserId(userId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/categories/${categoryId}?includeParents=true`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

    async getCategoryAttributes(categoryId: number, userId: string) {

        const accessToken = await utils.getAccessTokenByUserId(userId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/categories/${categoryId}/attributes`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

    async getAttributeValues(attributeId: String, keyWord: String, limit: String, page: String, userId: string) {

        const accessToken = await utils.getAccessTokenByUserId(userId);
        let path = `/integration/v2/attributes/${attributeId}/values?limit=${limit}&page=${page}`;

        if (keyWord) path += `&q=${keyWord}`

        return utils.httpsRequestPromise({
            hostname,
            path,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

    async getCategoryOptionLabels(categoryId: number, userId: string) {

        const accessToken = await utils.getAccessTokenByUserId(userId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/categories/${categoryId}/optionLabels`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then((res: any) => {
            res.data = res.data.map((el: any) => ({
                option_label: el.option_label.toLowerCase()
            }));
            return Array.from(new Set(res.data));
        })
    }
}