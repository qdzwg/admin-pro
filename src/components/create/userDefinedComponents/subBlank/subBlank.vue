<template>
  <div class="subblank-show-box">
    <div :style="{'background':data.backgroundColor,'height':(data.height + 'px')}"></div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss">
</style>
