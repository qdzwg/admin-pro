<template>
  <the-modal v-model="value" :title="title" @ok="ok" @cancel="cancel">
    <div style="padding-bottom:6px;margin-bottom:6px;">
      <Checkbox :value="checkAll" @click.prevent.native="selectCheckAll"
        >全选</Checkbox
      >
    </div>
    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
      <Checkbox :label="item.value" v-for="item in list" :key="item.value">{{
        item.label
      }}</Checkbox>
    </CheckboxGroup>
  </the-modal>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      required: true,
      validator: function(value) {
        return ["scenic", "city"].indexOf(value) !== -1;
      }
    },
    cityList: {
      type: Array,
      required: true
    },
    scenicList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      checkAll: false,
      checkAllGroup: []
    };
  },
  watch: {
    value: function(val) {
      if (!val) {
        this.checkAllGroup = [];
        this.checkAll = false;
      }
    }
  },
  computed: {
    title: function() {
      if (this.type === "scenic") {
        return "推荐景区";
      } else if (this.type === "city") {
        return "推荐城市";
      }
    },
    list: function() {
      if (this.type === "scenic") {
        return this.cloneDeep(this.scenicList);
      } else if (this.type === "city") {
        return this.cloneDeep(this.cityList);
      }
    }
  },
  methods: {
    checkAllGroupChange(list) {
      this.checkAllGroup = list;
    },
    selectCheckAll() {
      let flag = this.checkAll;
      this.checkAll = !flag;
      if (flag) {
        this.checkAllGroup = [];
        return;
      }
      if (this.type === "scenic") {
        this.checkAllGroup = this.scenicList.map(item => {
          return item.value;
        });
      } else if (this.type === "city") {
        this.checkAllGroup = this.cityList.map(item => {
          return item.value;
        });
      }
    },
    ok() {
      if (!this.checkAllGroup.length) {
        this.$Message.warning("请选择数据");
        return;
      }
      this.$emit("get-data", this.checkAllGroup);
    },
    cancel() {
      this.checkAllGroup = [];
      this.checkAll = false;
      this.$emit("input", false);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped></style>
