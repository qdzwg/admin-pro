<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="2" v-if="hotelId!=undefined">
        <Button type="primary" icon="android-add" @click="add">添加</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
      <Col span="2">
        <Button type="success" icon="android-done" @click="up">上架</Button>
      </Col>
      <Col span="2">
        <Button type="success" icon="android-close" @click="down">下架</Button>
      </Col>
      <Col span="2">
        <Button type="success" icon="android-close" @click="tiaojia">批量调价</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <!--批量调价-->
     <Modal width="600"
           v-model="tjModal"
           title="批量调价"
           ok-text="提交">
      <Form :model="formItem"
            label-position="right"
            ref="formItem"
            :rules="ruleTjForm"
            :label-width="130">
        <FormItem label="调价日期:" prop="startTime">          
          <template>
            <FormItem prop="startTime"
                          :rules="{required: true,type: 'date', message: '开始时间不能为空', trigger: 'change'}"
                          :label-width="1"
                          style="display:inline-block;">
              <DatePicker @on-change='setBegDate'
                        :options="startOption"
                        :value="formItem.startTime"
                        type="date"
                        format="yyyy-MM-dd"></DatePicker>
            </FormItem>            
            <span> > </span>
            <FormItem prop="endTime"
                          :rules="{required: true,type: 'date', message: '结束时间不能为空', trigger: 'change'}"
                          :label-width="1"
                          style="display:inline-block;">
              <DatePicker @on-change='setEndDate'
                          :options="endOption"
                          :value="formItem.endTime"
                          type="date"
                          format="yyyy-MM-dd"></DatePicker>
            </FormItem>
          </template>
        </FormItem>     
        <FormItem label="成本价增值：">
          <Input v-model="formItem.costPriceAdd"
                style="width:33%"
                placeholder="请输入成本价增值"
                :maxlength="64"></Input>
        </FormItem>  
        <FormItem label="成本价减值：">
          <Input v-model="formItem.costPriceFew"
                style="width:33%"
                placeholder="请输入成本价增值"
                :maxlength="64"></Input>
        </FormItem>   
        <FormItem label="销售价增值：">
          <Input v-model="formItem.salePriceAdd"
                style="width:33%"
                placeholder="请输入销售价增值"
                :maxlength="64"></Input>
        </FormItem>  
        <FormItem label="销售价减值：">
          <Input v-model="formItem.salePriceFew"
                style="width:33%"
                placeholder="请输入销售价减值"
                :maxlength="64"></Input>
        </FormItem>     
        <FormItem>
          <Button type="primary"
                  @click="submit">提交</Button>
          <Button type="ghost"
                  @click="cancel">关闭</Button>
        </FormItem>

      </Form>
      <div slot="footer"></div>
    </Modal>

  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import { apiPost } from '@/fetch/api'
