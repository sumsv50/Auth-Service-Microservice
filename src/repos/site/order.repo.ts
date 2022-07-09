import Order from '@models/site/order.model';
import { IOrder } from '@models/site/order.model';

export class OrderRepo {
  async create(order: IOrder) {
    return await Order.create(order);
  }

  async updateOne(query: object, data: IOrder) {
    return await Order.updateOne(query, data);
  }

  async findOne(query: IOrder) {
    return await Order.findOne(query)
      .select(['-createdBy'])
      .populate('products.product')
      .lean();
  }
  
  async findAll(query: object) {
    return await Order.find(query)
      .select(['-createdBy'])
      .populate('products.product')
      .sort('-createdAt')
      .lean();
  }

  async findAllPagination(query: object, page: number, itemPerPage: number) {
    const Orders = await Order.paginate(query, {
      page: page,
      limit: itemPerPage,
      lean: true,
      select: ['-createdBy'],
      populate: 'products.product',
      sort: '-createdAt'
    })
    return Orders;
  }

  async find(query: object) {
    const Orders = await Order.find(query);
    return Orders;
  }

  async aggregate(query: any) {
    const Orders = await Order.aggregate(query);
    return Orders;
  }

  async deleteOne(query: IOrder) {
    return await Order.deleteOne(query);
  }

  async count(query: any) {
    const count: number = await Order.countDocuments(query);
    return count;
  }
}