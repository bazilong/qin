<style>
.manage-applicant-search {
  margin: 20px 16px;
}
.manage-applicant-input {
  display: inline-block;
  width: 500px;
  vertical-align: top;
  margin-right: 20px;
  width: 465px;
}
.manage-applicant-select {
  width: 100px;
}
.manage-card-body {
  margin: 10px 12px 20px;
}
.manageapp-return-button {
  font-size: 16px;
  margin: 0 20px;
}
.manage-selector {
  display: inline-block;
  margin-left:15px;
  margin-bottom: 8px;
}
.manage-pagination {
  float: right;
}
.table {
  width: 700px;
  margin: 0 auto;
}
</style>

<template lang="pug">
.card-container
  .card-header
    .card-title 报名者管理
  .card-body(v-loading="loading")
    .manage-applicant-search
      .manage-applicant-input
        el-input(placeholder="请输入学号", v-model="searchInput", @keyup.native.enter="find()")
      el-button(type="primary", icon="el-icon-search", @click="find()") 查找报名者
    div
      div.manage-selector
        el-select(v-model="form_id", placeholder="--未选择--")
          el-option(label="全部", value="")
          el-option(v-if="$root.a.role==='1'",label="人才库", value="-1")
          el-option-group(label="问卷")
            el-option(v-for="(i,index) in options", :label="i.title", :value="i.id", :key="index")
        el-button(style="margin-left: 5px", @click="check(1)") 查看
    div(v-show="oneTable")
      el-pagination.manage-pagination(@current-change="handleCurrentChange",
                    :current-page="currentPage",
                    layout="prev, pager, next",
                    :total="tableData.length",
                    :page-size="pagesize")
      el-table.table(:data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)", border)
        el-table-column(align="center", prop="student_id", label="学号", width="130")
        el-table-column(align="center", prop="username", label="用户名", width="200")
        el-table-column(align="center", prop="is_poor", label="贫困生", width="200")
        el-table-column(align="center", prop="status", label="状态")
        el-table-column(align="center", label="操作")
          template(slot-scope="scope")
            el-button(type="text", @click="goDetail(scope.row.id)") 查看详情
      .block-need-right(v-show="tableData.length!==0")
        el-button.managerights-add-button(type="primary", @click="exportMessage(0)") 导出
        el-button.managerights-add-button(type="primary", @click="exportImage(0)") 报名者照片
    div(v-show="!oneTable")
      h4 未处理
      el-pagination.manage-pagination(@current-change="handleCurrentChange1",
                    :current-page="currentPage1",
                    layout="prev, pager, next",
                    :total="tableData.length",
                    :page-size="pagesize")
      el-table.table(:data="tableData.slice((currentPage1-1)*pagesize,currentPage1*pagesize)", border)
        el-table-column(align="center", prop="student_id", label="学号", width="100")
        el-table-column(align="center", prop="username", label="用户名", width="80")
        el-table-column(align="center", prop="is_poor", label="贫困生", width="60")
        el-table-column(align="center", prop="first", label="第一志愿", width="105")
        el-table-column(align="center", prop="second", label="第二志愿", width="105")
        el-table-column(align="center", prop="third", label="第三志愿", width="105")
        el-table-column(align="center", prop="status", label="状态",width="50")
        el-table-column(align="center", label="操作")
          template(slot-scope="scope")
            el-button(type="text", @click="goDetail(scope.row.id)") 查看详情
      .block-need-right(v-show="tableData.length!==0")
        el-button.managerights-add-button(type="primary", @click="exportMessage(1)") 导出
        el-button.managerights-add-button(type="primary", @click="exportImage(1)") 报名者照片
      h4 已处理
      el-pagination.manage-pagination(@current-change="handleCurrentChange",
                    :current-page="currentPage",
                    layout="prev, pager, next",
                    :total="tableData1.length",
                    :page-size="pagesize")
      el-table.table(:data="tableData1.slice((currentPage-1)*pagesize,currentPage*pagesize)", border)
        el-table-column(align="center", prop="student_id", label="学号", width="100")
        el-table-column(align="center", prop="username", label="用户名", width="80")
        el-table-column(align="center", prop="is_poor", label="贫困生", width="60")
        el-table-column(align="center", prop="first", label="第一志愿", width="105")
        el-table-column(align="center", prop="second", label="第二志愿", width="105")
        el-table-column(align="center", prop="third", label="第三志愿", width="105")
        el-table-column(align="center", prop="status", label="状态",width="50")
        el-table-column(align="center", label="操作")
          template(slot-scope="scope")
            el-button(type="text", @click="goDetail(scope.row.id)") 查看详情
      .block-need-right(v-show="tableData1.length!==0")
        el-button.managerights-add-button(type="primary", @click="exportMessage(2)") 导出
        el-button.managerights-add-button(type="primary", @click="exportImage(2)") 报名者照片
