<template lang="pug">
    .ptb10.flex-center
        .preloading-inner
            .preloading-inner-item.item1
            .preloading-inner-item.item2
            .preloading-inner-item.item3
            .preloading-inner-item.item4
            .preloading-inner-item.item5
            .preloading-inner-item.item6
            .preloading-inner-item.item7
            .preloading-inner-item.item8
        .ml10.fz12.color-text-light-x(v-if="text !== ''") {{ text }}
</template>
<script>
    export default {
        props: {
            text: {
                type: String,
                default: '加载中..'
            }
        }
    }
</script>
<style lang="sass">
    @import "~assets/sass/color.sass"
    .preloading-inner-item
        width: 3px
        height: 15px
        margin-right: 1px
        background: white
        display: inline-block
        transform-origin: bottom center
        animation: preloading 1.5s ease-in-out infinite
        &:last-child
            margin: 0
        &.item1
            animation-delay: 0.1s
        &.item2
            animation-delay: 0.2s
        &.item3
            animation-delay: 0.3s
        &.item4
            animation-delay: 0.4s
        &.item5
            animation-delay: 0.5s
        &.item6
            animation-delay: 0.6s
        &.item7
            animation-delay: 0.7s
        &.item8
            animation-delay: 0.8s
    @keyframes preloading
        0%
            transform: scaleY(0.1)
            background: white
        50%
            transform: scaleY(1)
            background: $color-main
        100%
            transform: scaleY(0.1)
            background: transparent
</style>
