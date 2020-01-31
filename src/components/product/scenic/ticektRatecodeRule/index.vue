<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
       <Col span="3">
        <Button type="primary" icon="android-add" @click="add">添加购买规则</Button>
      </Col>
      <Col span="3">
        <Button type="primary" icon="android-add" @click="addAfterSaleRule">添加售后规则</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <Modal width="800" v-model="buyRuleModal" title="添加购买规则" :loading="loading" @on-ok="ok"  @on-cancel="cancel">
        <Form class="defaultHeight" :model="formBuyRuleItem" label-position="right" :label-width="100" ref="formItem" :rules="buyRuleForm">
          <FormItem label="产品规则名称：" prop="name">
             <Input  v-model="formBuyRuleItem.name" placeholder="产品规则名称"></Input>
          </FormItem>
          <FormItem label="产品规则类型：" >
            购买
          </FormItem>
          <FormItem label="备注：" prop="subtitle">
            <Input  v-model="formBuyRuleItem.remark" type="textarea"  placeholder="填写备注"></Input>
          </FormItem>
          <FormItem label="可购时间限制：" >
           <RadioGroup  v-model="formBuyRuleItem.buyFarthestType">
                <Radio label="any">
                    <span>不限</span>
                </Radio>
                <Radio label="recent">
                    <span>可购买最近</span>
                    <template v-if="formBuyRuleItem.buyFarthestType=='recent'"><InputNumber v-model="formBuyRuleItem.buyFarthestDay"></InputNumber>天 （控制预订开始时间，当为1时则当天可预订）</template>
                </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="下单日期限制：" >
            <Row>
                <Col span="4">
                    <FormItem prop="openTime">
                         <DatePicker  @on-change="setStartTime" type="date" placeholder="" style="width: 112px"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="1" style="text-align: center">-</Col>
                <Col span="4">
                    <FormItem >
                        <DatePicker @on-change="setEndTime" type="date" placeholder="" style="width: 112px"></DatePicker>
                    </FormItem>
                </Col>
            </Row>
          </FormItem>
          <FormItem label="下单时间限制：" >
            <Row>
                <Col span="4">
                    <FormItem>
                        <TimePicker  v-model="formBuyRuleItem.dayBegTime" format="HH:mm" placeholder="" style="width: 112px"></TimePicker>
                    </FormItem>
                </Col>
                <Col span="1" style="text-align: center">-</Col>
                <Col span="4">
                    <FormItem >
                       <TimePicker  v-model="formBuyRuleItem.dayEndTime" format="HH:mm" placeholder="" style="width: 112px"></TimePicker>
                    </FormItem>
                </Col>
            </Row>
          </FormItem>
          <FormItem label="购买数量限定：">
            <InputNumber  v-model="formBuyRuleItem.minOrder"></InputNumber>
            <span>-</span>
            <InputNumber  v-model="formBuyRuleItem.maxOrder"></InputNumber>
          </FormItem>
          <FormItem label="提前预订天数：" >
            <InputNumber v-model="formBuyRuleItem.earlyBookDay" ></InputNumber>天
          </FormItem>
          <FormItem label="下单人身份证：">
             <RadioGroup v-model="formBuyRuleItem.isNeedIdcard">
                    <Radio label="F">
                        <span>选填</span>
                    </Radio>
                    <Radio label="T">
                        <span>必填</span>
                    </Radio>
                </RadioGroup>
          </FormItem>
          <template v-if="formBuyRuleItem.isNeedIdcard=='T'">
            <FormItem label="年龄限定：" prop="virtualSale">
                <InputNumber v-model="formBuyRuleItem.minAge"></InputNumber>
                <span>-</span>
                <InputNumber v-model="formBuyRuleItem.maxAge"></InputNumber>
             </FormItem>
            <FormItem label="性别限定：">
                    <RadioGroup v-model="formBuyRuleItem.sex">
                          <Radio label="">
                              <span>不限</span>
                          </Radio>
                          <Radio label="X">
                              <span>仅男士</span>
                          </Radio>
                          <Radio label="Y">
                              <span>仅女士</span>
                          </Radio>
                      </RadioGroup>
                </FormItem>
          </template>
        </Form>
    </Modal>
    <Modal width="800" v-model="afterSaleRuleModal" title="添加售后规则" :loading="loading" @on-ok="afterSaleOk"  @on-cancel="cancel">
        <Form :model="formAftersaleRuleItem" label-position="right" :label-width="150" ref="formItem" :rules="buyRuleForm">
          <FormItem label="产品规则名称：" prop="name">
             <Input  v-model="formAftersaleRuleItem.name" placeholder="产品规则名称"></Input>
          </FormItem>
          <FormItem label="产品规则类型：" >
            售后
          </FormItem>
          <FormItem label="备注：" prop="subtitle">
            <Input  v-model="formAftersaleRuleItem.remark" type="textarea"  placeholder="填写备注"></Input>
          </FormItem>
          <FormItem label="退单是否允许：">
             <RadioGroup v-model="formAftersaleRuleItem.isRetreat">
                    <Radio label="F">
                        <span>否</span>
                    </Radio>
                    <Radio label="T">
                        <span>是</span>
                    </Radio>
                </RadioGroup>
          </FormItem>
          <FormItem label="退单是否需要审核：">
             <RadioGroup v-model="formAftersaleRuleItem.isRetreatAudit">
                    <Radio label="F">
                        <span>否</span>
                    </Radio>
                    <Radio label="T">
                        <span>是</span>
                    </Radio>
                </RadioGroup>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      afterSaleRuleForm:{

      },
      buyRuleForm:{
        name:[
          { required: true, message: '请填写产品规则名称', trigger: 'blur' }
        ]
      },
      formAftersaleRuleItem:{
        modelType:"ticket",
        type:"1",
        name:"",
        remark:"",
        isRetreat:"F",
        isRetreatAudit:"F"
      },
      formBuyRuleItem:{
        name:"",
        remark:"",
        buyFarthestType:"any",
        orderBegDay:"",
        orderEndDay:"",
        dayBegTime:"",
        dayEndTime:"",
        minOrder:0,
        maxOrder:0,
        earlyBookDay:0,
        isNeedIdcard:'F',
        type:"0",
        modelType:"ticket"
      },
      loading:true,
      buyRuleModal:false,
      afterSaleRuleModal: false,
      mode:"",
      content:"",
      sucessMsg:'',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '产品规则名称',
          key: 'name'
        },
        {
          title: '产品规则编码',
          key: 'code'
        },
        {
          title: '产品规则类型',
          key: 'type',
          render: (h,params) => {
            return h("span",params.row.type=='1'?'售后':'购买')
          }
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '修改',
              action: () => {
                this.$router.push("/ticketEdit/" + params.row.id)
              }
            },
            {
              title: '删除',
              action: () => {
                this.mode= "done"
                this.content = "确认删除吗？"
                this.sucessMsg = "删除成功!"
                this.$refs.confirmModel.confirm('product/ruleProduct/del?ids=' + params.row.id + '&' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc',modelType:"ticket"},
      url: 'product/ruleProduct/grid',
      searchItems: [
        {
          label: '产品规则名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '产品规则编码',
          type: 'input',
          name: 'code'
        },
        {
          label: '产品规则类型',
          type: 'select',
          name: 'type',
          data: [
            {
              value: '0',
              label: '购买'
            },
            {
              value: '1',
              label: '售后'
            }
          ]
        }
      ]
    }
  },
  components: {searchForm, gridTable, confirm},
  methods: {
    setStartTime(time){
      this.formBuyRuleItem.orderBegDay = time
    },
    setEndTime(time){
      this.formBuyRuleItem.orderEndDay = time
    },
    afterSaleOk(){
      let _this = this;
      let url = "product/ruleProduct/save/ruleSold";
      this.common.formPost(this, {
        url,
        params: this.formAftersaleRuleItem,
        mold: "modal",
        callback(res) {
          if (res.success) {
            // _this.loading = true
            _this.afterSaleRuleModal = false;
          }
        }
      });
    },
    ok(){
      let _this = this;
      let url = "product/ruleProduct/save/ruleBuy";
      this.common.formPost(this, {
        url,
        params: this.formBuyRuleItem,
        mold: "modal",
        callback(res) {
          if (res.success) {
            // _this.loading = true
            _this.buyRuleModal = false;
          }
        }
      });
    },
    cancel(){},
    add(){
      this.formBuyRuleItem = {
        name:"",
        remark:"",
        buyFarthestType:"any",
        orderBegDay:"",
        orderEndDay:"",
        dayBegTime:"",
        dayEndTime:"",
        minOrder:0,
        maxOrder:0,
        earlyBookDay:0,
        isNeedIdcard:'F',
        type:"0",
        modelType:"ticket"
      }
      this.buyRuleModal = true
    },
    addAfterSaleRule(){
      this.formAftersaleRuleItem={
        modelType:"ticket",
        type:"1",
        name:"",
        remark:"",
        isRetreat:"F",
        isRetreatAudit:"F"
      },
      this.afterSaleRuleModal = true
    },
    delAll () {
      this.mode= "done"
      this.content = "确认删除吗？"
      this.sucessMsg = "删除成功!"
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let arr = []
        selection.forEach(element => {
          arr.push(element.id)
        })
        this.$refs.confirmModel.confirm('product/ruleProduct/del?ids=' + arr.join(","))
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    open(){
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let arr = []
        selection.forEach(element => {
          arr.push(element.id)
        })
        this.mode = "done"
        this.content = '确认开园吗？'
        this.sucessMsg = "开园成功!"
        this.$refs.confirmModel.confirm('product/parkInfo/enable?enable=T&ids=' + arr.join(','))
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    close(){
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let arr = []
        selection.forEach(element => {
          arr.push(element.id)
        })
        this.mode = "done"
        this.content = '确认闭园吗？'
        this.sucessMsg = "闭园成功!"
        this.$refs.confirmModel.confirm('product/parkInfo/enable?enable=F&ids=' + arr.join(','))
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    }
  }
}
</script>

<style scope lang="scss">
  .defaultHeight{
    height:400px;
    overflow:auto
  }
</style>