<template lang="pug">
    .banner-container
        .p10.bg-fdfdfd(v-if="!data.length")
            .banner-thumb.bg-background.lazyload
        van-swipe(:show-indicators="false")
            van-swipe-item(v-for="(item, index) in data" :key="index")
                van-image.pc100.h200(:src="item.coverImage" fit="fill")
                    template(v-slot:loading)
                        van-loading(type="spinner" size="20")
</template>
<script lang="ts">
    import Vue from 'vue'
    export default Vue.extend({
        props: {
            data: {
                type: Array,
                default() {
                    return []
                }
            }
        }
    })
</script>
