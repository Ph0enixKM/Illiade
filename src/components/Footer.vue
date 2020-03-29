<template>
    <div>
        <p>Copyright</p>
        <img src="../assets/art/PHX-Logo.png">
        <p>2020</p>
    </div>
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
    div
        background: #1C1A18
        text-align: center
        padding: 50px 0
        p
            display: inline-block
            color: #282523
            font-family: Lato-Regular
            font-size: 50px
            vertical-align: middle
            line-height: 100px
            margin: 0

        img
            display: inline-block
            height: 100px
            vertical-align: middle
            margin: 0 50px

    // Mobile rules
    @media screen and ( max-width: 800px )
        div
            #title
                font-size: 40px
                margin: 70px 0 20px 0
            img
                height: 50px
            p
                display: block
                font-size: 20px
</style>