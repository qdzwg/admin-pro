<template>
  <div class="search-content p-t-30">
    <div class="banner-handler">
      <Button size="small" @click="del(index)" type="error">删除</Button>
      <Button size="small" @click="searchEdit(index)" type="primary">编辑</Button>
    </div>
    <div class="search-content-box">
      <Input>
      <!-- <Select slot="prepend" style="width: 80px">
                    <Option v-for="(item,index) in itemList" :key="index" :value="item.businessType">{{item.name}}</Option>
                </Select> -->
      <Button slot="append" icon="ios-search"></Button>
      </Input>
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    index: {
      type: Number
    },
    itemList: Array
  },
  methods: {
    del(index) {
      this.$emit("delteCom", index);
    },
    searchEdit(index) {
      this.$emit("indexSearchEdit", index);
      this.$store.dispatch("setIndex", index);
    }
  }
};
</script>
<style scoped lang="scss">
.search-content {
  height: 78px;
  margin: 0 18px;
  .search-content-box {
    .ivu-input-group-append,
    .ivu-input-group-prepend {
      border-color: #90c656;
    }
    .ivu-input-wrapper {
      .ivu-input-group-prepend {
        display: none;
      }
    }
    .ivu-input-group-append {
      background: #90c656;
      .ivu-icon.ivu-icon-ios-search {
        font-size: 16px;
        color: #ffffff;
      }
    }
    .ivu-input {
      border-color: #90c656;
    }
    .ivu-input:hover {
      border-color: #90c656;
    }
  }
}
</style>

