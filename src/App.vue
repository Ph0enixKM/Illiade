<template>
  <div id="app">
    <Jumbotron/>
    <Articles/>
    <Footer/>
    <Header/>
  </div>
</template>

<script>
  import Jumbotron from './components/Jumbotron'
  import Articles from './components/Articles'
  import Footer from './components/Footer'
  import Header from './components/Header'

  export default {
    name: 'App',
    components: {
      Jumbotron,
      Articles,
      Footer,
      Header
    },
    data() {
      return {
        
      }
    }
  }
</script>

<style lang="sass">
  body
    margin: 0
    overflow-x: hidden
    background: #282523
    &::-webkit-scrollbar
        background-color: transparent
    &::-webkit-scrollbar-track
        background-color: transparent
    &::-webkit-scrollbar-thumb
        background-color: #2f2a28
        border-radius: 10px

  @font-face
    font-family: Lato-Regular
    src: url('./assets/art/lato/Lato-Regular.ttf')

  @font-face
    font-family: Lato-Light
    src: url('./assets/art/lato/Lato-Light.ttf')
</style>
