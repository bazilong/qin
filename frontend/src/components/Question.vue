<style>
.question-title{
  margin-bottom: 7px;
}
</style>

<template lang="pug">
div
  div.manage-q-msg(v-for="(q, index) in activeQ.data", :key="index")
    div.question-title {{index+1}}. {{q.title}}
    el-input(:disabled="!canSubmit", v-if="q.type=='input'" v-model="data[index]")
    el-input(type="textarea", :disabled="!canSubmit", v-if="q.type=='textarea'" v-model="data[index]")
    el-input-number(:disabled="!canSubmit", v-if="q.type=='number'", controls-position="right" v-model="data[index]")
    el-radio-group(v-if="q.type=='radio'", :disabled="!canSubmit" v-model="data[index]")
      el-radio(v-for="(r, i) in q.value", :key="i" el-radio :label="q.value[i]" )
    el-checkbox-group(v-if="q.type=='checkbox'", :disabled="!canSubmit" v-model="data[index]")
      el-checkbox(v-for="(r,i) in q.value", @change="checkOne(index,q.value[i])", :key="i"  :label="q.value[i]")
</template>

<script>
export default {
  props: {
    canSubmit: Boolean,
    activeQ: Object
  },
  data () {
    return {
      data: []
    }
  },
  methods: {
    checkOne (index, i) {
      if (this.data[index] === true || false) {
        this.data[index] = []
        this.data[index].push(i)
      }
    }
  },
  watch: {
    'data': function () {
      this.$emit('getData', this.data) // 主要是通过$emit方法来实现传参的方式，第一个参数是自定义事件名称，第二个则是要传的数据
    }
  }
}
</script>

