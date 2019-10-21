import Vue from 'vue'
import i18nConfig from '~/config/i18n.config'
import i18nTransfer from '~/utils/i18n'
import MHeader from '~/components/header.vue'
import DownApp from '~/components/downapp.vue'
import LoadMore from '~/components/load-more.vue'

Vue.component('m-header', MHeader)
Vue.component('m-downapp', DownApp)
Vue.component('m-loadmore', LoadMore)

const i18nData = i18nTransfer(i18nConfig)

Vue.mixin({
    computed: {
        $i18n () {
            return i18nData[this.$store.state.global.language]
        }
    }
})
