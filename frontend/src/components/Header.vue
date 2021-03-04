<style>
.header-container {
  display: inline-block;
  margin: 15px auto;
}
.header-logo {
  display: inline;
}
.header-block {
  display: inline-block;
}
.header-nav {
  display: inline;
}
.header-tool {
  display: inline;
}
</style>

<template lang="pug">
div
  .header-container
    a(@click.stop='toggleSide()')
      i.el-icon-d-arrow-left
    h2.header-logo
      slot(name='logo')
    div.header-block(:style="sidebarStyle", @click.stop='')
      ul.header-nav
        slot(name='nav')
      .header-tool
        slot(name='tool')
</template>

<script>
let sidebarStatus = false
let sidebarStyle = {
  height: ''
}
let body = document.body

const resizeHandler = function () {
  if (window.innerWidth >= 992) {
    hideSidebar(true)
  } else {
    sidebarStyle.height = window.innerHeight + 'px'
  }
}
const clickHandler = function (e) {
  hideSidebar()
}
const showSidebar = function () {
  body.className += ' app-header-sidebar-on'

  window.addEventListener('resize', resizeHandler)
  document.body.addEventListener('click', clickHandler)
  sidebarStyle.height = window.innerHeight + 'px'
  sidebarStatus = true
}
const hideSidebar = function (instant) {
  body.className = body.className.replace('app-header-sidebar-on', '')

  window.removeEventListener('resize', resizeHandler)
  document.body.removeEventListener('click', clickHandler)
  sidebarStatus = false

  if (instant) {
    sidebarStyle.height = ''
  } else {
    setTimeout(function () {
      if (!sidebarStatus) sidebarStyle.height = ''
    }, 400)
  }
}

export default {
  data () {
    return {
      sidebarStyle
    }
  },
  methods: {
    toggleSide () {
      if (sidebarStatus) {
        hideSidebar()
      } else {
        showSidebar()
      }
    }
  }
}
</script>
