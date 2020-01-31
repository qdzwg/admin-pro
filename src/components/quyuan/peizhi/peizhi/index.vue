<template>
    <div class="peizhi">
    <Row :gutter="20" class="btn-groups" v-if="data==''">
       <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
      <Col span="2" style="margin-right:50px;">
        <Button type="primary" icon="android-add" @click="showModal"> 无全员账户注册入口</Button>
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-add"  @click="showModal2">新有全员账户配置入口</Button>
      </Col>
    </Row>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel"></confirm>
    
     <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position="right" :label-width="100" ref="formItem" :rules="ruleForm">
           <FormItem label="管理员账号：" prop="qyAccount">
            <Input v-model="formItem.qyAccount" ></Input>
          </FormItem>
          <FormItem label="密码：" prop="roleName">
            <Input v-model="formItem.qyPassword"  placeholder="已设置" type="password"></Input>
          </FormItem>
          
        </Form>
    </Modal>

     <!-- 弹出无全员账户注册入口 -->
    <Modal v-model="modal2" :title="modalTitle2" :loading="loading" @on-ok="ok" width=600  @on-cancel="cancel" :type="type">
        <Form :model="formItem2" label-position="right" :label-width="100" ref="formItem2" :rules="ruleForm2">
           <FormItem label="景区企业码：" prop="corpCode">
            <Input v-model="formItem2.corpCode" ></Input>
          </FormItem>
          <FormItem label="企业名称：" prop="corpName">
            <Input v-model="formItem2.corpName" ></Input>
          </FormItem>
          <FormItem label="企业联系人：" prop="linkMan">
            <Input v-model="formItem2.linkMan" ></Input>
          </FormItem>
          <FormItem label="地址：" prop="address">
            <Input v-model="formItem2.address" ></Input>
          </FormItem>
          <FormItem label="用户名：" prop="username">
            <Input v-model="formItem2.username" ></Input>
          </FormItem>
          <FormItem label="用户姓名：" prop="realname">
            <Input v-model="formItem2.realname" ></Input>
          </FormItem>
          <FormItem label="帮助信息：">
            <Input type="textarea" v-model="formItem2.remark" ></Input>
          </FormItem>
          
        </Form>
    </Modal>

     <!-- 弹出新有全员账户配置入口 -->
    <Modal v-model="modal3" :title="modalTitle3" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem3" label-position="right" :label-width="100" ref="formItem3" :rules="ruleForm">
           <FormItem label="景区企业码：" prop="corpCode">
            <Input v-model="formItem3.corpCode" ></Input>
          </FormItem>
          <FormItem label="帮助信息：">
            <Input type="textarea" v-model="formItem3.remark" ></Input>
          </FormItem>
          
        </Form>
    </Modal>
    </div>
</template>


<script>

import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'

export default {
    data(){
        return{
        columns:[       
            {
                title:'店铺名称',
                key:'merchantName',
            },
             {
                title:'景区企业码',
                sortable: true,
                key:'marketDisAccount'
            },
            {
                title:'景区管理员账户',
                sortable: true,
                key:'qyAccount',
            },
            {
                title:'专属分销商账户',
                sortable: true,
                key:'disAccname',
            },
             {
          title: '操作',
          key: 'action',
          width:300,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '添加/修改管理员账户',
              action: () => {
                this.modal = true
                this.modalTitle = '编辑角色'
                this.formItem.qyAccount = params.row.qyAccount
                this.formItem.qyPassword = params.row.qyPassword
                this.formItem.switch = params.row.useFlag === '1'
                this.formItem.id = params.row.id
                this.formItem._method = 'put'
                this.type = 'edit'
              }
            },
            {
              title: '一键登录管理员',
              action: () => {
                this.$refs.confirmModel.confirm('/admin/userAuth/userManageList/' + params.row.id)
              }
            },
            
            ]
            return this.common.columnsHandle(h, actions)
          }
            }

        ],
        data:'',
        params:{page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
        url:'list/merchant/merchantWholeMarket/grid',
        modal: false,
        modal2: false,
        modal3: false,
        formItem: {
            qyAccount: '',
            switch: true,
            qyPassword: ''
        },
        formItem2:{
            corpCode:'',
            corpName:'',
            linkMan:'',
            address:'',
            username:'',
            realname:'',
            remark:'',
            switch: true,
        },
        formItem3:{
            corpCode:'',
            remark:'',
            switch: true,

        },
        modalTitle: '新增角色',
        modalTitle2: '新增角色',
        modalTitle3: '新增角色',
        type: 'add',
        loading: true,
        ruleForm: {
            qyAccount: [
            {required: true, message: '请输入管理员账号', trigger: 'blur'}
            ],
           

        },
         ruleForm2: { 
            corpCode: [
            {required: true, message: '请输入景区企业码', trigger: 'blur'}
            ],
            corpName: [
            {required: true, message: '请输入企业名称', trigger: 'blur'}
            ],
            linkMan: [
            {required: true, message: '请输入企业联系人', trigger: 'blur'}
            ],
            address: [
            {required: true, message: '请输入地址', trigger: 'blur'}
            ],
            username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
            ],
            realname: [
            {required: true, message: '请输入用户姓名', trigger: 'blur'}
            ]

        }
    }
},
    components:{    
        gridTable,
        confirm,
    },
    mounted(){
        

    },
    methods:{
        ok () {
            this.formItem.accType = 0
            this.formItem.useFlag = this.formItem.switch ? 1 : 0
            let _this = this

            let url = '',params={},modal=''
            
            if(_this.type==='addyou'){
                url='list/merchant/merchantWholeMarket/doSaveWhole'
                params=_this.formItem3
                modal=_this.modal3
            }else if(_this.type==='add'){
                url='list/merchant/merchantWholeMarket/addSinceMange'
                params=_this.formItem
                modal=_this.modal
            }else if(_this.type==='addwu'){
                url='list/merchant/merchantWholeMarket/doSave'
                params=_this.formItem2
                modal=_this.modal2
            }
            this.common.formPost(this, {
                url,
                params: params,
                mold: modal,
                callback (res) {
                if (res.success) {
                    modal = false
                }
                }
            })
        },
        cancel () {
            // this.$Message.info('Clicked cancel')
        },
        showModal(){
            this.modal2 = true
            this.type = 'addwu'
            this.formItem2.corpCode=''
            this.formItem2.corpName=''
            this.formItem2.linkMan=''
            this.formItem2.address=''
            this.formItem2.username=''
            this.formItem2.realname=''
            this.formItem2.remark = ''
            this.modalTitle2 = '添加'
        },
        showModal2(){
            this.modal3 = true
            this.type = 'addyou'
            this.formItem3.corpCode = ''
            this.formItem3.switch = true
            this.formItem3.remark = ''
            this.modalTitle3 = '设置景区企业码'
        },
 }
}
</script>

<style>
    #mImg {
            max-width: 100px;
        }
</style>




