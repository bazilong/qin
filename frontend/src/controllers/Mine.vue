<style>
.to-weekly-form {
  cursor: pointer;
  font-size: 18px;
  text-decoration: none;
}
.user-information-block {
  text-align: center;
  margin: 5px 0;
  font-size: 16px;
  font-weight: 400;
}
.weekly-time-description {
  display: inline;
  margin-left: 10px;
  font-size: 16px;
}
.confirm-buttton {
  margin: 5px;
}
.twt--avatar {
  height: 100px;
  width: 100px;
  margin-bottom: 10px;
  border-radius: 50%;
}
.message-content-block {
  background-color: #EFF3F5;
  border-radius: 3px;
  font-size: 15px;
  padding: 10px;
}
.position-name {
  font-size: 18px;
  margin-bottom: 5px;
}
.position-description {
  padding: 0 10px;
  margin-top: 10px;
  border-left: 5px solid #00a0e9;
}
.application-list-block {
  margin-top: 10px;
}
.mine-contact {
  padding: 10px 0 0 13px;
  line-height: 23px;
}
.no-submit{
  position: relative;
  width: 40%;
  left: 50%;
  margin-left: -20%;
  text-align:center;
  margin-top:16px;
  margin-bottom:16px;
}
.student-card {
  width: 40%;
  margin:auto;
  margin-bottom:16px;
}
.student-block {
  border-radius: 4px;
  border: 1.5px dashed #00a0e9;
  padding-top:18px;
  padding-bottom:18px;
  font-size:13px;
  color: #00a0e9;
}
.card-input {
  cursor: pointer;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  outline: none;
  background-color: transparent;
  opacity: 0;
}
.page-button{
  width:100%;
  position:relative;
}
.card-style{
  position:absolute;
  width:20px;
  left:65px;
  cursor:pointer;
}
.student-page{
  color: #00a0e9;
  cursor:pointer;
}
.close-student{
  position:relative;
}
.resubmit{
  position:relative;
}
el-steps {
  white-space: pre-line;
}
</style>

