<template>
 <Modal
    v-model="modalFlag"
    :title="title"
    class-name="modal-wrap"
    :width="width"
    :mask-closable="false"
    :footer-hide="true"
    @on-cancel="cancelFun">
    <div class="content">
      <slot></slot>
    </div>
    <div class="btn-wrap" v-if="fideHide">
      <Button class="cancel" type="text" @click="cancelFun">取消</Button>
      <Button type="primary" @click="confirmFun">确认</Button>
      <!-- <Button type="primary" v-btn-control="confirmFun">确认</Button> -->
    </div>
  </Modal>
</template>

<script>
export default {
  components: {},
  props: {
    width: {
      type: Number,
      default: 600// 420
    },
    flag: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    fideHide: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  watch: {},
  computed: {
    modalFlag: {
      get: function () {
        return this.flag
      },
      set: function (newVal) {
        return newVal
      }
      // return this.flag;
    }
  },
  methods: {
    confirmFun () {
      this.$emit('confirm')
    },
    cancelFun () {
      this.$emit('cancel')
    }
  },
  created () {},
  mounted () {}
}
</script>
<style lang="scss" scoped>
.modal-wrap{
  .form-width{
      width:200px;
  }
  .btn-wrap{
    display:flex;
    justify-content: flex-end;
    padding-right:12px;
  }
}
</style>
