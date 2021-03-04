<style>
.manage-p-span{
  margin-right: 5px;
}
.manage-p-msg {
  margin-left: 20px;
  margin-bottom: 10px;
}
.manage-q-add{
  margin-left: 20px;
}
.dialog-waring-msg {
  padding: 22px;
  color: red;
}
</style>

<template lang="pug">
div
  .card-header
    .card-title(v-if="showFor==='school'")  校内岗管理
    .card-title(v-if="showFor==='parttime'")  兼职岗管理
  .card-body(v-loading="loading")
    .block-need-right
      el-pagination(@current-change="handleCurrentChange",
                  :current-page="currentPage",
                  layout="prev, pager, next",
                  :total="tableData.length",
                  :page-size="pagesize")
    el-table(:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)", border)
      el-table-column(align="center", prop="number", label="岗位编号", width="65")
      el-table-column(align="center", prop="title", label="岗位名称")
      el-table-column(align="center", prop="base", label="所属基地", width="100", v-if="showFor==='school'")
      el-table-column(align="center", prop="department", label="所属科室", width="100", v-if="showFor==='school'")
      el-table-column(align="center", prop="status", label="状态", width="80")
      el-table-column(align="center", label="操作", v-if="$root.a.role === '2'")
        template(slot-scope="scope")
          el-button(type="text", @click="showDetails(scope.row)") 查看详情
      el-table-column(align="center", label="操作", :width="showFor==='school'? '230': '300'", v-else)
        template(slot-scope="scope")
          el-button(type="text", @click="showDetails(scope.row)") 查看详情
          el-button(v-if="scope.row.status=='正在招募'" type="text", @click="handleTop(scope.row)") {{scope.row.top=='1'? '取消置顶': '置顶'}}
          el-button(type="text", v-if="showFor==='parttime'", @click="exportMessage(scope.row)") 导出信息
          el-button(type="text", @click="handleDelete(scope.row)") 删除
          el-button(type="text", @click="toggleStatus(scope.row)") {{scope.row.status=='正在招募'? '停止招募': '继续招募'}}
    .block-need-right
      el-button.managerights-add-button(type="primary", @click="AddPosition()") 添加岗位
      <!--el-button.managerights-add-button(type="primary", @click="exportMessage()") 导出-->

  el-dialog(title="岗位详情", :visible.sync="DetailDialogVisible",width="600px")
    el-form(:model="position")
      h3.manage-q-h3 {{positionDetail.title}}
      hr
      .manage-q-msg 岗位编号：{{positionDetail.number}}
      .manage-q-msg(v-if="showFor === 'school'") 所属部门：{{positionDetail.belong_to}}
      .manage-q-msg 招聘人数：{{positionDetail.count}}
      .manage-q-msg 起止日期：{{stamp2D(positionDetail.start_time)}} 至 {{stamp2D(positionDetail.end_time)}}
      hr
      .manage-q-msg 工资水平： {{positionDetail.salary}} / 月
      .manage-q-msg 性别要求：{{positionDetail.fsex}}
      .manage-q-msg 年级要求：{{positionDetail.fgrade}}
      .manage-q-msg 技能要求：
        span.manage-p-span(v-for="s in positionDetail.skill") {{s}}
      .manage-q-msg 时间要求：
        span.manage-p-span(v-for="t in positionDetail.time") {{t}}
      hr
      .manage-q-msg 工作内容：{{positionDetail.content}}
      hr
      .manage-q-msg 工作要求：{{positionDetail.require}}
      hr
      questions(:canSubmit="false", :activeQ="activeQ")
    div(slot="footer", class="dialog-footer")
      el-button(@click="DetailDialogVisible = false") 关闭
      el-button(type="primary", @click="Edit()") 修改

  el-dialog(title="编辑岗位", :visible.sync="EditDialogVisible",width="600px")
    el-form(:model="position")
      el-form-item(label="岗位名称", :label-width="formLabelWidth")
        el-input(v-model="position.title1", autocomplete="off", clearable)
      el-form-item(label="岗位编号", :label-width="formLabelWidth")
        el-input(
          v-model="position.number1",
          autocomplete="off",
          clearable,
          :disabled="!!position.id",
          placeholder="请输入6位岗位编号")
      div(style="margin-bottom: 10px")
        span(style="color: red; margin-left:90px") *
        span 岗位编号提交后将不可修改
        span(style="color: red") *
      el-form-item(label="所属部门", :label-width="formLabelWidth", v-if="showFor === 'school'")
        el-cascader(
          :change-on-select="true",
          :props="defaultParams",
          :options="options",
          v-model="position.belongArr1",
          :show-all-levels="false",
          :clearable="true")
      //- el-form-item(label="所属基地", :label-width="formLabelWidth", v-if="showFor=='school'")
      //-   el-select(v-model="position.base", placeholder="--未选择--")
      //-     el-option(v-for="(i, index) in options", :label="i.name", :value="index", :key="index")
      //- el-form-item(label="所属部门", :label-width="formLabelWidth", v-if="showFor=='school'")
      //-   el-select(v-model="position.belong_to", placeholder="--未选择--")
      //-     el-option(v-for="(i, index) in options[position.base].data", :label="i.name", :value="i.id", :key="index")
      el-form-item(label="招聘人数", :label-width="formLabelWidth")
        el-input-number(v-model="position.count1", controls-position="right",:min="1")
      el-form-item(label="起止日期", :label-width="formLabelWidth")
        el-date-picker(v-model="position.dateArr1", type="daterange", range-separator="至", start-placeholder="开始日期", end-placeholder="结束日期", value-format="timestamp")
      el-form-item(label="工资水平", :label-width="formLabelWidth")
        el-select(v-model="position.salary1", placeholder="--未选择--")
          el-option(label="140", value="140")
          el-option(label="220", value="220")
          el-option(label="290", value="290")
          el-option(label="430", value="430")
          el-option(label="580", value="580")
          el-option(label="720", value="720")
        |  / 月
      el-form-item(label="性别要求", :label-width="formLabelWidth")
        el-select(v-model="position.sex1", placeholder="--未选择--")
          el-option(label="不限", value="0")
          el-option(label="男", value="1")
          el-option(label="女", value="2")
      el-form-item(label="年级要求", :label-width="formLabelWidth")
        el-select(v-model="position.grade1", placeholder="--未选择--")
          el-option(label="不限", value="0")
          el-option(label="大一", value="1")
          el-option(label="大二", value="2")
          el-option(label="大三", value="3")
          el-option(label="大四", value="4")
          el-option(label="研究生", value="5")
      el-form-item(label="技能要求", :label-width="formLabelWidth")
        el-checkbox-group(v-model="position.skillArr1")
          el-checkbox(label="Photoshop")
          el-checkbox(label="PowerPoint")
          el-checkbox(label="Word")
          el-checkbox(label="Excel")
          el-checkbox(label="英语")
          el-checkbox(label="微信推送")
      el-form-item(label="时间要求", :label-width="formLabelWidth")
        el-checkbox-group(v-model="position.timeArr1")
          el-checkbox(label="一个整半天/周", value="一个整半天/周")
          el-checkbox(label="两个整半天/周", value="两个整半天/周")
          el-checkbox(label="三个整半天/周", value="三个整半天/周")
          el-checkbox(label="四个整半天/周", value="四个整半天/周")
          el-checkbox(label="五个整半天/周", value="五个整半天/周")
      el-form-item(label="工作内容", :label-width="formLabelWidth")
        el-input(type="textarea", :rows="2", v-model="position.content1", autocomplete="off")
      el-form-item(label="岗位要求", :label-width="formLabelWidth")
        el-input(type="textarea", :rows="2", v-model="position.require1", autocomplete="off")
      div(v-if="showFor === 'parttime' && !position.id")
        h3.manage-q-h3 报名问题设定
        div(v-for="(q, index) in newQ.data", :key="index")
          el-form-item(label="问题类型", :label-width="formLabelWidth")
            el-select(v-model="q.type", placeholder="--未选择--")
              el-option(label="文本描述", value="desc")
              //- el-option(label="选择排序", value="sort")
              el-option(label="单行文本", value="input")
              el-option(label="数字", value="number")
              el-option(label="多行文本", value="textarea")
              el-option(label="单选", value="radio")
              el-option(label="多选", value="checkbox")
            el-button.manage-q-remove(type="text", icon="el-icon-close", @click="newQ.data.splice(index, 1)") 删除
          el-form-item(label="备注", :label-width="formLabelWidth", v-if="q.type == 'desc'")
            | 此问题类型不对用户显示输入框，可用作表单内较长的文字介绍或说明
          el-form-item(label="问题内容", :label-width="formLabelWidth")
            el-input(v-model="q.title", placeholder="问题标题")
          el-form-item(label="问题选项", :label-width="formLabelWidth", v-if="q.type=='radio' || q.type=='checkbox'")
            q-options(placeholder="请输入选项内容", v-model="q.value")
          //- el-form-item(label="最多可选", :label-width="formLabelWidth",v-if="q.type=='sort'")
            //- el-input-number( v-model="position.count", controls-position="right", :min="1", v-model.number="q.max", :max="q.value.length", placeholder="最多选择数")
          hr
        el-button.manage-q-add(@click="addData()") + 增加问题
    .dialog-waring-msg(v-if="showFor==='parttime'") 问卷在提交后无法再修改
    div(slot="footer", class="dialog-footer")
      el-button(@click="EditDialogVisible = false") 取 消
      el-button(type="primary", @click="EditPosition()") 确认提交

  el-dialog(title="删除校内岗", :visible.sync="deleteDialogVisible", width="400px")
    el-form(:model="form")
      div 岗位名称：{{position.title}}
      div 岗位编号：{{position.number}}
      el-form-item(label="管理员密码二次确认")
        el-input(v-model="form.password", autocomplete="off", show-password)
    div(slot="footer", class="dialog-footer")
      el-button(@click="deleteDialogVisible = false") 取 消
      el-button(type="primary", @click="doDelete()") 确 认 提 交

  el-dialog(title="继续招募-请选择结束时间", :visible.sync="endtimeDialogVisible", width="500px")
    el-form(:model="form")
      div 岗位名称：{{position.title}}
      div 岗位编号：{{position.number}}
      el-form-item(label="截止日期")
        el-date-picker(type="date",placeholder="选择日期", v-model="endtime", value-format="timestamp")
    div(slot="footer", class="dialog-footer")
      el-button(@click="endtimeDialogVisible = false") 取 消
      el-button(type="primary", @click="statusSubmit()") 确 认 提 交
