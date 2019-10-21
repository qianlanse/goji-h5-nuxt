<template lang="pug">
    van-pull-refresh.detail-container(v-model="refreshLoading" @refresh="handleRefresh")
        .bg-white.flex-center.full-page-fixed.z10005(v-if="initLoading")
            van-loading(type="spinner" size="24px") 加载中..
        m-header(ref="MHeader" :notpaddingbox="false")
            .flex-row-center.ph100(ref="authorHeader" slot="headerchild")
                van-image.w30.h30.block.circle.hidden(:src="result.authorAvatar && result.authorAvatar + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,jpg'")
                    template(v-slot:loading)
                        div.lazyload.pc100.ph100
                    template(v-slot:error)
                        div.lazyload.pc100.ph100
                .flex-column.flex1.mlr10.ptb5
                    h2.no-bold.orient.orient1.fz14.lh140 {{ result.author }}
                    p.orient.orient1.fz12.color-text-light-x.lh130 {{ result.authorIntro }}
            //-.flex-center.ph100(slot="rightchild")
                .w30.h30.circle.flex-center
                    i.icon.icon-moreandroid
        .swiper-container.hidden.relative(
            v-if="result.articleType === 'IMAGE' || result.articleType === 'IMAGE_TEXT'"
            :style="{'max-height': swipeMaxHeight + 'px'}")
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
        .swiper-container.hidden.relative(
            v-if="result.articleType === 'VIDEO'"
            :style="{'max-height': swipeMaxHeight + 'px'}")
            .lazyload.h200(v-if="!initVideoReady")
            .video-play-box(
                ref="videoPlayer"
                :playsinline='playsinline'
                @ready="playerReadied"
                v-video-player:myVideoPlayer="playerOptions")
        .author-wrapper.flex-row-center.bg-fafafa.ptb10.plr20
            .flex-row-center.flex1.mr10
                van-image.w50.h50.block.circle.hidden(:src="result.authorAvatar && result.authorAvatar + '?x-oss-process=image/resize,m_fill,h_100,w_100/format,jpg'")
                    template(v-slot:loading)
                        div.lazyload.pc100.ph100
                    template(v-slot:error)
                        div.lazyload.pc100.ph100
                .flex-column.flex1.mlr10.ptb5
                    h2.orient.orient1.fz18.lh140 {{ result.author }}
                    p.orient.orient1.fz14.color-text-light-x.lh130 {{ result.authorIntro }}
            van-button(type="primary" size="small" color="#6FD781" round @click="handleDownApp") 关注
        .body-wrapper.pt30.plr14
            h1.fz24.lh130.mb5.no-bold {{ result.title }}
            p.fz14.color-text-light-x.mb20 {{ result.publishDate }}
            .article-body-content.fz16.lh150.mb20.color-text(v-html="result.content")
            .pageviews.fz14.color-text-light-x 阅读: {{ result.lookCount }}
            van-divider
        .comment-wrapper.pb10.plr15
            .comment-header.flex-row-center.mb25
                .fz16.color-text 评论
                .fz12.ml3.color-text-light-x(v-if="!commentDataSource['loading'] && commentDataSource['content'].length") ({{ totalComments }})
            .comment-body
                template(v-if="!commentDataSource['loading'] && commentDataSource['content'].length")
                    comment-content(:comments="commentDataSource" :ismore="false")
                    .fz16.ptb15.ml50.color-main.t-center 展开全部评论
                .flex-column-center.mb20(v-if="commentDataSource.empty")
                    i.icon.icon-comment.mb2.fz32.color-text-light-xx
                    span.fz14.color-text-light-xx 评论为空T﹏T
        .p10.fz14.color-text-light-x.bg-background.mb15 相关推荐
        .plr10
            van-list(
                v-model="articleDataSource.loading"
                @load="fetchRelatedSuggestion"
                :offset="100"
                :finished="articleDataSource.loaded"
                :finished-text="$i18n.noMoreData"
                :immediate-check="true")
                m-loadmore(slot="loading")
                m-article(:result="articleDataSource")
        m-downapp(ref="downapp" url="article" :id="$route.params.id")
