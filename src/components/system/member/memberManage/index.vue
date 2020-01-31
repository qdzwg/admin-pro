<template>
  <div>
    <Form ref="formInline" :model="searchData" inline >
        <FormItem label="姓名:" :label-width="80">
            <Input v-model="searchData.realName" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="手机号：" :label-width="80">
            <Input v-model="searchData.mobile" placeholder="请输入手机号"></Input>
        </FormItem>
        <!-- <FormItem label="积分余额：" :label-width="80">
            <Input style="width:60px" v-model="searchData.name"></Input>&nbsp;-&nbsp;<Input style="width:60px" v-model="searchData.name"></Input>
        </FormItem> -->
        <Button style="margin-bottom:20px; margin-left:20px" type="primary" icon="ios-search" @click="toSearcd">查询</Button>
        <Button style="margin-bottom:20px; margin-left:20px" type="primary" @click="toDownLoad">导出</Button>
    </Form>
    <Table ref="gridTable"
     border
     :columns="columns"
     :data="mainList"
     ></Table>
     <Page class="page_class" :total="total" show-total show-sizer @on-change="toPage" @on-page-size-change="toChangeSize"/>
  </div>
</template>
<script>
import list from '@/components/global/list'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      total:0,
      searchData:{
        page: 1,
        limit: 10,
        sort: 'createTime',
        order: 'desc',
        mobile: '',
        realName: ''
      },
      mainList:[],

	    columns: [
        {
          title: '会员编号',
          render: (h, params) => {
            return h('span', params.row.id?params.row.id:'--');
          }
        },
        {
          title: '用户名',
          render: (h, params) => {
            return h('span', params.row.mobile?params.row.mobile:'--');
          }
        },
        {
          title: '姓名',
          render: (h, params) => {
            return h('span', params.row.realName?params.row.realName:'--');
          }
        },
        {
          title: '身份证',
          render: (h, params) => {
            return h('span', params.row.idcard?params.row.idcard:'--');
          }
        },
        {
          title: '手机号',
          render: (h, params) => {
            return h('span', params.row.mobile?params.row.mobile:'--');
          }
        },
        {
          title: '积分余额',
          render: (h, params) => {
            return h('span', params.row.bonus?params.row.bonus:'0');
          }
        },
        {
          title: '微信ID',
          render: (h, params) => {
            return h('span', params.row.wxId?params.row.wxId:'--');
          }
        },
        {
          title: '微信名',
          render: (h, params) => {
            return h('span', params.row.wxName?params.row.wxName:'--');
          }
        },
	      {
	        title: '性别',
          render: (h, params) => {
            let str='--';
            if(params.row.sex=='MALE')str='男';
            if(params.row.sex=='FEMALE')str='女';
            return h('span', str);
          }
	      },
        {
          title: '身份证所在地',
          render: (h, params) => {
            return h('span', params.row.addr?params.row.addr:'--');
          }
        }
	    ]
    }
  },
  components: { list, confirm },
  methods: {
    toSearcd(){
      this.getList();
    },
    toDownLoad(){
      let arr=[];
      for(let key in this.searchData){
        arr.push(`${key}=${this.searchData[key]}`);
      };
      this.common.exportData(
        "会员信息",
        '/leaguer/leaguerInfo/export?'+arr.join('&'),
        () => {},
        this
      );
    },
    toPage(num){
      this.searchData.page=num;
      this.getList();
    },
    toChangeSize(size){
      this.searchData.limit=size;
      this.getList();
    },
    getList(){
      this.apiPost('/leaguer/leaguerInfo/grid', this.searchData).then(data=>{
        this.mainList=data.rows;
        this.total=data.total;
      }).catch(err=>{
        this.$Message.warning('列表获取失败!');
      });
    }
  },
  mounted:function(){
    this.getList();
  }
}
</script>

<style lang="scss" scoped>
.page_class {margin-top:15px;}
.pro-main {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    justify-content:center;
    flex-direction:row;
}
</style>
