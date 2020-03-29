<template>
  <div id="jumbotron">
    <img id="logo" src="../assets/logo/logo.png">
    <img id="jelly-two" ref="jellyTwo" src="../assets/art/jellyfish.png">
    <div id="title">
      <h1>Illiade</h1>
      <h2>the Funky IDE</h2>
    </div>
    <img id="jelly-one" ref="jellyOne" src="../assets/art/jellyfish.png">
  </div>
</template>

<script>
  export default {
    name: 'Jumbotron',
    components: {},
    data() {
      return {
        
      }
    },
    mounted() {
      // Parallax
      window.addEventListener('scroll', () => {
        this.$refs.jellyOne.style.transform = `
          translate3d(${pageYOffset / 8}px, -${pageYOffset / 4}px, 0)
        `
        this.$refs.jellyTwo.style.transform = `
          translate3d(${pageYOffset / 2}px, -${pageYOffset}px, 0)
        `
      })
    }
  }
</script>

<style lang="sass" scoped>
#jumbotron
  width: 100vw
  height: 100vh
  background: linear-gradient(45deg, #DD0039, #CA00B9)
  overflow: hidden
  #logo
    position: absolute
    width: 100px
    top: 50px
    left: calc(50% - 50px)
  #jelly-one
    position: absolute
    right: 0
    width: 40vw
    top: calc(50% - 20vw) 
    will-change: transform
    transform: translate3d(0,0,0)
    transition: transform 5ms
  #jelly-two
    position: absolute
    bottom: 0vh
    height: 70vh
    opacity: 0.7
    left: 0
    will-change: transform
    transform: translate3d(0,0,0)
    transition: transform 5ms
  #title
    position: relative
    display: inline-block
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    text-align: center
    h1
      color: white
      font-family: Lato-Regular
      font-weight: 300
      font-size: 200px
      margin: 0
    h2
      color: white
      font-family: Lato-Light
      font-weight: 300
      font-size: 100px
      margin: 0

// Mobile rules
@media screen and ( max-width: 800px )
  #jumbotron
    #jelly-two
      width: 60vw
      height: 60vw
      bottom: calc(50vh - 30vw)
    #title
      h1
        font-size: 25vw
      h2
        font-size: 10vw
</style>
