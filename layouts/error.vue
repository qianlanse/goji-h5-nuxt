<template lang="pug">
    section.not-found-container.flex-column-center.full-page-fixed
        van-image(src="/images/404.png" fit="contain")
        h2.fz16.color-text-light.no-bold.mb10(v-if="statusCode === 404") 页面不存在
        h2.fz16.color-text-light.no-bold.mb10(v-else) 应用发生错误异常
        nuxt-link.color-main(to="/") 返回首页
</template>
<script>
    export default {
        props: {
            error: {
                type: Object,
                required: true
            }
        },
        head() {
            return {
                title: '页面未找到',
                meta: [
                    {
                        hid: 'description', name: 'description', content: 'GOJI be well be happy'
                    }
                ]
            }
        },
        computed: {
            statusCode () {
                return (this.error && this.error.statusCode) || 500
            }
        }
    }
</script>
<style lang="sass">
    .not-found-container
        -ms-text-size-adjust: 100%
        -webkit-text-size-adjust: 100%
        -webkit-font-smoothing: antialiased
</style>
