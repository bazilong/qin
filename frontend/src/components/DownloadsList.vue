<style>
.downloadButton {
  float: right;
}
</style>

<template lang="pug">
.body-container
  .card-container(v-for="(download, index) in downloadsList", :key="index")
    .card-header
      h4.card-title {{download.name}}
      p.card-header-description {{download.details}}
      el-button.downloadButton(type="primary") 下载
</template>

<script>

export default {
  props: {
    downloadsList: Array
  }
}
</script>
