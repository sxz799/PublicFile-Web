<template>

  <PublicFile msg="Welcome to PublicFile" />
</template>

<script>
import PublicFile from './components/PublicFile.vue'

export default {
  name: 'App',
  components: {
    PublicFile
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
