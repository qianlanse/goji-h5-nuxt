<template lang="pug">
    van-pull-refresh.bg-background(v-model="refreshLoading" @refresh="handleRefresh")
        .bg-white.flex-center.full-page-fixed.z10005(v-if="initLoading")
            van-loading(type="spinner" size="24px") 加载中..
        m-header(ref="MHeader" :notpaddingbox="false")
            .ph100.flex-column-center(ref="headerChild" v-show="initTitleShow" slot="headerchild")
                .orient.orient1 {{ result.title }}
        .swiper-container.hidden.relative(:style="{'max-height': swipeMaxHeight + 'px'}")
            van-swipe.transition(:show-indicators="false" :style="{height: swipeHeight + 'px'}")
                van-swipe-item(v-for="(item, index) in result.swipeImages" :key="index" @click="handlePreview(index, 'swipe')")
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
                        template(v-slot:loading)
                            div.lazyload.pc100.ph100
                        template(v-slot:error)
                            div.lazyload.pc100.ph100
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
                        .fz14.color-text-light-x.mb2 {{ result.locationDetail || '-' }}
                        .fz14.color-text-light-x {{ result.locationExtend || '-' }}
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
                            :src="item.url"
                            @click="handlePreview(index, 'product')")
                            template(v-slot:loading)
                                .lazyload.pc100.ph100
                            template(v-slot:error)
                                .lazyload.pc100.ph100
            .pl20.pr20.flex-row-center
                .flex-row-center.mr10(v-if="result.avatars && result.avatars.length")
                    van-image.circle.hidden.block.w20.h20.user-icon(
                        v-for="(item, index) in result.avatars"
                        :key="index"
                        :src="item + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,jpg'"
                        fit="cover")
                .fz14.color-text-light-x 报名人数：{{ result.num || 0 }}/{{ result.maxNum || 0 }}
                .fz14.color-text-light-x(v-if="result.num === result.maxNum  && result.num > 0") （名额已满）
                i.icon.icon-right.ml10.relative.t1.fz14.color-text-light-x(v-if="result.num")
            van-divider.mtb15
            .flex-row-center.plr20.pb20
                .fz14 活动类型：
                .color-blue {{ result.categoryName || '-'}}
        .other-activity.p20.bg-white
            .t-center.mb30
                .fz18.other-activity-title.inline-block.relative 该活动附近其他活动
            div(v-if="result.nearby && result.nearby.length")
                nuxt-link.flex-row.mt15.hidden(
                    v-for="(item, index) in result.nearby"
                    :key="index"
                    tag="div"
                    :to="`/activity/${item.id}`")
                    van-image.w115.h115.fadein(:src="item.coverImage" fit="cover")
                        template(v-slot:loading)
                            div.lazyload.pc100.ph100
                        template(v-slot:error)
                            div.lazyload.pc100.ph100
                    .flex-column.flex1.plr10.bg-f9f9f9.ptb5
                        .flex1
                            .color-text-light {{ item.startTime2 }}
                            .color-text.lh140.mt5.orient {{ item.title }}
                        .color-text-light-x.fz12.orient {{ item.location }}
            .color-text-light(v-else) 暂无其它活动
        .p20
            .fz14.color-text-light.mb10 GOJI提示
            .fz13.color-text-light-x.lh150 本活动信息由发起人自行发布，仅代表其个人意志，与GOJI平台无关，且活动的后续事项由发起人独立安排及负责，GOJI仅提供信息发布与展示平台，不能保证活动的真实性、有效性、安全性，请在参加活动前与发起人具体核实相关情况，注意人身与财产安全。
        m-downapp(ref="downapp" url="activity" :id="$route.params.id")
</template>
<script>
    import { ImagePreview } from 'vant'
    import { defaultColor } from '~/common/config'
    import { meta } from '~/config/app.config'
    export default {
        head() {
            const { result } = this
            return {
                title: result.title || this.$i18n.activityTitleDetail,
                meta: [
                    {
                        hid: 'keywords', name: 'keywords', content: meta.keywords
                    },
                    {
                        hid: 'description', name: 'description', content: result.title || meta.description
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
                initTitleShow: false,
                argument: false,
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
                this.$refs.headerChild.style.opacity = 0
                this.initTitleShow = true
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
            // 屏幕滚动
            handleWindowScroll() {
                const scrollY = window.scrollY
                const height = (this.swipeHeight >= this.swipeMaxHeight ? this.swipeMaxHeight : this.swipeHeight) - 55
                if (scrollY >= height) {
                    const startY = scrollY - height
                    const offsetHeight = 55
                    const diff = (startY / offsetHeight > 1) ? 1 : startY / offsetHeight
                    this.$refs.MHeader.$refs.globalHeaderBackground.style.opacity = diff
                    this.$refs.headerChild.style.opacity = diff
                } else {
                    this.$refs.MHeader.$refs.globalHeaderBackground.style.opacity = 0
                    this.$refs.headerChild.style.opacity = 0
                }
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
                    this.swipeHeight = this.result.swipeImages[this.swipeCurrent].height
                    this.authorWrapper = document.querySelector('.author-wrapper')
                    this.swipeMaxHeight = this.windowHeight - this.authorWrapper.offsetHeight - 53
                }
            },
            // 预览轮播图
            handlePreview(index, type) {
                let images = []
                if (type === 'swipe') {
                    images = this.result.swipeImages.map(item => item.url)
                } else {
                    images = this.result.images.map(item => item.url)
                }
                ImagePreview({
                    images,
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
    @import "~assets/sass/color.sass"
    .user-icon
        margin-left: -10px
        border: 1px solid white
        &:first-child
            margin-left: 0px
    .other-activity-title
        &:after
            content: ''
            display: block
            height: 10px
            width: 100%
            position: absolute
            bottom: 0
            left: 0
            z-index: 0
            background: rgba(219, 245, 223, 0.5)
    .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after
        border-width: 0 0 1px 0
</style>
