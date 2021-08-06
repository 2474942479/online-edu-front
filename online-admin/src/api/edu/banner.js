import request from '@/utils/request'

export default {

    // 1 讲师列表（后端中条件查询分页）
    // current:当前页   size：每页记录数    teacherQuery：查询条件
    getBannerList(bannerQueryDTO) {
        return request({
            url: `/eduService/banner/getBannerList`,
            method: 'post',
            // teacherQuery条件对象 后端用RequestBody获取数据
            // data表示把对象转换成json数据传递到接口里
            data: bannerQueryDTO
        })
    },

    // 根据id删除讲师
    removeBanner(id) {
        return request({
            url: `/eduService/banner/removeBanner/${id}`,
            method: 'delete',
        })

    },

    // 添加讲师
    saveOrUpdateBanner(bannerDTO) {
        return request({
            url: `/eduService/banner/saveOrUpdateBanner`,
            method: 'post',
            data: bannerDTO
        })
    },

    // 通过id查询讲师信息
    getBannerById(id) {
        return request({
            url: `/eduService/banner/getBannerById/${id}`,
            method: "get"
        })
    },

}
