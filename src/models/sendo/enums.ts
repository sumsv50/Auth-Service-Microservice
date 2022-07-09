const productStatus = [
    {
        code: 0,
        status: 'Draft',
        status_name: 'Nháp'
    },
    {
        code: 1,
        status: 'Submitted',
        status_name: 'Chờ duyệt'
    },
    {
        code: 2,
        status: 'Approved',
        status_name: 'Đã duyệt'
    },
    {
        code: 3,
        status: 'Rejected',
        status_name: 'Từ chối'
    },
    {
        code: 4,
        status: 'Cancelled',
        status_name: 'Hủy'
    },
    {
        code: 5,
        status: 'Deleted',
        status_name: 'Đã xóa'
    }
]

const productType = [
    {
        code: 1,
        type_name: 'Sản phẩm vật lý'
    },
    {
        code: 2,
        type_name: 'Voucher/Vé giấy'
    },
    {
        code: 3,
        type_name: 'E-voucher/Vé điện tử'
    }
];

const productUnit = [
    {
        code: 1,
        unit: "Single",
        unit_name: 'Cái'
    },
    {
        code: 2,
        unit: "Set",
        unit_name: 'Bộ'
    },
    {
        code: 3,
        unit: "One",
        unit_name: 'Chiếc'
    },
    {
        code: 4,
        unit: "Double",
        unit_name: 'Đôi'
    },
    {
        code: 5,
        unit: "Box",
        unit_name: 'Hộp'
    },
    {
        code: 6,
        unit: "Book",
        unit_name: 'Cuốn'
    },
    {
        code: 7,
        unit: "Bottle",
        unit_name: 'Chai'
    },
    {
        code: 8,
        unit: "Crate",
        unit_name: 'Thùng'
    }
];

export { productStatus, productType, productUnit }