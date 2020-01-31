<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
       <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
     <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position="right" :label-width="100" ref="formItem" :rules="ruleForm">
          <FormItem label="详细地址：" prop="roleName">
            <Input v-model="formItem.addr" placeholder="填写详细地址"></Input>
          </FormItem>
          <FormItem label="地图坐标">
           <Col span="16">
              <Input v-model="formItem.latitudeLongitude" :readonly="true"  placeholder="请选择坐标"></Input>
            </Col>
            <Col span="5" offset="1">
              <Button   type="primary" @click="gutterAddr">获取坐标</Button>
            </Col>
          </FormItem>
        </Form>
    </Modal>
    <!-- 地图 -->
    <amap ref="bdMap" @getPoint="address"></amap>
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import amap from '@/components/global/amap'
export default {
  data () {
    return {
      latAndLng:"",
      mode:"",
      content:"",
      sucessMsg:"",
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '景区名称',
          key: 'scenicName'
        },
        {
          title: '修改人',
          key: 'createBy'
        },
        {
          title: '提交时间',
          key: 'createTime'
        },
        {
          title: '状态',
          key: 'auditStatus',
          render: (h,params) => {
            let auditStatus=''
            if(params.row.auditStatus==='0'){
              auditStatus='待审核'
            } else if(params.row.auditStatus==='1'){
              auditStatus='已审核'
            }else if(params.row.auditStatus==='2'){
              auditStatus = '审核驳回'
            }
            return h("span",auditStatus)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            let actions =[]
            if(params.row.auditStatus === '0'){
              actions = [{
                title: '审核成功',
                action: () => {
                    this.modal = true
                this.modalTitle = '同步到智游宝景点信息'
                this.formItem.latitudeLongitude = ''
                this.formItem.addr = ''
                this.type = 'edit'
                  }
                 },
                 {
                title: '审核失败',
                action: () => {
                  this.mode = "done"
                  this.content = "确认审核失败吗？"
                  this.sucessMsg="操作成功"
                  this.$refs.confirmModel.confirm('list/product/parkInfoChange/auditFail?id=' + params.row.id)
                }
            }]
            }
           
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: 'product/parkInfoChange/grid',
      searchItems: [
        {
          label: '景区名称',
          type: 'input',
          name: 'scenicName'
        },
        // {
        //   label: '登录时间',
        //   type: 'date',
        //   name: 'createTime'
        // },
        {
          label: '状态',
          type: 'select',
          name: 'auditStatus',
          data: [
            {
              value: '0',
              label: '待审核'
            },
            {
              value: '1',
              label: '已审核'
            },
            {
              value: '2',
              label: '审核驳回'
            }
          ]
        }
      ],
      modal: false,
      formItem: {
        latitudeLongitude: '',
        switch: true,
        remark: ''
      },
      modalTitle: '新增角色',
      type: 'add',
      loading: true,
      ruleForm: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: {searchForm, gridTable, confirm, amap},
  methods: {
    address(val){
      this.formItem.latitudeLongitude = val.lng + "," + val.lat
    },
    gutterAddr(){
      this.$refs.bdmap.showModal(this.formItem.latitudeLongitude)
    },
    ok () {
      this.formItem.accType = 0
      this.formItem.useFlag = this.formItem.switch ? 1 : 0
      let _this = this
      let url = _this.type === 'add' ? 'list/admin/sysRole/saveRole' : 'list/admin/sysRole/update'
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: 'modal',
        callback (res) {
          if (res.success) {
            _this.modal = false
          }
        }
      })
    },
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
    showModal () {
      this.modal = true
      this.type = 'add'
      this.formItem.roleName = ''
      this.formItem.switch = true
      this.formItem.remark = ''
      this.modalTitle = '新增角色'
    },
    delAll () {
      this.mode = "delete"
      this.content = "确认删除吗？"
      this.sucessMsg="删除成功"
      let selection = this.$refs.gridTable.selection
      if (selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.$refs.confirmModel.confirm('list/product/parkInfoChange/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    }
  }
}
</script>
