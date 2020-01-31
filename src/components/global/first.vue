<template>
  <div id="first">
    <h1>我是标题</h1>
    <a href="javascript:;" @click="open">{{setauthor}}</a>
  </div>
</template>

<script>
export default {
  data () {
    return {
      author: '还有谁'
    }
  },
  props: ['setauthor'],
  methods: {
    open () {
      this.$emit('showbox', 'the msg')
    }
  }
}
</script>
