<template lang="pug">
    .article-list-container
        .article-content(v-if="result['content'] && result['content'].length === 0 && !result['empty']")
            skeleton(v-for="item in 4" :key="item")
        .list-container
            .list-side-box(v-for="(item, index) in result['renderList']" :key="index")
                nuxt-link.list-item(v-for="(jtem, jndex) in item" :key="jndex" tag="div" :to="`/detail/${jtem.id}`")
                    .body-thumb
                        van-image.fadein.lazyload.block(
                            :src="jtem.coverImage"
                            :width="jtem.width + 'px'"
                            :height="jtem.height + 'px'")
                            template(v-slot:loading)
                                div.lazyload.pc100.ph100
                            template(v-slot:error)
                                div.lazyload.pc100.ph100
                        .body-video(v-if="jtem.articleType === 'VIDEO'")
                            .icon-inner
                                van-image.icon-image(src="/images/play.png")
                    .body-content.ptb10.plr8
                        .title-box
                            .title.orient(v-html="jtem.title")
                        .footer
                            .w25.h25.mr5
                                van-image.pc100.ph100.circle.hidden.fadein(:src="jtem.authorAvatar")
                                    template(v-slot:loading)
                                        div.lazyload.pc100.ph100
                                    template(v-slot:error)
                                        div.lazyload.pc100.ph100
                            .fz12.lh150.color-text.orient.orient1.flex1 {{ jtem.authorName }}
                            .flex-row-center.ml10
                                .mr3.w20.h20.flex-center.relative
                                    .absolute-center.color-black(v-if="jtem.likeLoading")
                                        van-loading(type="spinner")
                                    i.icon.icon-like.color-text.fz14
                                .fz14.color-text {{ jtem.likeCount > 99 ? '99+' : jtem.likeCount }}
        empty(v-if="result['empty']")
</template>
<script>
    import empty from '../empty.vue'
    import { initData } from '../../common/util'
    import skeleton from './skeleton.vue'

    export default {
        components: {
            empty,
            skeleton
        },
        props: {
            result: {
                type: Object,
                require: true,
                default: () => initData()
            }
        }
    }
</script>
<style lang="sass">
    @import "~assets/sass/mixin.sass"
    .article-list-container
        .article-content
            display: flex
            flex-wrap: wrap
        .list-container
            display: flex
            flex-direction: row
            .list-side-box
                display: flex
                flex: 1
                flex-direction: column
                width: 50%
                &:nth-child(2n + 1)
                    padding-right: 5px
                &:nth-child(2n + 2)
                    padding-left: 5px
                .list-item
                    margin-bottom: 10px
            .body-thumb
                position: relative
                width: 100%
                .lazyload
                    border-top-left-radius: 5px
                    border-top-right-radius: 5px
                .thumb
                    width: 100%
                    height: 100%
                    border-top-left-radius: 5px
                    border-top-right-radius: 5px
                    background: #f5f6fa
                    &.mask
                        filter: blur(15px)
                        position: absolute
                        top: 0
                        left: 0
                        z-index: -1
                .body-video
                    position: absolute
                    top: 0
                    left: 0
                    padding: 10px
                    width: 100%
                    height: 100%
                    @include flex-center
                    .icon-inner
                        width: 40px
                        height: 40px
                        background: rgba(0, 0, 0, 0.5)
                        border-radius: 50%
                        overflow: hidden
                        @include flex-center
                        .icon-image
                            width: 40px
                            height: 40px
                    .icon
                        font-size: 80rpx
                        color: white
            .body-content
                background: #f9f9f9
                border-bottom-left-radius: 5px
                border-bottom-right-radius: 5px
                .title
                    font-size: 14px
                    line-height: 1.4
                    color: #454545
                .footer
                    display: flex
                    align-items: center
                    margin-top: 10px
                    overflow: hidden
</style>
