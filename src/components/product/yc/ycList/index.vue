<template>
  <div>
    <scycForm :search-list="parkList"></scycForm>
    <Row :gutter="16" class="btn-groups">
      <Col span="2">
        <Button type="error" icon="android-delete" @click="delAll">删除</Button>
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-add" @click="addCombo"
          >新增</Button
        >
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-done" @click="onLine">上架</Button>
      </Col>
      <Col span="2">
        <Button type="primary" icon="android-close" @click="offLine"
          >下架</Button
        >
      </Col>
    </Row>
    <gridTable
      ref="gridTable"
      :params="params"
      :columns="columns"
      :data="data"
      :url="url"
    ></gridTable>
    <confirm
      ref="confirmModel"
      :mode="mode"
      :content="content"
      :sucessMsg="sucessMsg"
    ></confirm>
  </div>
</template>
<script>
import scycForm from "@/components/global/scycForm";
import gridTable from "@/components/global/gridTable";
import confirm from "@/components/global/confirm";
import QRcode from "@xkeshi/vue-qrcode";
export default {
  data() {
    return {
      parkList: [],
      mode: "",
      content: "",
      sucessMsg: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "景区名称",
          key: "parkName"
        },
        {
          title: "票型名称",
          key: "name"
        },
        {
          title: "票型别名",
          key: "alias"
        },
        {
          title: "票型编码",
          key: "code"
        },
        {
          title: "提前购电商编码",
          key: "beforeThirdCode"
        },
        {
          title: "当天购电商编码",
          key: "todayThirdCode"
        },
        {
          title: "商户名称",
          key: "mchName"
        },
        {
          title: "状态",
          key: "useFlag",
          render: (h, params) => {
            return h("span", params.row.useFlag == "F" ? "已下架" : "已上架");
          }
        },
        {
          title: "创建人/时间",
          render: (h, params) => {
            let createBy = params.row.createBy;
            let createTime = params.row.createTime;
            return h("div", [
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                createBy
              ),
              h(
                "p",
                {
                  style: {
                    fontSize: "12px"
                  }
                },
                createTime
              )
            ]);
          }
        },
        {
          title: "更新人/时间",
          render: (h, params) => {
            let modifyBy = params.row.modifyBy;
            let modifyTime = params.row.modifyTime;
            return h("div", [h("p", modifyBy), h("p", modifyTime)]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            const actions = [
              {
                title: "修改",
                action: () => {
                  this.$router.push("/publishShow?id=" + params.row.id);
                }
              },
              {
                title: params.row.useFlag == "F" ? "上架" : "下架",
                action: () => {
                  this.mode = "post";
                  this.sucessMsg =
                    (params.row.useFlag == "F" ? "上架" : "下架") + "成功！";
                  this.content =
                    "确认" +
                    (params.row.useFlag == "F" ? "上架" : "下架") +
                    "？";
                  this.$refs.confirmModel.confirm(
                    "/product/api/showTicketApi/enable?ids=" +
                      params.row.id +
                      "&useFlag=" +
                      (params.row.useFlag == "F" ? "T" : "F")
                  );
                }
              },
              {
                title: "删除",
                action: () => {
                  this.del(params.row.id);
                }
              },
              {
                title: "价格",
                action: () => {
                  this.gotoRouter(params.row.id);
                  // this.$router.push("/showInventoryCl/" + params.row.id)
                }
              },
              {
                title: "复制",
                action: () => {
                  this.mode = "post";
                  this.sucessMsg = "复制成功！";
                  this.content = "确认复制此条数据吗？";
                  this.$refs.confirmModel.confirm(
                    "/product/api/showTicketApi/copyShow?id=" + params.row.id
                  );
                }
              }
            ];
            return this.common.columnsHandle(h, actions);
          }
        }
      ],
      data: "",
      params: { page: 1, limit: 10 },
      url: "/product/api/showTicketApi/grid"
    };
  },
  components: { scycForm, gridTable, confirm, qrcode: QRcode },
  methods: {
    fuzhi(id) {

    },
    delAll () {
      console.log(this.$refs.gridTable)
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id;
      });
      if (arr.length > 0) {
        this.del(arr.join(","));
      } else {
        this.$Message.warning("请选择删除项");
      }
    },
    addCombo() {
      this.$router.push("/publishShow");
    },
    gotoRouter(id) {
      let year = new Date().getFullYear(),
        month = new Date().getMonth();
      let fMonth = year + "-" + (month + 1);
      this.apiPost(
        "/product/api/showTicketApi/getCalendar?showId=" +
          id +
          "&month=" +
          fMonth
      ).then(res => {
        if (res.success) {
          this.$router.push("/showInventoryCl/" + id);
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    onLine() {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id;
      });
      if (arr.length > 0) {
        this.mode = "post";
        this.content = "确认上架吗?";
        this.sucessMsg = "上架成功!";
        this.$refs.confirmModel.confirm(
          "/product/api/showTicketApi/enable?ids=" +
            arr.join(",") +
            "&useFlag=T"
        );
      } else {
        this.$Message.warning("请选择上架项");
      }
    },
    offLine() {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id;
      });
      if (arr.length > 0) {
        this.mode = "post";
        this.content = "确认下架吗?";
        this.sucessMsg = "下架成功!";
        this.$refs.confirmModel.confirm(
          "/product/api/showTicketApi/enable?ids=" +
            arr.join(",") +
            "&useFlag=F"
        );
      } else {
        this.$Message.warning("请选择下架项");
      }
    },
    del(ids) {
      this.mode = "post";
      this.content = "确认删除吗?";
      this.sucessMsg = "删除成功!";
      this.$refs.confirmModel.confirm(
        "/product/api/showTicketApi/delete?ids=" + ids
      );
    }
  },
  created() {
    //获取景区列表
    this.apiPost("/product/api/showTicketApi/list", {}).then(res => {
      if (res.success) {
        this.parkList = res.park;
      }
    });
  }
};
</script>
