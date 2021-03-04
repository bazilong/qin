<style>
.el-tag__close.el-icon-close{
  color: #fff;
}
.show-positions-containner {
  margin: 10px 0;
}
.show-positions-filter-title {
  font-size: 15px;
  display: inline-block;
  vertical-align: text-top;
}
.show-positions-options-container {
  display: inline-block;
  vertical-align: text-top;
  width: calc(100% - 79px);
  font-size: 13px;
}
.show-positions-choosen-tag {
  margin: 2px 3px;
  background-color: #00a0e9;
  color: #fff;
  font-size: 13px;
  height: 25px;
}
.show-positions-length {
  color:rgb(141, 137, 137);
}
.checkbox-button {
  font-size: 13px;
  margin: 0 3px 3px;
  text-align: center;
  display: inline-block;
  background-color: #eff3f5;
  border-radius: 3px;
}
.checkbox-button-label {
  display: inline-block;
  padding: 5px 0;
  width: 70px;
  cursor: pointer;
}
.checkbox-button-input {
  position: absolute;
  clip: rect(0,0,0,0);
}
.bigger-option-label {
  width: 108px;
}
.show-position-button {
  font-size: 15px;
  margin: 10px 20px 0;
  padding: 6px 40px;
}
.checkbox-choosen-btn {
  background-color: #d3f0fd;
  color: #00a0e9;
}
@media (max-width:991px) {
  .show-positions-filter-title {
    font-size: 14px;
  }
  .show-positions-options-container {
    width: calc(100% - 58px);
  }
}
</style>

<template lang="pug">
div
  .list-title-containner
    span {{showFor=='school'? '校内': '兼职'}}岗位一览
  .card-container
    .card-body
      .show-positions-containner
        .show-positions-filter-title 技能要求：
        .show-positions-options-container
          .checkbox-button(v-for="(i, index) in skill", :key="index", :class="i.slected? 'checkbox-choosen-btn': ''")
            input.checkbox-button-input(type="radio", :id="i.id", :value="i.value", v-model="checkedFilters.skill")
            label.checkbox-button-label(:for="i.id", @click="skillSelect(index)") {{i.value}}
      .show-positions-containner
        .show-positions-filter-title 年级要求：
        .show-positions-options-container
          .checkbox-button(v-for="(i, index) in grade", :key="index", :class="i.slected? 'checkbox-choosen-btn': ''")
            input.checkbox-button-input(type="radio", :id="i.id", :value="i.value", v-model="checkedFilters.grade")
            label.checkbox-button-label(:for="i.id", @click="gradeSelect(index)") {{i.value}}
      .show-positions-containner
        .show-positions-filter-title 时间要求：
        .show-positions-options-container
          .checkbox-button(v-for="(i, index) in time", :key="index", :class="i.slected? 'checkbox-choosen-btn': ''")
            input.checkbox-button-input(type="checkbox", :id="i.id", :value="i.value", v-model="checkedFilters.timeArr")
            label.checkbox-button-label.bigger-option-label(:for="i.id" @click="timeSelect(index)") {{i.value}}
      .show-positions-containner
        .show-positions-filter-title 工资水平：
        .show-positions-options-container
          .checkbox-button(v-for="(i, index) in salary", :key="index", :class="i.slected? 'checkbox-choosen-btn': ''")
            input.checkbox-button-input(type="checkbox", :id="i.id", :value="i.value", v-model="checkedFilters.salary")
            label.checkbox-button-label(:for="i.id", @click="salarySelect(index)") {{i.value}}
  //- .card-container(v-show="1")
  //-   .card-body
  //-     .show-positions-containner
  //-       .show-positions-filter-title 已选关键词：
  //-       el-tag.show-positions-choosen-tag(disable-transitions=false) {{checkedFilters.skill}}
  //-       el-tag.show-positions-choosen-tag(:key="tag", v-for="tag in salaryArr", closable, disable-transitions=false, @close="removeFilters(tag)") {{tag}}
  //-       el-tag.show-positions-choosen-tag(:key="tag", v-for="tag in timeArr", closable, disable-transitions=false, @close="removeFilters(tag)") {{tag}}
  //-       el-tag.show-positions-choosen-tag(:key="tag", v-for="tag in gradeArr", closable, disable-transitions=false, @close="removeFilters(tag)") {{tag}}
  //-       span.show-positions-length 已搜索到3个结果
  positions-list-card(:positionsList="positionsList" :dd="dd" :tt="tt" :showFor="showFor", v-loading="loading")
</template>

<script>
import positionsListCard from '../components/PositionsList'

