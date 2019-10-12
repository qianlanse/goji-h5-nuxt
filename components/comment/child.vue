<template lang="pug">
    .comment-inner-container
        .flex-row(v-for="(item, index) in comments['content']" :key="index")
            van-image.w40.h40.circle.hidden.bg-background.fadein(:src="item.avatar")
                template(v-slot:loading)
                    div.lazyload.pc100.ph100
                template(v-slot:error)
                    div.lazyload.pc100.ph100
            .flex1.ml10.relative
                h2.fz16.mb5.orient.orient1.color-text {{ item.nickname || 'GOJI' }}
                .color-black.mb10(v-html="item.content")
                .flex-space-between
                    .flex-row-center
                        .fz14.color-text-light {{ item.createDateText }}
                        .fz14.ml5.color-text-light 回复
                    .flex-row-center
                        i.icon.icon-like.color-text.fz14.mr5
                        .fz14.color-text {{ item.like > 99 ? '99+' : item.like }}
                van-divider.mtb12
                .comment-top3-list
                    .flex-row(v-for="(jtem, jndex) in item.top3" :key="jndex")
                        van-image.w40.h40.circle.hidden.bg-background.fadein(:src="jtem.avatar")
                            template(v-slot:loading)
                                div.lazyload.pc100.ph100
                            template(v-slot:error)
                                div.lazyload.pc100.ph100
                        .flex1.ml10.relative
                            h2.fz16.mb5.orient.orient1.color-text {{ jtem.nickname || 'GOJI' }}
                            .color-black.mb10(v-html="jtem.content")
                            .flex-space-between
                                .flex-row-center
                                    .fz14.color-text-light {{ jtem.createDateText }}
                                    .fz14.ml5.color-text-light 回复
                                .flex-row-center
                                    i.icon.icon-like.color-text.fz14.mr5
                                    .fz14.color-text {{ jtem.like > 99 ? '99+' : jtem.like }}
                            van-divider.mtb12
</template>
<script>
    export default {
        props: {
            comments: {
                type: Object,
                required: true
            }
        }
    }
</script>
<style lang="sass">
</style>
