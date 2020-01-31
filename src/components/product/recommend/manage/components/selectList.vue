<template>
  <div class="select-list">
    <div v-for="(item, index) in tagNameList" class="subject-list-item">
      <Icon
        @click="subjectItemDel(index)"
        class="subject-list-item-del"
        type="close-circled"
      ></Icon>
      <Button>{{ item.name }}</Button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    tagNameList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {
    subjectItemDel(index) {
      this.tagNameList.splice(index, 1);
      // this.$emit("get-data", this.tagNameList);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.select-list {
  min-height: 52px;
  padding: 10px 0;
  .subject-list-item {
    display: inline-block;
    margin-right: 10px;
    position: relative;
    .subject-list-item-del {
      display: none;
      position: absolute;
      top: -5px;
      right: -5px;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .subject-list-item:hover {
    .subject-list-item-del {
      display: inline-block;
    }
  }
}
</style>
