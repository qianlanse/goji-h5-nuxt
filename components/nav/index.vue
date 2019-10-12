<template lang="pug">
    div(:style="{height: navHeight + 'px'}")
        .plr10.bg-white(ref="nav" :class="{fixedNav: fixed}")
            .nav-component-wrapper
                .nav-scroll-view(ref="navScrollView")
                    .nav-content(v-if="!navs.length")
                        .h40.flex-center(v-for="item in 10" :key="item")
                            .mr15.ptb8.plr20.bg-background.lazyload.br2
                    .nav-content
                        .mr30.nav-item(
                            v-for="(item, index) in navs" :key="index"
                            @click="handleChangeNav(index)")
                            .h40.flex-center
                                .fz14.nav-item-inner(:class="{'bold fz16': index === currentIndex}") {{ item.name }}
                        .line(v-if="navs.length" :style="{width: navLineWidth + 'px', left: navLineLeft + 'px'}")
        //-.pc100(:style="{height: navHeight + 'px'}" v-show="fixed")
</template>
<script>
    export default {
        props: {
            navs: {
                type: Array,
                default() {
                    return []
                }
            },
            fixed: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                currentIndex: 0,
                navLineLeft: 0,
                navLineWidth: 0,
                navHeight: 40,
                domInfos: []
            }
        },
        computed: {
            getStyle() {
                return {
                    left: this.navLineLeft,
                    width: this.navLineWidth
                }
            }
        },
        mounted() {
            if (process.browser) {
                const navDoms = document.getElementsByClassName('nav-item')
                for (const nav of navDoms) {
                    this.domInfos.push({
                        width: nav.offsetWidth,
                        left: nav.offsetLeft
                    })
                }
                this.moveTo()
                this.navHeight = this.$refs.nav.clientHeight
            }
        },
        methods: {
            handleChangeNav(index) {
                /* const scrollView = document.getElementsByClassName('nav-scroll-view')[0]
                console.log(scrollView.scrollLeft)
                scrollView.scrollLeft = 120 + 'px' */
                // this.$refs.navScrollView.scrollTo(120, 0)
                this.currentIndex = index
                this.$emit('change', index)
                this.moveTo()
            },
            // 移动
            moveTo() {
                const currentTab = this.domInfos[this.currentIndex]
                if (currentTab) {
                    this.navLineWidth = currentTab.width * 0.5
                    this.navLineLeft = currentTab.left + (currentTab.width - this.navLineWidth) / 2
                }
            }
        }
    }
</script>
<style lang="sass">
    @import "~assets/sass/color.sass"
    .fixedNav
        position: fixed
        left: 0
        top: 0
        z-index: 9999
        width: 100%
        box-shadow: 0 4px 5px rgba(0, 0, 0, 0.05)
        border-bottom-left-radius: 10px
        border-bottom-right-radius: 10px
    .nav-component-wrapper
        background: white
        overflow: hidden
        .tab-inner
            padding-bottom: 10px
        &:before
            border-top-color: #f5f5f5
    .nav-scroll-view
        width: 100%
        position: relative
        overflow-x: scroll
        .nav-content
            display: flex
            white-space: nowrap
            position: relative
        .nav-item-inner
            transition: all 0.15s ease
        .line
            width: 0
            height: 2px
            background: $color-main
            transition: all 0.5s
            position: absolute
            left: 0
            bottom: 0
</style>
