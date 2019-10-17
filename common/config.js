export const envir = 'test'
const configMap = {
    test: {
        base: 'https://gojidev.eastseven.cn/api/app/',
        appkey: '6c4f3f4a3c222da880d35c9c22104c50',
        url: 'https://apptest.netease.im'
    },
    online: {
        base: 'https://prod.gojiapp.cn/api/app/',
        appkey: '9975d74634ed413f7f01d06cf608ba88',
        url: 'https://app.netease.im'
    }
}
let config = {}
config = configMap[envir]
export const CONFIG = config
export const API = configMap[envir].base
export const headerHeight = 55
export const headerInnerHeight = 30
export const PAGE_SIZE = 10
export const defaultLogo = 'https://goji-prod.oss-us-west-1.aliyuncs.com/goji_logo_500x500.png'
export const defaultColor = '#6FD781'
