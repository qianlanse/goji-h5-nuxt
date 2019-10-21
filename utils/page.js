// 初始化列表数据格式
import { page as pageConfig } from '../config/app.config'

export const initData = (columns = 2, size = pageConfig.PAGE_SIZE) => {
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
export const changeDataSource = (width, data, change = false) => {
    return data.filter(item => item.coverImageWidth && item.coverImageHeight).map((item) => {
        const coverImageWidth = item.coverImageWidth
        const coverImageHeight = item.coverImageHeight
        if (change) {
            return {
                ...item,
                width,
                height: width * coverImageHeight / coverImageWidth
            }
        } else {
            let coverImage = item.coverImage
            if (coverImage.includes('http:')) {
                coverImage = coverImage.replace('http:', 'https:')
            }
            return {
                ...item,
                width,
                height: width * coverImageHeight / coverImageWidth,
                loading: false,
                loaded: false,
                coverImage: coverImage + `?x-oss-process=image/resize,p_30/format,jpg`,
                authorAvatar: item.authorAvatar + `?x-oss-process=image/resize,m_fill,h_50,w_50/format,jpg`
            }
        }
    })
}

// 修改评论格式
export function changeComments (item) {
    const at = item.at
    const str = item.content
    let arr = []
    const patten = /\u2004@([^\\@\u2004$]+)/g
    while (patten.exec(str)) {
        arr.push(RegExp.$1)
    }
    arr = arr.filter((item, index, self) => self.indexOf(item) === index).filter(item => item !== ' ').map(item => `@${item}`)
    let content = item.content
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i]
        content = content.replace(element, `<span class="color-blue" href="/user/${at[i]}">${element}</span>`)
    }
    if (item.top3 && item.top3.length) {
        item.top3 = item.top3.map((top) => {
            return {
                ...top,
                ...changeComments(top),
                show: true
            }
        })
    }
    return {
        ...item,
        content,
        likeLoading: false,
        collapse: false,
        avatar: item.avatar ? item.avatar + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,jpg' : `${pageConfig.defaultLogo}?`
    }
}
