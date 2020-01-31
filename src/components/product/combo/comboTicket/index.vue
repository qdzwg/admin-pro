<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="2" v-if="isEdit">
        <Button type="primary" icon="android-add" @click="add">新增</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-done" @click="onLine">上架</Button>
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-close" @click="offLine">下架</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      
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
          title: '套票票型名称',
          key: 'modelName'
        }, 
        {
          title: '票型编码',
          key: 'modelCode'
        },
        {
          title: '套票名称',
          key: 'familyInfoName'
        },
        {
          title: '票型价格',
          key: 'totalPrice'
        },
        {
          title: '状态',
          key: 'enabled',
          render: (h,params) => {
            return h('span',params.row.enabled=='F'?'已下架':'已上架')
          }

        },
        {
          title: '排序',
          key: 'sortNo',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h(
              'Input',
              {
                props: {
                  value: params.row.sortNo,
                  size: 'small',
                  maxlength: 3
                },
                on: {
                  input: value => {
                    params.row.sortNo = value
                    this.blurGet = true
                  },
                  'on-blur': () => {
                    if (this.blurGet) {
                      this.apiPost('/product/api/familyTicket/sort', {
                        familyId: params.row.id,
                        sortNo: params.row.sortNo
                      }).then(res => {
                        if (res.success) {
                          this.blurGet = false
                          this.$Message.success('操作成功!')
                          this.$refs.gridTable.loadpage()
                        } else {
                          this.$Message.warning(res.message)
                        }
                      })
                    }
                  },
                  'on-keyup': value => {
                    if (params.row.sortNo.length) {
                      params.row.sortNo = params.row.sortNo.replace(/[^\.\d]/g, '')
                    }
                  }
                }
              },
              ''
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          width:300,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '价格库存日历',
              action: () => {
                this.gotoRouter(params.row.id);
                
              //  this.$router.push("/comboInventoryCl/" + params.row.id)
              }
            },
            {
              title: '产品明细',
              action: () => {
               this.$router.push('/comboDetail?id=' + params.row.id)
              }
            },
            {
              title: '完善信息',
              action: () => { 
                if(this.$route.query&&this.$route.query.comboId){
                  this.$router.push(`/comboAddOrEdit?comboId=${this.$route.query.comboId}&cId=${params.row.id}`);
                }else{
                  this.$router.push(`/comboAddOrEdit?cId=${params.row.id}`);
                }
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: '/product/api/familyTicket/grid?familyInfoId=' + ((this.$route.query&&this.$route.query.comboId)?this.$route.query.comboId:''),
      searchItems: [
       
        {
          label: '票型编码',
          type: 'input',
          name: 'modelCode'
        },
        {
          label: '套票名称',
          type: 'input',
          name: 'modelName'
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
      ]
    }
  },
  components: {searchForm, gridTable, confirm},
  methods: {
    add(){
      this.$router.push("/comboAddOrEdit?comboId="+this.$route.query.comboId+'&action=cAdd')
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
    onLine () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {        
        this.mode = 'post'
        this.content = '确认上架吗?'
        this.sucessMsg = '上架成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/familyTicket/enable?familyId=' +
          arr.join(',') +
          '&enable=T'
        )
      } else {
        this.$Message.warning('请选择上架项')
      }
    },
    offLine () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        
        this.mode = 'post'
        this.content = '确认下架吗?'
        this.sucessMsg = '下架成功!'
        this.$refs.confirmModel.confirm(
          '/product/api/familyTicket/enable?familyId=' +
          arr.join(',') +
          '&enable=F'
        )
      } else {
        this.$Message.warning('请选择下架项')
      }
    },
    del (ids) {
      this.mode = 'post'
      this.content = '确认删除吗?'
      this.sucessMsg = '删除成功!'
      this.$refs.confirmModel.confirm(
        '/product/api/familyTicket/del?familyId=' + ids
      )
    },
    gotoRouter(id) {
      let year=new Date().getFullYear(), month=new Date().getMonth();
      let fMonth = year + "-" + (month + 1);
      this.apiPost('/product/api/familyTicket/selectFamilyCalendar?familyTicketId=' + id+'&month='+fMonth).then(res =>{
        if (res.status == 200) {
          this.$router.push("/comboInventoryCl/" + id)            
        }else{
          this.$Message.warning(res.message)
        }
      })

    }
  },
  created() {
    this.isEdit = this.$route && this.$route.query && this.$route.query.comboId;  
  }
}
</script>
