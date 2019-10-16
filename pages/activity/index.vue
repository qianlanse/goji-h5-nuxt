<template lang="pug">
    van-pull-refresh(v-model="refreshLoading" @refresh="handleRefresh")
        banner(:data="banners" @navigate="handleNavigator")
        m-nav(:navs="navs" :fixed="isFixed" @change="handleChangeNav")
        .mlr10.mt10(v-if="!tabList.length")
            skeleton
        van-list.mt10(
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
            m-activity(:result="item")
</template>
<script>
    import qs from 'qs'
	import banner from '~/components/banner'
	import MNav from '~/components/nav'
	import MActivity from '~/components/activity/activity.vue'
	import skeleton from '~/components/activity/skeleton.vue'
    import loadmore from '~/components/load-more.vue'
    import { initData } from '~/common/util.js'
    const activityState = ['报名中', '进行中', '已结束', '审核被拒', '审核中']
	export default {
		components: {
            banner,
            MNav,
            MActivity,
            skeleton,
            loadmore
        },
		data() {
			return {
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
                title: '活动类别 - GOJI',
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
                    $axios.get('activity/recommend'),
                    $axios.get('activity/category/list')
                ])
                const navs = [{ id: '', name: '推荐' }, ...navData.data]
                return {
                    banners: bannerData.data.map((item) => {
                        return {
                            ...item,
                            coverImage: item.imageUrl
                        }
                    }),
                    navs,
                    tabList: navs.map(() => initData())
                }
            } catch (err) {
            }
        },
        mounted() {
            this.fetchDataList()
            if (process.browser) {
                this.contentWidth = window.innerWidth - 20
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
                this.contentWidth = window.innerWidth - 20
                const currentIndex = this.currentIndex
                const parent = this.tabList[currentIndex]
                parent.content = this.changeWidth(parent.content, true)
            },
            // 屏幕滚动
            handleWindowScroll() {
                this.isFixed = window.scrollY >= this.bannerHeight
            },
            // 改变页面布局
            changeWidth(data, resize = false) {
                const width = this.contentWidth
                return data.map((item) => {
                    const coverWidth = item.coverWidth
                    const coverHeight = item.coverHeight
                    let coverImage = item.coverImage
                    if (coverImage.includes('http:')) {
                        coverImage = coverImage.replace('http:', 'https:')
                    }
                    if (resize) {
                        return {
                            ...item,
                            width,
                            height: width * coverHeight / coverWidth
                        }
                    } else {
                        return {
                            ...item,
                            width,
                            height: width * coverHeight / coverWidth,
                            coverImage: coverImage + `?x-oss-process=image/resize,p_70/format,jpg`
                        }
                    }
                })
            },
            // 下拉刷新
            handleRefresh() {
                this.fetchDataList()
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
                this.$router.push({
                    path: `/activity/${row.activityId}`
                })
            },
            // 获取列表数据
            async fetchDataList () {
                const currentIndex = this.currentIndex
                const parent = this.tabList[currentIndex]
                if (parent.query.page > parent.totalPages && parent.totalPages > 0) {
                    parent.loaded = true
                    parent.loading = false
                    this.refreshLoading = false
                } else {
                    try {
                        const params = {
                            ...parent.query,
                            category: this.navs[currentIndex].id
                        }
                        const response = await this.$axios.get('activity/page?' + qs.stringify(params))
                        if (response && response.success) {
                            const totalPages = response.data.totalPages
                            let { data } = response.data
                            if (totalPages) {
                                data = data.map((item) => {
                                    return {
                                        ...item,
                                        progressText: activityState[item.progress],
                                        startTime: item.startTime1.split(' ')
                                    }
                                })
                                data = this.changeWidth(data)
                                parent.totalPages = totalPages
                                if (this.refreshLoading) {
                                    parent.content = [...data, ...parent.content]
                                } else {
                                    parent.content = [...parent.content, ...data]
                                }
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
                        this.refreshLoading = false
                    } catch (error) {
                        parent.loading = false
                        this.refreshLoading = false
                    }
                }
            }
        }
    }
</script>
<style lang="sass">
</style>
