<template lang="pug">
    van-pull-refresh(v-model="refreshLoading" @refresh="handleRefresh")
        m-header(:index="true")
            .flex-row-center.bg-white(slot="headerchild" style="height: 100%; padding-right: 10px")
                van-image.w65.h30.mlr10.br15.hidden(src="images/logo.png")
                    template(v-slot:loading)
                        div.lazyload.pc100.ph100
                    template(v-slot:error)
                        div.lazyload.pc100.ph100
                nuxt-link.flex1.bg-background.br40.flex-center(:style="{height: config.headerInnerHeight + 'px'}" to="/search")
                    .icon.icon-search.fz14.color-text-light-x.mr5
                    .fz14.color-text-light-x 搜索您想知道的内容
        m-banner(:data="banners" @navigate="handleNavigator")
        m-nav(:navs="navs" :fixed="isFixed" :fixedHeight="config.headerHeight" @change="handleChangeNav")
        .mlr10(v-if="!tabList.length")
            .flex-wrap
                skeleton(v-for="item in 4" :key="item")
        van-list.plr10.pt10(
            v-for="(item, index) in tabList"
            :key="index"
            v-model="item.loading"
            @load="handleScroll"
            v-show="currentIndex === index"
            :offset="100"
            :finished="item.loaded"
            finished-text="没有更多数据了呀^_^"
            :immediate-check="true")
            loadmore(slot="loading")
            m-article(:result="item")
</template>
<script>
    import qs from 'qs'
	import MBanner from '~/components/banner'
	import MNav from '~/components/nav.vue'
	import MArticle from '~/components/article/article.vue'
	import skeleton from '~/components/article/skeleton.vue'
	import loadmore from '~/components/load-more.vue'
    import * as config from '~/common/config.js'
    import { initData, changeDataSource } from '~/common/util.js'
	export default {
		components: {
            MBanner,
            MNav,
            MArticle,
            skeleton,
            loadmore
        },
		data() {
			return {
                config,
                refreshLoading: false,
                isFixed: false,
				banners: [],
                navs: [],
                tabList: [],
                currentIndex: 0,
                halfWidth: 0,
                bannerHeight: 0
			}
        },
        head() {
            return {
                title: 'GOJI',
                meta: [
                    {
                        hid: 'description', name: 'description', content: 'GOJI be well be happy'
                    }
                ]
            }
        },
        // 初始化服务端数据
        async asyncData({ $axios }) {
            try {
                const [bannerData, navData] = await Promise.all([
                    $axios.get('index/ad'),
                    $axios.get('index/tags4recommend')
                ])
                const navs = [{ id: '', name: '推荐' }, ...navData.data]
                return {
                    banners: bannerData.data.bannerAd.filter(item => item.category !== 'PRODUCT' && item.category !== 'SHOP').map((item) => {
                        return {
                            ...item,
                            loaded: false,
                            coverImage: item.coverImageUrl + '?x-oss-process=image/resize,p_80/format,jpg'
                        }
                    }),
                    navs,
                    tabList: navs.map(() => initData())
                }
            } catch (err) {
                console.log(err)
            }
        },
        mounted() {
            this.fetchDataList()
            if (process.browser) {
                this.halfWidth = window.innerWidth / 2 - 15
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
                this.halfWidth = window.innerWidth / 2 - 15
                this.changeDataSource()
            },
            // 屏幕滚动
            handleWindowScroll() {
                this.isFixed = window.scrollY >= this.bannerHeight
            },
            // 改变页面布局
            changeDataSource() {
                const currentIndex = this.currentIndex
                const parent = this.tabList[currentIndex]
                parent.renderList = parent.renderList.map((list) => {
                    return changeDataSource(this.halfWidth, list, true)
                })
            },
            // 下拉刷新
            handleRefresh() {
                this.fetchDataList(true)
            },
            // 页面滚动
            handleScroll() {
                const current = this.tabList[this.currentIndex]
                if (this.tabList.length && current.content.length) {
                    this.fetchDataList()
                }
            },
            // 切换菜单
            handleChangeNav (index) {
                this.currentIndex = index
                if (!this.tabList[index].totalPages) {
                    this.fetchDataList()
                }
            },
            // 跳转页面
            handleNavigator(row) {
                if (row.category === 'IMAGE_TEXT') {
                    this.$router.push({
                        path: `/detail/${row.articleId}`
                    })
                }
            },
            // 获取列表数据
            async fetchDataList (refresh = false) {
                const currentIndex = this.currentIndex
                const parent = this.tabList[currentIndex]
                if (parent.query.page > parent.totalPages && parent.totalPages > 0) {
                    parent.loaded = false
                    parent.loading = false
                } else {
                    try {
                        const params = {
                            ...parent.query,
                            tag: this.navs[currentIndex].id
                        }
                        const response = await this.$axios.get('index?' + qs.stringify(params))
                        if (response && response.success) {
                            const totalPages = response.data.totalPages
                            let { data } = response.data
                            if (totalPages) {
                                data = changeDataSource(this.halfWidth, data)
                                data.forEach((item, index) => {
                                    const willPushIndex = index % 2
                                    if (refresh) {
                                        parent.renderList[willPushIndex].unshift(item)
                                    } else {
                                        parent.renderList[willPushIndex].push(item)
                                    }
                                })
                                parent.totalPages = totalPages
                                parent.content = [...parent.content, ...data]
                                parent.query = {
                                    ...parent.query,
                                    page: parent.query.page + 1
                                }
                                if (parent.query.page > parent.totalPages && parent.totalPages > 0) {
                                    parent.loaded = true
                                }
                            } else {
                                parent.empty = true
                            }
                        }
                        parent.loading = false
                    } catch (error) {
                        parent.loading = false
                    }
                }
                this.refreshLoading = false
            }
        }
	}
</script>
