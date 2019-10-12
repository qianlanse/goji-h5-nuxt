<template lang="pug">
    .h55.pc100
        .download-app(@click="handleDownApp")
            .download-content
                .flex-row-center.flex1
                    van-image.logo(src="/images/logo.png")
                    span.intro 开启我的健康方式
                .btn 下载GOJI
            .wechat-openbrowser(v-if="isWechatBrowser")
                van-image(src="/images/openapp-wechat.jpg")
                .close-box(@click.stop="isWechatBrowser = false")
                    i.icon.icon-article_close
</template>
<script>
    import CallUp from 'tool-callapp'
    import { browser } from '@/common/util'
    const iosUrl = 'https://itunes.apple.com/cn/app/goji/id1445290756?mt=8'
    const androidUrl = 'https://play.google.com/store/apps/details?id=com.an.goji_android_o'
    export default {
        name: 'Downapp',
        props: {
            id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        },
        data () {
            return {
                isWechatBrowser: false
            }
        },
        computed: {
            isIOS () {
                return browser.isIOS()
            },
            isAndroid () {
                return browser.isAndroid()
            }
        },
        methods: {
            // 去应用商店下载app
            handleDownApp () {
                if (!browser.isWx()) {
                    if (!this.isIOS && !this.isAndroid) {
                        if (browser.isMac()) {
                            this.handleAppleStore()
                        } else {
                            this.handleGooglePlay()
                        }
                        return
                    }
                    const callup = new CallUp({
                        PROTOCAL: this.isIOS ? 'comgojitakeout' : 'an',
                        HOME: 'article',
                        FAILBACK: {
                            ANDROID: androidUrl,
                            IOS: iosUrl
                        },
                        APK_INFO: {
                            PKG: 'com.an.goji_android_o',
                            CATEGORY: 'android.intent.category.DEFAULT',
                            ACTION: 'android.intent.action.VIEW'
                        },
                        LOAD_WAITING: 3000
                    })
                    callup.loadSchema({
                        targetURI: this.isIOS ? `comgojitakeout://${this.$props.url}/${this.$props.id}` : `an://${this.$props.url}/${this.$props.id}`,
                        fail: () => {
                            window.open(this.isIOS ? iosUrl : androidUrl)
                        }
                    })
                } else {
                    this.isWechatBrowser = true
                }
            },
            handleAppleStore () {
                window.open(iosUrl)
            },
            handleGooglePlay () {
                window.open(androidUrl)
            }
        }
    }
</script>
<style lang="sass">
    @import "~assets/sass/mixin.sass"
    .download-app
        @include relative($bottom: 0, $top: auto, $index: 53)
        background: white
        box-shadow: 5px 0 10px rgba(150, 150, 150, 0.1)
        padding: 10px 15px
        .download-content
            display: flex
            align-items: center
            border-radius: 10px
            .logo
                width: 65px
                height: 30px
                margin-right: 15px
            .intro
                color: #333
                font-size: 16px
            .btn
                font-weight: 500
                color: white
                height: 34px
                line-height: 34px
                padding: 0 10px
                background: #6FD781
                border-radius: 17px
                font-size: 14px
        .wechat-openbrowser
            position: fixed
            top: 0
            left: 0
            width: 100%
            height: 100%
            z-index: 99999
            background: white
            img
                display: block
                width: 100%
                margin: 0
            .close-box
                width: 50px
                height: 50px
                margin: 0 auto
                display: flex
                align-items: center
                justify-content: center
                .icon
                    font-size: 20px
                    color: #303030
</style>
