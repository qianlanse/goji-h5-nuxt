<template lang="pug">
    van-pull-refresh.activity-detail-container(v-model="refreshLoading" @refresh="handleRefresh")
        .bg-white.flex-center.full-page-fixed.z10005(v-if="initLoading")
            van-loading(type="spinner" size="24px") 加载中..
        m-header(ref="MHeader" :notpaddingbox="false")
            .flex-row-center.ph100(slot="headerchild")
        .swiper-container.hidden.relative(:style="{'max-height': swipeMaxHeight + 'px'}")
            van-swipe.transition(:show-indicators="false" :style="{height: swipeHeight + 'px'}")
                van-swipe-item(v-for="(item, index) in result.swipeImages" :key="index" @click="handlePreview(index)")
                    van-image.block(:src="item.thumb" :style="{width: item.width + 'px', height: item.height + 'px'}")
                        template(v-slot:loading)
                            div.lazyload.pc100.ph100
                        template(v-slot:error)
                            div.lazyload.pc100.ph100
        .head-container.mb10.bg-white
            .author-wrapper.pt20.plr20
                h1.no-bold.title.fz24.lh130 {{ result.title }}
                .user-info.flex-row-center.mt15
                    van-image.avatar.circle.mr10.w30.h30.bg-background.hidden(:src="result.ownerAvatar && result.ownerAvatar + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,jpg'")
                    span.fz14 发布者：
                    span.color-blue.flex1 {{ result.ownerName }}
                van-divider.mtb15
            .pb20.plr20
                .flex-row
                    .icon-box
                        .icon.icon-date.fz18
                    .fz14.ml15.lh120
                        p.mb3 {{ result.startTimeDay }} - {{ result.endTimeDay }}
                        p {{ result.startTimeHour }} - {{ result.endTimeHour }}
                van-divider.mtb15
                .flex-row-center.border-bottom-1px
                    .icon-box
                        .icon.icon-money.fz22
                    .fz14.ml5.lh120 CAD${{ result.fee || '0' }}
                van-divider.mtb15
                .flex-row
                    .icon-box
                        .icon.icon-location.fz22
                    .flex1.ml5
                        .fz14.mb5.lh120 {{ result.location || '-' }}
                        .fz14.color-text-light-x.mb2 {{ result.locationDetail }}
                        .fz14.color-text-light-x {{ result.locationExtend }}
                    .call-box.flex-center.plr25.ml20
                        .icon.icon-call.fz18
        .bg-white.mb10
            van-tabs(
                v-model="tabIndex"
                swipeable
                animated
                :color="defaultColor" :title-active-color="defaultColor" line-width="30")
                van-tab(v-for="(tab, index) in tabs" :key="index" :title="tab")
                    .pt20.plr20(v-show="tabIndex === 0")
                        .fz16.lh150.color-text(v-html="result.content1ForH5 || '-'")
                    .pt20.plr20(v-show="tabIndex === 1")
                        .fz16.lh150.color-text(v-html="result.content2ForH5 || '-'")
                    .pb20.pt10.plr20
                        van-image.thumb-activity.block.fadein.mt10(
                            v-for="(item, index) in result.images"
                            :style="{width: item.width + 'px', height: item.height + 'px'}"
                            :key="index"
                            :src="item.url")
                            template(v-slot:loading)
                                .lazyload.pc100.ph100
                            template(v-slot:error)
                                .lazyload.pc100.ph100
            .pl30.pr20.flex-row-center
                van-image.circle.hidden.block.w20.h20.user-icon(
                    v-for="(item, index) in result.avatars"
                    :key="index"
                    :src="item + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,jpg'"
                    fit="cover")
                .fz14.color-text-light-x.ml10 报名人数：{{ result.num || 0 }}/{{ result.maxNum || 0 }}
                .fz14.color-text-light-x(v-if="result.num === result.maxNum  && result.num > 0") （名额已满）
            van-divider.mtb15
            .flex-row-center.plr20.pb20
                .fz14 活动类型：
                .color-blue {{ result.categoryName || '-'}}
        m-downapp(ref="downapp" url="activity" :id="$route.params.id")
</template>
<script>
    import { defaultColor } from '@/common/config'
    export default {
        head() {
            return {
                title: this.result.title || '活动详情',
                meta: [
                    {
                        hid: 'description', name: 'description', content: this.result.title || 'GOJI be well be happy'
                    }
                ]
            }
        },
        data() {
            return {
                defaultColor,
                swipeCurrent: 0,
                swipeMaxHeight: 240,
                swipeHeight: 240,
                refreshLoading: false,
                initLoading: true,
                result: {},
                tabIndex: 0,
                tabs: ['参与须知', '退改规则']
            }
        },
        // 获取数据
        async asyncData({ $axios, params, redirect }) {
            if (!params.id) {
                return redirect('/activity')
            }
            try {
                const [result] = await Promise.all([
                    $axios(`activity/detail/${params.id}`)
                ])
                return {
                    result: result.data,
                    initLoading: false
                }
            } catch (error) {}
        },
        mounted() {
            // 处理轮播
            if (process.browser) {
                this.windowWidth = window.innerWidth
                this.windowHeight = window.innerHeight
                this.$refs.MHeader.$refs.globalHeaderBackground.style.opacity = 0
                this.changeSwipeLayout()
                window.addEventListener('resize', this.handleWindowResize)
                window.addEventListener('scroll', this.handleWindowScroll)
            }
        },
        destroyed() {
            if (process.browser) {
                window.removeEventListener('resize', this.handleWindowResize)
                window.removeEventListener('scroll', this.handleWindowScroll)
            }
        },
        methods: {
            // 屏幕大小改变
            handleWindowResize() {
                this.windowWidth = window.innerWidth
                this.changeSwipeLayout()
            },
            // 轮播布局
            changeSwipeLayout() {
                if (this.result.id) {
                    let coverImage = this.result.coverImage
                    coverImage = Array.isArray(coverImage) ? coverImage : [coverImage]
                    const imageWidth = this.windowWidth - 40
                    this.result = {
                        ...this.result,
                        swipeImages: coverImage.map((item) => {
                            return {
                                ...item,
                                width: this.windowWidth,
                                height: this.windowWidth * item.height / item.width,
                                thumb: item.url + '?x-oss-process=image/resize,p_80/format,jpg'
                            }
                        }),
                        images: this.result.images.map((item) => {
                            return {
                                ...item,
                                width: imageWidth,
                                height: imageWidth * item.height / item.width,
                                thumb: item.url + '?x-oss-process=image/resize,p_80/format,jpg'
                            }
                        })
                    }
                    this.swipeHeight = this.result.images[this.swipeCurrent].height
                    this.authorWrapper = document.querySelector('.author-wrapper')
                    this.swipeMaxHeight = this.windowHeight - this.authorWrapper.offsetHeight - 53
                }
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
    @import "~assets/sass/color.sass"
    body
        background-color: $color-background
    .user-icon
        margin-left: -10px
        border: 1px solid white
    .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after
        border-width: 0 0 1px 0
</style>
