const { resolve } = require('path')
const axios = require('axios')
const config = require('./common/config.js')
module.exports = {
    mode: 'universal',
    head: {
        title: process.env.npm_package_name || 'GOJI',
        meta: [
            {
                charset: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,target-densitydpi=device-dpi'
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            },
            { name: 'renderer', content: 'webkit' },
            { name: 'applicable-device', content: 'pc' },
            { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
            { 'http-equiv': 'Cache-Control', content: 'no-transform' },
            { 'http-equiv': 'Cache-Control', content: 'no-siteapp' }
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico'
            }
        ]
    },
    loading: false,
    css: [
        'vant/lib/index.css',
        'video.js/dist/video-js.css',
        { src: '~assets/sass/index.sass', lang: 'sass' }
    ],
    plugins: [
        '@/plugins/axios',
        '@/plugins/vant',
        '@/plugins/component',
        {
            src: '~plugins/video.js', ssr: false
        }
    ],
    buildModules: [
        '@nuxt/typescript-build'
    ],
    modules: [
        [
            '@nuxtjs/axios',
            {
                baseURL: config.API
            }
        ]
    ],
    axios: {
    },
    build: {
        // 分析并可视化构建后的打包文件，你可以基于分析结果来决定如何优化它
        analyze: true,
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
    generate: {
        subFolders: false,
        async routes () {
            try {
                const [articles, activites] = await Promise.all([
                    axios.get(config.API + 'index?page=1&size=100&tag='),
                    axios.get(config.API + 'activity/page?page=1&size=100&category=')
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
            } catch (error) {
                return []
            }
        }
    },
    server: {
        host: '0.0.0.0'
    }
}
