<template>
    <article>
        <div id="title">About</div>
        <p>
            Illiade is a code editor made totally 
            for fun and to serve me and you guys. 
            For any creative ideas you can create 
            an issue on GitHub. 
        </p>
        <img src="../../assets/logo/little-screenshot.jpg">
    </article>
</template>

<script>
  export default {
    name: 'About',
    components: {},
    data() {
      return {
        
      }
    }
  }
</script>

<style lang="sass" scoped>
    article
        margin-top: 100px
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
    img
        margin: 100px 0
        width: 100%
        border-radius: 10px
        box-shadow: 0 0 15px #0F0F0F88
</style>