</template>

<script>
export default {
  data () {
    return {
      select: '',
      searchInput: '',
      currentPage: parseInt(window.localStorage.currentPage) || 1,
      currentPage1: parseInt(window.localStorage.currentPage1) || 1,
      pagesize: 6,
      moveDialogVisible: false,
      showMessage: false,
      form: {
        base: '',
        status: ''
      },
      tableData: [],
      tableData1: [],
      loading: true,
      options: [],
      form_id: window.localStorage.form_id || '',
      oneTable: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$http.get(`/api.php/admin/schoolform`).then(res => {
        if (res.data.errno === 0) {
          this.options = res.data.data
        }
      })
      this.check()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    },
    handleCurrentChange1 (currentPage) {
      this.currentPage = currentPage
    },
    exportMessage (a) {
      let data
      if (a === 0 || a === 1) {
        data = this.tableData
      } else {
        data = this.tableData1
      }
      this.$http({
        url: '/api.php/admin/userexcel',
        method: 'post',
        data: {
          data: JSON.stringify(data)
        },
        responseType: 'blob'
      }).then(res => {
        this.$message.success('正在导出报名者excel文件')
        var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'}) // application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
        var filename
        var title
        if (this.form_id === '') {
          title = '全部'
        } else if (this.form_id === '-1') {
          title = '人才库'
        } else {
          var i = this.options.findIndex(item => item.id === this.form_id)
          title = this.options[i].title
        }
        if (a === 0) {
          filename = `${title}.xlsx`
        } else if (a === 1) {
          filename = `${title}-未处理.xlsx`
        } else {
          filename = `${title}-已处理.xlsx`
        }
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.style.display = 'none'
        downloadElement.href = href
        downloadElement.download = decodeURI(filename) // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    },
    find () {
      if (!this.searchInput) {
        this.$message.warning('请输入学号')
      } else {
        let index = this.tableData.findIndex(this.search)
        if (index !== -1) {
          let id = this.tableData[index].id
          this.goDetail(id)
        } else {
          this.$message.error('查找的报名者不存在')
        }
      }
    },
    goDetail (id) {
      window.localStorage.currentPage1 = Number(this.currentPage1)
      window.localStorage.currentPage = Number(this.currentPage)
      window.localStorage.form_id = this.form_id
      this.$router.push(`applicant/${id}`)
    },
    search (obj, objIndex, objs) {
      return obj.student_id === this.searchInput
    },
    exportImage (a) {
      let stu = []
      let arr = []
      if (a === 0 || a === 1) {
        stu = this.tableData
      } else {
        stu = this.tableData1
      }
      for (let i in stu) {
        arr.push(stu[i].id)
      }
      this.$http({
        url: '/api.php/admin/cardarchive',
        method: 'post',
        data: {
          id: arr
        },
        responseType: 'blob'
      }).then(res => {
        var blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8'}) // application/vnd.openxmlformats-officedocument.wordprocessingml.document这里表示doc类型
        var filename
        var title
        if (this.form_id === '') {
          title = '全部'
        } else if (this.form_id === '-1') {
          title = '人才库'
        } else {
          var i = this.options.findIndex(item => item.id === this.form_id)
          title = this.options[i].title
        }
        if (a === 0) {
          filename = `${title}.zip`
        } else if (a === 1) {
          filename = `${title}-未处理.zip`
        } else {
          filename = `${title}-已处理.zip`
        }
        var downloadElement = document.createElement('a')
        var href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.style.display = 'none'
        downloadElement.href = href
        downloadElement.download = decodeURI(filename) // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    },
    check (data) {
      if (data === 1) {
        this.currentPage = 1
        this.currentPage1 = 1
      }
      if (this.form_id !== '-1' && this.form_id) {
        this.oneTable = false
      } else {
        this.oneTable = true
      }
      if (this.form_id === '-1') {
        this.$http.get(`/api.php/admin/talent`).then(res => {
          if (res.data.errno === 0) {
            this.tableData = res.data.data
            this.loading = false
          }
        }).catch(() => {
          this.loading = false
        })
      } else if (!this.form_id) {
        this.$http.get(`/api.php/admin/userlist`).then(res => {
          if (res.data.errno === 0) {
            this.tableData = res.data.data
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.$http.get(`/api.php/admin/diflist?form=${this.form_id}`).then(res => {
          if (res.data.errno === 0) {
            this.tableData = res.data.data.unhandled
            this.tableData1 = res.data.data.handled
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
