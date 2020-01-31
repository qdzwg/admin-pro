<template>
  <div>
    <list ref="gridTable"
          :columns="columns"
          :url="url"
          :searchItems="searchItems"
          :hannleItems="hannleItems"></list>
    <confirm ref="confirmModel"
             :content="content"
             :mode="mode"></confirm>
    <!-- 弹出层 -->
    <Modal v-model="modal"
           width="800"
           title="游客注册模式控制台"
           @on-ok="ok">
      <RadioGroup v-model="ms">
        <Radio class="radioClass" label="非强制注册模式"></Radio><br>
        <span class="shuoming">说明：用户通过微信或支付宝入口访问店铺特殊页面时(如 “个人中心”页)，需要调用微信或支付宝的授权登录接口进行用户授权登录，但不强制要求绑定手机号码</span><br><br>
        <Radio class="radioClass" label="业务流截断型强制注册模式"></Radio><br>
        <span class="shuoming">说明：游客在“提交订单”以及“加入购物车”环节将被强制要求绑定手机号码；（注意：该模式为强管控模式，对核心业务流程有一定影响，请评估充足后选择。）</span><br><br>
        <Radio class="radioClass" label="强制注册模式"></Radio><br>
        <span class="shuoming">说明：游客在访问店铺所有页面时均需要授权登录以及绑定手机号码；</span><br><br>
      </RadioGroup>
    </Modal>
  </div>
</template>
<script>
import list from '@/components/global/list'
import confirm from '@/components/global/confirm'
export default {
  data () {
    return {
      ms:'非强制注册模式',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '头像图片',
          key: 'headImg',
          width: 130,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              attrs: {
                style: 'width:80px;hieght:80px;padding:5px;'
              }
            }, [
              h('img', {
                attrs: {
                  src: params.row.headImg ? params.row.headImg : 'http://testwww.lotsmall.cn/static/h-ui/images/default_pic.png', style: 'width:80px;height:80px'
                }
              })
            ])
          }
        },
        {
          title: '登录名',
          key: 'loginName'
        },
        {
          title: '会员唯一标识别',
          key: 'onlyCode'
        },
        {
          title: '启禁用',
          key: 'useFlag',
          render: (h, params) => {
            return h('span', this.filter.accountState(params.row.useFlag))
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const actions = [
              {
                title: '详情',
                action: () => {
                  this.apiGet('/leaguer/leaguerDetail/detailInfo?id=' + params.row.id).then(res => {
                    this.modalData.realName = res.data.leaguerDetail.realName ? res.data.leaguerDetail.realName : ''
                    this.modalData.loginName = res.data.leaguerDetail.loginName ? res.data.leaguerDetail.loginName : ''
                    this.modalData.mobile = res.data.leaguerDetail.mobile ? res.data.leaguerDetail.mobile : ''
                    this.modalData.sex = res.data.leaguerDetail.sex ? res.data.leaguerDetail.sex : '女'
                    this.modalData.idcard = res.data.leaguerDetail.idcard ? res.data.leaguerDetail.idcard : ''
                    this.modalData.addr = res.data.leaguerDetail.addr ? res.data.leaguerDetail.addr : '未录入'
                    this.modalData.age = res.data.leaguerDetail.age ? res.data.leaguerDetail.age : ''
                    this.modal = true
                  })
                }
              }
            ]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      modalData: {

      },
      url: '/leaguer/leaguerInfo/grid',
      searchItems: [
        {
          label: '会员标识',
          type: 'input',
          name: 'onlyCode'
        },
        {
          label: '登录名',
          type: 'input',
          name: 'loginName'
        },
        {
          label: '状态',
          type: 'select',
          name: 'useFlag',
          data: [
            {
              value: '',
              label: '--请选择启禁用--'
            },
            {
              value: '1',
              label: '启用'
            },
            {
              value: '0',
              label: '禁用'
            }
          ]
        }
      ],
      hannleItems: [
        {
          title: '删除',
          icon: 'android-delete',
          type: 'error',
          callback: () => {
            this.delAll()
          }
        },
        {
          title: '启用',
          icon: 'android-done',
          callback: () => {
            this.doneAll()
          }
        },
        {
          title: '禁用',
          icon: 'android-close',
          type: 'error',
          callback: () => {
            this.forbiddenAll()
          }
        },
        {
          title: '游客注册模式控制台',
          callback: () => {
            this.toShowMod()
          }
        }
      ],
      modal: false,
      content: '',
      mode: '',
      formItem: {
        roleName: '',
        switch: true,
        remark: ''
      },
      modalTitle: '会员详情',
      ruleForm: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: { list, confirm },
  methods: {
    ok () {
      let rs=1;
      if(this.ms=='非强制注册模式'){
        rs=1;
      }else if(this.ms=='业务流截断型强制注册模式'){
        rs=2;
      }else if(this.ms=='强制注册模式'){
        rs=3;
      }

      this.apiGet(`/leaguer/leaguerInfo/saveLoginType?loginType=${rs}`).then(data=>{
        if(data.success){
          this.$Message.success('保存成功!');
          this.modal = false;
        }
      }).catch(err=>{
        this.$Message.wraning('保存失败!');
      })
    },
    toShowMod(){
      this.apiGet(`/leaguer/leaguerInfo/getLoginType`).then(data=>{
        if(data.success){
          let ms='';
          if(data.message==1 || !data.message){
            ms='非强制注册模式';
          }else if(data.message==2){
            ms='业务流截断型强制注册模式';
          }else if(data.message==3){
            ms='强制注册模式';
          }
          this.ms=ms;
          this.modal = true;
        }else{
          this.$Message.wraning('注册模式获取失败!');
        };
      }).catch(err=>{
        this.$Message.wraning('注册模式获取失败!');
      });
    },
    delAll () {
      this.content = '确认删除？'
      this.mode = 'delete'
      let selection = this.$refs.gridTable.selection
      if (selection && selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.$refs.confirmModel.confirm('/admin/sysRole/' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    doneAll () {
      this.content = '确认启用？'
      this.mode = 'done'
      let selection = this.$refs.gridTable.selection
      if (selection && selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.$refs.confirmModel.confirm('/leaguer/leaguerInfo/enable?enable=true&ids=' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    },
    forbiddenAll () {
      this.content = '确认禁用？'
      this.mode = 'forbidden'
      let selection = this.$refs.gridTable.selection
      if (selection && selection.length) {
        let ids = ''
        selection.forEach(element => {
          ids += element.id + ','
        })
        this.$refs.confirmModel.confirm('/leaguer/leaguerInfo/enable?enable=false&ids=' + ids)
      } else {
        this.$Message.warning('请选择一条数据！')
      }
    }
  }
}
</script>
<style scoped>
.userInfo {
  border-top: 1px solid #dddddd;
}
.userInfo-table {
  width: 100%;
  border-collapse: collapse;
}
.userInfo-table .title {
  background-color: #f8f8f9;
  font-size: 14px;
}
.userInfo-table td {
  padding: 8px;
  border-bottom: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
}
.userInfo-table tr td:last-child {
  border-right: 2px solid #dddddd;
}
.shuoming {
  color:#996600;
}
.radioClass {
  line-height:40px;
}
</style>
