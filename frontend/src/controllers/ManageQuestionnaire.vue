<style>
.dialog-waring-msg {
  padding: 22px;
  color: red;
}
.manage-q-add{
  margin-left: 20px;
}
</style>

<template lang="pug">
.card-container
  .card-header
    .card-title  校内岗问卷管理
  .card-body(v-loading="loading")
    .block-need-right
      el-pagination(@current-change="handleCurrentChange",
                  :current-page="currentPage",
                  layout="prev, pager, next",
                  :total="tableData.length",
                  :page-size="pagesize")
    el-table(:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)", border)
      el-table-column(align="center", prop="title", label="问卷名称")
      el-table-column(align="center", prop="starttime", label="开始时间", width="90")
      el-table-column(align="center", prop="endtime", label="结束时间", width="90")
      el-table-column(align="center", prop="status", label="状态", width="100")
      el-table-column(align="center", label="操作", width="200")
        template(slot-scope="scope")
          el-button(type="text", @click="showDetail(scope.row)") 查看详情
          //- el-button(type="text", @click="toTop(scope.row)") 置顶
          //el-button(type="text", @click="deleteQ(scope.row)") 删除
          el-button(type="text", @click="toggleStatus(scope.row)") {{scope.row.status=='开始'? '停止问卷':'继续问卷'}}
    .block-need-right
      el-button.managerights-add-button(type="primary", @click="AddDialogVisible = true") 添加问卷

    el-dialog(title="新建问卷", :visible.sync="AddDialogVisible",width="600px")
      el-form(:model="newQ")
        el-form-item(label="问卷名称", :label-width="formLabelWidth")
          el-input(v-model="newQ.title", autocomplete="off", clearable)
        el-form-item(label="起止日期", :label-width="formLabelWidth")
          el-date-picker(v-model="newQ.date", type="daterange", range-separator="至", start-placeholder="开始日期", end-placeholder="结束日期", value-format="timestamp")
        el-form-item(label="问卷简介", :label-width="formLabelWidth")
          el-input(type="textarea", :rows="2", v-model="newQ.summary", autocomplete="off")
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
          //-   el-input-number( v-model="position.count", controls-position="right", :min="1", v-model.number="q.max", :max="q.value.length", placeholder="最多选择数")
          hr
        el-button.manage-q-add(@click="addData()") + 增加问题
      .dialog-waring-msg 问卷在提交后将无法再修改
      div(slot="footer", class="dialog-footer")
        el-button(@click="AddDialogVisible = false") 取 消
        el-button(type="primary", @click="Submit()") 确认提交

    el-dialog(title="问卷详情", :visible.sync="detailDialogVisible",width="600px")
      h3.manage-q-h3 {{activeQ.title}}
      .manage-q-msg 开始时间：{{stamp2D(activeQ.starttime)}}
      .manage-q-msg 截止时间：{{stamp2D(activeQ.endtime)}}
      hr
      questions(:canSubmit="false", :activeQ="activeQ")
      div(slot="footer", class="dialog-footer")
        el-button(@click="detailDialogVisible = false", type="primary") 确 认

    el-dialog(title="删除问卷", :visible.sync="deleteDialogVisible", width="400px")
      el-form(:model="form")
        div 问卷名称：{{form.title}}
        el-form-item(label="管理员密码二次确认")
          el-input(v-model="form.password", autocomplete="off", show-password)
      div(slot="footer", class="dialog-footer")
        el-button(@click="deleteDialogVisible = false") 取 消
        el-button(type="primary", @click="doDelete()") 确 认 提 交

    el-dialog(title="问卷继续-请选择结束时间", :visible.sync="endtimeDialogVisible", width="500px")
      el-form(:model="activeQ")
        div 岗位名称：{{activeQ.title}}
        el-form-item(label="截止日期")
          el-date-picker(type="date",placeholder="选择日期", v-model="endtime", value-format="timestamp")
      div(slot="footer", class="dialog-footer")
        el-button(@click="endtimeDialogVisible = false") 取 消
        el-button(type="primary", @click="statusSubmit(activeQ.id)") 确 认 提 交
</template>

<script>
import qOptions from '../components/ManageOptions'
import questions from '../components/Question'

export default {
  components: {qOptions, questions},
  inject: ['reload'],
  data () {
    return {
      currentPage: 1,
      tableData: [],
      pagesize: 8,
      formLabelWidth: '90px',
      detailDialogVisible: false,
      deleteDialogVisible: false,
      AddDialogVisible: false,
      endtimeDialogVisible: false,
      newQ: {
        data: []
      },
      form: {},
      activeQ: {},
      endtime: 0,
      loading: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$http.get(`/api.php/admin/formlist`).then(res => {
        this.loading = false
        this.tableData = res.data.data
      })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    showDetail (q) {
      let id = q.id
      this.$http.get(`/api.php/admin/formdetail?id=${id}`).then(res => {
        this.detailDialogVisible = true
        this.activeQ = res.data.data
        this.activeQ.data = JSON.parse(this.activeQ.data)
      })
    },
    toggleStatus (q) {
      let id = q.id
      this.activeQ = q
      this.endtime = q.endtime * 1000
      if (q.status === '开始') {
        this.$http.get(`/api.php/admin/formstatus?id=${id}`).then(res => {
          if (res.data.errno === 0) {
            this.reload()
            this.$message.success('操作成功')
          }
        })
      } else {
        this.endtimeDialogVisible = true
      }
    },
    statusSubmit (id) {
      this.$http.post(`/api.php/admin/formtime`, {
        endtime: this.endtime / 1000,
        id: id
      }).then(res => {
        this.$http.get(`/api.php/admin/formstatus?id=${id}`).then(res => {
          if (res.data.errno === 0) {
            this.$message.success(res.data.errmsg)
            this.reload()
          }
          this.endtimeDialogVisible = false
        })
      })
    },
    deleteQ (q) {
      this.form.id = q.id
      this.form.title = q.title
      this.deleteDialogVisible = true
    },
    doDelete () {
      this.$http.post(`/api.php/admin/delform`, this.form).then(res => {
        this.deleteDialogVisible = false
        if (res.data.errno === 0) {
          this.reload()
          this.$message(res.data.errmsg)
        }
      })
    },
    Submit () {
      let q = this.newQ
      q.starttime = q.date[0] / 1000
      q.endtime = q.date[1] / 1000
      q.data = JSON.stringify(q.data)
      this.$http.post(`/api.php/admin/form`, q).then(res => {
        this.AddDialogVisible = false
        if (res.data.errno === 0) {
          this.reload()
          this.$message.success('操作成功')
        }
      })
    },
    addData () {
      const a = this.newQ
      if (!a.data) a.$set('data', [])
      a.data.push({title: '', type: 'input', value: [], required: true})
    },
    stamp2D (d) {
      var date = new Date(d * 1000)
      var Y = date.getFullYear(0) + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate()
      return Y + M + D
    }
  }
}
</script>