</template>

<script>
import constant from '../constant'
import qOptions from './ManageOptions'
import questions from '../components/Question'

let filterGrade = constant.grade.getFilter()
let filterSex = constant.sex.getFilter()

export default {
  components: {qOptions, questions},
  inject: ['reload'],
  props: {
    showFor: String
  },
  data () {
    return {
      currentPage: 1,
      pagesize: 8,
      EditDialogVisible: false,
      showDialogVisible: false,
      deleteDialogVisible: false,
      modifyDialogVisible: false,
      endtimeDialogVisible: false,
      DetailDialogVisible: false,
      stop: false,
      activeId: '',
      canEdit: false,
      form: {
        name: '',
        region: '',
        password: ''
      },
      formLabelWidth: '90px',
      tableData: [],
      position: {
        dateArr1: [],
        skillArr1: [],
        timeArr1: [],
        belongArr1: []
      },
      endtime: 0,
      newQ: {
        data: []
      },
      activeQ: {},
      options: [],
      defaultParams: {
        label: 'name',
        value: 'id',
        children: 'data'
      },
      loading: true,
      positionDetail: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$http.get(`/api.php/admin/joblist?type=${this.showFor}`).then(res => {
        this.loading = false
        this.tableData = res.data.data
      })
    },
    Edit () {
      this.$http.get(`api.php/admin/deplist`).then(res => {
        this.options = res.data.data
        this.position = this.json2O(this.position)
        this.DetailDialogVisible = false
        this.EditDialogVisible = true
      })
    },
    EditPosition () {
      if (this.showFor === 'school' && !this.position.id) {
        if (!this.position.belongArr1[1]) {
          this.$message.warning('请正确选择所属部门')
        }
        this.submitPosition()
      } else {
        this.submitPosition()
      }
    },
    submitPosition () {
      this.$http.post(`/api.php/admin/${this.showFor}`, this.object2J(this.position)).then(res => {
        if (this.showFor === 'parttime') {
          if (res.data.errno === 0) {
            if (!this.newQ.id) {
              this.newQ.id = res.data.data
            }
            let q = this.newQ
            q.starttime = this.position.dateArr1[0] / 1000
            q.endtime = this.position.dateArr1[1] / 1000
            q.summary = this.position.content1
            q.title = this.position.title1
            q.data = JSON.stringify(this.newQ.data)
            this.$http.post(`/api.php/admin/form`, q).then(res => {
              if (res.data.errno === 0) {
                this.$message.success('提交成功')
                this.EditDialogVisible = false
                this.position = {}
                this.newQ = {}
                this.reload()
              }
            })
          }
        } else if (this.showFor === 'school') {
          if (res.data.errno === 0) {
            this.EditDialogVisible = false
            this.position = {}
            this.reload()
            this.$message.success('提交成功')
          }
        }
      }).catch(() => {
        this.EditDialogVisible = false
      })
    },
    AddPosition () {
      this.position = {
        dateArr1: [],
        skillArr1: [],
        timeArr1: [],
        belongArr1: []
      }
      this.newQ = {
        data: []
      }
      if (this.showFor === 'school') {
        this.$http.get(`api.php/admin/deplist`).then(res => {
          this.options = res.data.data
          this.EditDialogVisible = true
        })
      } else {
        this.EditDialogVisible = true
      }
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    handleTop (row) {
      this.$http.get(`/api.php/admin/top?id=${row.id}`).then(res => {
        this.reload()
        if (res.data.errno === 0) {
          this.$message.success('岗位置顶成功')
        }
      })
    },
    showDetails (row) {
      this.$http.get(`/api.php/admin/detail?id=${row.id}`).then(res => {
        if (res.data.errno === 0) {
          this.position = res.data.data
          let p = res.data.data
          p.data = JSON.parse(p.data)
          p.content = p.data[0]
          p.require = p.data[1]
          p.sex = p.data[2]
          p.skill = JSON.parse(p.skill)
          p.time = JSON.parse(p.time)
          p.fgrade = filterGrade(p.grade)
          p.fsex = filterSex(p.sex)
          this.positionDetail = p
          if (this.showFor === 'school') {
            this.DetailDialogVisible = true
          }
        }
      })
      if (this.showFor === 'parttime') {
        this.$http.get(`/api.php/admin/formdetail?id=${row.form_id}`).then(res => {
          this.DetailDialogVisible = true
          this.activeQ = res.data.data
          this.activeQ.id = row.form_id
          this.activeQ.title = row.title
          this.activeQ.data = JSON.parse(this.activeQ.data)
          this.newQ = this.activeQ
        })
      }
    },
    handleDelete (row) {
      this.position = row
      this.activeId = row.id
      this.deleteDialogVisible = true
    },
    doDelete () {
      this.$http.post(`/api.php/admin/deljob`, {
        id: this.activeId,
        password: this.form.password
      }).then(res => {
        if (res.data.errno === 0) {
          this.$message('操作成功')
          this.deleteDialogVisible = false
          this.reload()
        }
      })
    },
    exportMessage (row) {
      // this.$http.get(`/api.php/admin/jobexcel?type=${this.showFor}`).then(res => {
      //   window.open(`https://qin.twtstudio.com${res.data.data}`)
      // })
      window.location = `https://qin.twtstudio.com/api.php/admin/parttimearchive?id=${row.id}`
    },
    modifyPosition () {
      this.showDialogVisible = false
      this.modifyDialogVisible = true
    },
    toggleStatus (position) {
      this.position = position
      this.activeId = position.id
      this.endtime = position.endtime * 1000
      if (position.status === '正在招募') {
        let end = Date.parse(new Date()) / 1000 + 100
        this.$http.post(`/api.php/admin/jobstatus`, {
          id: position.id,
          endtime: end
        }).then(res => {
          if (res.data.errno === 0) {
            this.$message.success('操作成功')
            this.reload()
          }
        })
      } else {
        this.endtimeDialogVisible = true
      }
    },
    statusSubmit () {
      this.$http.post(`/api.php/admin/jobstatus`, {
        id: this.activeId,
        endtime: this.endtime / 1000
      }).then(res => {
        if (res.data.errno === 0) {
          this.$message.success('操作成功')
          this.reload()
        }
      })
    },
    object2J (p) {
      let pos = {}
      let a = []
      pos.title = p.title1
      pos.number = p.number1
      if (this.showFor === 'school') {
        pos.belong_to = p.belongArr1[1]
        a[3] = p.belongArr1[0]
      }
      if (p.id) {
        pos.id = p.id
      }
      pos.count = p.count1
      pos.start = p.dateArr1[0] / 1000
      pos.end = p.dateArr1[1] / 1000
      pos.salary = p.salary1
      a[2] = p.sex1
      pos.grade = p.grade1
      pos.skill = JSON.stringify(p.skillArr1)
      pos.time = JSON.stringify(p.timeArr1)
      a[0] = p.content1
      a[1] = p.require1
      pos.data = JSON.stringify(a)
      return pos
    },
    json2O (p) {
      let pos = {
        dateArr1: [],
        skillArr1: [],
        timeArr1: [],
        belongArr1: []
      }
      pos.id = p.id
      pos.data = p.data
      pos.title1 = p.title
      pos.number1 = p.number
      pos.count1 = p.count
      pos.dateArr1[0] = p.start_time * 1000
      pos.dateArr1[1] = p.end_time * 1000
      pos.salary1 = p.salary
      pos.grade1 = p.grade
      pos.content1 = pos.data[0]
      pos.require1 = pos.data[1]
      pos.sex1 = pos.data[2]
      pos.skillArr1 = p.skill
      pos.timeArr1 = p.time
      if (pos.data[3]) {
        pos.belongArr1[0] = pos.data[3]
        pos.belongArr1[1] = p.belong_to_id
      }
      return pos
    },
    stamp2D (d) {
      var date = new Date(d * 1000)
      var Y = date.getFullYear(0) + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate()
      return Y + M + D
    },
    addData () {
      const b = this.newQ
      if (!b.data) b.$set('data', [])
      b.data.push({title: '', type: 'input', value: [], required: true})
    }
  }
}
</script>
