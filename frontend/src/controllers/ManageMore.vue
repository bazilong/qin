<style>
.mmore-body {
  margin: 0 55px;
}
.mmore-button {
  margin: 0 10px;
}
.upload-list{margin:0;padding:0;list-style:none;}
.upload-list-li{position: relative;margin-top:5px;line-height: 1.8}
.upload-list-li:hover{background-color: #f5f7fa;}
.upload-list-li-name{position:relative;margin-right: 40px;display: block;}
.fa-file-text-o{margin-right:7px;}
.upload-list-li-label{position:absolute;right:5px;top:0;}
.file-box{
  padding:5px 15px;
  border-radius:3px;
  background-color:#00a0e9;
  border-color:#00a0e9;
  color:#fff;display:inline-block;position: relative;
}
.file-btn{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  outline: none;
  background-color: transparent;
  filter:alpha(opacity=0);
  -moz-opacity:0;
  -khtml-opacity: 0;
  opacity: 0;
}
.el-icon-close{
  position: absolute;
  right: 10px;
  top: 7px;
  cursor: pointer;
}
.announce-title {
  font-size: 1.3em;
  display: inline-block;
}
.announce-time {
  display: inline-block;
  margin-left: 5px;
}
pre{
  white-space:pre-wrap; /* css3.0 */
  white-space:-moz-pre-wrap; /* Firefox */
  white-space:-pre-wrap; /* Opera 4-6 */
  white-space:-o-pre-wrap; /* Opera 7 */
  word-wrap:break-word; /* Internet Explorer 5.5+ */
  text-align: justify
}
</style>

<template lang="pug">
.card-container
  .card-header
    .card-title 更多
  .card-body.mmore-body(v-loading="loading")
    h4 获取月报数据
    el-date-picker(v-model="date",
      type="daterange",
      range-separator="至",
      start-placeholder="开始日期",
      end-placeholder="结束日期",
      value-format="timestamp",
      :default-time="['00:00:00', '23:59:59']",
      :picker-options="timeChange")
    el-button.mmore-button(type="primary", @click="exportData()") 导出数据
    hr
    h4 发布公告
    el-button(type="primary", @click="NoticeDialogVisible = true") 发布公告
    div(v-for="(announce, index) in announcement", :key="index", v-show="index < showNum")
      hr
      div(style="margin:15px")
        .announce-title  {{announce.title}}
        .announce-time(style="color:grey") {{announce.time}}
        el-button(type="text", style="float:right; margin-left:20px;", @click="showDeleteNotice(index)") 删除公告
        el-button(v-if="announce.is_top==='1'", style="float:right", @click="toggleTop(index,0)") 取消置顶
        el-button(v-else, type="primary", style="float:right", @click="toggleTop(index,1)") 置顶公告
        pre {{announce.detail}}
        div(v-if="downloadsList[index][0]")
          br
          div(style="margin-bottom:10px") 附件
          div(v-for="(files, id) in downloadsList[index]", :key="id" style="margin-left:20px")
            a.helpDownloadButton(href="javascript:void(0)", @click="exportMessage(id,index)") {{files.file}}
    .block-need-center
      el-button.text-button(type="text", v-show="announcement.length > 3", @click="toggleShowAll()") {{showAll? '收起公告': '展开查看全部公告'}}
  el-dialog(title="发布公告", :visible.sync="NoticeDialogVisible", width="490px")
    el-form(:model="notice")
      el-form-item(label="公告标题", :label-width="formLabelWidth")
        el-input(v-model="notice.title", autocomplete="off")
      el-form-item(label="公告详情", :label-width="formLabelWidth")
        el-input(type="textarea", :rows="4", v-model="notice.detail", autocomplete="off")
      el-form-item(label="发布附件", :label-width="formLabelWidth")
        form( action="/" method="post" id="uploadForm")
          .file-box(style="color:white") 上传附件
            form(enctype='multipart/form-data' method="post")
              input(type="file" id="files"  class="file-btn" name="file"  placeholder="file" multiple @change="tirggerFile($event)")
        ul(class="upload-list")
          li(v-for="(file, index) in fileList"  class="upload-list-li")
            |  {{file.name}}
            i.el-icon-close(@click="deleFile(index,file)")
    div(slot="footer", class="dialog-footer")
      el-button(@click="NoticeDialogVisible = false") 取 消
      el-button(type="primary", @click="publishNotice()") 发 布
  el-dialog(title="删除公告", :visible.sync="DeleteDialogVisible", width="490px")
    | 确认删除公告【{{activeNotice.title}}】吗？
    div(slot="footer", class="dialog-footer")
      el-button(@click="DeleteDialogVisible = false") 取 消
      el-button(type="primary", @click="deleteNotice()") 确 认
</template>

<script>
export default {
  inject: ['reload'],
  data () {
    return {
      NoticeDialogVisible: false,
      formLabelWidth: '90px',
      notice: {
        title: '',
        detail: ''
      },
      fileList: [],
      date: [],
      timeChange: {
        disabledDate (time) {
          return time.getTime() < (Date.now() - 3600 * 1000 * 24 * 183) || time.getTime() > Date.now() // 选择时间范围
        }
      },
      loading: true,
      announcement: [],
      showDetails: [],
      downloadsList: [],
      showNum: 3,
      showAll: false,
      DeleteDialogVisible: false,
      activeNotice: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // UploadUrl () {
    //   return 'https://qin.twtstudio.com//api.php/admin/source'
    // },
    fetchData () {
      this.loading = true
      this.$http.get('api.php/announcement/index').then(res => {
        this.announcement = res.data.data
        this.loading = false
        for (let i = 0; i < this.announcement.length; i++) {
          if (this.announcement[i].attach !== '') { this.downloadsList[i] = JSON.parse(this.announcement[i].attach) }
        }
        for (let i = 0; i < this.announcement.length; i++) {
          this.showDetails[i] = false
        }
      })
    },
    showDeleteNotice (i) {
      this.activeNotice = this.announcement[i]
      this.DeleteDialogVisible = true
    },
    deleteNotice () {
      this.$http.post(`api.php/admin/delannouncement`, {
        id: this.activeNotice.id
      }).then(res => {
        if (res.data.errno === 0) {
          this.$message.success('操作成功')
          this.reload()
          this.DeleteDialogVisible = false
        }
      })
    },
    toggleShowAll () {
      this.showAll = !this.showAll
      if (this.showAll) {
        this.showNum = this.announcement.length
      } else this.showNum = 3
    },
    exportMessage (id, index) {
      window.location = `https://qin.twtstudio.com/api.php/announcement/download?file=${this.downloadsList[index][id].file}&path=${this.downloadsList[index][id].path}`
    },
    file () {
      let formData = new FormData()
      for (let i = 0; i < this.fileList.length; i++) {
        formData.append('file', this.fileList[i], this.fileList[i].name)
      }
    },
    tirggerFile (event) {
      var _this = this
      var list = event.target.files
      for (var i = 0; i < list.length; i++) {
        _this.fileList.push(list[i])
      }
    },
    deleFile (i, name) {
      this.fileList.splice(i, 1)
    },
    publishNotice () {
      let formData = new FormData()
      for (let i = 0; i < this.fileList.length; i++) {
        formData.append('file[]', this.fileList[i], this.fileList[i].name)
      }
      formData.append('title', this.notice.title)
      formData.append('detail', this.notice.detail)
      let that = this
      var request = new XMLHttpRequest()
      request.open('POST', `/api.php/admin/announcement`)
      request.setRequestHeader('x-csrf-token', localStorage.getItem('token'))
      request.send(formData)
      request.onreadystatechange = function () { // 若响应完成且请求成功
        if (request.status === 200) {
          // console.log(JSON.parse(request.responseText))
          let err = JSON.parse(request.responseText).errno
          if (err === 0) {
            that.NoticeDialogVisible = false
            that.reload()
          } else {
            let msg = JSON.parse(request.responseText).errmsg
            if (msg === '操作成功') {
              that.reload()
              that.$message.success('操作成功')
            } else {
              that.$message.warning(msg)
            }
          }
        } else {
          that.$message.error('提交失败')
        }
      }
    },
    exportData () {
      let a = {}
      a.start = this.date[0] / 1000
      a.end = this.date[1] / 1000
      if (isNaN(a.start) || isNaN(a.end)) {
        this.$message.warning('请填入完整时间信息')
      } else {
        window.location = `https://qin.twtstudio.com/api.php/admin/report?end=${a.end}&start=${a.start}`
        this.$message.success('正在导出excel表格')
      }
    },
    handleAdd (file) {
      this.fileList.push(file.raw)
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
      for (let i = 0; i < this.fileList.length; i++) {
        if (file.raw === this.fileList[i]) this.fileList.splice(i, 1)
      }
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    toggleTop (index, status) {
      let id = this.announcement[index].id
      this.$http.post(`/api.php/admin/announcementtop`, {
        id: id,
        status: status
      }).then(res => {
        if (res.data.errno === 0) {
          this.$message.success('操作成功')
          this.reload()
        }
      })
    }
  }
}
</script>
