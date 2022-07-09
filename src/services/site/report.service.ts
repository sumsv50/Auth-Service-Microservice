/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-unsafe-optional-chaining */
import { ORDER_STATE } from '@models/site/enum';
import {
  IPostReport,
  IPostReportRequest,
  ISalesReport,
  ISalesReportRequest,
} from '@models/site/report.model';
import { FbPostRepo } from '@repos/site/post.repo';
import { productRepo } from '@repos/site/product.repo';
import postService from '@services/facebook/post.service';
import OrderService from './order.service';
import { productService } from './product.service';

const orderService = new OrderService();
const fbPostRepo = new FbPostRepo();
export default class ReportService {
  async getSalesReport(userId: string, reportRequest: ISalesReportRequest) {
    const outOfStocks = await productRepo.count({
      createdBy: userId,
      stockAvailable: {
        $elemMatch: {
          quantity: {
            $gt: 0,
          },
        },
      },
    });
    const allStocks = await productRepo.count({ createdBy: userId });
    const inventories = await productRepo.count({
      createdBy: userId,
      stockAvailable: {
        $not: {
          $elemMatch: {
            quantity: {
              $gt: 0,
            },
          },
        },
      },
    });
    const deliveries = await orderService.countTotalProductQuantity(
      userId,
      ORDER_STATE.ARRIVED.code
    );

    const outOfStockProducts = await productRepo.find({
      createdBy: userId,
      stockAvailable: {
        $elemMatch: {
          quantity: {
            $gt: 0,
          },
        },
      },
    });

    const productsInStock = await productRepo.find({
      createdBy: userId,
      stockAvailable: {
        $not: {
          $elemMatch: {
            quantity: {
              $gt: 0,
            },
          },
        },
      },
    });

    const chartData = await this.getChartData(userId, reportRequest);
    const salesReport: ISalesReport = {
      outOfStocks,
      allStocks,
      inventories,
      deliveries,
      chartData,
      outOfStockProducts,
      productsInStock,
    };
    return salesReport;
  }

  async getChartData(userId: string, reportRequest: ISalesReportRequest) {
    if (reportRequest.type === 'ARRIVED') {
      return await this.getChartDataByArrived(userId, reportRequest);
    } else if (reportRequest.type === 'INVENTORY') {
      return await this.getChartDataByInventory(userId, reportRequest);
    }
  }

  async getChartDataByArrived(
    userId: string,
    reportRequest: ISalesReportRequest
  ) {
    if (reportRequest.month === undefined && reportRequest.year === undefined) {
      return [];
    }
    if (reportRequest.month === undefined && reportRequest.year !== undefined) {
      const data = await orderService.aggregate([
        {
          $match: {
            createdBy: userId,
            delivery_date: {
              $gte: new Date(reportRequest.year, 0, 1),
              $lt: new Date(reportRequest.year, 11, 31),
            },
            state: ORDER_STATE.ARRIVED.code,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$delivery_date' },
              month: { $month: '$delivery_date' },
            },
            arrivedProducts: { $sum: { $sum: '$products.quantity' } },
          },
        },
      ]);
      return data;
    }
    if (reportRequest.month !== undefined && reportRequest.year !== undefined) {
      const data = await orderService.aggregate([
        {
          $match: {
            createdBy: userId,
            delivery_date: {
              $gte: new Date(reportRequest.year, reportRequest.month - 1, 1),
              $lt: new Date(reportRequest.year, reportRequest.month - 1, 31),
            },
            state: 4,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$delivery_date' },
            },
            arrivedProducts: { $sum: { $sum: '$products.quantity' } },
          },
        },
      ]);
      return data;
    }
  }

  async getChartDataByInventory(
    userId: string,
    reportRequest: ISalesReportRequest
  ) {
    if (reportRequest.month === undefined && reportRequest.year === undefined) {
      const data = await productRepo.aggregate([
        {
          $match: {
            createdBy: userId,
            delivery_date: {
              $gte: new Date(reportRequest.year, 0, 1),
              $lt: new Date(reportRequest.year, 11, 31),
            },
            state: ORDER_STATE.ARRIVED.code,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$delivery_date' },
              month: { $month: '$delivery_date' },
            },
            arrivedProducts: { $sum: { $sum: '$products.quantity' } },
          },
        },
      ]);
      return data;
    }
    if (reportRequest.month === undefined && reportRequest.year !== undefined) {
      const data = await orderService.find({});
    }
  }

  async getPostReport(userId: string, reportRequest: IPostReportRequest) {
    const publishedPosts = await fbPostRepo.count({
      createdBy: userId,
      status: 'posted',
    });

    let interactions;
    let chartData;
    if (reportRequest.month === undefined && reportRequest.year !== undefined) {
      const data = await this.getChartPostReportByMonthAndYear(
        userId,
        reportRequest
      );
      interactions = data?.interactions || 0;
      chartData = data?.chartData || [];
    } 
    else if (reportRequest.month !== undefined && reportRequest.year !== undefined) {
      const data = await this.getChartPostReportByMonth(userId, reportRequest);
      interactions = data?.interactions || 0;
      chartData = data?.chartData || [];
    }

    const postReport: IPostReport = {
      publishedPosts,
      interactions,
      chartData,
    };
    return postReport;
  }

  async getChartPostReportByMonthAndYear(
    userId: string,
    reportRequest: IPostReportRequest
  ) {
    const posts = await fbPostRepo.aggregate([
      {
        $match: {
          createdBy: userId,
          updatedAt: {
            $gte: new Date(reportRequest.year, 0, 1),
            $lte: new Date(reportRequest.year, 11, 31),
          },
          status: 'posted',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$updatedAt' },
            month: { $month: '$updatedAt' },
          },
          // results: {$push: {fbPostIds:'$$ROOT.fbPostIds', date: '$$ROOT.updatedAt'}},
          results: { $push: '$$ROOT' },
        },
      },
    ]);

    const interactionsAndChartData = await this.getInteractionAndChartData(posts);

    return interactionsAndChartData;
  }

  async getChartPostReportByMonth(
    userId: string,
    reportRequest: IPostReportRequest
  ) {
    const posts = await fbPostRepo.aggregate([
      {
        $match: {
          createdBy: userId,
          updatedAt: {
            $gte: new Date(reportRequest.year, reportRequest.month - 1, 1),
            $lte: new Date(reportRequest.year, reportRequest.month - 1, 31),
          },
          status: 'posted',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
          },
          results: { $push: '$$ROOT' },
        },
      },
    ]);

    const interactionsAndChartData = await this.getInteractionAndChartData(posts);

    return interactionsAndChartData;  
  }

  async getInteractionAndChartData(posts: any) {
    let interactions = 0;
    let chartData = [];
    for (const post of posts) {
      let noOfInteractionsInEachRecord = 0;
      let noOfPosts = 0;
      for (const postInMonth of post.results) {
        const postData: any = await postService.getInteractions(
          postInMonth.fbPostIds
        );
        noOfPosts += postInMonth.fbPostIds.length;
        for (const interaction of postData) {
          const noOfComments = interaction?.comments?.data.length || 0;
          const noOfReactions = interaction?.reactions?.data.length || 0;
          const noOfShares = interaction?.shares?.count || 0;
          noOfInteractionsInEachRecord +=
            noOfComments + noOfReactions + noOfShares;
        }
      }
      post.noOfPosts = noOfPosts;
      post.results = undefined;
      post.interactions = noOfInteractionsInEachRecord;
      interactions += noOfInteractionsInEachRecord;
      chartData.push(post);
    }
    return { interactions, chartData };
  }
}
