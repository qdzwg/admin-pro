<template>
  <div class="notBuyService">
    <div class="boxService">
      <Icon type="close-circled"
            size="100"
            color="#cb2020"></Icon>
      <h1>您未购买此服务或此服务已过期!</h1>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.notBuyService {
  width: 100%;
  .boxService {
    width: 30%;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin: 100px auto;
    text-align: center;
    padding: 30px 0;
  }
}
</style>
