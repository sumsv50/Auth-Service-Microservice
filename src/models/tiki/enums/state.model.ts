export default [
    {
        state: 'queuing', 
        description: 'Yêu cầu trong hàng đợi, chờ xử lý'
    },
    {
        state: 'processing', 
        description: 'Yêu cầu đang được chuyển đổi sang định dạng của Tiki'
    },
    {
        state: 'drafted', 
        description: 'Yêu cầu đã được tạo, có thể xem lại'
    },
    {
        state: 'bot_awaiting_approve', 
        description: 'Tiki bot kiểm tra yêu cầu'
    },
    {
        state: 'md_awaiting_approve', 
        description: 'Tiki kiểm tra các tài liệu cần thiết'
    },
    {
        state: 'awaiting_approve', 
        description: 'Yêu cầu đợi được phê duyệt'
    },
    {
        state: 'approved', 
        description: 'Đã phê duyệt, tạo sản phẩm thành công'
    },
    {
        state: 'rejected', 
        description: 'Yêu cầu bị từ chối'
    },
    {
        state: 'deleted', 
        description: 'Yêu cầu bị xóa'
    },
]