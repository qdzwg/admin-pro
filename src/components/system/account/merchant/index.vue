<template>
  <div>    
    <Row :gutter="16" class="btn-groups">
  
      <Col span="3">
        <Button type="primary" icon="android-add" @click="goAdd">新增</Button>
      </Col>
      <Col span="3">
        <Button type="info" icon="android-delete" @click="exportExcel">导出</Button>
      </Col>

    </Row>
    <mchForm :search-list='parkList' :searchForm="searchForm"></mchForm>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>
    <!--核销密码-->
    <Modal width="600"
           v-model="hxModal"
           title="商户核销密码"
           ok-text="保存">
      <Form  :model="formItem"
            label-position="right"
            ref="formItem"
            :rules="rulehxForm"
            :label-width="130">

        <FormItem label="核销密码：" prop="checkCode">
          <Input v-model="formItem.checkCode" style="width:33%" placeholder="请输入核销密码" :maxlength="64"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="submit">保存</Button>
          <Button type="ghost" @click="cancel">关闭</Button>
        </FormItem>

      </Form>
      <div slot="footer"></div>
    </Modal>
   
  </div>
</template>
<script>
import mchForm from '@/components/global/mchForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import { apiPost } from '@/fetch/api'
export default {
  data () {
    return {
      searchForm:{},
      hxModal: false,
      hxMchId: '',
      nowTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
      parkList: [],
      uploadModal: false,
      mode:"",
      content:"",
      sucessMsg:'',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '归属景区',
          key: 'parkName'
        },
        {
          title: '商户名称',
          key: 'mchName'
        },
        {
          title: '商户编码',
          key: 'mchId'
        },
        {
          title: '法人姓名',
          key: 'legalName'          
        },
        {
          title: '法人手机号',
          key: 'legalPhone'         
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return h('span', params.row.status == 'F' ? '禁用' : '启用')
          }         
        },
        {
          title: '创建人/时间',
          render: (h, params) => {
            let createBy = params.row.createBy;
            let createTime = params.row.createTime;
            return h("div", [
              h('p', { style: {
                fontSize: '12px'
              }}, createBy),
              h('p',{ style: {
                fontSize: '12px'
              }}, createTime)
            ])
          }
        },
        {
          title: '更新人/时间',
          render: (h, params) => {
            let modifyBy = params.row.modifyBy;
            let modifyTime = params.row.modifyTime;
            return h("div", [
              h('p', modifyBy),
              h('p', modifyTime)
            ])
          }      
        },
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            let { id, status } = params.row
            const actions = [{
              title: status == 'F' ? '启用' : '禁用',
              action: () => {
                this.mode = 'post'
                this.sucessMsg = (status == 'F' ? '启用' : '禁用') + '成功！'
                this.content = '确认' + (status == 'F' ? '启用' : '禁用') + '？'
                this.$refs.confirmModel.confirm('/admin/api/mchInfo/op?id=' + id + '&status=' + (status == 'F' ? 'T' : 'F'))
              }
            },
            {
              title: '查看',
              action: () => {
                this.$router.push("/mchAddOrEdit?detailId=" + id)
              }
            },
            {
              title: '修改',
              action: () => {
                this.$router.push("/mchAddOrEdit?id=" + id)
              }
            },
            // {
            //   title: '删除',
            //   action: () => {
            //     this.del(params.row.id)
            //   }
            // }, 
            {
              title: '核销密码',
              action: () => {
                this.showHxModal(params.row);
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10},
      url: '/admin/api/mchInfo/grid',
      formItem: {
        checkCode: ''
      },
      rulehxForm: {
        checkCode: [{required: true, message: '核销密码不能为空', trigger: 'blur'}]
      }
    }
  },
  components: {mchForm, gridTable, confirm},
  mounted () {
    this.apiGet('/admin/api/mchInfo/loadParks').then(res => {
      if(res.success || res.status == 200){
        this.parkList = res.parks;
      }
    })
  },
  methods: {
    exportExcel() {
      let str='?';
      for(let key in this.searchForm){
        str+=`${key}=${this.searchForm[key]}&`;
      };
      if(str=='?'){
        str='';
      }else{
        str=str.substring(0, str.length-1);
      };
      window.location.href = `/admin/api/mchInfo/exportExcel${str}`
    },
    goAdd() {
      this.$router.push('/mchAddOrEdit')
    },
    cancel() {
      this.hxModal = false
    },
    showHxModal(item) {
      this.hxModal = true;
      this.hxMchId = item.id;
      this.formItem.checkCode = item.checkCode ? item.checkCode : '';
    },
    submit() {
      this.$refs.formItem.validate(async valid => {
        this.scrollError();
        if (valid) {
          this.formItem.id = this.hxMchId;
          apiPost('/admin/api/mchInfo/op', this.formItem).then(res => {
            if(res.success || res.status == 200) {
              this.$store.dispatch("postApi");
              this.$Message.success(res.message ? res.message : "成功！");
              this.hxModal = false;
            }else{
              this.$Message.warning(res.message)
            }
          });
        }
      })      
    },
    scrollError () {
      let errList = $('.ivu-form-item-error')
      if (errList.length > 0) {
        let scroll_offset = errList.eq(0).offset().top
        $('#content').animate(
          {
            scrollTop: scroll_offset
          },
          300
        )
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.choose-file{
  color: #2d8cf0;
  display: block;
  border: 1px solid #2d8cf0;
  padding: 0 30px;
  border-radius: 5px;
  height: 28px;
  line-height: 28px;
}
</style>
