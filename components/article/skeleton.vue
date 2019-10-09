<template lang="pug">
  .single-articel-container.skeleton-container
        .body-thumb
            .thumb.lazyload
        .body-content
            .title-box
                .title.t1
                .title.t2
            .footer
                .user-intro
                    .avatar
                    .username
                .like
                    i.icon.icon-like_fill
</template>

<style lang="sass">
    .single-articel-container
        width: 50%
        margin-bottom: 10px
        position: relative
        &:nth-child(2n + 1)
            padding-right: 5px
        &:nth-child(2n + 2)
            padding-left: 5px
        .body-thumb
            position: relative
            .thumb
                width: 100%
                height: 170px
                border-top-left-radius: 5px
                border-top-right-radius: 5px
                background-color: #f5f6fa
        .body-content
            padding: 10px
            background: #fdfdfd
            border-bottom-left-radius: 5px
            border-bottom-right-radius: 5px
            .title
                height: 10px
                background: #f5f6fa
                margin-bottom: 5px
                &.t1
                    width: 80%
                &.t2
                    width: 30%
            .footer
                display: flex
                align-items: center
                margin-top: 10px
                .user-intro
                    display: flex
                    flex: 1
                    align-items: center
                .avatar
                    width: 25px
                    height: 25px
                    border-radius: 50%
                    background-color: #f5f6fa
                    margin-right: 5px
                .username
                    width: 35px
                    height: 12px
                    background-color: #f5f6fa
                .icon-like_fill
                    font-size: 17px
                    color: #f5f6fa
</style>
