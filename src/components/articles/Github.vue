<template>
    <article>
        <img @click="go" src="../../assets/art/git-light.png">
    </article>
</template>

<script>
  export default {
    name: 'Github',
    components: {},
    methods: {
        go() {
            location.href = `https://github.com/Ph0enixKM/Illiade`
        }
    }

  }
</script>

<style lang="sass" scoped>
    article
        text-align: center
        margin: 170px 0
        img
            opacity: 0.3
            width: 200px
            cursor: pointer
            transition: 300ms
            &:hover
                transform: scale(0.99)
                opacity: 0.5
            &:active
                transform: scale(0.95)
                opacity: 0.1
</style>