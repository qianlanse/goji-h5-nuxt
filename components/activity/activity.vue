<template lang="pug">
    .activity-list-container
        skeleton(v-if="result['content'] && result['content'].length === 0 && !result['empty']")
        .mb20.br6(v-for="(item, index) in result['content']" :key="index")
            nuxt-link.cover-box.relative(tag="div" :to="`/activity/${item.id}`")
                van-image.thumb.block.fadein.hidden(
                    :src="item.coverImage"
                    :width="item.width + 'px'"
                    :height="item.height + 'px'")
                    template(v-slot:loading)
                        div.lazyload.pc100.ph100
                    template(v-slot:error)
                        div.lazyload.pc100.ph100
                .h24.br12.plr10.flex-row-center.absolute.r10.b10.color-white.look-count
                    .icon.icon-eye.mr4.fz12
                    .fz12.bold {{ item.lookCount > 999 ? '999+' : item.lookCount }}
            .body-content.bg-white.flex-row-center.ptb20.plr15
                .date.mr15.flex-column-center
                    .fz15.color-text-light {{ item.startTime[0] }}
                    .fz28.color-main.bold {{ item.startTime[1] }}
                    .fz15.color-text-light {{ item.startTime[2] }}
                .flex1.flex-column
                    .title-box
                        .state.fz16.mb4.mr4.color3(v-if="item.progress === 2 || item.progress === 3") [{{ item.progressText }}]
                        .title.orient.orient1.fz16.mb4.flex1.lh130(v-html="item.title")
                    .address.fz14.color-text-light.orient.orient1.mtb5.lh130 {{ item.location }} {{ item.locationDetail }}
                    .footer
                        .inline-block.price ${{ item.fee }}
        empty(v-if="result['empty']")
</template>
<script>
    import empty from '../empty.vue'
    import { initData } from '../../common/util'
    import skeleton from './skeleton.vue'
    export default {
        components: {
            empty,
            skeleton
        },
        props: {
            result: {
                type: Object,
                require: true,
                default: () => initData()
            }
        }
    }
</script>
<style lang="sass">
    body
        background: #f5f5f5
    .activity-list-container
        width: 100%
        .cover-box
            border-top-left-radius: 4px
            border-top-right-radius: 4px
            position: relative
            z-index: 10
            .thumb
                border-top-left-radius: 4px
                border-top-right-radius: 4px
            .look-count
                background-color: rgba(0, 0, 0, 0.75)
        .body-content
            box-shadow: 0px 5px 25px 1px rgba(55, 58, 64, 0.075)
            border-bottom-left-radius: 4px
            border-bottom-right-radius: 4px
            .title-box
                display: flex
                align-items: center
                .state.color1
                    color: #F5A623
                .state.color2
                    color: #4A90E2
                .state.color3
                    color: #D0021B
            .price
                padding: 3px 10px
                background: #f9f9f9
                color: #7A7A7A
                border: 1px solid #dbdbdb
                border-radius: 4px
</style>
