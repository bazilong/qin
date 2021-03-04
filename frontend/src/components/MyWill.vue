<style>
.will-component {
  background-color: #fff;
  border-radius: 6px;
  z-index: 99;
}
.fix {
  position : fixed;
  bottom : 0;
  width: 900px;
  margin: 0 auto;
}
.decoration-for-will {
  background-color: #00A0E9;
  height: 4px;
  border-radius: 6px 6px 0 0;
}
.content-for-will {
  background-color: #D3F0FD;
}
.will-position-list {
  padding: 15px 45px;
  color: rgb(71, 71, 71);
  letter-spacing: 1.5px;
}
.position-in-will {
  background-color: #fff;
  margin: 8px 0;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 16px;
  color: rgb(51, 50, 50);
}
.icon-div-in-will {
  float: right;
}
.icon-in-card {
  margin-left: 15px;
  font-size: 20px;
  cursor: pointer;
}
.icon-in-card:hover {
  color: #00A0E9;
}
.title-for-will {
  font-size: 16px;
  color: rgb(109, 107, 107);
  padding: 15px 15px 20px 15px;
  letter-spacing: 2px;
  overflow: hidden;
}
.show-button {
  font-size: 25px;
  color: #00A0E9;
  cursor: pointer;
  margin-right: 30px;
}
.go-form-button {
  float: right;
  font-size: 14px;
}

@media (max-width:991px) {
  .fix {
    width : calc(100vw - 20px);
    margin: 0;
  }
  .show-button {
    margin-right: 14px;
  }
  .go-form-button {
    font-size: 14px;
  }
  .will-position-list {
    padding: 10px 15px;
    font-size: 16px;
    font-weight: 600;
  }
  .position-in-will {
    padding: 10px 10px;
    font-size: 14px;
    font-weight: normal;
  }
  .icon-in-card {
    margin-left: 10px;
  }
  .title-for-will {
    font-size: 14px;
  }
}
</style>

<template lang="pug">
.will-component(:class="{'fix': fixed}")
  .content-for-will
    transition(name="el-zoom-in-bottom")
      .will-position-list(v-show="show")
        | 我的志愿单
        .position-in-will(v-if="positions" v-for="(s,index) in positions", :key="index") 第{{index+1}}志愿
          span(style="margin-left:15px") {{s.title}}
          .icon-div-in-will
            i.el-icon-arrow-up.icon-in-card(:disabled="index === 0", @click="willSortUp(index)")
            i.el-icon-arrow-down.icon-in-card(@click="willSortDown(index)")
            i.el-icon-delete.icon-in-card(:disabled="index === positions.length - 1", @click="willDelete(index)")
  .decoration-for-will
  .title-for-will
    i.show-button( @click="show=!show", :class="{'el-icon-arrow-up':!show, 'el-icon-arrow-down':show}")
    |  已选{{(positions) ? positions.length : 0}}项志愿
    el-button.go-form-button( type="primary" @click="toWeeklyForm()") 去往报名表
</template>

<script>
import bus from '../router/bus.js'
export default {
  data () {
    return {
      show: false,
      positions: [],
      fixed: true,
      bottom: 0
    }
  },
  methods: {
    pchange () {
      this.positions = JSON.parse(localStorage.getItem('will'))
    },
    willSortUp (i) {
      let oldWill = JSON.parse(localStorage.getItem('will'))
      localStorage.removeItem('will')
      if (i !== 0) {
        let temp = oldWill[i - 1]
        oldWill.splice(i - 1, 1, oldWill[i])
        oldWill.splice(i, 1, temp)
      }
      localStorage.setItem('will', JSON.stringify(oldWill))
      this.pchange()
    },
    willSortDown (i) {
      let oldWill = JSON.parse(localStorage.getItem('will'))
      localStorage.removeItem('will')
      if (i !== oldWill.length - 1) {
        let temp = oldWill[i + 1]
        oldWill.splice(i + 1, 1, oldWill[i])
        oldWill.splice(i, 1, temp)
      }
      localStorage.setItem('will', JSON.stringify(oldWill))
      this.pchange()
    },
    willDelete (i) {
      let oldWill = JSON.parse(localStorage.getItem('will'))
      localStorage.removeItem('will')
      oldWill.splice(i, 1)
      localStorage.setItem('will', JSON.stringify(oldWill))
      this.pchange()
    },
    toWeeklyForm () {
      this.$http.get(`api.php/user/status`).then(response => {
        if (response.data.data.id) {
          this.$http.get(`api.php/user/formstatus`).then(res => {
            if (res.data.data === true) {
              this.$message.warning('本周已报名')
            } else {
              this.$http.get(`/api.php/user/form`).then(r => {
                if (r.data.data.length === 0) {
                  this.$message.warning('本周无报名表')
                } else {
                  this.$router.push(`/weeklyForm`)
                }
              })
            }
          })
        } else {
          this.$message.warning('请先登录')
        }
      })
    },
    handleScroll () {
      let heightTop = document.documentElement.scrollTop || document.body.scrollTop
      let heightScroll = document.body.scrollHeight
      let heightWindow = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      if (this.show === false) {
        if (this.fixed === true) {
          this.fixed = (heightScroll - heightTop - heightWindow > 378.58)
        } else this.fixed = (heightScroll - heightTop - heightWindow > 448.58)
      } else {
        if (this.fixed === true) {
          this.fixed = (heightScroll - heightTop - heightWindow > 478)
        } else this.fixed = (heightScroll - heightTop - heightWindow > 548)
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    // window.addEventListener('click', this.handleScroll)
    this.positions = JSON.parse(localStorage.getItem('will'))
    bus.$on('change', index => {
      this.pchange()
    })
    bus.$on('cha', index => {
      this.handleScroll()
    })
  }
}
</script>