</template>
<script>
    import qs from 'qs'
    import { ImagePreview } from 'vant'
    import { initData, changeDataSource, changeComments } from '@/common/util'
    import CommentContent from '@/components/comment/child.vue'
    import MArticle from '~/components/article/article.vue'
    import skeleton from '~/components/article/skeleton.vue'
    import { meta } from '~/config/app.config'
    export default {
        scrollToTop: true,
        components: {
            CommentContent,
            MArticle,
            skeleton
        },
        head() {
            const { result } = this
            return {
                title: result.title || this.$i18n.articleTitleDetail,
                meta: [
                    {
                        hid: 'keywords', name: 'keywords', content: result.title || meta.keywords
                    },
                    {
                        hid: 'description', name: 'description', content: result.title || meta.description
                    }
                ]
            }
        },
        data() {
            return {
                swipeCurrent: 0,
                swipeMaxHeight: 240,
                swipeHeight: 240,
                refreshLoading: false,
                initLoading: true,
                initVideoReady: false,
                result: {},
                totalComments: 0,
                comments: [],
                commentDataSource: {
                    ...initData(),
                    loading: true
                },
                articleDataSource: {
                    ...initData()
                },
                playsinline: true,
                playerOptions: {
                    autoplay: false,
                    muted: false,
                    fluid: true,
                    language: 'zh-CN'
                }
            }
        },
        // 获取数据
        async asyncData({ $axios, params, redirect }) {
            if (!params.id) {
                return redirect('/')
            }
            try {
                const [result, comments] = await Promise.all([
                    $axios(`article/detail/${params.id}`),
                    $axios(`v2/article/comment/top3/${params.id}`)
                ])
                return {
                    result: result.data,
                    comments: comments.data.map((item) => {
                        return {
                            ...item,
                            ...changeComments(item),
                            page: 2,
                            size: item.top3.length
                        }
                    }),
                    initLoading: false
                }
            } catch (error) {}
        },
        created() {
            // 获取相关文章
            this.fetchRelatedSuggestion()
        },
        mounted() {
            this.totalComments = this.result.comments || 0
            // 处理评论
            const parent = this.commentDataSource
            parent.loaded = true
            parent.loading = false
            parent.content = this.comments.map((item) => {
                return {
                    ...item,
                    page: 2,
                    size: item.top3.length
                }
            })
            parent.empty = parent.content.length === 0
            // 处理轮播
            if (process.browser) {
                this.windowWidth = window.innerWidth
                this.windowHeight = window.innerHeight
                this.halfWidth = this.windowWidth / 2 - 15
                this.$refs.MHeader.$refs.globalHeaderBackground.style.opacity = 0
                this.$refs.authorHeader.style.opacity = 0
                this.$refs.authorHeader.style.transform = `translateY(100%)`
                this.$refs.authorHeader.style.mozTransform = `translateY(100%)`
                this.$refs.authorHeader.style.webkitTransform = `translateY(100%)`
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
                this.windowWidth = document.body.clientWidth
                this.halfWidth = this.windowWidth / 2 - 15
                this.changeSwipeLayout()
                this.changeDataSource()
            },
            // 屏幕滚动
            handleWindowScroll() {
                const articleType = this.result.articleType
                if (articleType) {
                    const scrollY = window.scrollY
                    const swipeHeight = articleType === 'VIDEO' ? this.videoHeight : this.swipeHeight
                    const height = swipeHeight >= this.swipeMaxHeight ? this.swipeMaxHeight : swipeHeight
                    if (scrollY >= height) {
                        const startY = scrollY - height
                        const offsetHeight = this.authorWrapper.offsetHeight
                        const diff = (startY / offsetHeight > 1) ? 1 : startY / offsetHeight
                        const translateY = 100 - Math.ceil(Math.round(diff * 100))
                        this.$refs.MHeader.$refs.globalHeaderBackground.style.opacity = diff
                        this.$refs.authorHeader.style.opacity = diff
                        this.$refs.authorHeader.style.transform = `translateY(${translateY}%)`
                        this.$refs.authorHeader.style.mozTransform = `translateY(${translateY}%)`
                        this.$refs.authorHeader.style.webkitTransform = `translateY(${translateY}%)`
                    } else {
                        this.$refs.MHeader.$refs.globalHeaderBackground.style.opacity = 0
                        this.$refs.authorHeader.style.opacity = 0
                        this.$refs.authorHeader.style.transform = `translateY(100%)`
                        this.$refs.authorHeader.style.mozTransform = `translateY(100%)`
                        this.$refs.authorHeader.style.webkitTransform = `translateY(100%)`
                    }
                }
            },
            // 轮播布局
            changeSwipeLayout() {
                if (this.result.id) {
                    this.result = {
                        ...this.result,
                        images: this.result.images.map((item) => {
                            return {
                                ...item,
                                width: this.windowWidth,
                                height: this.windowWidth * item.height / item.width,
                                thumb: item.url + '?x-oss-process=image/resize,p_80/format,jpg'
                            }
                        })
                    }
                    this.authorWrapper = document.querySelector('.author-wrapper')
                    this.swipeMaxHeight = this.windowHeight - this.authorWrapper.offsetHeight - 55
                    if (this.result.articleType === 'VIDEO') {
                        this.playerOptions = {
                            ...this.playerOptions,
                            height: this.swipeMaxHeight,
                            width: this.windowWidth,
                            poster: this.result.coverImage,
                            sources: [{
                                type: 'video/mp4',
                                src: this.result.video.playUrl
                            }]
                        }
                        this.videoHeight = this.swipeMaxHeight
                    } else {
                        this.swipeHeight = this.result.images[this.swipeCurrent].height
                    }
                }
            },
            // 播放准备就绪
            playerReadied() {
                this.initVideoReady = true
            },
            // 改变页面布局
            changeDataSource() {
                const parent = this.articleDataSource
                const data = changeDataSource(this.halfWidth, parent.content, true)
                parent.renderList = [[], []]
                data.forEach((item, index) => {
                    const willPushIndex = index % 2
                    parent.renderList[willPushIndex].push(item)
                })
            },
            // 获取相关推荐
            async fetchRelatedSuggestion () {
                const parent = this.articleDataSource
                if (parent.query.page > parent.totalPages && parent.totalPages > 0) {
                    parent.loaded = true
                } else {
                    try {
                        const params = {
                            ...parent.query
                        }
                        const response = await this.$axios.get(`article/more/${this.$route.params.id}?${qs.stringify(params)}`)
                        if (response && response.success) {
                            const totalPages = response.data.totalPages
                            let { data } = response.data
                            if (totalPages) {
                                data = changeDataSource(this.halfWidth, data)
                                data.forEach((item, index) => {
                                    const willPushIndex = index % 2
                                    parent.renderList[willPushIndex].push(item)
                                })
                                parent.query = {
                                    ...parent.query,
                                    page: parent.query.page + 1
                                }
                                parent.loading = false
                                parent.totalPages = totalPages
                                if (parent.query.page === 1) {
                                    parent.content = data
                                } else {
                                    parent.content = [...parent.content, ...data]
                                }
                                if (parent.query.page > parent.totalPages && parent.totalPages > 0) {
                                    parent.loaded = true
                                }
                            } else {
                                parent.empty = true
                            }
                        }
                    } catch (error) {
                    }
                }
            },
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
            async handleRefresh() {
                const id = this.$route.params.id
                if (id) {
                    const [result, comments] = await Promise.all([
                        this.$axios(`article/detail/${id}`),
                        this.$axios(`v2/article/comment/top3/${id}`)
                    ])
                    this.result = result.data
                    this.comments = comments.data.map((item) => {
                        return {
                            ...item,
                            ...changeComments(item),
                            page: 2,
                            size: item.top3.length
                        }
                    })
                    this.changeSwipeLayout()
                }
                this.refreshLoading = false
            },
            // 关注
            handleDownApp() {
                this.$refs.downapp.handleDownApp()
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
    .article-body-content
        img
            width: 100%
    .video-play-box
        .vjs-load-progress div
            background-color: rgba(0, 0, 0, 0.5)
        .vjs-control-bar
            background-color: rgba(0, 0, 0, 0.5)
        .vjs-big-play-button
            top: 50%
            left: 50%
            transform: translate(-50%, -50%)
            background-color: rgba(0, 0, 0, 0.45)
            border-color: rgba(255, 255, 255, 0.65)
            color: rgba(255, 255, 255, 0.85)
            width: 2em
            height: 2em
            line-height: 2em
            border-radius: 50%
</style>
