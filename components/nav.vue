<template lang="pug">
    .pt10.plr10.bg-white.nav-box-info
        .nav-component-wrapper
            .nav-scroll-view
                .nav-content
                    .nav-item(
                        v-for="(item, index) in data" :key="index"
                        :class="{selected: index === currentIndex}"
                        @click="handleChangeNav(index)")
                        .nav-name {{ item.name }}
                    .line(v-if="data.length" :style="{width: navLineWidth + 'px', left: navLineLeft + 'px'}")
</template>
<script>
    export default {
        props: {
            data: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                currentIndex: 0,
                navLineLeft: 0,
                navLineWidth: 0,
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
            const navDoms = document.getElementsByClassName('nav-item')
            for (const nav of navDoms) {
                this.domInfos.push({
                    width: nav.offsetWidth,
                    left: nav.offsetLeft
                })
            }
            this.moveTo()
        },
        methods: {
            handleChangeNav(index) {
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
        z-index: 9999
        width: 100%
        box-shadow: 0 4px 5px rgba(0, 0, 0, 0.06)
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
                padding-bottom: 5px
            .nav-item
                margin: 0 30px 0 0
                .nav-name
                    font-size: 14px
                &.selected
                    .nav-name
                        font-weight: bold
            .line
                width: 0
                height: 2px
                background: $color-main
                transition: all 0.5s
                position: absolute
                left: 0
                bottom: 0
</style>