export default {
  data () {
    return {
      tjModal: false,
      ids: '',
      mode:"",
      content:"",
      sucessMsg:'',
      hotelId:'',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '房型名称',
          key: 'modelName'
        },
        {
          title: '房型编码',
          key: 'modelCode'
        },
        {
          title: '酒店名称',
          key: 'hotelName'
        },
       
        {
          title: '上架状态',
          key: 'enabled',
          render: (h,params) => {
            return h('span',params.row.enabled=='T'?'已上架':'已下架')
          }
        },
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            // let { id, enabled } = params.row;

            const actions = [
            {
              title: '价格库存日历',
              action: () => {
               this.$router.push({'path': '/hotelInventoryCl/' + params.row.modelCode})
              }
            },
            
            {
              title: '修改',
              action: () => {
                this.$router.push('/hotelRoom-add-edit?hotelId='+params.row.hotelId + '&houseId='+params.row.id)
              }
            },
            {
              title: '删除',
              action: () => {
                this.mode="done"
                this.content = "删除后将影响已有订单退票、核销，请谨慎操作"
                this.sucessMsg = "删除成功!"
                this.$refs.confirmModel.confirm('product/hotelRoom/del?id=' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc',hotelId:this.$route.query.id},
      url: 'product/hotelRoom/grid',
      searchItems: [
        {
          label: '房型名称',
          type: 'input',
          name: 'modelName'
        },
        {
          label: '房型编号',
          type: 'input',
          name: 'modelCode'
        },        
        {
          label: '状态',
          type: 'select',
          name: 'enabled',
          data: [
            {
              value: '',
              label: '请选择'
            },
            {
              value: 'T',
              label: '已上架'
            },
            {
              value: 'F',
              label: '已下架'
            }
          ]
        }
      ],
      formItem: {
        startTime: '',
        endTime: '',
        costPriceAdd: '',
        costPriceFew: '',
        salePriceAdd: '',
        salePriceFew:''
      },
      ruleTjForm: {
        startTime: [
          { required: true, type: 'date', message: '开始时间不能为空', trigger: 'change' }
        ],
        endTime: [
          { required: true, type: 'date', message: '结束时间不能为空', trigger: 'change' }
        ]       
      },    
      startOption: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      endOption: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now()
        }
      }
    }
  },
  components: {searchForm, gridTable, confirm},
  mounted(){
      //获取调转过来的id作为hotelId，决定添加按钮是否出现
      this.hotelId=this.$route.query.id
  },
  methods: {
    add(){
      // this.$router.push({"path":"/hotelRoom-add-edit",query:{hotelId:this.hotelId}})
      this.$router.push('/hotelRoom-add-edit?hotelId='+ this.hotelId)
    },
    tiaojia() {      
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        // this.submit(arr.join(','));
        this.ids = arr.join(',');
        this.tjModal = true;
      } else {
        this.$Message.warning('请选择要调价的项')
      }
    },
    cancel() {
      this.tjModal = false;
    },
    submit(ids) {
      this.formItem.hotelRoomId = this.ids;
      apiPost('/product/api/hotelPush/batchPrice', this.formItem).then(res => {
        if(res.success || res.status == 200) {
          this.$store.dispatch("postApi");
          this.$Message.success(res.message ? res.message : "批量调价成功!");
          this.tjModal = false;
        }else{
          this.$Message.warning(res.message)
        }
      });
    },
    setBegDate (time) {
      this.formItem.startTime = time

      // 重置结束时间规则
      this.endOption = {
        disabledDate (date) {
          return date && date.valueOf() < new Date(time).valueOf()
        }
      }

      // 先选择结束时间再次选择开始时间大于结束，将结束时间置空
      if (
        this.formItem.endTime &&
        new Date(time).valueOf() > new Date(this.formItem.endTime).valueOf()
      ) {
        this.formItem.endTime = null
      }
    },
    setEndDate (time) {
      if (time) {
        this.formItem.endTime = time
        let endTime = this.formItem.endTime
          ? new Date(this.formItem.endTime).valueOf() -
          1 * 24 * 60 * 60 * 1000
          : ''
        this.options3 = {
          disabledDate (date) {
            return date && date.valueOf() > endTime
          }
        }
      } else {
        this.options3 = {
          disabledDate (date) {
            return false
          }
        }
      }
    },

    delAll () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        this.del(arr.join(','))
      } else {
        this.$Message.warning('请选择删除项')
      }
    },
    del (ids) {
      this.mode = 'post'
      this.content = '确认删除吗?'
      this.sucessMsg = '删除成功!'
      this.$refs.confirmModel.confirm(
        'product/hotelRoom/del?id=' + ids
      )
    },
    up(){
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let arr = []
        selection.forEach(element => {
          arr.push(element.id)
        })
        this.mode = "post"
        this.content = '确认上架吗？'
        this.sucessMsg = "上架成功!"
        this.$refs.confirmModel.confirm('product/api/hotelPush/enable?enable=T&ids=' + arr.join(','))
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    down(){
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let arr = []
        selection.forEach(element => {
          arr.push(element.id)
        })
        this.mode = "post"
        this.content = '确认下架吗？'
        this.sucessMsg = "下架成功!"
        this.$refs.confirmModel.confirm('product/api/hotelPush/enable?enable=F&ids=' + arr.join(','))
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tjdate:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
}
</style>
