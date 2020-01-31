<template>
  <div class="template-user-define">
    <template v-if='show'>
      <searchForm :search-items='searchItems'>
      </searchForm>
      <Row class="btn-groups">
        <Col span="24">
        <Button type="primary"
                icon="plus-round"
                @click="add">新增年卡</Button>
        <Button @click="dealList">交易记录</Button>
        <Button @click="undelLineAddress">地址配置</Button>
        </Col>
      </Row>
      <gridTable ref="gridTable"
                 :columns="columns"
                 :params="params"
                 :data="data"
                 :url="url"></gridTable>
      <confirm ref="confirmModel"
               :sucessMsg='sucessMsg'
               :content='content'
               :mode="mode"></confirm>
      <Modal class="template-modal-select"
             width='1000'
             v-model="modal"
             title="选择页面模板"
             @on-ok="ok"
             @on-cancel="cancel">
        <div class='template-select-list clearfix'>
          <Col class="item-warper"
               span="6">
          <div class="template-item user-defined">
            <img class="userdefine-img"
                 src="http://f.hiphotos.baidu.com/image/h%3D300/sign=0eaa7d0c75f0f736c7fe4a013a54b382/f603918fa0ec08faf4f358d454ee3d6d54fbdad6.jpg"
                 alt="">
            <div>自定义页面</div>
            <Button>立即新建</Button>
          </div>
          </Col>
          <Col class="item-warper"
               span="6">
          <div class="template-item">
            <img class="template-item-img"
                 src="http://f.hiphotos.baidu.com/image/h%3D300/sign=0eaa7d0c75f0f736c7fe4a013a54b382/f603918fa0ec08faf4f358d454ee3d6d54fbdad6.jpg"
                 alt="">
            <div class="cover">
              <Button class="template-use">使用模板</Button>
            </div>
          </div>
          </Col>
          <Col class="item-warper"
               span="6">
          <div class="template-item">
            <img class="template-item-img"
                 src="http://f.hiphotos.baidu.com/image/h%3D300/sign=0eaa7d0c75f0f736c7fe4a013a54b382/f603918fa0ec08faf4f358d454ee3d6d54fbdad6.jpg"
                 alt="">
            <div class="cover">
              <Button class="template-use">使用模板</Button>
            </div>
          </div>
          </Col>
          <Col class="item-warper"
               span="6">
          <div class="template-item">
            <img class="template-item-img"
                 src="http://f.hiphotos.baidu.com/image/h%3D300/sign=0eaa7d0c75f0f736c7fe4a013a54b382/f603918fa0ec08faf4f358d454ee3d6d54fbdad6.jpg"
                 alt="">
            <div class="cover">
              <Button class="template-use">使用模板</Button>
            </div>
          </div>
          </Col>
        </div>
        <div slot="footer">

        </div>
      </Modal>
      <!-- 预览 -->
      <qrcode-modal :url='QRcodeUrl'
                    :title="previewTitle"
                    v-model="qrcodeShow"></qrcode-modal>
    </template>
    <template v-if='noBuyShow'>
      <div>
        <no-buy></no-buy>
      </div>
    </template>
  </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import noBuy from "@/components/marketing-center/notBuyService";
