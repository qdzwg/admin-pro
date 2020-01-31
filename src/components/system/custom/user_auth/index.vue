<template>
    <div class="sys-param">
        <searchForm :search-items='searchItems'></searchForm>

    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="delete"></confirm>
     <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle"  @on-ok="ok"  @on-cancel="cancel" width="800" >
        <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" style="padding:0 50px;">
          <FormItem label="认证类型:" >
            {{formItem.authType}}
          </FormItem>
          <FormItem label="姓名：：">
            {{formItem.name}}
          </FormItem>
          <FormItem label="身份证:" >
            {{formItem.certNo}}
          </FormItem>
          <FormItem label="身份证图片地址（正面）:" >
            <img :src="formItem.certNoPositiveAddr" alt="" style="width:100%">
          </FormItem>
          <FormItem label="身份证图片地址（反面）:" >
           <img :src="formItem.certNoReverseSideAddr" alt="" style="width:100%">
          </FormItem>
          <FormItem label="手持身份证图片地址:" >
           <img :src="formItem.certNoInHandAddr" alt="" style="width:100%">
          </FormItem>
          <FormItem label="所属地区:" >
            {{formItem.areaName}}
          </FormItem>
          <FormItem label="审核状态:" >
            {{formItem.auditStatus}}
          </FormItem>
          <FormItem label="审核信息:" >
            {{formItem.auditMsg}}
          </FormItem>
          <FormItem label="创建时间:" >
            {{formItem.createTime}}
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
                label: '姓名',
                type: 'input',
                name: 'name'
            },
            {
                label: '身份证',
                type: 'input',
                name: 'certNo'
            },
            {
                label: '企业名称',
                type: 'input',
                name: 'corpName'
            },
            {
                label: '法人',
                type: 'input',
                name: 'legalPerson'
            },
            {
                label: '法人证件号',
                type: 'input',
                name: 'legalPersonCertNo'
            },
            {
                label: '状态',
                type: 'select',
                name: 'auditStatus',
                data: [
                    {
                        value: 'audit_success',
                        label: '审核成功'
                    },
                    {
                        value: 'wait',
                        label: '待审核'
                    },
                    {
                        value: 'audit_failure',
                        label: '审核失败'
                    }           
                ]
            },
        ],
        columns:[
            {
                title:'商户主账号',
                key:'userName',
            },
            {
                title:'认证类型',
                key:'authType',
                sortable: true,
                render: (h, params) => {
                return h('span', this.filter.accountauthType(params.row.authType))
                }
            },
            {
                title:'姓名',
                key:'name',
                sortable: true,
            },
            {
                title:'身份证',
                key:'certNo',
                width:180,
                sortable: true,
            },
            {
                title:'企业名称',
                key:'corpName',
                sortable: true,
            },
            {
                title:'法人',
                key:'legalPerson',
                sortable: true,
            },
             {
                title:'法人证件号',
                key:'legalPersonCertNo',
                sortable: true,
            },
             {
                title:'营业执照号',
                key:'businessLicenseNo',
                sortable: true,
            },
             {
                title:'审核状态',
                key:'auditStatus',
                sortable: true,
                render: (h, params) => {
                return h('span', this.filter.accountauditStatus(params.row.auditStatus))
                }
            },
             {
                title:'申请时间',
                key:'createTime',
                sortable: true,
                align: 'center',
            },
             {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {    
            const actions = [{
              title: '明细',
              action: () => {
                this.modal = true
                this.modalTitle = '认证明细'
                this.formItem.name = params.row.name
                this.formItem.authType = this.filter.accountauthType(params.row.authType)
                this.formItem.certNo = params.row.certNo
                this.formItem.certNoPositiveAddr = params.row.certNoPositiveAddr
                this.formItem.certNoReverseSideAddr = params.row.certNoReverseSideAddr
                this.formItem.certNoInHandAddr = params.row.certNoInHandAddr
                this.formItem.auditStatus = this.filter.accountauditStatus(params.row.auditStatus)
                this.formItem.areaName = params.row.areaName
                this.formItem.auditMsg = params.row.auditMsg
                this.formItem.createTime = params.row.createTime
                this.formItem.switch = params.row.useFlag === '1'
                this.formItem._method = 'put'
              }
            },
            ]
            return this.common.columnsHandle(h, actions)
          }
            }

        ],
        data:'',
        params:{page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
        url:'list/admin/userAuth/grid',
        modal: false,
        formItem: {
            name: '',
            authType: '',
            certNo:'',
            certNoPositiveAddr:'',
            certNoReverseSideAddr:'',
            certNoInHandAddr:'',
            auditStatus:'',
            areaName:'',
            auditMsg:'',
            createTime:'',
            switch: true,
        },
        modalTitle: '新增角色',
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
             _this.modal = false
            
        },
        cancel () {
            // this.$Message.info('Clicked cancel')
        }

    }
}
</script>



