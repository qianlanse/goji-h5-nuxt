<template lang="pug">
    .activity-skeleton-container.skeleton-container.hidden.bg-white
        .cover-box
            .thumb.bg-background.lazyload
        .body-content.flex-row-center.ptb20.plr15
            .flex-column-center.mr15
                .month
                .day.mtb8
                .week
            .flex-column.flex1
                .flex-row-center
                    .state.mr10
                    .title
                .address.mtb8
                .footer
</template>
<script>
    export default {
    }
</script>
<style lang="sass">
    @import "~assets/sass/color.sass"
    .activity-skeleton-container
        margin-bottom: 25px
        border-radius: 4px
        position: relative
        .cover-box
            border-top-left-radius: 4px
            border-top-right-radius: 4px
            position: relative
            .thumb
                border-top-left-radius: 4px
                border-top-right-radius: 4px
                height: 225px
        .body-content
            border-bottom-left-radius: 4px
            border-bottom-right-radius: 4px
            .month, .day, .week
                width: 30px
                height: 15px
                background: $color-background
            .state
                width: 50px
                height: 15px
                background: $color-background
            .title
                flex: 1
                height: 15px
                background: $color-background
            .address
                width: 80%
                height: 15px
                background: $color-background
            .footer
                width: 40%
                height: 15px
                background: $color-background
</style>
