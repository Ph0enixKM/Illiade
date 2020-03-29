<template>
  <header ref="header" :class="{hide}">
    <img id="logo" alt="Illiade logo" src="../assets/logo/logo.png" @click="goUp">
  </header>
</template>

<script>
  export default {
    name: 'Header',
    components: {},
    data() {
      return {
        hide: true
      }
    }, 
    mounted() {
      window.addEventListener('scroll', () => {
        if (pageYOffset > innerHeight) {
          this.hide = false
        }
        else {
          this.hide = true
        }
      })
    },
    methods: {
      goUp() {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
header
    position: fixed
    top: 0
    left: 0
    text-align: center
    padding: 5px 0
    height: 50px
    width: 100vw
    background: #23211f
    box-shadow: 0 0 10px black
    will-change: transform
    transition: transform 300ms
    &.hide
      transform: translate(0, -100%)
#logo
    filter: drop-shadow(0 0 2px black)
    width: 50px
    cursor: pointer
</style>
