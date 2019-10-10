// 初始化列表数据格式
import { PAGE_SIZE } from './config'
export const initData = (columns = 2, size = PAGE_SIZE) => {
    const renderList = []
    for (let i = 0; i < columns; i++) {
        renderList[i] = []
    }
    return {
        totalPages: 0,
        loading: false,
        loaded: false,
        empty: false,
        query: {
            page: 1,
            size
        },
        renderList,
        content: []
    }
}

// 改变列表数据
export const changeDataSource = (halfWidth, data, refresh = false) => {
    return data.filter(item => item.coverImageWidth && item.coverImageHeight).map((item) => {
        const coverImageWidth = item.coverImageWidth
        const coverImageHeight = item.coverImageHeight
        let coverImage = item.coverImage
        if (coverImage.includes('http:')) {
            coverImage = coverImage.replace('http:', 'https:')
        }
        if (refresh) {
            return {
                ...item,
                width: halfWidth,
                height: halfWidth * coverImageHeight / coverImageWidth
            }
        } else {
            return {
                ...item,
                width: halfWidth,
                height: halfWidth * coverImageHeight / coverImageWidth,
                loading: false,
                loaded: false,
                coverImage: coverImage + `?x-oss-process=image/resize,p_30/format,jpg`,
                authorAvatar: item.authorAvatar + `?x-oss-process=image/resize,m_fill,h_50,w_50/format,jpg`
            }
        }
    })
}
