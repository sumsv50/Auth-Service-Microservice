import TikiProduct from "@models/tiki/product.model"
import { ITikiProduct } from "@models/tiki/product.model"
import stateModel from "@models/tiki/enums/state.model";

class TikiProductRepo {

    async findAll(page: number, itemPerPage: number) {
      return await TikiProduct.paginate({}, {
        page: page,
        limit: itemPerPage,
        lean: true,
        select: ['-createdBy'],
        sort: '-createdAt'
      });
    }

    async findOne(query: any): Promise<any> {
      return await TikiProduct.findOne(query).select(['-createdBy']).lean();
    }

    async findByTrackId(trackId: string) {
      return await TikiProduct.findOne({track_id: trackId}).select(['-createdBy']).lean();
    }
  
    async saveProduct(product: ITikiProduct) {
      return new TikiProduct(product).save();
    }

    async saveProductFromProductRequest(productRequest: any, resBody: any) {
      if (resBody) {
        productRequest.track_id = resBody.track_id;
        productRequest.state = resBody.state;
        productRequest.state_description = stateModel.find(el => el.state === resBody.state)?.description;
        
        productRequest.createdBy = resBody.userId;
      }

      return await this.saveProduct(productRequest);
    }

    async updateStatus(trackId: string, statusData: any) {
      return await TikiProduct.updateOne({track_id: trackId}, {
        state: statusData.state,
        reason: statusData.reason,
        state_description: stateModel.find(el => el.state === statusData.state)?.description,
        request_id: statusData.request_id
      });
    }

  }
  
  const tikiProductRepo = new TikiProductRepo();
  export { tikiProductRepo };