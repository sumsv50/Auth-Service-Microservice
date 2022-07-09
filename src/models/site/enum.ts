const ORDER_STATE = {
    QUEUING: {
        code: 1,
        description: 'Đang chờ xác nhận'
    },
    CONFIRMED: {
        code: 2,
        description: 'Đã xác nhận'
    },
    DELIVERING: {
        code: 3,
        description: 'Đang giao hàng'
    },
    ARRIVED: {
        code: 4,
        description: 'Hoàn thành'
    },
    REJECTED: {
        code: 0,
        description: 'Bị từ chối'
    },
    CANCELED: {
        code: -1,
        description: 'Bị khách hủy'
    }
}

const EC_SITE = {
    FACEBOOK: {
        code: 1,
        site: 'Facebook'
    },
    TIKI: {
        code: 2,
        site: 'Tiki'
    },
    SENDO: {
        code: 3,
        site: 'Sendo'
    }
}

const CATEGORIES = [
    'Thiết bị điện tử',
    'Áo quần',
    'Giày dép',
    'Mũ nón',
    'Phụ kiện',
    'Phụ tùng xe',
    'Đồ gia dụng',
    'Thức ăn',
    'Đồ uống',
    'Đồ dùng học tập',
    'Sách'
]
const POST_STATUS = {
  POSTED: 'posted',
  WAITING: 'waiting'
}

const NOTIFICATION_TYPE = {
  INTERESTING_POST: 'interestingPost'
}

const NOTIFICATION_STATUS = {
  READ: 'read',
  NOT_READ: 'notRead'
}

function getDescription(code: number) {
    for(const value of Object.values(ORDER_STATE)) {
        if (value.code === code) {
            return value.description;
        }
    }
    return 'Code not found';
}

function getEcSite(code: number) {
    for(const value of Object.values(EC_SITE)) {
        if (value.code === code) {
            return value.site;
        }
    }
    return 'Code not found';
}

export { 
    ORDER_STATE, 
    EC_SITE,
    CATEGORIES,
    POST_STATUS,
    NOTIFICATION_TYPE,
    NOTIFICATION_STATUS,
    getDescription,
    getEcSite
}
