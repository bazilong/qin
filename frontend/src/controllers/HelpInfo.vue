<style>
  .TXTcontents {
    padding: 0 40px 40px 40px;
    letter-spacing: 2px;
  }
  .middle {
    text-align: center;
  }
  .detail{
    margin-bottom : 20px;
  }
  pre{
    white-space:pre-wrap; /* css3.0 */
    white-space:-moz-pre-wrap; /* Firefox */
    white-space:-pre-wrap; /* Opera 4-6 */
    white-space:-o-pre-wrap; /* Opera 7 */
    word-wrap:break-word; /* Internet Explorer 5.5+ */
    text-align: justify
  }
  .time{
    font-size:13px;
    float:right;
    color:gray;
  }
  .point{
    cursor: pointer;
  }
  .card-title{display:inline;font-size:22px;letter-spacing:1.5px;font-weight:400}
</style>

<template lang="pug">
div
  .body-container(v-loading="loading")
    .card-container(v-for="(announce, index) in announcement", :key="index")
      .top(v-if="announce.is_top==='1'")
        img(src="/static/top.png")
      el-tooltip(class="item", effect="light", content="点击查看/收起详情", placement="top-end")
        .card-header.point(@click="toggleHidden(index)")
          .card-title  {{announce.title}}
          .time {{announce.time}}
      div(v-show="showDetails[index]")
        .card-body
          pre.detail  {{announce.detail}}
          div(v-if="downloadsList[index][0]")
            hr(style="margin: 0")
            br
            img(src="/static/paperclip.png", style="width:16px;margin-right:5px")
            span(style="color:#00a1e9") 附件下载
            div(v-for="(files, id) in downloadsList[index]", :key="id" style="margin:20px")  
              a.helpDownloadButton(href="javascript:void(0)", @click="exportMessage(id,index)") {{files.file}}
              //- el-button.downloadButton(type="primary" @click="exportMessage(id,index)") 下载
</template>

<script>
  import downloadsList from '../components/DownloadsList.vue'

  export default {
    components: {
      downloadsList
    },
    data () {
      return {
        announcement: [],
        showDetails: [],
        downloadsList: [],
        loading: true
      }
    },
    created () {
      this.loading = true
      this.$http.get('api.php/announcement/index').then(res => {
        this.announcement = res.data.data
        for (let i = 0; i < this.announcement.length; i++) {
          if (this.announcement[i].attach !== '') { this.downloadsList[i] = JSON.parse(this.announcement[i].attach) }
        }
        for (let i = 0; i < this.announcement.length; i++) {
          this.showDetails[i] = false
        }
        this.showDetails[0] = true
        this.loading = false
      })
    },
    methods: {
      toggleHidden (i) {
        this.showDetails.splice(i, 1, !this.showDetails[i])
      },
      exportMessage (id, index) {
        window.location = `api.php/announcement/download?file=${this.downloadsList[index][id].file}&path=${this.downloadsList[index][id].path}`
      }
    }
  }
</script>

