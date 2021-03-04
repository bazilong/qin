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
.body-container
  el-card.block-need-center.card-container(shadow="never")
    .card-title 本周报名表
    div(v-if="activeQ") {{activeQ.starttime}}————{{activeQ.endtime}}
  .card-container(v-if="positions.length!==0" v-for="(w, index) in positions", :key="index")
    .card-header
      h4.card-title 第{{index+1}}志愿
      p.card-header-description(v-if="w") {{w.title}}
      .icon-div-in-will
        i.el-icon-arrow-up.icon-in-card(@click="SortUp(index)")
        i.el-icon-arrow-down.icon-in-card(@click="SortDown(index)")
        i.el-icon-delete.icon-in-card(@click="Delete(index)")
  .card-container(v-if="positions.length<3" v-for="index in (3-positions.length)")
    .card-header
      h4.card-title 第{{index+positions.length}}志愿
      .icon-div-in-will
        i.el-icon-plus.icon-in-card(@click="AddWill(index)")
  .card-container(v-loading="loading")
    .card-header(@click="showDetails=!showDetails",:class="showDetails? 'card-head-with-color':''")
      h4.card-title 申请表单
      .icon-div-in-will
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
              p.content-in-card {{(user.campus==='2')? '卫津路校区':((user.campus==='1')? '北洋园校区':'无信息' )}}
            el-col(:span='14')
              .content-in-card 手机：
              p.content-in-card {{user.phone}}
        hr
        div
          h5 申请信息
          div(v-if="activeQ")
            h3 问卷-{{activeQ.title}}
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
              el-radio(:label="1") 是
              el-radio(:label="0") 不是
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
          <!--el-button.text-button(type="text") 附件下载-->
          <!--el-upload(:action="UploadUrl()" :on-change="uploadSectionFile" multiple :auto-upload="false")-->
            <!--el-button.text-button(type="text") 附件上传-->
          form(action="/" method="post" id="uploadForm")
            .file-box(style="color:white;margin-bottom:10px") 上传附件
              form(enctype='multipart/form-data' method="post")
                input(type="file" id="files"  class="file-btn" name="file"  placeholder="file" multiple @change="tirggerFile($event)")
          ul(class="upload-list")
            li(v-for="(file, index) in fileList"  class="upload-list-li")
              |  {{file.name}}
              i.el-icon-close(@click="deleFile(index,file)")
        hr
        p.weelyform-declaration 本项目信息由天津大学勤工助学基金提供，在您报名成功后，您的个人基本信息及申请表单（以上去全部内容）将被提供给天津大学勤工助学办公室，本页面多列项目信息及具体项目交流方式由天津大学勤工助学办公室负责，与平台无关
  .block-need-center
    el-button.weelyform-subbmit-button(type="primary" @click="confirmSubmit") 提交
  <!--div(v-show="showMyCollection")-->
    <!--el-card(shadow="never")-->
      <!--el-row(:gutter="20")-->
        <!--el-col(:span="6")-->
          <!--h4.card-title 请输入岗位编号-->
        <!--el-col(:span="14")-->
          <!--input.weeklyform-search(type="text", placeholder="00000000", v-model="postNum")-->
        <!--el-col(:span="4")-->
          <!--el-button.weelyform-add-button(type="primary", @click="AddToMyWill()") 添加-->
    <!--div.weeklyform-collection-block-->
      <!--.list-title-containner-->
        <!--span 我的收藏(校内岗位)-->
      <!--positions-list-card(:positionsList="positions")-->
</template>

<script>
import questions from '../components/Question'
import positionsListCard from '../components/PositionsList'

