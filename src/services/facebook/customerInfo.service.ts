/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {FB} from '@shared/fb';
import { ICustomerInfo } from '@models/facebook/customerInfo.model';
import {customerInfoRepo} from '@repos/facebook/customerInfo.repo';


async function findDetailOrCreate(threadId: string, userId: string) {
    let customerInfo = await customerInfoRepo.findOne({threadId: threadId});
    if(!customerInfo) {
        customerInfo = await customerInfoRepo.create({threadId: threadId, createdBy: userId});
    }
    return customerInfo;
}

async function findDetail(threadId: string) {
    return await customerInfoRepo.findOne({threadId: threadId});
}

async function updateDetail(customerInfo: ICustomerInfo) {
  return await customerInfoRepo.updateOne({threadId: customerInfo.threadId}, customerInfo);
}


export default {
    findDetailOrCreate: findDetailOrCreate,
  updateDetail,
  findDetail
} as const;