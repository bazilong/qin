<style>
.app-manage-menu {
  text-align: center;
  padding: 30px 0;
  width: 180px;
  margin-right: 5px;
  display: inline-block;
  vertical-align: top;
}
.app-manage-item {
  font-size: 18px;
  margin: 8px 0;
  display: block;
  color: #000;
  cursor: pointer;
}
.active, .app-manage-item:hover, .app-manage-item:active {
  color: #00a1e9;
  border-bottom: none;
}
.app-menu-container {
  height:100%;
  bottom:0px;
}
</style>

<template lang="pug">
.app-manage-container
  .app-manage-menu.card-container(:span="5")
    router-link(v-if="$root.a.role === '1'", to="/managepage/rights", tag="li", class="app-manage-item") 权限管理
    router-link(to="/managepage/applicant", tag="li", class="app-manage-item") 报名者管理
    router-link(to="/managepage/school", tag="li", class="app-manage-item") 校内岗管理
    router-link(v-if="$root.a.role === '1'", to="/managepage/questionnaire", tag="li", class="app-manage-item") 校内岗问卷管理
    router-link(v-if="$root.a.role === '1'", to="/managepage/parttime", tag="li", class="app-manage-item") 兼职岗管理
    router-link(v-if="$root.a.role === '1'", to="/managepage/more", tag="li", class="app-manage-item") 更多
  .app-manage-body
    //- transition(name=".el-zoom-in-center")
    router-view(v-if="isRouterAlive")
</template>

<script>
export default {
  created () {
    if (this.$root.a.role === '') {
      this.judgeStatus()
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
      loading: false
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    judgeStatus () {
      this.loading = true
      this.$http.get(`api.php/admin/info`).then(res => {
        this.$root.a.role = res.data.data.role
        this.$root.a.adminname = res.data.data.info[0]
        this.$root.a.admininfo = res.data.data.info[1]
        this.$root.a.job = res.data.data.job
        this.loading = false
      })
    }
  }
}
</script>
