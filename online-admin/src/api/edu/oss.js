import request from '@/utils/request'

export default {

    removeBatchOssFile(fileUrls) {
        return request({
            url: `/eduService/oss/removeBatchOssFile`,
            method: "delete",
            data: fileUrls
        })
    }
}