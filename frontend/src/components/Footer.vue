<style>
  .footer-container {
    color: rgb(204,204,206);
    background-color: rgb(43,44,46);
    margin: 0;
    font-size: 13px;
    padding-top: 50px;
    padding-bottom: 30px;
  }
  .contact-png {
    height: 120px;
    width: 120px;
  }
  .footer {
    width: 900px;
    margin: 0 auto;
  }
  .footer_h4 {
    display: inline-block;
  }
  .footer_div {
    margin-top:10px;
  }
  .footer-support {
    padding: 50px 0 0;
    margin: 0 auto;
    width: 600px;
    text-align: center;
  }
  .footer-twtlogo {
    width:40px;
    height:30px;
    position: relative;
    bottom: -10px;
  }
</style>

<template lang="pug">
div.footer-container
  el-row.footer(type="flex", justify="center")
    div(style="width: 280px;")
      h4.footer_h4 办公时间
      span （节假日除外）
      el-row
        el-col(:span="10") 周一至周五
        el-col(:span="14")
          div 上午 8:30 - 12:00
          div 下午 13:00 - 19:30
      el-row.footer_div
        el-col(:span="10") 周六
        el-col(:span="14")
          div 上午 8:30 - 12:00
          div 下午 13:00 - 17:30
    div(style="width: 400px;")
      h4 联系方式
      el-row.footer_div
        el-col(:span="5") 通讯地址：
        el-col(:span="19") 天津大学勤工助学管理办公室
      el-row.footer_div
        el-col(:span="5") 邮编：
        el-col(:span="19") 300350
      el-row.footer_div
        el-col(:span="5") 办公地点：
        el-col(:span="19")
          div 卫津路校区：大学生活动中心205
          div 北洋园校区：大通学生活动中心C区303
      el-row.footer_div
        el-col(:span="5") 联系电话：
        el-col(:span="19")
          div 卫津路校区：022-87402161
          div 北洋园校区：022-85356161
      el-row.footer_div
        el-col(:span="5") 招聘邮箱：
        el-col(:span="19") qgbbyy_jianli@126.com
    div
      h4 二维码
      img.contact-png(src="/static/contact.png")
      div.footer_div 天津大学学生资助管理中心
  div.footer-support
    span 技术支持：
    img.footer-twtlogo(src="/static/twtlogo.png")
    span 天外天工作室  / © 2000-{{year}} / 津ICP备05004358号 / 津教备0316号
</template>

<script>
const date = new Date()
const year = date.getFullYear()
export default {
  data () {
    return {
      year: year
    }
  }
}
</script>
