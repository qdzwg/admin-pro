<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">

      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">添加</Button>
      </Col>
  
    </Row>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" sucessMsg="删除成功！" content="确认删除吗？" mode="delete"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal" :title="modalTitle" :loading="loading" @on-ok="ok"  @on-cancel="cancel" :type="type">
        <Form :model="formItem" label-position='right' :label-width="120" ref="formItem" :rules="ruleForm">
          <FormItem label="组件名称：" prop="pluginsName">
            <Input v-model="formItem.pluginsName" placeholder="填写组件名称"></Input>
          </FormItem>
          <FormItem label="组件唯一标识：" prop='pluginsUniqueFlag'>
            <Input v-model="formItem.pluginsUniqueFlag"  placeholder="填写组件唯一标识" type="text"></Input>
          </FormItem>
          <FormItem label="组件基础内容：" prop='dataContent'>
            <Input v-model="formItem.dataContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          <FormItem label="组件图片：">
            <Input v-model="formItem.linkMobileImg" style="display:none"></Input>
            <my-img :limitNum="1" :uploadList="singleImgList" @getImgUrl="setWapUrl"></my-img>
            <p>建议上传小于2M， 宽750px，高560px的JPG/PNG格式的图片</p>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import {apiGet} from "@/fetch/api.js"
import myImg from "@/components/global/singleImg"
export default {
  data () {
    return {
      columns: [
        {
          title: '序号',
          width: 120,
          align: 'center',
          render: (h,params) => {
             return h('span', params.index + 1)
          }
        },
        {
          title: '组件名称',
          key: 'pluginsName',
          sortable: true
        },
        {
          title: '组件唯一标识',
          key: 'pluginsUniqueFlag',
          sortable: true
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '操作',
          key: 'action',
          // width: 150,
          align: 'center',
          render: (h, params) => {
            const actions = [
            {
              title: '修改',
              action: () => {
                this.modal = true
                this.modalTitle = '修改组件'
                this.formItem.pluginsName = params.row.pluginsName
                this.formItem.pluginsUniqueFlag = params.row.pluginsUniqueFlag
                this.formItem.dataContent = params.row.dataContent
                this.formItem.pluginsPic = params.row.pluginsPic
                this.formItem.id = params.row.id
                this.type = 'edit'
              }
            },
            {
              title: '删除',
              action: () => {
                this.mode = "delete";
                this.content = "确定删除吗？";
                this.sucessMsg = "操作成功！";
                this.$refs.confirmModel.confirm('/admin/pluginsIcon/' + params.row.id)
                // this.$store.dispatch('postApi');
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      singleImgList: [],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: '/admin/pluginsIcon/grid',
      searchItems: [
        {
          label: '组件名称',
          type: 'input',
          name: 'pluginsName'
        },
        {
          label: '组件唯一标识',
          type: 'input',
          name: 'pluginsUniqueFlag'
        }
      ],
      modal: false,
      formItem: {
        pluginsName: '',
        pluginsUniqueFlag: '',
        linkMobileImg: '',
        dataContent: '' ,
        id: '',
        pluginsPic: ''
      },
      modalTitle: '新增组件',
      type: 'add',
      loading: true,
      ruleForm: {
        pluginsName: [
          {required: true, message: '请输入组件名称', trigger: 'blur'}
        ],
        pluginsUniqueFlag: [
          {required: true, message: '请输入组件唯一标识', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: {searchForm, gridTable, confirm, myImg},
  methods: {
    setWapUrl(imgArr) {
      this.formItem.pluginsPic = imgArr.join(",");
      this.formItem.linkMobileImg = imgArr.join(",");
    //   this.$refs.formItem.validateField("linkMobileImg");
    },
    ok () {
      let _this = this
      let url = _this.type === 'add' ? '/admin/pluginsIcon/save' : '/admin/pluginsIcon/editSave'
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: 'modal',
        callback (res) {
          if (res.success) {
            _this.$Message.success(_this.type === 'add'?'添加成功!':'修改成功!')
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
      this.formItem.pluginsName = ''
      this.formItem.pluginsUniqueFlag = ''
      this.formItem.dataContent = ''
      this.formItem.pluginsPic = ''
       this.formItem.id = ''
      this.modalTitle = '添加组件'
    }
  }
}
</script>
