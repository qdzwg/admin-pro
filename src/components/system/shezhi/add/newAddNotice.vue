<template>
  <div class="newAddNotice" :style="{'padding-bottom':padding}">
    <Form :model="formItem"
          label-position="right"
          :label-width="120"
          ref="formItem"
          :rules="ruleComplteForm">
      <FormItem label="标题："
                prop="title">
        <span v-if="backShow=='back'">{{formItem.title}}</span>

        <Input v-else
               style="width:33%;"
               v-model="formItem.title" :maxlength="60"></Input>

      </FormItem>
      <FormItem label="谁可以看："
                prop="viewType">
        <RadioGroup v-model="formItem.viewType"
                    :disabled="backShow==''">
          <Radio label="all"
                 :disabled="backShow=='back'">全部</Radio>
          <Radio label="part"
                 :disabled="backShow=='back'">部分</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="分销组："
                v-if="formItem.viewType=='part'"
                required>
        <Button v-if="backShow==''"
                type="primary"
                @click="choose">选择</Button>
        <div v-if='showTableSelection&&showTableSelection.length'>
          <div v-for='(item,index) in showTableSelection'
               :key='index'
               class="senicInfo">
            <Icon v-if="backShow==''"
                  @click="senicDel(index)"
                  class="senicDel"
                  type="close-circled"></Icon>
            <div class="name">{{item.name}}</div>
            <div class="address">{{item.areaAddr}}</div>
          </div>
        </div>
      </FormItem>
      <FormItem label="详细内容："
                prop="content"
                v-if="flag">
        <!-- <Input v-model="formItem.content"
               style="display:none"></Input> -->
        <div v-if="backShow=='back'"
             v-html="formItem.content"></div>
        <!-- <ueditor v-else
                 id="ue2"
                 ref="mustKnow"
                 :content="formItem.content"
                 :config="config"></ueditor> -->
        <vueUEditor v-else
                    v-model="formItem.content"
                    :config="config"></vueUEditor>
      </FormItem>
      <FormItem>
        <Button v-if="backShow=='back'"
                type="primary"
                @click="back">返回</Button>
        <Button v-else
                type="primary"
                @click="submit"
                :loading="btnLoading">提交</Button>
        <Button v-if="backShow==''"
                @click='back'>取消</Button>
      </FormItem>
    </Form>
    <Modal v-model="chooseModal"
           title="选择分销组"
           width=600>
      <div>
        <Table height='350'
               @on-selection-change='selectionChange'
               :loading='tableLoading'
               border
               :columns="columns7"
               :data="data6"></Table>
      </div>
      <div style="margin-top:10px">
        <Page :total="total"
              :current="page"
              :page-size="pageSize"
              @on-change="changePage"
              @on-page-size-change='pageSizeChange'
              size="small"
              show-elevator
              show-sizer></Page>
      </div>
      <div slot='footer'>
        <Button type="primary"
                @click="ok">添加</Button>
        <Button @click='cancel'>取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { apiGet, apiPost } from '@/fetch/api'
