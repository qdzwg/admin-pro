<template>
    <div class="sys-announcement">
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
          <FormItem label="标题：" prop="title">
            <Input v-model="formItem.title" placeholder="填写角色名称"></Input>
          </FormItem>
         
          <FormItem label="内容：" prop="content">
            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
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
                label: '标题',
                type: 'input',
                name: 'title'
            }
        ],
        columns:[
            {
                type: 'selection',
                width: 60,
                align: 'center'
            },
            {
                title:'标题',
                key:'title',
                sortable: true,
                 width: 200,
            },
             {
                title:'内容',
                sortable: true,
                key:'content'
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
                this.formItem.content = params.row.content
                this.formItem.switch = params.row.useFlag === '1'
                this.formItem.id = params.row.id
                this.formItem._method = 'put'
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('list/admin/sysAnnouncement/' + params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
            }

        ],
        data:'',
        params:{page: 1, limit: 10, sort: 'modifyTime', order: 'desc'},
        url:'admin/sysAnnouncement/grid',
        modal: false,
        formItem: {
            title: '',
            switch: true,
            content: ''
        },
        modalTitle: '新增角色',
        type: 'add',
        loading: true,
        ruleForm: {
            title: [
            {required: true, message: '请输入标题', trigger: 'blur'}
            ],
            content:[
                {required: true, message: '请输入内容', trigger: 'blur'}
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
            let url = _this.type === 'add' ? 'list/admin/sysAnnouncement/saveRole' : 'list/admin/sysAnnouncement/update'
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
            this.formItem.title = ''
            this.formItem.switch = true
            this.formItem.content = ''
            this.modalTitle = '新增角色'
        },
        delAll(){
            let selection = this.$refs.gridTable.selection
            if (selection.length) {
            let ids = ''
            selection.forEach(element => {
                ids += element.id + ','
            })
            this.$refs.confirmModel.confirm('list/admin/sysAnnouncement/' + ids)
            } else {
                this.$Message.warning('请选择一条数据！')
            }
        }

    }
}
</script>



