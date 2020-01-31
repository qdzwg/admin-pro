<template>
    <div class="head">
        <img class="head-img" src="../../../../assets/images/top.jpg" alt="">
        <div class="title">
            <div v-if="show" @click="isShow">{{title?filter.cutstr(title,16):'请设置名称'}}</div>
            <div v-else>
                <Input @on-blur="setTitle" v-model="youTitle"></Input>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      show: true,
      title: "",
      youTitle: ""
    };
  },
  methods: {
    isShow() {
      this.show = !this.show;
      this.youTitle = this.title;
    },
    setTitle() {
      this.show = !this.show;
      this.title = this.youTitle;
    }
  }
};
</script>
<style scoped lang="scss">
.head {
  height: 75px;
  position: relative;
  .title {
    position: absolute;
    top: 38px;
    left: 50%;
    margin-left: -75px;
    color: #ffffff;
    width: 150px;
    text-align: center;
    font-size: 16px;
    background: transparent;
  }
}
.head-img {
  width: 100%;
  height: 75px;
}
</style>
