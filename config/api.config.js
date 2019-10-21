import { NODE_ENV } from '../environment'

const apiMap = {
    development: {
        baseUrl: 'https://gojidev.eastseven.cn/api/app/'
    },
    production: {
        baseUrl: 'https://prod.gojiapp.cn/api/app/'
    }
}

export default apiMap[NODE_ENV]
