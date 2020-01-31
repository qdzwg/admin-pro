<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <!-- <Row :gutter="16" class="btn-groups">
       <Col span="3">
        <Button type="primary" icon="android-add" @click="add">添加购买规则</Button>
      </Col>
      <Col span="3">
        <Button type="primary" icon="android-add" @click="addAfterSaleRule">添加售后规则</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
    </Row> -->
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <Modal width="800" v-model="afterSaleRuleModal" title="修改" :loading="loading" @on-ok="afterSaleOk"  @on-cancel="cancel">
        <Form :model="formAftersaleRuleItem" label-position="right" :label-width="150" ref="formItem" :rules="buyRuleForm">
          <FormItem label="分销商手机号：">
            {{disTel}}
          </FormItem>
          <FormItem label="分销商名称：" >
           {{disName}}
          </FormItem>
          <FormItem label="渠道码名称：" prop="name">
             <Input  v-model="formAftersaleRuleItem.name" placeholder="产品规则名称"></Input>
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
      disTel:"",
      distName:"",
      buyRuleForm:{
        name:[
          { required: true, message: '请填写渠道码名称', trigger: 'blur' }
        ]
      },
      formAftersaleRuleItem:{
        name:"",
        _method: 'put'
      },
      loading:true,
      afterSaleRuleModal: false,
      mode:"",
      content:"",
      sucessMsg:'',
      id:"",
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '渠道码编码',
          key: 'code'
        },
        {
          title: '渠道码名称',
          key: 'name'
        },
        {
          title: '分销商名称',
          key: 'distName'
        },
        {
          title: '分销商手机号',
          key: 'distMobile'
        },
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '产品',
              action: () => {
                this.$router.push("/channelManageList/" + params.row.code)
              }
            },
            {
              title: '修改',
              action: () => {
                this.id = params.row.id
                this.disTel = params.row.distMobile
                this.disName = params.row.distName
                this.formAftersaleRuleItem.name = params.row.name
                this.afterSaleRuleModal = true
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc',modelType:"room"},
      url: 'list/product/channel/grid',
      searchItems: [
        {
          label: '渠道码编码',
          type: 'input',
          name: 'code'
        },
        {
          label: '渠道码名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '分销商名称',
          type: 'input',
          name: 'distName'
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
      let url = "list/product/channel/" + this.id;
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
      let url = "list/product/ruleProduct/save/ruleBuy";
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
        this.$refs.confirmModel.confirm('list/product/ruleProduct/del?ids=' + arr.join(","))
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