<template lang="pug">
.body-container(v-loading='loading')
  div(v-if="user.id")
    div(v-if="!signed")
      router-link(v-if="activeQ" to="/weeklyForm")
        el-card.to-weekly-form(shadow="hover", @click="toWeeklyform()") 前往本周报名表
          .weekly-time-description {{activeQ.starttime}}————{{activeQ.endtime}}
          i.el-icon-d-arrow-right.card-show-details-button
      el-card.to-weekly-form(v-else shadow="hover") 本周无报名表
    el-card.to-weekly-form(v-else shadow="hover") 本周已报名
  div(v-else)
    el-card.to-weekly-form(shadow="hover", @click="tologin()") 请登录后前往本周报名表
  el-row(:gutter="10")
    el-col(:span="6")
      el-card.card-container.block-need-center(shadow="never")
        div(v-if="user.id")
          img.twt--avatar(:src="user.avatar")
        div(v-else)
          img.twt--avatar(:src="user.avatar" style="cursor: pointer" @click="tologin()")
        div(v-if="user.id")
          .user-information-block {{user.realname}}
          .user-information-block {{user.grade}}{{type[user.type-2]}}
          .user-information-block {{user.college}}
          .user-information-block {{user.major}}
          .page-botton(@click="showstudent = true")
            img.card-style(src="/static/card.png" )
            .student-page 学生证页
          <!--div(v-if="user.card==''")-->
            <!--.student-card.student-block  点击上传学生证照片-->
              <!--form(action="/" enctype='multipart/form-data' method="post")-->
                <!--input(class="card-input" type="file" name="file"  placeholder="file" @change="submitcard($event)")-->
          <!--div(v-else)-->
            <!--.student-card-->
              <!--img.student-img(:src="user.card")-->
              <!--span 点击重新上传-->
              <!--form(action="/" enctype='multipart/form-data' method="post")-->
                  <!--input(class="card-input" type="file" name="file"  placeholder="file" @change="submitcard($event)")-->
        div(v-else)
          .user-information-block 未登录
        el-button.text-button(v-if="user.id" type="text" @click="showInformation = true") 信息有误 / 已转专业？
      el-card.card-container(shadow="never")
        .mine-contact
          el-row
            el-col(:span="6") 校区
            el-col(:span="18") {{(user.campus==='2')? '卫津路校区':((user.campus==='1')? '北洋园校区':'无信息' )}}
          el-row
            el-col(:span="6") 手机
            el-col(:span="18") {{user.phone}}
          el-button.text-button(v-if="user.id" type="text" @click="showContact = true") 修改联系方式
    el-col(:span="18")
      el-card.card-container(shadow="never" v-show="showstudent" style="border-color: #00a1e9")
        .card-title 学生证信息
        div(v-if="user.card==''")
          .no-submit.student-block  点击上传学生证照片
            form(action="/" enctype='multipart/form-data' method="post")
              input(class="card-input" type="file" name="file"  placeholder="file" @change="submitcard($event)")
          el-button.close-student(@click="showstudent = false") 关闭
        div(v-else)
          el-slider(v-model="cardsize" input="bigsize()")
          .student-card(ref="size")
            img.student-img(:src="user.card")
          el-button.resubmit 重新上传
            form(action="/" enctype='multipart/form-data' method="post")
              input(class="card-input" type="file" name="file"  placeholder="file" @change="submitcard($event)")
          el-button.close-student(@click="showstudent = false") 关闭
      el-card.card-container(shadow="never" v-show="showInformation" style="border-color: #00a1e9")
        .card-title 修改个人信息
        user-information(:user="user", @hide="showInformation = false")
      el-card.card-container(shadow="never" v-show="showContact" style="border-color: #00a1e9")
        .card-title 修改联系方式
        user-contact(:user="user", @hide="showContact = false")
      el-card.card-container(shadow="never")
        <!--div(v-if="messages.length == 0")-->
        .card-title 校内岗位申请
        div(v-for="(a, index) in applySchool")
          div(v-if="index === 0", style="margin:20px")
            .position-name 正在进行 - {{a.form}}
            el-steps(:active="a.content.activeIndex",style="margin-top: 20px")
              el-step(v-for="(step, i) in applySchool[index].content.data",:title="step.title",:description="step.desc", :key="i")
          .application-list-block(v-else, v-show="index < showApplicationsNum")
            hr
            el-row(style="margin:20px")
              el-col(:span="19")
                .position-name {{a.form}}
                .position-description
                  | {{a.content.data[a.content.activeIndex-1].title}}
                  span(v-if="a.content.data[a.content.activeIndex-1].desc") - {{a.content.data[a.content.activeIndex-1].desc}}
        div(v-if="!applySchool.length")
          div(style="font-size: 15px;margin-top: 20px;") 您还没有申请过任何校内岗位
        .block-need-center
          el-button.text-button(type="text", v-show="applySchool.length > 4", @click="toggleShowAllApplication()") {{showAllApplication? '收起申请': '展开查看全部申请'}}
      el-card.card-container(shadow="never")
        .card-title 兼职岗位申请
        div(v-for="(a, index) in applyParttime")
          .application-list-block(v-show="index < showParttimeNum")
            hr(v-if="index !== 0")
            el-row(style="margin:20px")
              el-col(:span="19")
                .position-name {{a.title}}
                .position-description
                  | {{a.time}}
        div(v-if="!applyParttime.length")
          div(style="font-size: 15px;margin-top: 20px;") 您还没有申请过任何兼职岗位
        .block-need-center
          el-button.text-button(type="text", v-show="applyParttime.length > 4", @click="toggleShowAllParttime()") {{showAllParttime? '收起申请': '展开查看全部申请'}}
  <!--.list-title-containner-->
    <!--span 我的收藏（校内岗位）-->
  <!--positions-card-list(:positionsList="positionsList")-->
</template>

<script>

