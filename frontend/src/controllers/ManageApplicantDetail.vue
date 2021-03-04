<style>
.manage-applicant-title {
  margin-right: 20px;
  display: inline;
}
.manage-log-input {
  width: 400px;
  display: block;
  margin: 10px 0;
}
.manage-return-button {
  font-size: 13px;
  display: block;
}
.manage-feed-container {
  margin: 10px 0
}
.manage-feed-question-title, .manage-feed-question-q, .manage-feed-question-a, .manage-feed-detail {
  display: inline-block;
  vertical-align: top;
}
.manage-feed-question-q {
  width: 150px
}
.manage-feed-question-a {
  margin-left:10px;
  width: 350px;
}
.manage-feed-question-container {
  margin: 10px 0;
}
.manage-feed-title {
  font-size: 16px;
  margin-bottom: 10px
}
.manage-feed-detail {
  width: 395px;
  margin-left: 5px;
}
.manage-feed-button {
  margin-left: 5px;
  font-size: 12px;
}
.table-css{
  width: 100%;
  border-spacing: 0;
  position: relative;
  margin:5px 0;
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
.td-head{
  background-color:#f5f9fb;
  padding:6px 0;
  margin:-6px 0;
}
.manage-applicant-postitle {
  margin-bottom: 10px;
}
.student-card-photo{
  width:110px;
  cursor:pointer;
}
</style>

<template lang="pug">
.card-container
  .card-header
    .card-title 报名者管理-报名者详情页
    el-button.manage-return-button(type='text', @click="$router.push('/managepage/applicant')") < 返回报名者管理页面
  .card-body(v-loading="loading")
    .manage-card-body
      h4 个人信息
      div
        .manage-applicant-title 姓名
        span {{stu_msg.user.realname}}
      div
        .manage-applicant-title 年级
        span {{stu_msg.user.grade}}
      div
        .manage-applicant-title 学院
        span {{stu_msg.user.college}}
      div
        .manage-applicant-title 专业
        span {{stu_msg.user.major}}
      div
        .manage-applicant-title 学号
        span {{stu_msg.user.stu_id}}
      div
        .manage-applicant-title 校区
        span {{(stu_msg.user.campus==='0')? '卫津路校区':((stu_msg.user.campus==='1')? '北洋园校区':'无信息' )}}
      div
        .manage-applicant-title 手机
        span {{stu_msg.user.phone}}
      div
        .manage-applicant-title 学生证照片
        el-tooltip(class="item", effect="light", content="点击放大", placement="right")
          img.student-card-photo(:src="stu_msg.user.card" align="top")
      h4 状态
      div
        .manage-applicant-title 基本状态
        span(:style="{ 'color': stu_msg.status  === '异常' ? 'red' : '' }") {{stu_msg.status}}
      h4 日志
      div(v-for="(f,index) in feed", style="margin-bottom: 10px", :key="index")
        div
          span.manage-feed-title(v-if="f.form") {{f.form.form_title}}
          span.manage-feed-title(v-else, style="color: grey") 对应问卷已被删除
          el-button.manage-feed-button(v-if="f.form", type="text",@click="toogleStatus(index)") {{showDetail[index]? '收起': '展开详情'}}
        div(v-if="f.form && !!showDetail[index]", style="margin: 0 20px")
          div
            .manage-applicant-title 提交问卷时间：
            span {{f.form.app_create}}
          div(v-for="(w, ii) in f.form.wish", :key="ii", style="margin-top: 10px;")
            .manage-applicant-title 第{{w.wish}}志愿：
            span(:style="{ 'color': w.status  === '通过' ? '#0FD59D' : '' }") {{w.title}} - {{w.status}}
          div.manage-feed-container
            span(style="color: #00a1e9") [{{timestampToTime(f.feed[0].timestamp)}}]
            div
              div.manage-feed-question-container(v-for="(q, i) in JSON.parse(JSON.parse(f.feed[0].data).form_data)", :key="i")
                div.manage-feed-question-title {{i+1}}.
                div.manage-feed-question-q {{JSON.parse(JSON.parse(f.feed[0].data).form_data)[i].title}}
                div(v-if="JSON.parse(JSON.parse(f.feed[0].data).app_data)[0]")
                  div.manage-feed-question-a(v-if="JSON.parse(JSON.parse(JSON.parse(f.feed[0].data).app_data)[0])[i]=== null && JSON.parse(JSON.parse(f.feed[0].data).form_data)[i].type !== 'desc'") 未填写
                  div.manage-feed-question-a(v-else) {{JSON.parse(JSON.parse(JSON.parse(f.feed[0].data).app_data)[0])[i]}}
                hr(v-if="i+1 !== JSON.parse(JSON.parse(f.feed[0].data).form_data).length")
              div(v-if="JSON.parse(JSON.parse(f.feed[0].data).app_data)[1]")
                div(style="margin-top:10px") 空闲时间
                  table.table-css
                    thead
                    tr
                      th.th-css(v-for="(cell,index) in header" :key="index" v-text="cell.text")
                    tr(v-for="(tr,index) in JSON.parse(JSON.parse(JSON.parse(f.feed[0].data).app_data)[1])" :key="index")
                      td.td-css(v-for="(td,i) in tr" :key="i")
                        div(v-if="td.col !== 0") {{td.text}}
                        .td-head(v-else) {{td.text}}
                  <!--div.manage-feed-question-a 可工作时间共计: {{odd}}个整半天/单周  {{even}}个整半天/双周-->
                <!--div {{JSON.parse(JSON.parse(JSON.parse(f.feed[0].data).app_data)[1])}}-->
              div(v-if="feed[index].form.attach",style="margin-bottom:10px;margin-top:10px") 报名附件
              div(v-if="feed[index].form.attach", v-for="(a,i) in feed[index].form.attach", :key="i", style="margin-left: 10px")
                a.helpDownloadButton(href="javascript:void(0)", @click="exportMessage(a.name,a.url)") {{a.name}}
          div.manage-feed-container(v-for="(a, i) in f.feed", :key="i", v-if="i !== 0")
            div.manage-feed-question-title(style="color: #00a1e9") [{{timestampToTime(f.feed[i].timestamp)}}]
            .manage-feed-detail
              span(style="color: #00a1e9") {{JSON.parse(f.feed[i].data).user}}
              span {{JSON.parse(f.feed[i].data).content}}
          div(v-if="index === feedLength - 1")
            el-input.manage-log-input(type="textarea", :rows="2", v-model="content")
            el-button(type="primary", @click="submit()") 提交
            el-button(type="primary", @click="fetchData()") 刷新
      h4 操作
      //- el-button(type="primary", @click="moveDialogVisible=true") 移动到
      el-button(type="primary", v-if="$root.a.role === '2'", @click="confirm()") 确认面试
      //- el-button(type="primary", v-if="$root.a.role === '2'", @click="accept(0)") 不录取
      el-button(type="primary", v-if="$root.a.role === '3'", @click="confirm()") 确认面试
      el-button(v-if="$root.a.role !== '2'", type="info", @click="black()") {{stu_msg.status==='异常'? '移出黑名单': '移入黑名单'}}
      div(v-if="$root.a.role === '2'")
        hr(style="margin-top:20px")
        h4 未处理岗位
        .manage-applicant-postitle(v-if="belongPos.length===0")
          div(style="color: grey") 当前基地下该报名者未被确认面试或最近一次报名岗位均被处理
        el-row.manage-applicant-postitle(v-for="(p,index) in belongPos",:key="index",v-else)
          el-col(:span="16") {{belongPos[index].title}}({{belongPos[index].status}})
          el-col(:span="8")
            el-button(type="primary", @click="accept(1,belongPos[index].id)") 录取
            el-button(type="danger", @click="accept(0,belongPos[index].id)") 不录取
  //- el-dialog(title="移动报名者", :visible.sync="moveDialogVisible", width="450px")
  //-   el-form(:model="form")
  //-     el-form-item(label="基地", :label-width="formLabelWidth")
  //-       el-select(v-model="form.base", placeholder="--未选择--")
  //-         el-option(label="基地1", value="base1")
  //-         el-option(label="基地2", value="base2")
  //-     el-form-item(label="状态", :label-width="formLabelWidth")
  //-       el-select(v-model="form.status", placeholder="--未选择--")
  //-         el-option(label="未录取", value="base1")
  //-         el-option(label="待定", value="base2")
  //-   div(slot="footer", class="dialog-footer")
  //-     el-button(type="primary", @click="moveDialogVisible = false") 确 定 提 交

  el-dialog(title="移入黑名单", :visible.sync="blackDialogVisible", width="450px")
    div 确认将 {{stu_msg.user.realname}}(学号：{{stu_msg.user.stu_id}}) 移入黑名单?
    div(slot="footer", class="dialog-footer")
      el-button(@click="blackDialogVisible = false") 取 消
      el-button(type="primary", @click="toBlack()") 确 定

</template>

<script>
// import constant from '../constant'

// let filterCampus = constant.campus.getFilter()

export default {
  inject: ['reload'],
  data () {
    return {
      form: {
        base: '',
        status: ''
      },
      // odd: 0,
      // even: 0,
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
      formLabelWidth: '90px',
      moveDialogVisible: false,
      blackDialogVisible: false,
      acceptDialogVisible: false,
      stu_msg: {},
      feed: [],
      content: '',
      showDetail: [],
      feedLength: 0,
      loading: true,
      belongPos: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      let { id } = this.$route.params
      this.$http.get(`api.php/admin/userdetail?user=${id}`).then(res => {
        if (res.data.errno === 0) {
          this.stu_msg = res.data.data
          this.stu_msg.user.card = 'https://qin.twtstudio.com/upload/' + this.stu_msg.user.card
          this.feed = this.stu_msg.feed
          this.feedLength = Object.keys(this.feed).length
          this.showDetail[this.feedLength - 1] = true
          let pos = this.feed[this.feedLength - 1].form.wish
          let arr = this.$root.a.job
          for (let i in pos) {
            let ii = arr.includes(pos[i].id)
            if (ii && pos[i].status === '已面试') {
              this.belongPos.push(pos[i])
            }
          }
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    exportMessage (name, url) {
      window.location = `https://qin.twtstudio.com/api.php/announcement/download?file=${name}&path=${url}`
    },
    toogleStatus (i) {
      this.showDetail.splice(i, 1, !this.showDetail[i])
    },
    submit () {
      let { id } = this.$route.params
      this.$http.post(`api.php/admin/interview?user=${id}`, {
        content: this.content,
        user: id
      }).then(res => {
        if (res.data.errno === 0) {
          this.content = ''
          this.fetchData()
        }
      })
    },
    black () {
      let { id } = this.$route.params
      if (this.stu_msg.status === '异常') {
        this.$http.get(`api.php/admin/outblack?user=${id}`).then(res => {
          if (res.data.errno === 0) {
            this.fetchData()
            this.$message.success('成功移除黑名单')
          }
        })
      } else {
        this.blackDialogVisible = true
      }
    },
    toBlack () {
      let { id } = this.$route.params
      this.$http.get(`api.php/admin/inblack?user=${id}`).then(res => {
        if (res.data.errno === 0) {
          this.fetchData()
          this.$message.success('已加入黑名单')
          this.blackDialogVisible = false
        }
      })
    },
    confirm () {
      let { id } = this.$route.params
      this.$http.get(`api.php/admin/confirm?user=${id}`).then(res => {
        if (res.data.errno === 0) {
          this.$message.success(res.data.errmsg)
          this.reload()
        }
      })
    },
    timestampToTime (timestamp) {
      var date = new Date(timestamp * 1000)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      return Y + M + D + h + m + s
    },
    accept (type, job) {
      let { id } = this.$route.params
      this.$http.post(`api.php/admin/accept`, {
        user: id,
        type: type,
        job: job
      }).then(res => {
        if (res.data.errno === 0) {
          let data = JSON.parse(res.data.data)
          if (data.type === 1) {
            this.$message('录取' + this.stu_msg.user.realname + '：' + data.job)
          } else {
            this.$message.warning('拒绝' + this.stu_msg.user.realname + data.job + '的岗位申请')
          }
        }
        this.fetchData()
      })
    }
  }
}
</script>
