<style>
.managerights-add-button {
  margin: 13px;
}
.dialog-label {
  font-size: 18px;
  margin: 10px 0;
}
.dialog-message {
  font-size: 16px;
  margin: 10px 0;
}
.table {
  width: 700px;
  margin: 0 auto;
}
</style>

<template lang="pug">
.card-container
  .card-header
    .card-title 权限管理
  .card-body(v-loading="loading")
    .block-need-right
      el-pagination(@current-change="handleCurrentChange",
                  :current-page="currentPage",
                  layout="prev, pager, next",
                  :total="tableData.length",
                  :page-size="pagesize")
    el-table.table(:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)", border)
      el-table-column(align="center", prop="username", label="用户名", width="300")
      el-table-column(align="center", prop="role", label="权限", width="200")
      el-table-column(align="center", label="操作")
        template(slot-scope="scope")
          el-button(type="text", @click="handleEdit(scope.row)") 修改
          el-button(type="text", @click="handleDele(scope.row)") 删除
    .block-need-right
      el-button.managerights-add-button(type="primary", @click="AddAd()") 添加管理员

  el-dialog(title="添加管理员", :visible.sync="AddDialogVisible", width="550px")
    el-form(:model="newAdmin")
      el-form-item(label="用户名", :label-width="formLabelWidth")
        el-input(v-model="newAdmin.username", autocomplete="off")
      el-form-item(label="权限", :label-width="formLabelWidth")
        el-select(v-model="newAdmin.role", placeholder="--未选择--")
          //- el-option(label="超级管理员", value="1")
          el-option(label="基地管理员", value="2")
          el-option(label="面试官", value="3")
      el-form-item(v-if="newAdmin.role === '2'", label="所属基地", :label-width="formLabelWidth")
        el-select(v-model="newAdmin.base", placeholder="--未选择--")
          el-option(v-for="(i,index) in options", :label="i.name", :value="i.id", :key="index")
      el-form-item(show-password, label="密码", :label-width="formLabelWidth",)
        el-input(show-password, v-model="newAdmin.password", autocomplete="off")
      el-form-item(show-password, label="管理员密码二次确认", :label-width="formLabelWidth")
        el-input(show-password, v-model="newAdmin.adminPass", autocomplete="off", placeholder="输入您的密码进行确认")
    div(slot="footer", class="dialog-footer")
      el-button(@click="AddDialogVisible = false") 取消
      el-button(type="primary", @click="AddAdmin()") 确 定

  el-dialog(title="编辑管理员", :visible.sync="showDialogVisible", width="450px")
    el-form(:model="activeAdmin")
      el-form-item(label="用户名", :label-width="formLabelWidth")
        el-input(v-model="activeAdmin.username", autocomplete="off")
      el-form-item(label="重置密码", :label-width="formLabelWidth")
        el-input(show-password, v-model="activeAdmin.password", autocomplete="off", placeholder="无需修改请留空")
      el-form-item(label="管理员密码二次确认", :label-width="formLabelWidth")
        el-input(show-password, v-model="activeAdmin.adminPass", autocomplete="off", placeholder="输入您的密码进行确认")
    div(slot="footer", class="dialog-footer")
      el-button(@click="showDialogVisible = false") 取消
      el-button(type="primary", @click="EditAdmin()") 确 定

  el-dialog(title="删除管理员", :visible.sync="deleteDialogVisible", width="400px")
    el-form(:model="activeAdmin")
      .dialog-label 管理员信息
      .dialog-message 用户：{{activeAdmin.username}}
      .dialog-message 权限：{{activeAdmin.role}}
      el-form-item(label="管理员密码二次确认", :label-width="formLabelWidth")
        el-input(show-password, v-model="activeAdmin.adminPass", autocomplete="off", placeholder="输入您的密码进行确认")
    div(slot="footer", class="dialog-footer")
      el-button(@click="deleteDialogVisible = false") 取消
      el-button(type="primary", @click="DeleteAdmin()") 删 除
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      pagesize: 6,
      // data: this.tableData.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize),
      AddDialogVisible: false,
      showDialogVisible: false,
      deleteDialogVisible: false,
      newAdmin: {},
      activeAdmin: {},
      formLabelWidth: '140px',
      tableData: [],
      options: [],
      loading: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    handleEdit (row) {
      this.showDialogVisible = true
      this.activeAdmin = row
    },
    handleDele (row) {
      this.deleteDialogVisible = true
      this.activeAdmin = row
    },
    DeleteAdmin () {
      this.$http.post(`/api.php/admin/deladmin?id=${this.activeAdmin.id}`, {
        password: this.activeAdmin.adminPass
      }).then(res => {
        if (res.data.errno === 0) {
          this.reload()
          this.$message({
            showClose: true,
            message: res.data.errmsg,
            customClass: 'zZindex',
            type: 'success'
          })
        }
      })
      this.deleteDialogVisible = false
    },

    AddAdmin () {
      this.$http.post(`/api.php/admin/addrole`, {
        username: this.newAdmin.username,
        password: this.newAdmin.password,
        role: this.newAdmin.role,
        base: this.newAdmin.base || 0,
        adminPass: this.newAdmin.adminPass
      }).then(res => {
        if (res.data.errno === 0) {
          this.AddDialogVisible = false
          this.$message({
            showClose: true,
            message: res.data.errmsg,
            customClass: 'zZindex',
            type: 'success'
          })
          this.fetchData()
          this.newAdmin = {}
        } else {
          this.newAdmin.password = ''
          this.newAdmin.adminPass = ''
        }
      }).catch(() => {
        this.newAdmin.adminPass = ''
      })
    },
    EditAdmin () {
      this.$http.post(`/api.php/admin/changepassword?id=${this.activeAdmin.id}`, {
        id: this.activeAdmin.id,
        username: this.activeAdmin.username,
        password: this.activeAdmin.adminPass,
        newPassword: this.activeAdmin.password
      }).then(res => {
        if (res.data.errno === 0) {
          this.$message({
            showClose: true,
            message: res.data.errmsg,
            customClass: 'zZindex',
            type: 'success'
          })
          this.showDialogVisible = false
          this.fetchData()
        }
      })
    },
    fetchData () {
      this.$http.get(`/api.php/admin/adminlist`).then(res => {
        this.tableData = res.data.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    AddAd () {
      var loading = this.$loading()
      this.$http.get(`api.php/admin/baselist`).then(res => {
        loading.close()
        this.options = res.data.data
        this.AddDialogVisible = true
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
