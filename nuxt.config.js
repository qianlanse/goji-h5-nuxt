const { resolve } = require('path')
const config = require('./common/config.js')
module.exports = {
    mode: 'universal',
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            {
                charset: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || ''
            }
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico'
            }
        ]
    },
    /*
     ** Customize the progress-bar color
     */
    loading: false,
    /*
     ** Global CSS
     */
    css: [
        'vant/lib/index.css',
        'video.js/dist/video-js.css',
        { src: '~assets/sass/index.sass', lang: 'sass' }
    ],
    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '@/plugins/axios',
        '@/plugins/vant',
        '@/plugins/component',
        {
            src: '~plugins/video.js', ssr: false
        }
    ],
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxt/typescript-build'
    ],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        [
            '@nuxtjs/axios',
            {
                baseURL: config.API
            }
        ]
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {},
    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
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
    }
}
