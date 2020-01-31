<template>
    <div class="msg-template">
        <searchForm :search-items='searchItems'></searchForm>

        <Row :gutter="16" class="btn-groups">
       <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">新增</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete" sucessMsg="删除成功！" content="确认删除吗？" @click="delAll">删除</Button>
      </Col>
    </Row>

    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="delete"></confirm>
     <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
          <FormItem label="消息类型：" prop="msgType">
            <Select v-model="formItem.msgType" style="width:200px">
                <Option v-for="item in searchItems[0].data" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="模板类型：" prop="templateType">
            <Select v-model="formItem.templateType" style="width:200px">
                <Option v-for="item in searchItems[1].data" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态：" prop="status">
            <Select v-model="formItem.status" style="width:200px">
                <Option v-for="item in searchItems[2].data" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="标题：" prop="title">
            <Input v-model="formItem.title" placeholder="标题请用【】包裹起来"></Input>
          </FormItem>
          <FormItem label="模板内容：" prop="info">
            <Input v-model="formItem.info" type="textarea" placeholder="预留参数请使用${}" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
           <FormItem label="模板描述：" prop="descContent">
            <Input v-model="formItem.descContent" ></Input>
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
    data(){
        return{

        searchItems: [
            {
                label: '消息',
                type: 'select',
                name: 'msgType',
                data: [
                    {
                        value: '0',
                        label: '短信'
                    },
                    {
                        value: '1',
                        label: '邮件'
                    }           
                ]
            },
           {
                label: '模板',
                type: 'select',
                name: 'templateType',
                data: [
                    {
                        value: '0',
                        label: '用户'
                    },
                    {
                        value: '1',
                        label: '订单'
                    },
                    {
                        value: '2',
                        label: '店铺'
                    },
                    {
                        value: '3',
                        label: '营销中心'
                    }
                ]
            },
            {
                label: '状态',
                type: 'select',
                name: 'status',
                data: [
                    {
                        value: '00',
                        label: '注册'
                    },
                    {
                        value: '01',
                        label: '登录'
                    },
                    {
                        value: '02',
                        label: '忘记密码'
                    },
                    {
                        value: '15ticket_sync',
                        label: '同步门票下单成功'
                    },
                    {
                        value: '03',
                        label: '备用金支付密码'
                    },
                    {
                        value: '04',
                        label: '会员关怀'
                    },
                    {
                        value: '15ticket_ordinary',
                        label: '门票下单成功'
                    },
                    {
                        value: '05',
                        label: '信用支付密码'
                    },
                    {
                        value: '06',
                        label: '主题认证'
                    },
                    {
                        value: '17',
                        label: '退单成功'
                    },
                    {
                        value: '30',
                        label: '拼团成功通知'
                    },
                    {
                        value: '20',
                        label: '店铺认证短信验证'
                    },
                    {
                        value: '31',
                        label: '拼团失败通知'
                    },
                    {
                        value: '15hotel',
                        label: '酒店下单成功'
                    },
                    {
                        value: '32',
                        label: '团长开团通知'
                    }
                ]
            }
           
        ],
        columns:[
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title:'消息类型',
                key:'msgType',
                sortable: true,
                render: (h, params) => {
                return h('span', this.filter.accountmsgType(params.row.msgType))
                }
            },
            {
                title:'模板类型',
                key:'templateType',
                sortable: true,
                render: (h, params) => {
                return h('span', this.filter.accounttemplateType(params.row.templateType))
                }
            },
            {
                title:'状态',
                key:'status',
                sortable: true,
                render: (h, params) => {
                return h('span', this.filter.accountStatus(params.row.status))
                }
            },
            {
                title:'标题',
                key:'title',
                sortable: true,
                
            },
            {
                title:'模板内容',
                key:'info',
                sortable: true,
                width: 300,
            },
            {
                title:'模板描述',
                key:'descContent',
                sortable: true,
            },
             {
                title: '操作',
                key: 'action',
                width: 150,
                align: 'center',
                render: (h, params) => {
                    const actions = [{
                    title: '修改',
                    action: () => {
                        this.modal = true
                        this.modalTitle = '编辑角色'
                        this.formItem.title = params.row.title
                        this.formItem.descContent = params.row.descContent
                        this.formItem.info = params.row.info
                        this.formItem.msgType = params.row.msgType
                        this.formItem.templateType = params.row.templateType
                        this.formItem.status = params.row.status
                        this.formItem.switch = params.row.useFlag === '1'
                        this.formItem.id = params.row.id
                        this.formItem._method = 'put'
                        this.type = 'edit'
                    }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('list/admin/sysMsgTemplate/' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
            }
        ],
        data:'',
        params:{page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
        url:'/admin/sysMsgTemplate/grid',
        modal: false,
        formItem: {
            title: '',
            switch: true,
            descContent: '',
            info: '',
            msgType: '',
            templateType: '',
            status: '',
        },
        modalTitle: '新增角色',
        type: 'add',
        loading: true,
        ruleForm: {
            title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
            ],
            descContent: [
            {required: true, message: '请输入模板描述', trigger: 'blur'}
            ],
            info: [
            {required: true, message: '请输入模板内容', trigger: 'blur'}
            ],
            msgType:[
            { required: true, message: '请选择消息', trigger: 'change' }
            ],
            templateType:[
            { required: true, message: '请选择模板', trigger: 'change' }
            ],
            status:[
            { required: true, message: '请选择状态', trigger: 'change' }
            ],
        }
    }
},
    components:{
        searchForm,
        gridTable,
        confirm
    },
    mounted(){

    },
    methods:{
        ok () {
            this.formItem.accType = 0
            this.formItem.useFlag = this.formItem.switch ? 1 : 0
            let _this = this
            let url = _this.type === 'add' ? 'list/admin/sysMsgTemplate/saveRole' : 'list/admin/sysMsgTemplate/update'
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
        showModal(){
            this.modal = true
            this.type = 'add'
            this.formItem.status = ''
            this.formItem.descContent = ''
            this.formItem.info = ''
            this.formItem.msgType = ''
            this.formItem.templateType = true
            this.formItem.title = ''
            this.modalTitle = '新增角色'
        },
        delAll(){
            let selection = this.$refs.gridTable.selection
            if (selection.length) {
            let ids = ''
            selection.forEach(element => {
                ids += element.id + ','
            })
            this.$refs.confirmModel.confirm('list/admin/sysMsgTemplate/' + ids)
            } else {
                this.$Message.warning('请选择一条数据！')
            }
        }

    }
}
</script>



