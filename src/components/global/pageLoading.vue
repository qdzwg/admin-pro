<template>
  <div class="mock">
    <div class="main">loading...</div>
  </div>
</template>    
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
.mock {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.5);    
  .main {
    position: relative;
    top: 50%;
    font-size: 16px;
    z-index: 10001;
    color: #fff;
  }
}
</style>