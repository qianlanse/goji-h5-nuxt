import { resolve } from 'path'
import axios from 'axios'
import { meta } from './config/app.config'
import apiConfig from './config/api.config'
import i18nConfig from './config/i18n.config'

const htmlLang = i18nConfig.default

export default {
    mode: 'universal',
    head: {
        title: meta.title,
        titleTemplate: `%s`,
        htmlAttrs: {
            xmlns: 'http://www.w3.org/1999/xhtml',
            lang: htmlLang
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'MobileOptimized', content: '320' },
            { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' },
            { name: 'renderer', content: 'webkit' },
            { name: 'applicable-device', content: 'pc' },
            { hid: 'keywords', name: 'keywords', content: meta.keywords },
            { hid: 'description', name: 'description', content: meta.description },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
            { 'http-equiv': 'Cache-Control', content: 'no-transform' },
            { 'http-equiv': 'Cache-Control', content: 'no-siteapp' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'dns-prefetch', href: '//www.google-analytics.com' }
        ],
        noscript: [
            { innerHTML: 'This website requires JavaScript' }
        ]
    },
    loading: {
        color: '#369',
        height: '2px'
    },
    css: [
        'vant/lib/index.css',
        'video.js/dist/video-js.css',
        { src: '~assets/sass/index.sass', lang: 'sass' }
    ],
    plugins: [
        '~plugins/axios',
        '~plugins/vant',
        '~plugins/vue-extend',
        { src: '~plugins/analytics', mode: 'client' },
        { src: '~plugins/video', mode: 'client' }
    ],
    buildModules: [
        '@nuxt/typescript-build'
    ],
    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/style-resources',
        '@nuxtjs/component-cache',
        ['@nuxtjs/axios', { baseURL: apiConfig.baseUrl }]
    ],
    styleResources: {
    },
    axios: {
    },
    build: {
        vendor: ['axios', 'vue-i18n', 'vue-video-player'],
        filenames: {
            chunk: ({ isDev }) => isDev ? '[name].js' : '[id].[chunkhash].js'
        },
        extend(config, { isDev, isClient }) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
                config.module.rules.push({
                    test: /\.(png|jpe?g|gif|svg)$/,
                    loader: 'url-loader',
                    exclude: [resolve(__dirname, 'static/svgs')],
                    options: {
                        limit: 1000,
                        name: 'img/[name].[hash:8].[ext]'
                    }
                })
            }
        }
    },
    server: {
        host: '0.0.0.0'
    },
    generate: {
        concurrency: 100,
        interval: 100,
        subFolders: false,
        async routes () {
            const [articles, activites] = await Promise.all([
                axios.get(apiConfig.baseUrl + 'index?page=1&size=1000&tag='),
                axios.get(apiConfig.baseUrl + 'activity/page?page=1&size=1000&category=')
            ])
            const articleRoutes = articles.data.data.data.map((article) => {
                return {
                    route: '/detail/' + article.id
                }
            })
            const activityRoutes = activites.data.data.data.map((activity) => {
                return {
                    route: '/activity/' + activity.id
                }
            })
            return [...articleRoutes, ...activityRoutes]
        }
    }
}
