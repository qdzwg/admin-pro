<template>
  <div>
    <Modal v-model="modal" title="攻略选择" :mask-closable="false">
      <CheckboxGroup v-model="social">
        <Checkbox v-for="(item,index) in typeList" :key="index" :label="item.key">
          <span>{{item.value}}</span>
        </Checkbox>
      </CheckboxGroup>
      <div slot="footer">
        <Button type="primary" @click="sure">确定</Button>
        <Button @click="cancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { apiGet } from "@/fetch/api";
export default {
  props: {
    arr: {
      type: Array,
      default: () => []
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    arr: {
      handler(val) {
        this.social = val.map(item => item.key);
      },
      immediate: true
    },
    modal(val) {
      this.$emit("input", val);
    },
    value(val) {
      if (val) {
        this.getTypeList();
      }
      this.modal = val;
    }
  },
  data() {
    return {
      typeList: [],
      social: [],
      modal: this.value
    };
  },
  methods: {
    cancel() {
      this.$emit("modalCancel");
      this.modal = false;
    },
    getTypeList() {
      apiGet("/merchant/merchantStrategy/changeList", {
        key: "merchantStrategyType"
      }).then(res => {
        if (res.status == 200) {
          this.typeList = res.data;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    sure() {
      let arr = this.typeList.filter(
        item => this.social.indexOf(item.key) > -1
      );
      if (arr.length) {
        this.$emit("getStrategy", arr);
        this.modal = false;
      } else {
        this.$Message.warning("请选择分类项");
      }
    }
  }
};
</script>