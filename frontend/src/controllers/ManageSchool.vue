<template lang="pug">
.card-container
  manage-positions(:showFor="showFor")
</template>

<script>
import managePositions from '../components/ManagePositions.vue'

export default {
  components: {
    managePositions
  },
  data () {
    return {
      showFor: 'school'
    }
  }
}
</script>
