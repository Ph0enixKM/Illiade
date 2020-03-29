<template>
    <article>
        <div id="title">Download</div>
        <button @click="download">
            <span class="version">1.3.0b</span><br>
            <span class="level">Pillar</span>
        </button>
    </article>
</template>

<script>
  export default {
    name: 'Download',
    components: {},
    data() {
      return {
        
      }
    },
    methods: {
        download() {
            location.href = `https://github.com/Ph0enixKM/Illiade`
        }
    }
  }
</script>

<style lang="sass" scoped>
    article
        text-align: center
    #title
        color: #D50072
        font-family: Lato-Regular
        font-size: 70px
        margin: 70px 0 20px 0
    button
        background: linear-gradient(45deg, #DD0039, #CA00B9)
        color: white
        border: none
        border-radius: 10px
        outline: none
        cursor: pointer
        width: 200px
        padding: 10px
        transition: opacity 200ms, transform 200ms
        will-change: transform
        .version
            font-family: Lato-Light
            font-size: 20px
        .level
            font-family: Lato-Regular
            font-size: 30px
        &:active
            transform: scale(0.95) !important
        &:hover
            transform: scale(0.99)
            opacity: 0.8
</style>