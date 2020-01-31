<template>
    <Modal
        v-model="flag"
        title=""
        class-name="modal-wrap"
        width='600'
        :mask-closable="false"
        :footer-hide="true"
        @on-cancel="cancelFun">
        <div class="content">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="开始时间" prop='stockBgTime'>
              <DatePicker type="date" :value="formValidate.stockBgTime" :editable="false"
              @on-change="changeStart"  :options="options3" placeholder="开始时间" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="stockEndTime">
              <DatePicker type="date" :value="formValidate.stockEndTime" :editable="false"
               @on-change="changeEnd" format="yyyy-MM-dd" :options="options3" placeholder="结束时间" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="库存" prop="stockNum">
              <InputNumber  :max="1000" :value="formValidate.stockNum" style="width:100px" :min="0" @on-change="changeStockNum"></InputNumber>
            </FormItem>
          </Form>
        </div>
          <div class="btn-wrap">
            <Button class="cancel" type="text" @click="cancelFun">取消</Button>
            <Button type="primary" @click="confirmFun">确认</Button>
          </div>
    </Modal>
</template>

<script>
export default {
  components: {},
  props: {
    modalFlag: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formValidate: {
        stockBgTime: '',
        stockEndTime: '',
        stockNum: 0
      },
      ruleValidate: {
        stockBgTime: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        stockEndTime: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        stockNum: [
          {
            pattern: /^[1-9][0-9]*|0$/,
            message: "数据格式不正确"
          },
          { required: false, trigger: 'blur', type: 'number' }
        ]
      },
      options3: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      }
    }
  },
  watch: {
    modalFlag: function (newVal, oldVal) {
      if (!newVal && oldVal) {
        this.$refs['formValidate'].resetFields()
      }
    }
  },
  computed: {
    flag: {
      get: function () {
        return this.modalFlag
      },
      set: function (newVal) {
        // return newVal;
      }
    }
  },
  methods: {
    changeStart (date) {
      this.formValidate.stockBgTime = date
    },
    changeEnd (date) {
      this.formValidate.stockEndTime = date
    },
    changeStockNum (num) {
      if (num) {
        this.formValidate.stockNum = num
      } else {
        this.formValidate.stockNum = 0
      }
    },
    confirmFun () {
      let runBeginTime = this.formValidate.stockBgTime
      let runEndTime = this.formValidate.stockEndTime
      let start = new Date(runBeginTime).getTime()
      let end = new Date(runEndTime).getTime()
      if (end < start) {
        this.$Message.info('线路结束时间不能大于线路开始时间')
        return
      }
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.$emit('save', this.formValidate)
          //   this.saveStock();
        }
      })
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
    // .content{
    //   padding-top:20px;
    // }
    .btn-wrap{
      display:flex;
      justify-content: flex-end;
    }
  }
</style>
