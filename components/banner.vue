<template lang="pug">
    .banner-container
        .skeleton-animation-container.bg-background.lazyload.relative.hidden(v-if="!data.length" :style="{height: height + 'px'}")
        van-swipe(:show-indicators="false" v-else)
            van-swipe-item(v-for="(item, index) in data" :key="index" @click="handleNavigate(item)")
                van-image.pc100.h200.block(:src="item.coverImage" fit="fill" :style="{height: height + 'px'}")
                    template(v-slot:loading)
                        div.lazyload.pc100.ph100
                    template(v-slot:error)
                        div.lazyload.pc100.ph100
</template>
<script>
    export default {
        props: {
            data: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                height: 160
            }
        },
        mounted() {
            if (process.browser) {
                this.height = window.innerWidth / 2
                this.$parent.$parent.bannerHeight = this.height
                window.addEventListener('resize', this.handleWindowResize)
            }
        },
        destroyed() {
            if (process.browser) {
                window.removeEventListener('resize', this.handleWindowResize)
            }
        },
        methods: {
            // 屏幕大小改变
            handleWindowResize() {
                this.height = window.innerWidth / 2
                this.$parent.$parent.bannerHeight = this.height
            },
            // 跳转页面
            handleNavigate(row) {
                this.$emit('navigate', row)
            }
        }
    }
</script>
