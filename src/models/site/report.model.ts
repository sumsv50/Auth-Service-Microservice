export interface ISalesReport {
    outOfStocks?: number;
    allStocks?: number;
    inventories?: number;
    deliveries?: number;
    chartData?: any;
    outOfStockProducts?: any;
    productsInStock?: any;
}

// type: 'ARRIVED', 'INVENTORY'
export interface ISalesReportRequest {
    type: string;
    month: number;
    year: number;
}

export interface IPostReport {
    publishedPosts?: number;
    interactions?: number;
    chartData?: any;
}

export interface IPostReportRequest {
    month: number;
    year: number;
}