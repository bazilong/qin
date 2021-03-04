<style>
.button-in-list {
  margin:2px 0px;
}
.property-title {
  display: inline-block;
  vertical-align: text-top;
}
.p-in-card {
  display: inline-block;
  vertical-align: text-top;
  width: calc(100% - 70px)
}
.mobile-arrow-button {
  display: none;
}
.title-add-style {
  margin-right: 30px;
}
@media (min-width: 992px) {
  .card-block-small {
    display: inline-block;
    width: 33.3%;
  }
  .card-block {
    display: inline-block;
  }
  .mobile-hr {
    display: none;
  }
  .mobile-button {
    display: none;
  }
  .mobile-arrow-button {
    display: inline-block;
  }
  .position-header {
    cursor: pointer;
  }
}
</style>

<template lang="pug">
div
  .card-container(v-for="(position, index) in positionsList", :key="index")
    .top(v-if="position.top==='1'")
      img(src="/static/top.png")
    .card-header.position-header(:class="showDetails[index]? 'card-head-with-color':''", @click="toggleHidden(index)")
      h4.card-title {{position.title}}
      //- el-button.text-button.mobile-button(type="text", @click="toggleHidden(index)", ) {{ showDetails[index] ? '收起详细' : '展开详细' }}
      hr.mobile-hr
      p.card-header-description {{position.description}}
      i.card-show-details-button.mobile-arrow-button(:class="{'el-icon-arrow-up':showDetails[index], 'el-icon-arrow-down':!showDetails[index]}")
    div(v-show="showDetails[index]")
      hr(style="margin: 0")
      .card-body
        div
          .card-block-small
            .property-title.title-add-style 岗位编号：
            .content-in-card {{position.number}}
          .card-block-small
            .property-title.title-add-style  助学金：
            .content-in-card {{position.salary}}
          .card-block-small
            .property-title.title-add-style  招聘人数：
            .content-in-card {{position.count}} 人
        hr
        div
          .card-block-small
            .property-title.title-add-style  性别要求：
            .content-in-card {{sex[dd[index][2]]}}
          .card-block
            .property-title.title-add-style  年级要求：
            .content-in-card {{grade[position.grade]}}
        hr
        el-row
          el-col(:span="3", style="margin-top:14px").property-title 工作时间：
          el-col.content-in-card(:span="21")
            span(v-for="(time, id) in tt[index]", :key="id") {{time}}
        hr
        el-row
          el-col(:span="3", style="margin-top:14px").property-title 工作内容：
          el-col.content-in-card(:span="21") {{dd[index][0]}}
        hr
        el-row
          el-col(:span="3", style="margin-top:14px").property-title 岗位要求：
          el-col.content-in-card(:span="21") {{dd[index][1]}}
        hr
        el-button.button-in-list(v-if="showFor==='school'" type='primary' @click="addWill(index)") 加入志愿单
        el-button.button-in-list(v-else type="primary" @click="toWeeklyForm2(index)") 去往报名表
        <!--el-button.button-in-list(icon='el-icon-star-off') 收藏-->
  .card-container(v-if="positionsList.length===0")
    .card-header
      h4.card-title 暂无招募信息
</template>

<script>
import bus from '../router/bus.js'
// import constant from '../constant'

// let filterGrade = constant.grade.getFilter()

export default {
  props: {
    positionsList: Array,
    dd: Array,
    tt: Array,
    showFor: String
  },
  data () {
    return {
      showDetails: [],
      sex: ['不限', '女', '男'],
      grade: ['不限', '大一', '大二', '大三', '大四', '研究生']
    }
  },
  methods: {
    toggleHidden (i) {
      if (this.showDetails[i] !== true || false) {
        for (let i = 0; i < this.positionsList.length; i++) {
          this.showDetails[i] = false
        }
      }
      this.showDetails.splice(i, 1, !this.showDetails[i])
      bus.$emit('cha', i)
    },
    toWeeklyForm2 (index) {
      this.$http.get(`api.php/user/status`).then(response => {
        if (response.data.data.id) {
          this.$router.push({
            path: `/parttimeForm`,
            query: {id: this.positionsList[index].id, title: this.positionsList[index].title}})
        } else {
          this.$message.warning('请先登录')
        }
      })
    },
    addWill (index) {
      if (!localStorage.getItem('will')) {
        localStorage.setItem('will', JSON.stringify([{
          title: this.positionsList[index].title,
          id: this.positionsList[index].id
        }]))
        this.$message.success('添加成功')
      } else {
        if (JSON.parse(localStorage.getItem('will')).length > 2) {
          this.$message.error('志愿单已满')
        } else {
          let oldWill = JSON.parse(localStorage.getItem('will'))
          let did = 0
          for (let i = 0; i < oldWill.length; i++) {
            if (oldWill[i].id === this.positionsList[index].id) did = 1
          }
          let nowWill = {title: this.positionsList[index].title, id: this.positionsList[index].id}
          if (did) {
            this.$message.warning('已添加')
          } else {
            localStorage.removeItem('will')
            oldWill.push(nowWill)
            localStorage.setItem('will', JSON.stringify(oldWill))
            this.$message.success('添加成功')
          }
        }
        bus.$emit('change', index)
      }
      console.log(localStorage.getItem('will'))
    }
  }
}
</script>
