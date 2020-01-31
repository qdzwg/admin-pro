<template>
    <div class="peizhi">
        <searchForm :search-items='searchItems'></searchForm>

        <Row :gutter="16" class="btn-groups">
       <!-- <Col span="2">
        <Button type="primary" icon="android-add" @click="test">手动添加权限测试</Button>
      </Col> -->
      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">添加</Button>
      </Col>
      <!-- <Col span="2">
        <Button type="error" icon="android-delete" sucessMsg="删除成功！" content="确认删除吗？" @click="delAll">删除</Button>
      </Col> -->
    </Row>

    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="delete"></confirm>
    
     <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position="right" :label-width="100" ref="formItem" :rules="ruleForm">
           <FormItem label="用户名(商户名称)：" prop="roleName">
            <Input v-model="formItem.roleName" ></Input>
          </FormItem>
          <FormItem label="用户密码：" prop="roleName">
            <Input v-model="formItem.roleName" ></Input>
          </FormItem>
          <FormItem label="真是姓名：" prop="roleName">
            <Input v-model="formItem.roleName" ></Input>
          </FormItem>
           <FormItem label="认证类型：" prop="authType">
            <Select v-model="formItem.authType"  style="width:200px">
                <Option v-for="item in authType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="姓名：" prop="roleName">
            <Input v-model="formItem.roleName" ></Input>
          </FormItem>
          <FormItem label="身份证号：" prop="roleName">
            <Input v-model="formItem.roleName" ></Input>
          </FormItem>
          <FormItem label="手持身份证：" prop="roleName">
            <input id="mFile" type="file" name="file" @change="myFile">
            <div>
                <img id="mImg" src="">
            </div>
          </FormItem>
          <FormItem label="个人/法人证件身份证正面：" prop="roleName">
            <input id="mFile" type="file" name="file">
            <div>
                <img id="mImg" src="">
            </div>
          </FormItem>
          <FormItem label="个人/法人证件身份证反面：" prop="roleName">
            <input id="mFile" type="file" name="file">
            <div>
                <img id="mImg" src="">
            </div>
          </FormItem>
          <FormItem label="所属地区：" prop="roleName">
            <select-item></select-item>
          </FormItem>
        </Form>
    </Modal>
    </div>
</template>


<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import selectItem from '@/components/global/select'
export default {
    data(){
        return{
            authType:[
                {
                    value:'corp',
                    label:'企业'
                },
                {
                    value:'person',
                    label:'个人'
                }
            ],
        searchItems: [
            {
                label: '用户名',
                type: 'input',
                name: 'accName'
            }
        ],
        columns:[
            {
                title: '序号',
                align: 'center',
                render: (h,params) => {
                    return h('span', params.index + 1)
                }
            },
            {
                title:'用户名',
                key:'accName',
            },
             {
                title:'最后登录时间',
                sortable: true,
                key:'loginDate'
            },
            {
                title:'认证类型',
                sortable: true,
                key:'authType',
                render: (h, params) => {
                return h('span', this.filter.accountauthType(params.row.authType))
                }
            },
            {
                title:'状态',
                sortable: true,
                key:'accStatus',
                render: (h, params) => {
                return h('span', this.filter.accountaccStatus(params.row.accStatus))
                }
            },
             {
          title: '操作',
          key: 'action',
          width:300,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '认证信息',
              action: () => {
                this.modal = true
                this.modalTitle = '编辑角色'
                this.formItem.roleName = params.row.roleName
                this.formItem.remark = params.row.remark
                this.formItem.switch = params.row.useFlag === '1'
                this.formItem.id = params.row.id
                this.formItem._method = 'put'
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('/admin/userAuth/userManageList/' + params.row.id)
              }
            },
            {
              title: '禁用',
              action: () => {
                this.$refs.confirmModel.confirm('/admin/userAuth/userManageList/' + params.row.id)
              }
            },
            {
              title: '重置密码',
              action: () => {
                this.$refs.confirmModel.confirm('/admin/userAuth/userManageList/' + params.row.id)
              }
            }
            ]
            return this.common.columnsHandle(h, actions)
          }
            }

        ],
        data:'',
        params:{page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
        url:'/admin/userAuth/userManageList',
        modal: false,
        formItem: {
            roleName: '',
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
    components:{
        searchForm,
        gridTable,
        confirm,
        selectItem
    },
    mounted(){
        

    },
    methods:{
        ok () {
            this.formItem.accType = 0
            this.formItem.useFlag = this.formItem.switch ? 1 : 0
            let _this = this
            let url = _this.type === 'add' ? '/admin/userAuth/userManageList/saveRole' : '/admin/userAuth/userManageList/update'
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
            this.formItem.roleName = ''
            this.formItem.switch = true
            this.formItem.remark = ''
            this.modalTitle = '新增角色'
        },
        delAll(){
            let selection = this.$refs.gridTable.selection
            if (selection.length) {
            let ids = ''
            selection.forEach(element => {
                ids += element.id + ','
            })
            this.$refs.confirmModel.confirm('/admin/userAuth/userManageList/' + ids)
            } else {
                this.$Message.warning('请选择一条数据！')
            }
        },
        myFile () {


            
         //判断 FileReader 是否被浏览器所支持
            if (!window.FileReader) return;


            var file = ev.target.files[0];  

            if(!file.type.match('image/*')){
                alert('上传的图片必修是png,gif,jpg格式的！');
                ev.target.value = ""; //显示文件的值赋值为空
                return;
            }

            var reader = new FileReader();  // 创建FileReader对象

            reader.readAsDataURL(file); // 读取file对象，读取完毕后会返回result 图片base64格式的结果

            reader.onload = function(e){
                document.getElementById('mImg').src = e.target.result;
            }

    }
 }
}
</script>

<style>
    #mImg {
            max-width: 100px;
        }
</style>




