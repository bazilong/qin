<style>
.app-header-container {
  top: 0;
  width:100%;
  background-color: #fff;
  position: fixed;
  z-index: 9;
  box-shadow: 0 2px 6px rgba(173, 172, 172, 0.363);
}
.app-header-box {
  margin: 0 auto;
  width: 900px;
}
.app-header-title {
  font-size: 20px;
  display: inline-block;
  vertical-align: top;
}
.app-main-container {
  background-color: #EFF3F5;
  margin: 0 auto;
  padding: 70px 0;
  min-height: calc(105vh - 100px);
}
.app-manage-container {
  width: 1000px;
  margin: 0 auto;
}
.app-manage-menu {
  text-align: center;
  padding: 30px 0;
  width: 180px;
  margin-right: 5px;
  display: inline-block;
  vertical-align: top;
}
.app-manage-body {
  display: inline-block;
  width: 815px;
  vertical-align: top;
}
.app-menu-container {
  height:100%;
  bottom:0px;
}
.header-item {
  font-size: 16px;
  padding: 4px 20px 1px;
  display: inline-block;
  color: #000;
  cursor: pointer;
  text-align: center;
  line-height: 55px;
}
.twt--header-user {
  display: inline-block;
  font-size: 16px;
  margin-bottom: 0;
}
.active, .header-item:hover, .header-item:active {
  color: #00a1e9;
}
.logo{
  width:65px;
  height:60px;
  display: inline-block;
  vertical-align: top;
}
.logo-container {
  cursor: pointer;
}
.header-admin{
  display: inline-block;
  margin-top: auto;
  margin-bottom: auto;
}
.header-admininfo {
  display: inline-block;
  margin-right: 20px;
}
/* .active {
  border-bottom: 2px solid #00a0e9;
} */
</style>

<template lang="pug">
div
  .app-header-container
    el-row.app-header-box(type="flex", justify="space-between")
      div.logo-container(@click="$router.push(`/`)")
        img.logo(src="/static/logo.png")
        h2.app-header-title 勤工助学岗招募中心
      div(v-show="!$root.manage")
        router-link(to="/", exact, tag="li", class="header-item") 校内岗位
        router-link(to="/parttime", tag="li", class="header-item") 兼职岗位
        router-link(to="/help", tag="li", class="header-item") 帮助信息
        router-link(to="/mine", tag="li", class="header-item") 我的岗位
      template(v-if="!$root.manage")
        el-button(type="text", @click="userLogin()" v-if="!user.id") 登录
        template(v-else)
          el-button(type="text")
            router-link(to="/mine") {{user.realname}}
          el-button(type="text", @click="userLogout()") 登出
      .header-admin(v-if="$root.managePage")
        .header-admininfo {{$root.a.adminname}} - {{$root.a.admininfo}}
        el-button(type="text", @click="$root.adminLogout()") 退出
  .app-main-container(ref="element")
    //- transition(name="el-zoom-in-center")
    router-view(v-if="isRouterAlive")
  app-footer
</template>

<script>
import appFooter from './components/Footer'

export default {
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {
    appFooter
  },
  data () {
    return {
      showMloginDialog: false,
      mLogin: {
        username: '',
        password: ''
      },
      formLabelWidth: '100px',
      isRouterAlive: true,
      user: {}
    }
  },
  watch: {
    $route: {
      handler (val, oldVal) {
        this.$root.managePage = !((val.path).indexOf('managepage') === -1)
        this.$root.manage = !((val.path).indexOf('manage') === -1)
      },
      immediate: true
    }

  },
  created () {
    let that = this
    if (!this.$root.manage) {
      this.$http.get(`api.php/user/status`).then(response => {
        that.user = response.data.data
        if (that.user.token !== localStorage.getItem('token')) {
          that.$message.warning('状态异常，请刷新')
        }
        localStorage.setItem('token', that.user.token)
      })
    } else if (this.$root.manage && this.$root.managePage) {
      this.$root.fetchAdmin()
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    checkRouterLocal (path) {
      this.navIndex = this.nav.findIndex(item => item.path === path)
    },
    userLogin () {
      window.location = `/api.php/user/login?redirect=${encodeURIComponent(window.location.pathname)}`
    },
    userLogout () {
      this.$http.post(`api.php/user/logout`)
        .then(res => {
          if (res.data.errno === 0) {
            this.$message.success('登出成功')
            window.location.reload()
          }
        })
    }
  }
}
</script>