export default {
  components: {
    positionsListCard,
    questions
  },
  data () {
    return {
      positions: {},
      showDetails: true,
      // showMyCollection: false,
      // postNum: '',
      activeQ: {},
      added: 0,
      data: {
        data: [],
        wish: [],
        mode: 0,
        files: [],
        poor: 1
      },
      fileList: [],
      user: {},
      type: ['研究生', '本科生'],
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
      ],
      loading: true
    }
  },
  created () {
    this.question()
    this.pchange()
    this.$http.get(`api.php/user/status`).then(response => {
      this.user = response.data.data
      if (this.user.campus === '0' || this.user.phone === '' || this.user.card === '') {
        this.$message.warning('请先添加联系方式并完善学生证信息')
        this.$router.push(`/mine`)
      }
    })
  },
  methods: {
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
    },
    pchange () {
      this.positions = JSON.parse(localStorage.getItem('will'))
      if (this.positions === null) this.positions = []
    },
    AddWill (i) {
      // this.showDetails = false
      // this.showMyCollection = true
      // this.added = i
      // return i
      this.$prompt('请输入岗位编号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$http.get(`api.php/job/search?number=${value}}`).then(res => {
          let a = res.data.data
          if (a === false) {
            this.$message.error('没有找到该岗位')
          } else {
            this.add(a)
          }
        })
        this.showMyCollection = false
      })
    },
    SortUp (i) {
      let oldWill = JSON.parse(localStorage.getItem('will'))
      localStorage.removeItem('will')
      if (i !== 0) {
        let temp = oldWill[i - 1]
        oldWill.splice(i - 1, 1, oldWill[i])
        oldWill.splice(i, 1, temp)
      }
      localStorage.setItem('will', JSON.stringify(oldWill))
      this.pchange()
    },
    SortDown (i) {
      let oldWill = JSON.parse(localStorage.getItem('will'))
      localStorage.removeItem('will')
      if (i !== oldWill.length - 1) {
        let temp = oldWill[i + 1]
        oldWill.splice(i + 1, 1, oldWill[i])
        oldWill.splice(i, 1, temp)
      }
      localStorage.setItem('will', JSON.stringify(oldWill))
      this.pchange()
    },
    Delete (i) {
      let oldWill = JSON.parse(localStorage.getItem('will'))
      localStorage.removeItem('will')
      oldWill.splice(i, 1)
      localStorage.setItem('will', JSON.stringify(oldWill))
      this.pchange()
    },
    add (i) {
      if (!localStorage.getItem('will')) {
        localStorage.setItem('will', JSON.stringify([{
          title: i.title,
          id: i.id
        }]))
      } else {
        let oldWill = JSON.parse(localStorage.getItem('will'))
        let did = 0
        for (let j = 0; j < oldWill.length; j++) {
          if (oldWill[j].id === i.id) did = 1
        }
        let nowWill = {title: i.title, id: i.id}
        if (did === 1) {
          this.$message.warning('已添加')
        } else {
          localStorage.removeItem('will')
          oldWill.push(nowWill)
          localStorage.setItem('will', JSON.stringify(oldWill))
          this.pchange()
          this.$message.success('添加成功')
        }
      }
    },
    question () {
      this.$http.get(`/api.php/user/form`).then(res => {
        if (res.data.data.length === 0) {
          this.$message.warning('无当前问卷信息')
          this.activeQ = null
        } else {
          this.activeQ = res.data.data[0]
          this.activeQ.data = JSON.parse(this.activeQ.data)
        }
        this.loading = false
      })
    },
    // AddToMyWill () {
    //   this.$http.get(`api.php/job/search?number=${this.postNum}}`).then(res => {
    //     let a = res.data.data
    //     if (a === false) {
    //       this.$message.error('没有找到该岗位')
    //     } else {
    //       this.add(a)
    //     }
    //   })
    //   this.showMyCollection = false
    // },
    getdata (d) {
      this.data.data[0] = JSON.stringify(d)
    },
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
      let oldWill = JSON.parse(localStorage.getItem('will'))
      // console.log(oldWill)
      if (this.user.campus === '0' || this.user.phone === '') {
        this.$message.warning('请添加联系方式或完善学生证信息')
      } else {
        if (!oldWill || oldWill.length === 0) {
          this.$message.error('未添加志愿')
        } else {
          let formData = new FormData()
          for (let i = 0; i < oldWill.length; i++) {
            this.data.wish.splice(i, 1, oldWill[i].id)
          }
          this.data.data[1] = JSON.stringify(this.rows)
          formData.append('wish', JSON.stringify(this.data.wish))
          formData.append('data', JSON.stringify(this.data.data))
          formData.append('mode', this.data.mode)
          formData.append('is_poor', this.data.poor)
          for (let i = 0; i < this.fileList.length; i++) {
            formData.append('file[]', this.fileList[i], this.fileList[i].name)
          }
          let that = this
          var request = new XMLHttpRequest()
          request.open('POST', `api.php/application/create?id=${this.activeQ.id}&type=school`)
          request.setRequestHeader('x-csrf-token', localStorage.getItem('token'))
          request.send(formData)
          request.onreadystatechange = function () { // 若响应完成且请求成功
            if (request.status === 200) {
              if (JSON.parse(request.responseText).errno === 0) {
                localStorage.removeItem('will')
                that.reloads()
              } else {
                let msg = JSON.parse(request.responseText).errmsg
                that.$message.warning(msg)
              }
            } else {
              that.$message.error('提交失败')
            }
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
    freeTime (index, i) {
      if (this.rows[index][i].text === '') this.rows[index][i].text = '单双'
      else if (this.rows[index][i].text === '单双') this.rows[index][i].text = '单'
      else if (this.rows[index][i].text === '单') this.rows[index][i].text = '双'
      else if (this.rows[index][i].text === '双') this.rows[index][i].text = ''
      this.compute()
    }
  },
  mounted () {
    this.pchange()
  }
}
</script>
