import i18nConfig from '~/config/i18n.config'

export const state = () => ({
    // 默认语言
    language: i18nConfig.default,
    // 公共广告轮播高度
    bannerHeight: 150
})
