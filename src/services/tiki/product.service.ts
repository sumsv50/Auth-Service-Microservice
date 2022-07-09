import Utils from "./utils";
import { tikiProductRepo } from "@repos/tiki/product.repo";

//define constant
const https = require('https');
const utils = new Utils();
const hostname = 'api.tiki.vn';


function productToProductRequest (product: any) {

    let tempProduct = Object.assign({}, product);
    if (tempProduct.attributes) {
        const attributes = tempProduct.attributes;
        tempProduct.attributes = {};

        attributes.forEach((attr:any) => {
            tempProduct.attributes[attr.attribute_code] = attr.value;
        });
    }
    return tempProduct;

}


export default class TikiProductService {

    async getTrackIdByProductId(productId: string) {
        const product:any = await tikiProductRepo.findOne({_id: productId});
        if (product) {
            return product.track_id;
        } 
        return null;
    }

    async getRequestIdByProductId(productId: string) {
        const product:any = await tikiProductRepo.findOne({_id: productId});
        if (product) {
            return product.request_id;
        } 
        return null;
    }

    async requestOneProduct(product: any, userId: string) {

        const accessToken = await utils.getAccessTokenByUserId(userId);
        const postData = JSON.stringify(productToProductRequest(product));

        const options = {
            hostname,
            path: `/integration/v2.1/requests`,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
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

    async getAllProductRequestsStatus(userId: string, page: string, limit: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/tracking`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(async (data: any) => {
            if (Array.isArray(data)) {
                const products = await tikiProductRepo.findAll(Number.parseInt(page), Number.parseInt(limit));
                products.docs.forEach(async (product:any) => {
                    const statusData = data.find((el) => el.track_id === product.track_id);
                    if (statusData) {
                        await tikiProductRepo.updateStatus(product.track_id, statusData)
                    }
                })
            }
            return await tikiProductRepo.findAll(Number.parseInt(page), Number.parseInt(limit));
        })
    }

    async getOneProductRequestStatus(productId: string, userId: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        const trackId = await this.getTrackIdByProductId(productId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/tracking/${trackId}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(async (data: any) => {
            if (data.state) {
                await tikiProductRepo.updateStatus(trackId, data);
            }
            return await tikiProductRepo.findOne({_id: productId});
        })
    }

    async replayProductRequest(producId: string, userId: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        const trackId = await this.getTrackIdByProductId(producId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/tracking/${trackId}/replay`,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

    async getProductRequestInfoById(requestId: string, userId: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/requests/${requestId}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

    async getAllProductRequestsInfo(pagination: any, state: string , userId: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/requests?state=${state}&page=${pagination.page}&limit=${pagination.limit}&include=products`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

    async deleteProductRequest(productId: string, userId: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);
        const requestId = await this.getRequestIdByProductId(productId);

        if (!requestId) return new Promise((resolve, reject) => {
            reject('Cannot delete this product request yet!');
        });

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2/requests/${requestId}`,
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

    async getAllProducts(userId: string, name: string, active: string, category_id: string, page: string, limit: string, 
        created_from_date: string, updated_from_date: string, created_to_date: string, updated_to_date: string) {
        const accessToken = await utils.getAccessTokenByUserId(userId);

        return utils.httpsRequestPromise({
            hostname,
            path: `/integration/v2.1/products?name=${name}&active=${active}&category_id=${category_id}&page=${page}&limit=${limit}
                &created_from_date=${created_from_date}&updated_from_date=${updated_from_date}
                &created_to_date=${created_to_date}&updated_to_date=${updated_to_date}&include=inventory`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
    }

    async createProductFromRequest(productRequest: any, resBody: any) {
        if (resBody.track_id && resBody.state) {
            return await tikiProductRepo.saveProductFromProductRequest(productRequest, resBody);
        }
        return resBody;
    }

    async getProductLink(userId: string, sku: string) {
        const product: any = await tikiProductRepo.findOne({
            createdBy: userId,
            sku
        });
        if (!product) return false;
        return await {
            link: product.request_id ? `https://sellercenter.tiki.vn/new/#/products/update/request/${product.request_id}?source_screen=request_list` : null,
            id: product._id
        };
    }
    
}