<template>
  <div>
    <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="2">
        <Button type="primary" icon="android-add" @click="showModal">新增</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete">删除</Button>
      </Col>
    </Row>
    <gridTable :columns="columns" :data="data" :url="url"></gridTable>
    <Modal v-model="modal" :title="modalTitle" @on-ok="ok"  @on-cancel="cancel">
        <Form :model="formItem" :label-width="60">
          <FormItem label="标题：">
            <Input v-model="formItem.title" placeholder="填写标题"></Input>
          </FormItem>
          <FormItem label="内容：">
            <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
import searchForm from '../../global/searchForm'
import gridTable from '../../global/gridTable'
import store from '@/store'
export default {
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '内容',
          key: 'content'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.modal = true
                    this.formItem.title = params.row.title
                    this.formItem.content = params.row.content
                    this.modalTitle = '编辑公告'
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      searchItems: [
        {
          label: '标题',
          type: 'input',
          name: 'title'
        }
      ],
      url: '/admin/sysAnnouncement/grid',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      data: '',
      modal: false,
      formItem: {
        title: '',
        content: ''
      },
      modalTitle: '新增公告'
    }
  },
  store,
  components: {searchForm, gridTable},
  methods: {
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
    showModal () {
      this.modal = true
      this.formItem.title = ''
      this.formItem.content = ''
      this.modalTitle = '新增公告'
    }
  }
}
</script>
