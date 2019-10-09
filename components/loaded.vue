<template lang="pug">
    .p15.flex-column-center
        .fz14.color-text-light-xx {{ text }}
</template>
<script>
    export default {
        props: {
            text: {
                type: String,
                default: '没有更多数据了呀^_^'
            }
        }
    }
</script>
