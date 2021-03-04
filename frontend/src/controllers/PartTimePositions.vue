<style>
</style>

<template lang="pug">
.body-container
  .banner
    img(src="/static/banner.png")
  show-positions(:showFor="showFor")
</template>

<script>
import showPositions from '../components/ShowPositions'

export default {
  components: {
    showPositions
  },
  data () {
    return {
      showFor: 'parttime'
    }
  }
}
</script>
