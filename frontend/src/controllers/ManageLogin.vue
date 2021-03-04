<style>
.mlogin-card {
  width: 600px;
  margin: 10px auto;
}
.mlogin-card-header {
  padding: 20px 30px 0;
}
.mlogin-label-container {
  margin: 20px;
}
.mlogin-label {
  display: inline-block;
  font-size: 16px;
  width: 100px;
  text-align: right;
}
.mlogin-input {
  display: inline-block;
  width: 300px;
  font-size: 16px;
}
.mlogin-button {
  padding: 8px 30px;
  font-size: 14px;
}
</style>

<template lang="pug">
.body-container
  .card-container.mlogin-card
    .card-header.mlogin-card-header
      .card-title 管理员登录
    .card-body
      .mlogin-label-container
        .mlogin-label 用户名：
        el-input.mlogin-input(v-model="username", @keyup.enter.native="$root.adminLogin(username, password)")
      .mlogin-label-container
        .mlogin-label 密码：
        el-input.mlogin-input(v-model="password", show-password, @keyup.enter.native="$root.adminLogin(username, password)")
      .block-need-right
        el-button.mlogin-button(type="primary", @click="$root.adminLogin(username, password)") 登 录
</template>

<script>
export default {
  data () {
    return {
      username: window.localStorage.username || '',
      password: ''
    }
  },
  mounted () {
    window.localStorage.mUserName = this.username
  }
}
</script>
