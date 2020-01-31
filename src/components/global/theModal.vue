<template>
  <div class="modal-wrap">
    <Modal :value="value" :title="title" @on-cancel="cancel" :width="width">
      <slot></slot>
      <div class="modal-footer" slot="footer">
        <template v-if="!noFooter">
          <Button @click="cancel" size="large">取消</Button>
          <Button type="primary" class="ok-btn" size="large" @click="ok">{{
            okText
          }}</Button>
        </template>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    width: {
      type: Number | String,
      default: 520
    },
    title: {
      type: String,
      default: "信息"
    },
    value: {
      type: Boolean,
      default: false
    },
    noFooter: {
      type: Boolean,
      default: false
    },
    okText: {
      type: String,
      default: "确定"
    }
  },
  data() {
    return {};
  },
  watch: {
    // value: function (val) {
    //   this.$emit('input', val)
    // }
  },
  computed: {},
  methods: {
    cancel: function() {
      this.$emit("cancel");
    },
    ok: function() {
      this.$emit("ok");
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.ivu-modal-wrap {
  .modal-footer {
    text-align: right;
    .ok-btn {
      margin-left: 8px;
    }
  }
}
</style>