import ueditor from '@/components/global/ueditor'
import vueUEditor from '@/components/global/vueUEditor'
export default {
  components: {
    ueditor,
    vueUEditor
  },
  data () {
    return {
      chooseModal: false,
      flag: false,
      isEdit: false,
      btnLoading: false,
      tableLoading: false,
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      formItem: {
        title: '',
        content: '',
        viewType: 'all',
        supplyerId: '',
        ids: ''
      },
      ruleComplteForm: {
        title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        viewType: [
          { required: true, message: '请选择分销组', trigger: 'change' }
        ],
        content: [{ required: true, message: '请填写内容', trigger: 'blur' }]
      },
      columns7: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          key: 'name',
          render: (h, params) => {
            return h('div', params.index + 1)
          }
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'remark'
        }
      ],
      data6: [],
      total: 0,
      page: 1,
      pageSize: 10,
      tableSelecttion: [], // 弹框选中项
      seletedList: [],
      showTableSelection: [],
      backShow: '',
      num: 5,
      padding:""
    }
  },
  watch: {
    social: function (val) {
      if (val.length != 10) {
        // 没有全选
        this.active = false
      } else {
        this.active = true
      }
    }
  },
  created () {
    if (this.$route.query.noticeId) {
      apiPost('/admin/webapi/userNotice/getById', {
        noticeId: this.$route.query.noticeId
      }).then(res => {
        if (res.status == 200) {
          this.flag = true
          this.isEdit = true
          this.formItem.title = res.data.userDistributorNotice.title
          this.formItem.viewType = res.data.userDistributorNotice.viewType
          this.formItem.id = res.data.userDistributorNotice.id
          this.formItem.content = res.data.userDistributorNotice.content
          this.showTableSelection = res.data.ownGroupList
        } else {
          //   this.isEdit=false
        }
      })
    } else if (this.$route.query.id && this.$route.query.back == 'back') {
      apiPost('/admin/webapi/userNotice/getById', {
        noticeId: this.$route.query.id
      }).then(res => {
        if (res.status == 200) {
          this.flag = true
          this.backShow = this.$route.query.back
          this.formItem.title = res.data.userDistributorNotice.title
          this.formItem.viewType = res.data.userDistributorNotice.viewType
          this.formItem.id = res.data.userDistributorNotice.id
          this.formItem.content = res.data.userDistributorNotice.content
          this.showTableSelection = res.data.ownGroupList
        } else {
          //   this.isEdit=false
        }
      })
    } else {
      this.isEdit = false
      this.flag = true
    }


    var agent = navigator.userAgent.toLowerCase();
    // firefox
    if (agent.indexOf("firefox") > 0) {
      this.padding = "50px";
    }
  },
  methods: {
    changePage (val) {
      this.page = val
      this.selectHotel()
    },
    pageSizeChange (val) {
      this.pageSize = val
      this.selectHotel()
    },
    senicDel (i) {
      this.showTableSelection.splice(i, 1)
    },
    selectionChange (selection) {
      this.tableSelecttion = selection
    },
    choose () {
      this.chooseModal = true
      this.selectHotel()
    },
    back () {
      this.$router.back()
    },
    selectHotel () {
      this.tableLoading = true
      apiPost('/admin/webapi/capitalAccount/getGroups', {
        page: this.page,
        limit: this.pageSize
      }).then(res => {
        if (res.status === 200) {
          // let _this = this
          this.tableLoading = false
          //   res.data.rows = res.data.rows.filter(ele => {
          //     return !_this.showTableSelection.some(item => {
          //       return ele.id == item.id;
          //     });
          //   });
          //   this.social = this.showTableSelection.map(function(item, index) {
          //     return item.id;
          //   });
          this.data6 = res.data.rows
          this.total = res.data.total
        }
      })
    },
    ok () {
      // 弹框确定
      // 和已存在的景区对比，获取未存在的景区
      let _this = this
      // 重复的
      this.seletedList = this.tableSelecttion.filter(function (item, index) {
        return _this.showTableSelection.find(function (it, i) {
          return item.id == it.id
        })
      })
      // 不重复的
      this.tableSelecttion = this.tableSelecttion.filter(function (item, index) {
        return !_this.showTableSelection.find(function (it, i) {
          return item.id == it.id
        })
      })
      if (
        this.showTableSelection &&
        this.tableSelecttion &&
        this.tableSelecttion.length + this.showTableSelection.length > 20
      ) {
        this.$Message.warning(
          '最多选择20个景区，已选' +
          this.showTableSelection.length +
          '个景区,至多还能选择' +
          (20 - this.showTableSelection.length) +
          '个景区'
        )
      } else {
        this.showTableSelection = this.showTableSelection.concat(
          this.tableSelecttion
        )
        this.chooseModal = false
      }
      this.page = 1
    },
    cancel () {
      this.chooseModal = false
      this.page = 1
    },
    submit () {
      let _this = this
      this.btnLoading = true
    //   this.formItem.content = this.$refs.mustKnow
    //     ? this.$refs.mustKnow.getUEContent()
    //     : ''
      let arr = this.showTableSelection.map((item, index) => {
        return item.id
      })
      this.formItem.ids = arr.join(',')

      this.$refs.formItem.validate(async valid => {
        if (valid) {

            if(this.formItem.viewType=='part'){
                if(this.formItem.ids==''){
                    this.$Message.warning('请选择分销组')
                    this.btnLoading = false
                    return false
                }
            }
          let url = this.isEdit
            ? '/admin/webapi/userNotice/edit'
            : '/admin/webapi/userNotice/save'
          if (this.isEdit) {
            this.formItem.id = this.$route.query.noticeId
          }
          let res = await apiPost(url, this.formItem)
          if (res.status == 200) {
            _this.$Message.success('保存成功!')

            _this.$router.push('/distributorNotice')
          } else {
            this.btnLoading = false
            _this.$Message.warning(res.message)
          }
        } else {
          this.btnLoading = false
          // 滚动到错误地方
          setTimeout(function () {
            $('#content').scrollTop(
              $('.ivu-form-item-error').offset().top -
              90 +
              $('#content').scrollTop()
            )
          }, 500)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.newAddNotice {
  .senicInfo {
    position: relative;
    margin-top: 10px;
    display: inline-block;
    padding: 5px 10px;
    margin-right: 10px;
    border: 1px solid rgba(35, 192, 250, 1);
    .senicDel {
      position: absolute;
      top: -9px;
      right: -8px;
      background: #fff;
      font-size: 18px;
      cursor: pointer;
      display: none;
    }
    .address {
      color: #999;
    }
  }
  .senicInfo:hover {
    .senicDel {
      display: inline-block;
    }
  }
}
</style>
