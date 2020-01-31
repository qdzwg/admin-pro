<template>
  <div class="merchant_strategy">
    <Form ref="formInline" :model="searchData" inline >
        <FormItem>
          <Select v-model="searchData.strategyType"
                  placeholder="请选择类型"
                  clearable
                  style="width:200px">
            <Option v-for="(item, index) in strategyTypeList"
                    :value="item.key"
                    :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem>
            <Input v-model="searchData.name" placeholder="请输入攻略名称"></Input>
        </FormItem>
        <Button style="margin-bottom:20px; margin-left:20px" type="primary" icon="ios-search" @click="toSearcd">搜索</Button>
    </Form>
    <Button style="margin-bottom:20px" type="primary" @click="actionBtns">新增攻略</Button>
    <Table
     border
     :columns="columns"
     :data="mainList"
     ></Table>
     <Page class="page_class" :total="total" show-total show-sizer @on-change="toPage" @on-page-size-change="toChangeSize"/>
    <confirm ref="confirmModel" mode="done" :content="content" @okClick="getList"></confirm>
  </div>
</template>
<script>
import confirm from '@/components/global/confirm'
export default {
  components: { confirm },
  data () {
    return {
      content: '<div style="color:red">确定要删除吗?</div>',
      searchData:{
        strategyType:'',
        name:'',
        page:1,
        limit:10
      },
      total:0,
      mainList:[],
      columns: [
        {
          title: '攻略类型',
          key: 'strategyType'
        },
        {
          title: '攻略名称',
          key: 'name',
        },
        {
          title: '发布人',
          key: 'promulgator'
        },
        {
          title: '发布时间',
          key: 'createTime',
        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          align: 'center',
          render: (h, params) => {
            let { id } = params.row
            const actions = [{
              title: '详情',
              action: () => {
                this.$router.push({ path: '/strategyDetail/' + id })
              }
            },
            {
              title: '修改',
              action: () => {
                this.$router.push({ path: '/strategyEdit/' + id })
              }
            },
            {
              title: '删除',
              action: () => {
                this.$refs.confirmModel.confirm('merchant/webApi/merchantStrategy/delFL', {id:params.row.merchantStrategyId});
              }
            },
            ]
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      strategyTypeList: [
        {
          key: '0',
          value: '资讯攻略'
        },
        {
          key: '1',
          value: '游玩攻略'
        }
      ],

      upDateFlag: false,
      upDateTitle: '修改',
      detailFlag: false,
      detailTitle: '详情',
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    getList(){
      this.apiPost('/merchant/webApi/merchantStrategy/gridFL', this.searchData).then(data=>{
          this.mainList=data.rows;
          this.total=data.total;
      }).catch(err=>{
        this.$Message.warning('数据获取失败!');
      });
    },
    /**获取详情信息接口
     * @param {any} id 列表id
     * @param {number} index 0:详情，1:修改  
     */
    toSearcd(){
      this.getList();
    },
    toChangeSize(num){
      this.searchData.limit=num;
      this.getList();
    },
    toPage(num){
      this.searchData.page=num;
      this.getList();
    },
    getDetail (id, index) {
      if (index) {
        this.upDateFlag = true
        this.upDateTitle = '修改'
      } else {
        this.detailFlag = true
      }
    },
    actionBtns () {
      this.$router.push('/strategyAdd');
    },
    updateFun () {
      console.log(this.formItem)
    },
    initFormData () {
      return {
        strategyType: '',
        name: '',
        decription: '',
        picAddr: "",
        strategyTags: [
          // { labelName: "", labelKey: 0 },
        ],
        vedioAddr: "",
        musicAddr: "",
        latitudeLongitude: "",
        nickName: '',
        headImg: "",
        subHeading1: '',
        content1: '',
        subHeading2: '',
        content2: '',
        subHeading3: '',
        content3: '',
      }
    }
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




