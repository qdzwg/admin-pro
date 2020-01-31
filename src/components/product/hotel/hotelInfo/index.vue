<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="2">
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
      blurGet: false, // 排序是否请求接口
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '酒店编码',
          key: 'productCode'
        },
        {
          title: '酒店名称',
          key: 'name'
        },        
        {
          title: '星级',
          key: 'hotelLevel',
          render: (h,params) => {
            return h("span",params.row.hotelLevel=='0'?'无':params.row.hotelLevel+'星级')
          }
        },
        {
          title: '状态',
          key: 'enabled',
          render: (h,params) => {
            return h('span',params.row.enabled=='T'?'已上架':'已下架')
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
                      this.apiGet('/product/hotelInfo/updateSortNo', {
                        hotelId: params.row.id,
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
          width:250,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '房型',
              action: () => {
               this.$router.push('/hotelRoom?id=' + params.row.id)
              }
            },
            {
              title: '修改',
              action: () => {
                this.$router.push("/hotelAddOrEdit?id=" + params.row.id)
              }
            },
            {
              title: '删除',
              action: () => {
                this.mode="done"
                this.content = "删除后将影响已有订单退票、核销，请谨慎操作"
                this.sucessMsg = "删除成功!"
                this.$refs.confirmModel.confirm('product/hotelInfo/del?id=' + params.row.id + '&' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: '/product/hotelInfo/grid',
      searchItems: [
        {
          label: '酒店名称',
          type: 'input',
          name: 'name'
        },
        {
          label: '酒店编号',
          type: 'input',
          name: 'productCode'
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
        },
        {
          label: '酒店星级',
          type: 'select',
          name: 'hotelLevel',
          data: [
            {
              value: '',
              label: '请选择'
            },
            {
              value: '0',
              label: '无'
            },
            {
              value: '1',
              label: '1星级'
            },
            {
              value: '2',
              label: '2星级'
            },
            {
              value: '3',
              label: '3星级'
            },
            {
              value: '4',
              label: '5星级'
            },
            {
              value: '5',
              label: '5星级'
            }
          ]
        }
      ]
    }
  },
  components: {searchForm, gridTable, confirm},
  methods: {
    add(){
      this.$router.push("/publishHotel")
    },
    delAll () {
      this.mode="delete"
      this.content = "删除后将影响已有订单退票、核销，请谨慎操作"
      this.sucessMsg = "删除成功!"
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let arr = []
        selection.forEach(element => {
          arr.push(element.id)
        })
        this.$refs.confirmModel.confirm('product/hotelInfo/' + arr.join(","))
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    up(){
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let arr = []
        selection.forEach(element => {
          arr.push(element.id)
        })
        this.mode = "done"
        this.content = '确认上架吗？'
        this.sucessMsg = "上架成功!"
        this.$refs.confirmModel.confirm('product/hotelInfo/enable?enable=T&ids=' + arr.join(','))
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
        this.mode = "done"
        this.content = '确认下架吗？'
        this.sucessMsg = "下架成功!"
        this.$refs.confirmModel.confirm('product/hotelInfo/enable?enable=F&ids=' + arr.join(','))
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    }
  }
}
</script>