export default {
  created () {
    this.apiPost("/marketing/api/yearCardTob/selectPage?page=1&limit=10").then(
      res => {
        if (res.message == "您未购买此服务") {
          this.show = false;
          this.noBuyShow = true;
        } else {
          this.show = true;
          this.noBuyShow = false;
        }
      }
    );
  },
  data () {
    return {
      QRcodeUrl: 'marketing/api/yearCardTob/getExtendUrl',
      qrcodeShow: false,
      previewTitle: '',
      noBuyShow: false,
      show: false,
      sucessMsg: "",
      mode: "",
      content: "",
      searchItems: [
        {
          label: "年卡名称",
          type: "input",
          name: "cardName"
        }
      ],
      columns: [
        {
          title: "年卡名称",
          key: "cardName",
          sortable: false
        },
        {
          title: "年卡价格",
          key: "cardPrice",
          sortable: false
        },
        {
          title: "线下编码",
          key: "nextProductCode",
          sortable: false
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: false
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            let { id, status } = params.row
            const actions = [
              {
                title: status == "F" ? "上架" : "下架",
                action: () => {
                  this.sucessMsg =
                    (status == "F" ? "上架" : "下架") + "成功!";
                  this.content =
                    "确认" +
                    (status == "F" ? "上架" : "下架") +
                    "吗？";
                  this.mode = "done";
                  this.$refs.confirmModel.confirm(
                    "/marketing/api/yearCardTob/enabled?id=" + id + "&status=" + (status == "F" ? "T" : "F")
                  );
                }
              },
              {
                title: "删除",
                action: () => {
                  this.sucessMsg = "删除成功!";
                  this.content = "确认删除吗？";
                  this.mode = "done";
                  this.$refs.confirmModel.confirm(
                    "/marketing/api/yearCardTob/deleteById?id=" + id
                  );
                }
              },
              {
                title: "编辑",
                action: () => {
                  this.$router.push({
                    path: "/parkCardAddEdit?id=" + id
                  });
                }
              },
              {
                title: "推广地址",
                action: () => {
                  this.QRcodeUrl = `marketing/api/yearCardTob/getExtendUrl?id=${id}`
                  this.previewTitle = "推广"
                  this.qrcodeShow = true
                  // this.preLookModal = true;
                }
              },
              {
                title: "二维码快捷入口",
                action: () => {
                  this.QRcodeUrl = `marketing/api/yearCardTob/getQrCodeEntranceUrl?id=${id}`
                  this.previewTitle = "预览"
                  this.qrcodeShow = true
                }
              },
            ];
            if (params.row.hierarchy === 3) {
              actions.splice(0, 1);
            }
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: { page: 1, limit: 10, sort: "modifyTime", order: "desc" },
      url: "/marketing/api/yearCardTob/selectPage",
      modal: false
    };
  },
  mounted () {
    // this.loadpage(this.params)
  },
  components: { gridTable, confirm, searchForm, noBuy },
  methods: {

    add () {
      this.$router.push({ path: "/parkCardAddEdit" });
    },
    dealList () {
      this.$router.push({ path: "/dealList" });
    },
    refundSet () {
      this.$router.push({ path: "/refundSet" });
    },
    undelLineAddress () {
      this.$router.push({ path: "/undelLineAddress" });
    },
    splits (test) {
      return test.split(",");
    },
    ok () {
      this.formItem.accType = 0;
      this.formItem.useFlag = this.formItem.switch ? 1 : 0;
      let _this = this;
      let url =
        _this.type === "add"
          ? "list/admin/sysFunctions/saveRole"
          : "list/admin/sysFunctions/update";
      this.common.formPost(this, {
        url,
        params: this.formItem,
        mold: "modal",
        callback (res) {
          if (res.success) {
            _this.modal = false;
          }
        }
      });
    },
    cancel () {
      // this.$Message.info('Clicked cancel')
    },
    showModal () {
      this.modal = true;
      this.formItem.funName = "";
      this.formItem.funCode = "";
      this.formItem.optType = "";
      this.formItem.sortNo = "";
      this.formItem.openModes = "";
      this.formItem.functionTypes = "";
      this.formItem.hierarchys = "";
      this.formItem.funTypes = [];
      this.type = "add";
      this.formItem.switch = true;
      this.modalTitle = "新增角色";
    },
    delAll () {
      let selection = this.$refs.gridTable.selection;
      if (selection.length) {
        let ids = "";
        selection.forEach(element => {
          ids += element.id + ",";
        });
        this.$refs.confirmModel.confirm("list/admin/sysFunctions/" + ids);
      } else {
        this.$Message.warning("请选择一条数据！");
      }
    }
  }
};
</script>
<style lang='scss'>
.template-modal-select {
  .template-select-list {
    .item-warper {
      padding: 0 5px;
      .template-item {
        // margin: 0 5px;
        height: 350px;
        position: relative;
        .template-item-img {
          width: 100%;
          height: 350px;
        }
        .cover {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          text-align: center;
          .template-use {
            margin-top: 180px;
          }
        }
      }
      .template-item:hover {
        .cover {
          display: block;
        }
      }
      .user-defined {
        border: 1px solid #eee;
        text-align: center;
        .userdefine-img {
          margin-top: 80px;
          height: 80px;
          width: 80px;
        }
      }
    }
  }
}

.template-user-define {
}
</style>

