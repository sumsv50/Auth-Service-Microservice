import Utils from "./utils";

//define constant
const utils = new Utils();
const https = require('https');
const hostname = 'open.sendo.vn';

class SendoProductService {

    constructor() {

    }

    async getProductIdBySku(userId: string, sku: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        const options = {
            hostname,
            path: '/api/partner/product?sku=' + sku,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        return utils.httpsRequestPromise(options)
        .then(async (data: any) => {
            return data.result.id;
        })  
        .catch((e: any) => {
            return e;
        })
    } 

    async getProductById(userId: string, productId: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        const options = {
            hostname,
            path: '/api/partner/product?id=' + productId,
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

    async createProduct(userId: string, product: any) {
        
        const accessToken = await utils.getAccessTokenByUserId(userId);

        const postData = JSON.stringify(product);
        const options = {
            hostname,
            path: `/api/partner/product`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
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

    async getAllProducts(userId: string, data: any) {
        const accessToken = await utils.getAccessTokenByUserId(userId);

        const postData = JSON.stringify(data);
        const options = {
            hostname,
            path: `/api/partner/product/search`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
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

    async updateProduct(userId: string, data: any): Promise<any> {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        let productData: any = {};
        if (data.stockAvailable && data.stockAvailable.length > 0) {
            productData.stock_quantity = data.stockAvailable.find((stock: any) => stock.ecSite === 'Sendo')?.quantity;
        }
        productData.id = await this.getProductIdBySku(userId, data.sku);
        productData.sku = data.sku;
        productData.name = data.name;
        productData.price = data.exportPrice;
        productData.stock_availability = data.isAllowSell;
        productData.field_mask = ['sku', 'name', 'stock_availability', 'quantity', 'price'];

        const postData = JSON.stringify([productData]);
        const options = {
            hostname,
            path: `/api/partner/product/update-by-field-mask`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
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

    async getProductLink(userId: string, sku: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        const option = {
            hostname,
            path: '/api/partner/product?sku=' + sku,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        return utils.httpsRequestPromise(option)
        .then(async (data: any) => {
            return data;
        })  
        .catch((e: any) => {
            return e;
        })
    }
}

const sendoProductService = new SendoProductService();
export { sendoProductService }