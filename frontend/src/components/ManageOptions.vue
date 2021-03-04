<template lang="pug">
div
  div(v-for="(s, index) in value")
    el-input(v-model="value[index]", @input="update(value)", :disabled="disabled")
      el-button(v-if="!disabled", @click="remove(index)", slot="append", icon="el-icon-minus")
  div(v-if="!disabled")
    el-input(v-model="newLine", @keyup.native.enter="push()", :placeholder="placeholder")
      el-button(slot="append", @click="push()") + 增加
  div(style="color:grey;margin-top:5px;") “+增加”按钮一行的选项内容不会出现在问卷中
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholder: { type: String },
    disabled: { type: Boolean }
  },
  data () {
    return {
      newLine: ''
    }
  },
  methods: {
    update (val) {
      this.$emit('input', val)
    },
    push () {
      let val = this.newLine.trim()
      if (!val) return

      let arr = this.value
      arr.push(val)

      this.update(arr)
      this.newLine = ''
    },
    remove (index) {
      let arr = this.value
      arr.splice(index, 1)

      this.update(arr)
    }
  }
}
</script>
