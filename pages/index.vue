<template lang="pug">
    van-pull-refresh.index-container(v-model="isLoading" @refresh="onRefresh")
        banner(:data="banners")
        m-nav(:data="navs" @change="handleChangeNav")
        .pt10.plr10.hidden
            m-article(v-for="(item, index) in tabList" :key="index" :result="item" v-show="currentIndex === index")
</template>
<script>
    import qs from 'qs'
	import banner from '~/components/banner.vue'
	import MNav from '~/components/nav.vue'
	import MArticle from '~/components/article/article.vue'
    import { initData, changeDataSource } from '~/common/util.js'
	export default {
		components: {
            banner,
            MNav,
            MArticle
		},
		data() {
			return {
                isLoading: false,
                currentIndex: 0,
				banners: [],
                navs: [],
                tabList: []
			}
		},
		created() {
			this.fetchBannerAd()
			this.fetchNavData()
		},
		methods: {
            onRefresh() {
                setTimeout(() => {
                    this.$toast('刷新成功')
                    this.isLoading = false
                }, 500)
            },
            // 切换菜单
            handleChangeNav (index) {
                this.currentIndex = index
                if (!this.tabList[index].totalPages) {
                    this.fetchDataList()
                }
            },
            // 获取banner广告数据
			async fetchBannerAd() {
				try {
					const response = await this.$axios.get('index/ad')
					if (response && response.success) {
						this.banners = response.data.bannerAd.filter(item => item.category !== 'PRODUCT' && item.category !== 'SHOP').map((item) => {
							return {
								...item,
								loaded: false,
								coverImage: item.coverImageUrl + '?x-oss-process=image/resize,p_40/format,jpg'
							}
                        })
					}
				} catch (error) {}
            },
            // 获取首页TabData
            async fetchNavData () {
                try {
                    const response = await this.$axios.get('index/tags4recommend')
                    if (response && response.success) {
                        this.navs = [{ id: '', name: '推荐' }, ...response.data]
                        this.tabList = this.navs.map(() => initData())
                        this.fetchDataList()
                    }
                } catch (error) {
                }
            },
            // 获取列表数据
            async fetchDataList () {
                const currentIndex = this.currentIndex
                const parent = this.tabList[currentIndex]
                if (parent.loading) {
                    return
                }
                if (parent.query.page > parent.totalPages && parent.totalPages > 0) {
                    parent.loaded = true
                } else {
                    try {
                        parent.loading = true
                        const params = {
                            ...parent.query,
                            tag: this.navs[currentIndex].id
                        }
                        const response = await this.$axios.get('index?' + qs.stringify(params))
                        if (response && response.success) {
                            const totalPages = response.data.totalPages
                            let { data } = response.data
                            data = changeDataSource(160, data)
                            if (totalPages) {
                                data.forEach((item, index) => {
                                    const willPushIndex = index % 2
                                    parent.renderList[willPushIndex].push(item)
                                })
                                parent.loading = false
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
                        if (this.loading) {
                            this.loading = false
                        }
                    } catch (error) {
                    }
                }
            }
        }
	}
</script>
