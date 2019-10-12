<template lang="pug">
    .global-header-container(v-if="!isWechatBrowser")
        .global-header(:class="{'border-bottom-1px': borderpixel}")
            .global-left-box.flex-row-center.hidden.pl10(
                ref="globalHeaderLeft"
                :class="[leftShow, notTransparent]"
                :style="{height: btnWH + 'px', 'border-radius':  btnWH / 2 + 'px', top: (height - btnWH) / 2 + 'px'}")
                .global-left-inner.flex-center.pc50.ph100(:style="{width: btnWH + 'px'}" v-if="back && isBack" @click="handleBack")
                    .w30.h30.circle.flex-center(:class="transparent" :style="{'background-color': leftbgcolor + ' !important'}")
                        i.icon.icon-back.bold
                .global-left-inner.flex-center.pc50.ph100(:style="{width: btnWH + 'px'}" v-if="home && !isBack" @click="handleHome")
                    .w30.h30.circle.flex-center(:class="transparent" :style="{'background-color': leftbgcolor + ' !important'}")
                        .icon.icon-shouye.bold
                slot(name="leftchild")
            .global-header-content.hidden(ref="globalHeaderContent" :style="{height: height + 'px', padding: '0 ' + paddingTitle + 'px'}")
                .global-center.flex-center.ph100(v-if="title !== ''")
                    h2.no-bold.orient.orient1.lh140.fz16 {{ title }}
                slot(name="headerchild")
            .global-right-box.fixed.r0.z10001.flex-row-center.hidden.pr10(
                ref="globalHeaderRight"
                :style="{height: btnWH + 'px', 'border-radius':  btnWH / 2 + 'px', top: (height - btnWH) / 2 + 'px'}")
                slot(name="rightchild")
            .global-header-background.absolute.t0.l0.pc100.transition(ref="globalHeaderBackground" :style="{'background-color': mainbgcolor, height: height + 'px', 'z-index': -1}")
        .global-header-padding(v-if="notpaddingbox" :style="{height: height + 'px'}")
</template>
<script>
    import { browser } from '@/common/util'
    export default {
        props: {
            title: {
                type: String,
                default: ''
            },
            height: {
                type: Number,
                default: 55
            },
            btnWH: {
                type: Number,
                default: 30
            },
            mainbgcolor: {
                type: String,
                default: 'white'
            },
            leftbgcolor: {
                type: String,
                default: ''
            },
            back: {
                type: Boolean,
                default: true
            },
            home: {
                type: Boolean,
                default: true
            },
            double: {
                type: Boolean,
                default: false
            },
            borderpixel: {
                type: Boolean,
                default: false
            },
            notpaddingbox: {
                type: Boolean,
                default: true
            },
            focus: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isBack: false,
                isWechatBrowser: false,
                paddingTitle: 0
            }
        },
        computed: {
            isTransparent () {
                return !this.double || this.isBack
            },
            notTransparent() {
                return this.isTransparent ? '' : 'bg-transparent'
            },
            transparent() {
                return !this.isTransparent ? '' : 'bg-transparent'
            },
            leftShow() {
                return this.focus ? 'hidden' : 'show'
            }
        },
        watch: {
            '$router'() {
                console.log('123')
            }
        },
        mounted() {
            if (process.browser) {
                this.isWechatBrowser = browser.isWx()
                this.isBack = window.history.length > 1
                this.paddingTitle = document.querySelector('.global-left-box').clientWidth + 5
            }
        },
        methods: {
            // 返回
            handleBack() {
                this.$router.back()
            },
            // 返回
            handleHome() {
                this.$router.replace({
                    path: '/'
                })
            }
        }
    }
</script>
<style lang="sass">
    .global-header-container
        .global-left-box
            position: fixed
            z-index: 10001
            &.hidden
                opacity: 0
                visibility: hidden
                backface-visibility: hidden
                transform: translateX(-100%)
            &.show
                opacity: 1
                visibility: visible
                backface-visibility: visible
                transform: translateX(0)
        .bg-transparent
            background: rgba(255, 255, 255, 0.35)
        .global-header
            position: fixed
            top: 0
            left: 0
            width: 100%
            z-index: 10001
            .global-header-content
                position: relative
                width: 100%
                .global-center
                    position: absolute
                    top: 0
                    left: 0
                    width: 100%
                    z-index: 1
        .global-header-background
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.035)
</style>
