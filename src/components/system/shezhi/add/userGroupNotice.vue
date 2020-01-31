<template>
    <div class="userGroupNotice">
        <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleComplteForm">
            <FormItem label="分组名称：" prop="name">
                <Input style="width:33%;" v-model="formItem.name" :maxlength="10"></Input>
            </FormItem>
           
            <FormItem label="分销商：" prop="accountIds">
                <Input style="display:none;" v-model="formItem.accountIds"></Input>
                <Button type="primary" @click="choose">选择</Button>
                <div v-if='showTableSelection&&showTableSelection.length'>
                    <div v-for='(item,index) in showTableSelection' :key='index' class="senicInfo">
                        <Icon @click="senicDel(index)" class="senicDel" type="close-circled"></Icon>
                        <div class="name">{{item.name}}</div>
                        <div class="address">{{item.group_name}}</div>
                    </div>
                </div>
            </FormItem>
            <FormItem label="备注：">
                <Input type="textarea" v-model="formItem.remark" style="width:33%;" :maxlength="100"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit" :loading="btnLoading">保存</Button>
                <Button @click='back'>取消</Button>
            </FormItem>
        </Form>
        <Modal v-model="chooseModal" title="选择分销组" width=600>
            <div>
                <Table height='350' @on-selection-change='selectionChange' :loading='tableLoading' border :columns="columns7" :data="data6"></Table>
            </div>
            <div style="margin-top:10px">
                <Page :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change='pageSizeChange' size="small" show-elevator show-sizer></Page>
            </div>
            <div slot='footer'>
                <Button type="primary" @click="ok">添加</Button>
                <Button @click='cancel'>取消</Button>
            </div>
        </Modal>
    </div>
</template>


<script>
import { apiGet, apiPost } from "@/fetch/api";
import ueditor from "@/components/global/ueditor";
export default {
  components: {
    ueditor
  },
  data() {
    return {
      chooseModal: false,
      flag:false,
      isEdit: false,
      btnLoading: false,
      tableLoading: false,
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      formItem: {
        name: "",
        remark: "",
        accountIds: "",
      },
      ruleComplteForm: {
        name: [{ required: true, message: "请填写分组名称", trigger: "blur" }],
        accountIds: [{ required: true, message: "请选择分销商", trigger: "blur" }],
      },
      columns7: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "序号",
          key: "name",
          render: (h, params) => {
            return h("div", params.index + 1);
          }
        },
        {
          title: "分销商名称",
          key: "name"
        },
        {
          title: "分组名称",
          key: "group_name"
        }
      ],
      data6: [],
      total: 0,
      page: 1,
      pageSize: 10,
      tableSelecttion: [], //弹框选中项
      seletedList: [],
      showTableSelection: [],
    };
  },
    watch: {
    social: function(val) {
      if (val.length != 10) {
        //没有全选
        this.active = false;
      } else {
        this.active = true;
      }
    }
  },
  created(){
      if(this.$route.query.id){
          apiPost('/admin/webapi/userGroup/getById',{
              id:this.$route.query.id
          }).then(res=>{
              if(res.status==200){
                  this.flag=true
                  this.isEdit=true
                  this.formItem.id=res.data.group.id
                  this.formItem.name=res.data.group.name
                  this.formItem.remark=res.data.group.remark
                  this.showTableSelection=res.data.account
              }else{
                //   this.isEdit=false
              }
          })
      }else{
         this.isEdit=false 
         this.flag=true 
      }
  },
  methods: {
    changePage(val) {
        this.page=val
        this.selectHotel()
    },
    pageSizeChange(val) {
        this.pageSize=val
        this.selectHotel()
    },
    selectionChange(selection) {
      this.tableSelecttion = selection;
    },
    choose() {
      this.chooseModal = true;
      this.selectHotel()
    },
    selectHotel() {
      this.tableLoading = true;
      apiPost("/admin/webapi/capitalAccount/grid", {
        page: this.page,
        limit: this.pageSize,
      }).then(res => {
        if (res.status == 200) {
          let _this = this;
          this.tableLoading = false;
        //   // res.data.rows = res.data.rows.filter(ele => {
        //   //   return !_this.showTableSelection.some(item => {
        //   //     return ele.id == item.id;
        //   //   });
        //   // });
          this.social = this.showTableSelection.map(function(item, index) {
            return item.id;
          });
          this.data6 = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    ok() {
      // 弹框确定
      //和已存在的景区对比，获取未存在的景区
      let _this = this;
      // 重复的
      this.seletedList = this.tableSelecttion.filter(function(item, index) {
        return _this.showTableSelection.find(function(it, i) {
          return item.id == it.id;
        });
      });
      //不重复的
      this.tableSelecttion = this.tableSelecttion.filter(function(item, index) {
        return !_this.showTableSelection.find(function(it, i) {
          return item.id == it.id;
        });
      });
      if (
        this.showTableSelection &&
        this.tableSelecttion &&
        this.tableSelecttion.length + this.showTableSelection.length > 20
      ) {
        this.$Message.warning(
          "最多选择20个分销商，已选" +
            this.showTableSelection.length +
            "个分销商,至多还能选择" +
            (20 - this.showTableSelection.length) +
            "个分销商"
        );
      } else {
        this.showTableSelection = this.showTableSelection.concat(
          this.tableSelecttion
        );
        this.chooseModal = false;
      }
      this.page = 1;
    },
    cancel() {
      this.chooseModal = false;
      this.page = 1;
    },
    back(){
        this.$router.back()
    },
     senicDel(i) {
      this.showTableSelection.splice(i, 1);
    },
    submit() {
      let _this = this;
      this.btnLoading = true;
           let arr = this.showTableSelection.map((item, index) => {
        return item.id;
      });
      this.formItem.accountIds = arr.join(",")

      this.$refs.formItem.validate(async valid => {
        if (valid) {
          let url = this.isEdit
            ? "/admin/webapi/userGroup/update"
            : "/admin/webapi/userGroup/save";
          if (this.isEdit) {
            this.formItem.id = this.$route.query.id;
          }
          let res = await apiPost(url, this.formItem);
          if (res.status == 200) {
            _this.$Message.success("保存成功!");

            _this.$router.push("/groupingManagement");
          } else {
            this.btnLoading = false;
            _this.$Message.warning(res.message);
          }
        } else {
          this.btnLoading = false;
          //滚动到错误地方
          setTimeout(function() {
            $("#content").scrollTop(
              $(".ivu-form-item-error").offset().top -
                90 +
                $("#content").scrollTop()
            );
          }, 500);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.userGroupNotice {
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

