<template>
    <article>
        <div id="title">Short Guide</div>
        <p>
            Illiade is made quite uniquely so then a 
            short guide of what can be done might be useful.
        </p>
        <button @click="enter = true">Guide</button>
        <div class="error" v-show="enter"> Sorry... Guide does not exist yet.</div>
    </article>
</template>

<script>
  export default {
    name: 'Guide',
    components: {},
    data() {
      return {
        enter: false
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
    p
        color: white
        font-family: Lato-Light
        font-size: 30px
    .error
        margin: 20px auto
        width: 400px
        font-family: Lato-Light
        color: red
        background: #3c2828
        padding: 20px
        border-radius: 20px
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
        font-family: Lato-Regular
        font-size: 30px
        &:active
            transform: scale(0.95) !important
        &:hover
            transform: scale(0.99)
            opacity: 0.8
</style>