export default {
  props: {
    showFor: String
  },
  components: {
    positionsListCard
  },
  data () {
    return {
      skill: [
        { value: '不限', id: null, slected: true },
        { value: 'PS', id: 'Photoshop', slected: false },
        { value: 'PPT', id: 'PowerPoint', slected: false },
        { value: 'WORD', id: 'Word', slected: false },
        { value: 'EXCEL', id: 'Excel', slected: false },
        { value: '英语', id: '英语', slected: false },
        { value: '微信推送', id: '微信推送', slected: false }
      ],
      salary: [
        { value: '不限', id: null, slected: true },
        { value: '￥140', id: 1, slected: false },
        { value: '￥180', id: 2, slected: false },
        { value: '￥290', id: 3, slected: false },
        { value: '￥430', id: 4, slected: false },
        { value: '￥580', id: 5, slected: false },
        { value: '￥720', id: 6, slected: false }
      ],
      time: [
        { value: '不限', id: null, slected: true },
        { value: '一个整半天/周', id: 1, slected: false },
        { value: '两个整半天/周', id: 2, slected: false },
        { value: '三个整半天/周', id: 3, slected: false },
        { value: '四个整半天/周', id: 4, slected: false },
        { value: '五个整半天/周', id: 5, slected: false }
      ],
      grade: [
        { value: '不限', id: '不限', slected: true },
        { value: '大一', id: '大一', slected: false },
        { value: '大二', id: '大二', slected: false },
        { value: '大三', id: '大三', slected: false },
        { value: '大四', id: '大四', slected: false },
        { value: '研究生', id: '研究生', slected: false }
      ],
      timeArr: [],
      checkedFilters: {
        time: [],
        salary: [],
        grade: '',
        skill: ''
      },
      positionsList: [],
      data: {
        time: Array,
        salary: Array,
        grade: String,
        skill: String
      },
      dd: [],
      tt: [],
      loading: true
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData (data) {
      this.loading = true
      this.$http.post(`/api.php/job/index?type=${this.showFor}`, data).then(res => {
        this.loading = false
        this.positionsList = res.data.data
        this.dd = []
        this.tt = []
        for (let i in this.positionsList) {
          this.dd[i] = JSON.parse(this.positionsList[i].data)
          this.tt[i] = JSON.parse(this.positionsList[i].time)
          for (let j = 0; j < this.tt[i].length; j++) {
            if (j !== this.tt[i].length - 1) this.tt[i][j] = this.tt[i][j] + '，'
          }
        }
      })
    },
    skillSelect (index) {
      if (index) {
        this.data.skill = this.skill[index].id
      } else {
        this.data.skill = undefined
      }
      for (var i = 0; i < this.skill.length; i++) {
        if (i === index) {
          this.skill[i].slected = true
        } else {
          this.skill[i].slected = false
        }
      }
      this.fetchData(this.data)
    },
    gradeSelect (index) {
      if (index) {
        this.data.grade = this.grade[index].id
      } else {
        this.data.grade = undefined
      }
      for (var i = 0; i < this.grade.length; i++) {
        if (i === index) {
          this.grade[i].slected = true
        } else {
          this.grade[i].slected = false
        }
      }
      this.fetchData(this.data)
    },
    timeSelect (index) {
      this.data.time = []
      let j = 0
      let a = 1
      if (index) {
        for (let i = 0; i < this.time.length; i++) {
          if (i === index) {
            this.time[i].slected = !this.time[i].slected
          }
          if (this.time[i].slected === true && i !== 0) {
            this.time[0].slected = false
          }
        }
        for (let i = 1; i < this.time.length; i++) {
          if (this.time[i].slected === true) a = 0
        }
        if (a) {
          this.time[0].slected = true
          this.data.time = undefined
        } else {
          for (let i = 0; i < this.time.length; i++) {
            if (this.time[i].slected === true) {
              this.data.time[j] = this.time[i].id
              j++
            }
          }
        }
      } else {
        this.data.time = undefined
        if (this.time[0].slected === false) {
          for (let i = 0; i < this.time.length; i++) {
            this.time[i].slected = false
          }
        }
        this.time[0].slected = true
      }
      this.fetchData(this.data)
    },
    salarySelect (index) {
      this.data.salary = []
      let j = 0
      let a = 1
      if (index) {
        for (let i = 0; i < this.salary.length; i++) {
          if (i === index) {
            this.salary[i].slected = !this.salary[i].slected
          }
          if (this.salary[i].slected === true && i !== 0) {
            this.salary[0].slected = false
          }
        }
        for (let i = 1; i < this.salary.length; i++) {
          if (this.salary[i].slected === true) a = 0
        }
        if (a) {
          this.salary[0].slected = true
          this.data.salary = undefined
        } else {
          for (let i = 0; i < this.salary.length; i++) {
            if (this.salary[i].slected === true) {
              this.data.salary[j] = this.salary[i].id
              j++
            }
          }
        }
      } else {
        this.data.salary = undefined
        if (this.salary[0].slected === false) {
          for (let i = 0; i < this.salary.length; i++) {
            this.salary[i].slected = false
          }
        }
        this.salary[0].slected = true
      }
      // let length = this.salary.length
      // let min = 0
      // let max = 0
      // if (!index) {
      //   this.data.salary[0] = undefined
      //   this.data.salary[1] = undefined
      //   for (let i of this.salary) {
      //     i.slected = false
      //   }
      //   this.salary[index].slected = true
      // } else {
      //   this.salary[0].slected = false
      //   if (index >= max || this.salary[index + 1].slected) {
      //     for (let m = 1; m < length; m++) {
      //       if (m <= index) {
      //         this.salary[m].slected = true
      //       } else {
      //         this.salary[m].slected = false
      //       }
      //       max = index
      //     }
      //   } else {
      //     for (let n = 1; n < length; n++) {
      //       if (n < index) {
      //         this.salary[n].slected = false
      //       } else {
      //         this.salary[n].slected = true
      //       }
      //     }
      //   }
      //   this.data.salary[1] = this.salary[max].id
      //   this.data.salary[0] = this.salary[min].id
      // }
      this.fetchData(this.data)
    }
    // removeFilters (tag) {
    //   this.checkedFilters.splice(this.checkedFilters.indexOf(tag), 1)
    // },
    // chooseSalary (index) {
    //   for (var i = 0; i < this.salary.length; i++) {
    //     if (i <= index) {
    //       this.salary[i].slected = true
    //     } else {
    //       this.salary[i].slected = false
    //     }
    //   }
    // }
  }
}
</script>
