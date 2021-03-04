<style>
  .change-box{
    margin-top : 10px;
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
    label(class="card") 校区 :
      select.input-box(v-model="edit.campus")
        option(value="0") === 请选择 ===
        option(value="1") 北洋园校区
        option(value="2") 卫津路校区
    br
    label(class="card") 手机 :
      input.input-box(type="text", v-model="edit.phone" style="margin-bottom:22px")
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
        campus: 0,
        phone: ''
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
      this.edit.campus = this.user.campus
      this.edit.phone = this.user.phone
    },
    submit () {
      if (!this.edit.campus || !this.edit.phone) {
        return null
      }
      this.$http.post(`api.php/user/contact`, {
        campus: this.edit.campus,
        phone: this.edit.phone
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
