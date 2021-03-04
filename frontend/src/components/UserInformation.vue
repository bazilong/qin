<style>
  .change-box{
    margin-top : 10px;
  }
  .change-box p{
    color:#f0ad4e!important;
  }
  .card{
    font-size:15px;
    float:none;
  }
  .input-box{
    margin:10px;
    padding:5px;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: .25rem;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  }
</style>

<template lang="pug">
  .change-box
    p 个人信息每 180 天允许修改一次，请谨慎修改。
    label(class="card") 学院 :
      input.input-box(type="text", v-model="edit.college" style="margin-top:5px")
    br
    label(class="card") 专业 :
      input.input-box(type="text", v-model="edit.major" style="margin-bottom:22px")
    br
    el-button(@click="submit" style="color:#00a0e9") 提交
    el-button(@click="$emit('hide')") 取消
</template>

<script>
  export default {
    props: ['user'],
    data () {
      return {
        edit: {
          college: this.user.college,
          major: this.user.major
        }
      }
    },
    watch: {
      user: 'watcher'
    },
    created () {
      this.watcher()
    },
    methods: {
      watcher () {
        this.edit.college = this.user.college
        this.edit.major = this.user.major
      },
      submit () {
        if (!this.edit.college || !this.edit.major) {
          return null
        }
        this.$http.post(`api.php/user/major`, {
          college: this.edit.college,
          major: this.edit.major
        }).then(response => {
          if (response.data.errno === 0) {
            this.$message.success('修改成功')
            window.location.reload()
          }
        })
      }
    }
  }
</script>
