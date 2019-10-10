<template lang="pug">
    van-pull-refresh.detail-container(v-model="refreshLoading" @refresh="handleRefresh")
        //-.swiper-container(:style="{'max-height': swipeMaxHeight + 'px'}")
        van-swipe.transition(@change="handleChangeSwiper" :show-indicators="false" :style="{height: swipeHeight + 'px'}")
            van-swipe-item(v-for="(item, index) in result.images" :key="index" @click="handlePreview(index)")
                van-image.block(:src="item.thumb" :style="{width: item.width + 'px', height: item.height + 'px'}")
                    template(v-slot:loading)
                        div.lazyload.pc100.ph100
                    template(v-slot:error)
                        div.lazyload.pc100.ph100
            .swipe-indicator(slot="indicator")
                .content
                    .dot(v-for="(item, index) in result.images" :key="index" :class="{active: index === swipeCurrent}")
        .author-wrapper.flex-row-center.bg-fafafa.ptb10.plr20
            .author-intro.flex-row-center.flex1.mr10
                van-image.w50.h50.block.circle(:src="result.authorAvatar && result.authorAvatar + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,jpg'")
                    template(v-slot:loading)
                        div.lazyload.pc100.ph100
                    template(v-slot:error)
                        div.lazyload.pc100.ph100
                .flex-column.flex1.mlr10.ptb5
                    h2.orient.orient1.fz18.lh140 {{ result.author }}
                    p.orient.orient1.fz14.color-text-light-x.lh130 {{ result.authorIntro }}
            van-button.h35(type="primary" size="small" color="#6FD781" round) 关注
        .body-wrapper.pt30.plr14
            h1.fz24.lh130.mb5.no-bold {{ result.title }}
            p.fz14.color-text-light-x.mb20 {{ result.publishDate }}
            .fz16.lh150.mb20.color-text(v-html="result.content")
            .pageviews.fz16.color-text-light-x 阅读: {{ result.lookCount }}
            van-divider
        .comment-wrapper.pb70.plr15
            .header.flex-row-center.mb25
                span.fz16.color-text 评论
                span.fz12.ml3.color-text-light (12)
</template>
<script>
    import { ImagePreview } from 'vant'
    export default {
        head() {
            return {
                title: this.result.title || '文章详情',
                meta: [
                    {
                        hid: 'description', name: 'description', content: this.result.title || 'GOJI be well be happy'
                    }
                ]
            }
        },
        data() {
            return {
                swipeCurrent: 0,
                swipeMaxHeight: 0,
                swipeHeight: 200,
                refreshLoading: false,
                result: {}
            }
        },
        // 获取数据
        async asyncData({ $axios, params }) {
            try {
                const res = await $axios(`article/detail/${params.id}`)
                return {
                    result: res.data
                }
            } catch (error) {}
        },
        mounted() {
            if (process.browser) {
                const windowWidth = document.body.clientWidth
                const initSwipeHeight = windowWidth / 2
                this.maxHeight = initSwipeHeight
                if (this.result.id) {
                    this.result = {
                        ...this.result,
                        images: this.result.images.map((item) => {
                            return {
                                ...item,
                                width: windowWidth,
                                height: windowWidth * item.height / item.width,
                                thumb: item.url + '?x-oss-process=image/resize,p_80/format,jpg'
                            }
                        })
                    }
                    this.swipeHeight = this.result.images[this.swipeCurrent].height
                }
            }
        },
        methods: {
            // 改变轮播
            handleChangeSwiper(index) {
                this.swipeCurrent = index
                this.swipeHeight = this.result.images[this.swipeCurrent].height
            },
            // 预览轮播图
            handlePreview(index) {
                ImagePreview({
                    images: this.result.images.map(item => item.url),
                    startPosition: index
                })
            },
            // 下拉刷新
            handleRefresh() {
                setTimeout(() => {
                    this.refreshLoading = false
                }, 1000)
            }
        }
    }
</script>
<style lang="sass">
    .swipe-indicator
        position: absolute
        left: 0
        bottom: 0
        right: 0
        height: 15px
        border-top-left-radius: 25px
        border-top-right-radius: 25px
        background: #fafafa
        .content
            display: flex
            align-items: center
            justify-content: center
            margin-top: 5px
            .dot
                width: 5px
                height: 5px
                border-radius: 50%
                background: #d8d8d8
                margin: 0 3px
                transition: width 0.3s ease
                &.active
                    width: 14px
                    border-radius: 14px
                    background: #374653
</style>
