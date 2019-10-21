let locale = 'en-US'
if (process.browser) {
    locale = navigator.language || navigator.browserLanguage
    console.log(locale)
}
export const state = () => {
    return {
        locales: ['en-US', 'zh-CN'],
        locale
    }
}
export const getters = {}
export const mutations = {
    // 设置lang
    SET_LANG (state, locale) {
        if (state.locales.includes(locale)) {
            state.locale = locale
        }
    }
}
export const actions = {
}
