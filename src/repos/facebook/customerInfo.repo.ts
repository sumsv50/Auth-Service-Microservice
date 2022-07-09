/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import CustomerInfo from "@models/facebook/customerInfo.model";

import { ICustomerInfo } from "@models/facebook/customerInfo.model";

class CustomerInfoRepo {
  async create(customerInfo: ICustomerInfo) {
    return await CustomerInfo.create(customerInfo);
  }

  async findOne(query: ICustomerInfo): Promise<ICustomerInfo> {
    return await CustomerInfo.findOne(query).populate('order').lean();
  }

  async updateOne(query: ICustomerInfo, data: ICustomerInfo) {
    return await CustomerInfo.updateOne(query, data);
  }

  async deleteOne(query: ICustomerInfo) {
    return await CustomerInfo.deleteOne(query);
  }

  async deleteMany(userId: string, customerInfoIds: string[]) {
    return await CustomerInfo.deleteMany({
      createdBy: userId,
      _id: {
        $in: customerInfoIds
      }
    })
  }
}

const customerInfoRepo = new CustomerInfoRepo();
export { customerInfoRepo };