import UserContact from '../components/UserContact.vue'
import UserInformation from '../components/UserInformation.vue'
export default {
  components: {
    UserContact,
    UserInformation
  },
  data () {
    return {
      // messages: messages,
      activeQ: {},
      // showMessagesNum: 4,
      showApplicationsNum: 4,
      showParttimeNum: 4,
      showAllMessages: false,
      showAllParttime: false,
      showAllApplication: false,
      showInformation: false,
      showContact: false,
      showstudent: false,
      cardsize: 0,
      signed: true,
      user: {},
      type: ['研究生', '本科生'],
      applySchool: [],
      applyParttime: [],
      loading: true
    }
  },
  created () {
    this.question()
    // console.log(this.use)
    this.$http.get(`api.php/user/status`).then(response => {
      this.user = response.data.data
      this.loading = false
      if (this.user.card) {
        this.user.card = 'https://qin.twtstudio.com/upload/' + this.user.card
      }
      if (this.user.id) {
        if (this.user.avatar === '') {
          this.user.avatar = '/static/avatar.png'
        } else {
          this.user.avatar = 'https://i.twtstudio.com/uploads/' + this.user.avatar
        }
        this.$http.get(`api.php/user/application`).then(res => {
          this.applySchool = res.data.data.school
          var str = this.applySchool[0].content.data[0].desc.replace(/\/\//g, ' \n ')
          this.applySchool[0].content.data[0].desc = str
          this.applyParttime = res.data.data.parttime
        })
      } else {
        this.user.avatar = '/static/avatar.png'
      }
    })
    this.$http.get(`api.php/user/formstatus`).then(res => {
      this.signed = res.data.data
    })
  },
  watch: {
    'cardsize': function (newVal) {
      let student = document.getElementsByClassName('student-card')[0]
      student.style.width = 40 + (newVal * 3 / 5) + '%'
    }
  },
  methods: {
    // toggleShowAllMessage () {
    //   this.showAllMessages = !this.showAllMessages
    //   if (this.showAllMessages) {
    //     this.showMessagesNum = this.messages.length
    //   } else this.showMessagesNum = 4
    // },
    question () {
      this.$http.get(`/api.php/user/form`).then(res => {
        if (res.data.data.length !== 0) {
          this.activeQ = res.data.data[0]
          this.activeQ.data = JSON.parse(this.activeQ.data)
        } else {
          this.activeQ = 0
        }
      })
    },
    toggleShowAllApplication () {
      this.showAllApplication = !this.showAllApplication
      if (this.showAllApplication) {
        this.showApplicationsNum = this.applySchool.length
      } else this.showApplicationsNum = 4
    },
    toggleShowAllParttime () {
      this.showAllParttime = !this.showAllParttime
      if (this.showAllParttime) {
        this.showParttimeNum = this.applyParttime.length
      } else this.showParttimeNum = 4
    },
    toWeeklyform () {
      if (this.user.id) {
        this.$http.get(`/api.php/user/formstatus`).then(res => {
          if (res.data.data === true) {
            this.$message.warning('本周已报名')
          } else {
            this.$router.push(`/weeklyForm`)
          }
        })
      } else {
        this.$message.warning(`请先登录`)
      }
    },
    tologin () {
      window.location = `/api.php/user/login?redirect=${encodeURIComponent(window.location.pathname)}`
    },
    submitcard (event) {
      var list = event.target.files
      let formData = new FormData()
      formData.append('file', list[0], list[0].name)
      let that = this
      let request = new XMLHttpRequest()
      request.open('POST', `api.php/user/card`)
      request.setRequestHeader('x-csrf-token', localStorage.getItem('token'))
      request.send(formData)
      request.onreadystatechange = function () { // 若响应完成且请求成功
        if (request.status === 200) {
          if (JSON.parse(request.responseText).errno === 0) {
            that.$message.success('上传成功')
            window.location.reload()
          } else {
            console.log(JSON.parse(request.responseText).errmsg)
            let msg = JSON.parse(request.responseText).errmsg
            that.$message.warning(msg)
          }
        } else {
          that.$message.error('上传失败')
        }
      }
    }
  }
}
</script>
