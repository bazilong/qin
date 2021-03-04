<template lang="pug">
.body-container
  .banner
    img(src="/static/banner.png")
  show-positions(:showFor="showFor")
  my-will
</template>

<script>
import showPositions from '../components/ShowPositions'
import myWill from '../components/MyWill'

export default {
  components: {
    showPositions,
    myWill
  },
  data () {
    return {
      showFor: 'school'
    }
  }
}
</script>
