import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import { isBrowser, isProdMode } from '~/environment'

if (isBrowser) {
    window.onNuxtReady(() => {
        Vue.use(VueAnalytics, {
            id: 'UA-145293592-1',
            router: window.$nuxt.$router,
            customResourceURL: '/scripts/analytics.js',
            autoTracking: {
                exception: true,
                screenview: true
            },
            debug: {
                sendHitTask: isProdMode
            }
        })
    })
}
