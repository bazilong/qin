<style>
  h5 {
    font-size: 20px;
    font-weight: 400;
    margin: 20px 20px 20px 0;
    display: inline-block;
  }
  .weelyform-declaration {
    font-size: 14px;
  }
  .weelyform-subbmit-button {
    margin: 10px;
    font-size: 16px;
    padding: 8px 30px
  }
  .icon-in-will{
    float:right;
    width:30px;
    height:29.6px;
  }
  .weeklyform-collection-block {
    margin: 20px 0;
  }
  .weeklyform-search {
    width: 100%;
    padding: 6px 20px;
    font-size: 16px;
    background-color: #F5F9FB;
    border: none;
    border-radius: 3px;
  }
  .weelyform-add-button {
    width: 100%;
    font-size: 14px;
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
    background-color:#409eff;
    border-color:#409eff;
    color:#000;display:inline-block;position: relative;
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
  .table-css{
    width: 100%-20px;
    border-spacing: 0;
    position: relative;
  }
  .table-css thead{
    text-align: center;
    font-size: 13px;
    color: #455565;
    width: 120px;
  }
  .th-css{
    width: 100px;
    border:1px solid #cccccc;
    padding:6px;
    padding-right: 0px;
    padding-left: 0px;
    font-size: 12px;
    color: #455565;
    text-align: center;
    background-color: #f5f9fb;
  }
  .td-css{
    width: 100px;
    border:1px solid #cccccc;
    padding:6px;
    padding-right: 0px;
    padding-left: 0px;
    font-size: 10px;
    color: #455565;
    text-align: center;
  }
  .button-css{
    cursor:pointer;
    padding:6px 0;
    margin:-6px 0;
    /*margin-top:-6px;*/
    /*margin-bottom:-6px;*/
  }
  .button{
    cursor:pointer;
    padding:11px 0;
    margin:-11px 0;
  }
  .td-head{
    background-color:#f5f9fb;
    padding:6px 0;
    margin:-6px 0;
  }
  .tip{
    margin-bottom: 10px;
    line-height: 22px;
  }
.form-answer-container {
  margin-left:20px;
}
</style>

<template lang="pug">
  .body-container(ref="container")
    el-card.block-need-center.card-container(shadow="never")
      .card-title 兼职岗报名表
      div(v-if="activeQ") {{activeQ.starttime}}————{{activeQ.endtime}}
    .card-container
      .card-header
        h4.card-title 第一志愿
        p.card-header-description {{title}}
    .card-container
      .card-header(@click="showDetails=!showDetails",:class="showDetails? 'card-head-with-color':''")
        h4.card-title 申请表单
        .icon-in-will
          i.card-show-details-button(v-bind:class="{'el-icon-arrow-up':showDetails, 'el-icon-arrow-down':!showDetails}")
      div(v-show="showDetails")
        hr(style="margin: 0")
        .card-body
          div
            h5 个人信息
            <!--el-button.text-button(type="text") 信息有误/已转专业？-->
            el-row
              el-col(:span='10')
                .content-in-card 姓名：
                p.content-in-card {{user.realname}}
              el-col(:span='14')
                .content-in-card 年级：
                p.content-in-card {{user.grade}}{{type[user.type-2]}}
            el-row
              el-col(:span='10')
                .content-in-card 学院：
                p.content-in-card {{user.college}}
              el-col(:span='14')
                .content-in-card 专业：
                p.content-in-card {{user.major}}
          div
            h5 联系方式
            <!--el-button.text-button(type="text") 修改-->
            el-row
              el-col(:span='10')
                .content-in-card 校区：
                p.content-in-card {{(user.campus==='0')? '无信息':((user.campus==='1')? '北洋园校区':'卫津路校区' )}}
              el-col(:span='14')
                .content-in-card 手机：
                p.content-in-card {{user.phone}}
          hr
          div
            h5 申请信息
            div(v-if="activeQ")
              questions(:canSubmit="true", :activeQ="activeQ" @getData="getdata")
            br
            h3 是否服从调剂
            .form-answer-container
              el-radio-group(v-model="data.mode")
                el-radio(:label="0") 调剂
                el-radio(:label="1") 不调剂
            br
            h3 是否是贫困生
            .form-answer-container
              el-radio-group(v-model="data.poor")
                el-radio(:label="0") 是
                el-radio(:label="1") 不是
            br
            h3 空闲时间
            div.tip.form-answer-container
              span(style="color:red") ***
              | 点击表格内的时间块选择空闲时间，点击一、二、三次分别代表该时间段单双周均有时间、单周有时间、双周有时间，此题为多选，例如：单周周一1、2节课有空闲时间，则请点击对应时间块两次。
              span(style="color:red") ***
            table.table-css.form-answer-container
              thead
              tr
                th.th-css(v-for="(cell,index) in header" :key="index" v-text="cell.text")
              tr(v-for="(tr,index) in rows" :key="index")
                td.td-css(v-for="(td,i) in tr" :key="i")
                  div(v-if="td.text === ''" @click="freeTime(index,i)")
                    .button
                  div(v-else-if="td.col !== 0" @click="freeTime(index,i)")
                    .button-css {{td.text}}
                  .td-head(v-else) {{td.text}}
            p.form-answer-container 可工作时间共计: {{odd}}个整半天/单周  {{even}}个整半天/双周
          hr
          div(style="margin-bottom:20px;")
            h5 文件上传
            <!--el-upload(:action="UploadUrl()" :on-change="uploadSectionFile" multiple :auto-upload="false")-->
            <!--el-button.text-button(type="text") 附件上传-->
            form(action="/" method="post" id="uploadForm")
              .file-box(style="color:white;margin-bottom:10px;") 上传附件
                form(enctype='multipart/form-data' method="post")
                  input(type="file" id="files"  class="file-btn" name="file"  placeholder="file" multiple @change="tirggerFile($event)")
            ul(class="upload-list")
              li(v-for="(file, index) in fileList"  class="upload-list-li")
                |  {{file.name}}
                i.el-icon-close(@click="deleFile(index,file)")
          hr
          p.weelyform-declaration 本项目信息由天津大学勤工助学基金提供，在您报名成功后，您的个人基本信息及申请表单（以上去全部内容）将被提供给天津大学勤工助学办公室，本页面多列项目信息及具体项目交流方式由天津大学勤工助学办公室负责，与平台无关
    .block-need-center
      el-button.weelyform-subbmit-button(type="primary" @click="confirmSubmit()") 提交
</template>

<script>
  // import Bus from '../router/bus.js'
  import questions from '../components/Question'
  export default {
    components: {
      questions
    },
    data () {
      return {
        showDetails: true,
        postNum: '',
        title: this.$route.query.title,
        activeQ: {},
        data: {
          data: [],
          wish: [this.$route.query.id],
          mode: 0,
          files: [],
          poor: 0
        },
        user: {},
        type: ['研究生', '本科生'],
        fileList: [],
        odd: 0,
        even: 0,
        header: [
          {row: 0, col: 0, text: ''},
          {row: 0, col: 1, text: '周一'},
          {row: 0, col: 2, text: '周二'},
          {row: 0, col: 3, text: '周三'},
          {row: 0, col: 4, text: '周四'},
          {row: 0, col: 5, text: '周五'},
          {row: 0, col: 6, text: '周六'},
          {row: 0, col: 7, text: '周日'}
        ],
        rows: [
          [
            {row: 1, col: 0, text: '1-2节'},
            {row: 1, col: 1, text: ''},
            {row: 1, col: 2, text: ''},
            {row: 1, col: 3, text: ''},
            {row: 1, col: 4, text: ''},
            {row: 1, col: 5, text: ''},
            {row: 1, col: 6, text: ''},
            {row: 1, col: 7, text: ''}
          ],
          [
            {row: 2, col: 0, text: '3-4节'},
            {row: 2, col: 1, text: ''},
            {row: 2, col: 2, text: ''},
            {row: 2, col: 3, text: ''},
            {row: 2, col: 4, text: ''},
            {row: 2, col: 5, text: ''},
            {row: 2, col: 6, text: ''},
            {row: 2, col: 7, text: ''}
          ],
          [
            {row: 3, col: 0, text: '5-6节'},
            {row: 3, col: 1, text: ''},
            {row: 3, col: 2, text: ''},
            {row: 3, col: 3, text: ''},
            {row: 3, col: 4, text: ''},
            {row: 3, col: 5, text: ''},
            {row: 3, col: 6, text: ''},
            {row: 3, col: 7, text: ''}
          ],
          [
            {row: 4, col: 0, text: '7-8节'},
            {row: 4, col: 1, text: ''},
            {row: 4, col: 2, text: ''},
            {row: 4, col: 3, text: ''},
            {row: 4, col: 4, text: ''},
            {row: 4, col: 5, text: ''},
            {row: 4, col: 6, text: ''},
            {row: 4, col: 7, text: ''}
          ],
          [
            {row: 5, col: 0, text: '晚上'},
            {row: 5, col: 1, text: ''},
            {row: 5, col: 2, text: ''},
            {row: 5, col: 3, text: ''},
            {row: 5, col: 4, text: ''},
            {row: 5, col: 5, text: ''},
            {row: 5, col: 6, text: ''},
            {row: 5, col: 7, text: ''}
          ]
        ]
      }
    },
    created () {
      this.$http.get(`api.php/user/status`).then(response => {
        this.user = response.data.data
        if (this.user.campus === '0' || this.user.phone === '' || this.user.card === '') {
          this.$message.warning('请先添加联系方式并完善学生证信息')
          this.$router.push(`/mine`)
        }
        // console.log(this.user)
      })
      this.$http.get(`/api.php/job/form?job=${this.data.wish}`).then(res => {
        if (res.data.data.length === 0) {
          this.$message.warning('无当前问卷信息')
          this.activeQ = null
        } else {
          this.activeQ = res.data.data
          this.activeQ.data = JSON.parse(this.activeQ.data)
        }
      })
    },
    methods: {
      reloads () {
        this.$message.success('成功提交报名表')
        this.$router.push(`/mine`)
      },
      confirmSubmit () {
        this.$confirm('问卷提交后无法修改，请问是否提交', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submit()
        })
      },
      submit () {
        if (this.user.campus === '0' || this.user.phone === '') {
          this.$message.warning('请添加联系方式')
        } else {
          this.data.data[1] = JSON.stringify(this.rows)
          let formData = new FormData()
          formData.append('wish', JSON.stringify(this.data.wish))
          formData.append('data', this.data.data)
          formData.append('mode', this.data.mode)
          formData.append('poor', this.data.poor)
          for (let i = 0; i < this.fileList.length; i++) {
            formData.append('file[]', this.fileList[i], this.fileList[i].name)
          }
          let that = this
          let request = new XMLHttpRequest()
          request.open('POST', `api.php/application/create?id=${this.activeQ.id}&type=parttime`)
          request.setRequestHeader('x-csrf-token', localStorage.getItem('token'))
          request.send(formData)
          request.onreadystatechange = function () { // 若响应完成且请求成功
            if (request.status === 200) {
              console.log(request.responseText)
              if (JSON.parse(request.responseText).errno === 0) {
                that.reloads()
              } else {
                console.log(JSON.parse(request.responseText).errmsg)
                let msg = JSON.parse(request.responseText).errmsg
                that.$message.warning(msg)
              }
            } else {
              that.$message.error('提交失败')
            }
          }
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
      getdata (d) {
        this.data.data[0] = JSON.stringify(d)
      },
      freeTime (index, i) {
        if (this.rows[index][i].text === '') this.rows[index][i].text = '单双'
        else if (this.rows[index][i].text === '单双') this.rows[index][i].text = '单'
        else if (this.rows[index][i].text === '单') this.rows[index][i].text = '双'
        else if (this.rows[index][i].text === '双') this.rows[index][i].text = ''
        this.compute()
      },
      compute () {
        this.odd = 0
        this.even = 0
        for (let i = 0; i < 5; i++) {
          for (let l = 1; l < 8; l++) {
            if (this.rows[i][l].text === '单双') {
              this.odd = this.odd + 0.5
              this.even = this.even + 0.5
            } else if (this.rows[i][l].text === '单') this.odd = this.odd + 0.5
            else if (this.rows[i][l].text === '双') this.even = this.even + 0.5
          }
        }
      }
    }
  }
</script>
