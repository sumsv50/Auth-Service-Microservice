import { productRepo } from "@repos/site/product.repo";
import { EC_SITE, getEcSite } from "@models/site/enum";
import { sendoProductService } from "@services/sendo/product.service";
import { FbPostRepo } from "@repos/site/post.repo";

const fbPostRepo = new FbPostRepo();

class ProductService {

    async convertEcProductToSiteProduct(product: any, ecSite: number) {
        
        product.dimensionUnit = 'cm';

        if (ecSite === EC_SITE.TIKI.code) {
            product.meta_data = {
                is_auto_turn_on: product.isAllowSell
            }
            product.weightUnit = 'kg';
            product.exportPrice = product.market_price;
            product.quantity = product.variants.reduce((accumulator: number, variant: any) => {
                return accumulator + variant.warehouse_stocks.reduce((accu: number, stock: any) => accu + stock.qtyAvailable, 0);
            }, 0)

        } else if (ecSite === EC_SITE.SENDO.code) {
            product.stock_availability = product.isAllowSell;
            product.weightUnit = 'gam';
            product.exportPrice = product.price;
            product.image = product.avatar.picture_url;
            product.images = product.pictures.map((pic: any) => pic.picture_url);
            product.quantity = product.stock_quantity;
        }
        return await product;
    }
    
    async createProduct(product: any, ecSite: number) {
        let currProduct: any = await productRepo.findOne({
            createdBy: product.createdBy,
            sku: product.sku
        });

        if (currProduct) {
            if (currProduct.stockAvailable) {
                if (currProduct.stockAvailable.find((e: any) => e.ecSite === ecSite)) {
                    return null;
                }

                currProduct.stockAvailable.push({
                    ecSite: getEcSite(ecSite),
                    quantity: product.quantity
                });
                return await productRepo.updateOne({_id: currProduct._id}, currProduct);
            }
        } else {
            product.stockAvailable = new Array<any>();
            product.stockAvailable.push({
                ecSite: getEcSite(ecSite),
                quantity: product.quantity
            });
            return await productRepo.create(product);
        }
    }

    async updateProduct(userId: string, productId: string, productData: any) {
        let product: any = await productRepo.findOne({_id: productId});
        let isSendoConnected = false;
        if (productData.stockAvailable) {
            isSendoConnected = (productData.stockAvailable.find((stock: any) => stock.ecSite === EC_SITE.SENDO.site));
        }
        if (product) {
            if (isSendoConnected) {
                const isSendoUpdated = await sendoProductService.updateProduct(userId, productData);
                if (!isSendoUpdated.success) return {
                    failed: true,
                    message: 'Cannot update product in Sendo',
                    ...isSendoUpdated
                };
            }

            return await productRepo.updateOne({_id: productId}, productData);
        } return {
            failed: true,
            message: 'Product not found'
        };
    }

    async changeProductQuantity(order: any, typeQuantity: string, factor: number) {
        const products = order.products;
        try {
            products.forEach(async (product: any) => {
                let currProduct: any = await productRepo.findOne({
                    _id: product.product._id
                });
                if (typeQuantity === 'quantity') {
                    currProduct.stockAvailable.find((stock: any) => stock.ecSite === getEcSite(order.ec_site)).quantity += product.quantity * factor;
                } else if (typeQuantity === 'availableQuantity') {
                    currProduct.stockAvailable.find((stock: any) => stock.ecSite === getEcSite(order.ec_site)).availableQuantity += product.quantity * factor;
                }

                await productRepo.updateOne({
                    _id: currProduct._id,
                }, {stockAvailable: currProduct.stockAvailable});
            });
            return true;
        } catch {
            return false;
        }
    }

    async findRelatedPosts(userId: string, productId: string) {
        return await fbPostRepo.find({
            createdBy: userId,
            product: productId,
        });
    }

}

const productService = new ProductService();
export { productService };
