<template lang="pug">
    div(:style="{height: navHeight + 'px'}")
        .bg-white(ref="nav" :class="{fixedNav: fixed}")
            van-tabs(v-model="currentIndex" :ellipsis="false" :border="false" :color="defaultColor" @change="handleChangeNav")
                van-tab(v-for="(nav, index) in navs" :key="index" :title="nav.name")
        .pc100(:style="{height: navHeight + 'px'}" v-show="fixed")
</template>
<script>
    import { defaultColor } from '@/common/config'
    export default {
        props: {
            navs: {
                type: Array,
                default() {
                    return []
                }
            },
            fixed: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                defaultColor,
                currentIndex: 0,
                navHeight: 0
            }
        },
        mounted() {
            if (process.browser) {
                this.navHeight = this.$refs.nav.clientHeight
            }
        },
        methods: {
            handleChangeNav(index) {
                this.currentIndex = index
                this.$emit('change', index)
            }
        }
    }
</script>
<style lang="sass">
    @import "~assets/sass/color.sass"
    .fixedNav
        position: fixed
        left: 0
        top: 0
        z-index: 9999
        width: 100%
        box-shadow: 0 4px 5px rgba(0, 0, 0, 0.05)
        border-bottom-left-radius: 10px
        border-bottom-right-radius: 10px
    .van-tab
        padding: 0 10px
        color: black
        line-height: 40px
    .van-tab--active
        font-weight: bold
    .van-tabs--line .van-tabs__wrap
        height: 40px
    .van-tabs__nav--line
        padding-bottom: 0px
    .van-tabs__line
        bottom: 0px
</style>
