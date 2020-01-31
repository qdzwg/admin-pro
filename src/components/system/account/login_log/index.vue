<template>
  <div>
    <!-- <searchForm :search-items='searchItems'></searchForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="2">
        <Button type="primary" icon="android-add">新增</Button>
      </Col>
      <Col span="2">
        <Button type="error" icon="android-delete">删除</Button>
      </Col>
    </Row> -->
    <!-- <Table border :columns="columns" :data="data" ></Table>
    <Page :total="100" class-name="pages"></Page> -->
    <gridTable :columns="columns" :params="params" :data="data" :url="url"></gridTable>
  </div>
</template>
<script>
// import searchForm from '@/components/global/searchForm'
import gridTable from '@/components/global/gridTable'
// import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      columns: [
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '信息',
          key: 'message',
          sortable: true,
        },
        {
          title: '登录ip',
          key: 'ip',
          sortable: true,
        },
        {
          title: '登录os',
          key: 'system',
          sortable: true,
        },
        {
          title: '登录浏览器',
          key: 'browser',
          sortable: true,
        },
        {
          title: '登录时间',
          key: 'createTime',
          sortable: true,
        }
      ],
      data: '',
      params: {page: 1, limit: 10, sort: 'createTime', order: 'desc'},
      url: '/admin/userLog/grid',
    //   searchItems: [
    //     {
    //       label: '信息',
    //       type: 'input',
    //       name: 'message'
    //     },
    //     // {
    //     //   label: '登录时间',
    //     //   type: 'date',
    //     //   name: 'createTime'
    //     // },
    //     {
    //       label: '浏览器',
    //       type: 'select',
    //       name: 'browser',
    //       data: [
    //         {
    //           value: 'Chrome',
    //           label: 'Chrome'
    //         },
    //         {
    //           value: 'Firefox',
    //           label: 'Firefox'
    //         },
    //         {
    //           value: 'ie11',
    //           label: 'ie11'
    //         }
    //       ]
    //     }
    //   ]
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: { gridTable}
}
</script>
