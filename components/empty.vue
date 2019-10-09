<template lang="pug">
    .empty-container.ptb50.plr10.flex-column-center(@click="handleEmpty")
        .icon.mb10.fz40.color-text-light-xx(:class="emptyIcon")
        .fz14.color-text-light-xx(v-html="text")
</template>
<script>
    export default {
        props: {
            icon: {
                type: String,
                default: 'empty-box'
            },
            text: {
                type: String,
                default: '没有任何数据T﹏T'
            }
        },
        computed: {
            emptyIcon () {
                return `icon-${this.icon}`
            }
        },
        methods: {
            handleEmpty () {
                this.$emit('empty')
            }
        }
    }
</script>
