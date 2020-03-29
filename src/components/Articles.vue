<template>
  <div>
    <Download/>
    <About/>
    <Guide/>
    <Github/>
  </div>
</template>

<script>
  import Download from './articles/Download'
  import About from './articles/About'
  import Guide from './articles/Guide'
  import Github from './articles/Github'

  export default {
    name: 'Articles',
    components: {
        Download,
        About, 
        Guide,
        Github
    },
    data() {
      return {
        
      }
    }
  }
</script>

<style lang="sass" scoped>
    div
        margin: 0 auto
        width: 50vw
</style>