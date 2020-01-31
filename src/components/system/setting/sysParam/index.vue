<template>
    <div class="sys-param">
        <searchForm :search-items='searchItems'></searchForm>

        <Row :gutter="16" class="btn-groups">
       <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">新增</Button>
      </Col>
      <!-- <Col span="2">
        <Button type="error" icon="android-delete" sucessMsg="删除成功！" content="确认删除吗？" @click="delAll">删除</Button>
      </Col> -->
    </Row>

    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="done"></confirm>
     <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
          <FormItem label="参数编号：" prop="paramCode">
            <Input v-model="formItem.paramCode" ></Input>
          </FormItem>
          <FormItem label="参数名称：" prop="paramName">
            <Input v-model="formItem.paramName" ></Input>
          </FormItem> 
          <FormItem label="选项：">
            <Input v-model="formItem.paramOption" type="textarea" placeholder="0：已支付1：待支付（注意中英文）" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          <FormItem label="备注：" >
            <Input v-model="formItem.remark" ></Input>
          </FormItem>
          <FormItem label="排序" >
            <Input v-model="formItem.sortNo" ></Input>
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
    // created(){
    //     console.log("asdada")
    // },
    data(){
        return{

        searchItems: [
            {
                label: '参数编号',
                type: 'input',
                name: 'paramCode'
            },
            {
                label: '参数名称',
                type: 'input',
                name: 'paramName'
            },
            {
                label: '选项',
                type: 'input',
                name: 'paramOption'
            },
            {
                label: '备注',
                type: 'input',
                name: 'remark'
            },
        ],
        columns:[
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title:'参数编号',
                key:'paramCode',
                sortable: true,
            },
            {
                title:'参数名称',
                key:'paramName',
                sortable: true,
            },
            {
                title:'选项',
                key:'paramOption',
                sortable: true,
            },
            {
                title:'备注',
                key:'remark',
                sortable: true,
            },
            {
                title:'排序',
                key:'sortNo',
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
                this.modalTitle = '编辑参数'
                this.formItem.paramCode = params.row.paramCode
                this.formItem.paramName = params.row.paramName
                this.formItem.paramOption = params.row.paramOption
                this.formItem.sortNo = params.row.sortNo
                this.formItem.remark = params.row.remark
                this.formItem.switch = params.row.useFlag === '1'
                this.formItem.id = params.row.id
                this.formItem._method = 'post'
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('/admin/sysparam/del?id=' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
            }

        ],
        data:'',
        params:{page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
        url:'/admin/sysparam/grid',
        modal: false,
        formItem: {
            paramCode: '',
            paramName:'',
            paramOption:'',
            sortNo:'',
            switch: true,
            remark: ''
        },
        modalTitle: '新增参数',
        type: 'add',
        loading: true,
        ruleForm: {
            paramCode: [
            {required: true, message: '请输入参数名称', trigger: 'blur'}
            ],
            paramName: [
            {required: true, message: '请输入参数名称', trigger: 'blur'}
            ]
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
            let url = _this.type === 'add' ? '/admin/sysparam/save' : '/admin/sysparam/update'
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
            this.formItem.paramCode = ''
            this.formItem.paramName = ''
            this.formItem.paramOption = ''
            this.formItem.sortNo = ''
            this.formItem.switch = true
            this.formItem.remark = ''
            this.modalTitle = '新增参数'
        },
        delAll(){
            let selection = this.$refs.gridTable.selection
            if (selection.length) {
            let ids = ''
            selection.forEach(element => {
                ids += element.id + ','
            })
            this.$refs.confirmModel.confirm('/admin/sysparam/del/?' + ids)
            } else {
                this.$Message.warning('请选择一条数据！')
            }
        }

    }
}
</script>



