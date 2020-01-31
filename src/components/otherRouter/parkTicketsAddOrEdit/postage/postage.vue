<template>
  <div>
    <Form :model="formItem" label-position="right" :label-width="150" :rules="ruleForm" ref="formItem">
      <FormItem label="邮费模版名称：" prop="name">
        <Input v-model="formItem.name" style="width:33%;"></Input>
      </FormItem>
      <FormItem label="计价方式：">
        <RadioGroup v-model="formItem.costType">
          <Radio label="1">按件数</Radio>
          <Radio label="0">按重量</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="快递方式：">
        <p>除指定区域外，其余地区的配送费采用“默认配送费”</p>
        <Checkbox v-model="kuaidi">快递物流</Checkbox>
        <template v-if="kuaidi==true">
          <div style="border:1px solid #ccc; padding:10px;">

            <div style="padding:10px 0;">
              <Row>
                <Col span="4">
                <FormItem>
                  <span>默认运费</span>
                  <Input v-model="formItem.defaultWeight" number style="width:39%"></Input>
                  <span v-if="formItem.costType==0">kg</span>
                  <span v-if="formItem.costType==1">件</span>
                  <span>内</span>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem>
                  <Input v-model="formItem.defaultPrice" number style="width:39%"></Input>
                  <span> 元；每增加</span>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem>
                  <Input v-model="formItem.defaultStepWeight" number style="width:39%"></Input>
                  <span v-if="formItem.costType==0">kg</span>
                  <span v-if="formItem.costType==1">件</span>
                  <span>,增加运费</span>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem>
                  <Input v-model="formItem.defaultStepPrice" number style="width:39%"></Input>
                  <span>元</span>
                </FormItem>
                </Col>
              </Row>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>
                    <Icon class="add-icon" @click="add" type="android-add-circle" v-if="listData.length<=10"></Icon>
                    <Icon type="plus-circled" v-else style="font-size:28px;"></Icon>
                  </th>
                  <th width=30%>配送到</th>
                  <th>首
                    <span v-if="formItem.costType==0">重(kg)</span>
                    <span v-if="formItem.costType==1">件(件)</span>
                  </th>
                  <th>首费(元)</th>
                  <th>续
                    <span v-if="formItem.costType==0">重(kg)</span>
                    <span v-if="formItem.costType==1">件(件)</span>
                  </th>
                  <th>续费(元)</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item,index) in listData">
                  <tr>
                    <td class="center-td">
                      <Icon class="delete-icon" @click="del(index)" type="android-remove-circle"></Icon>
                    </td>
                    <td>
                      <div>{{item.areaName}}</div>
                      <a @click="getAreaData(index,'add2')">编辑</a>
                    </td>
                    <td class="num">
                      <Input v-model="item.startWeight"></Input>
                    </td>
                    <td class="num">
                      <Input v-model="item.startPrice"></Input>
                    </td>
                    <td class="num">
                      <Input v-model="item.stepWeight"></Input>
                    </td>
                    <td class="num">
                      <Input v-model="item.stepPrice"></Input>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

        </template>
        <Checkbox v-model="zhiding">指定条件包邮</Checkbox>
        <template v-if="zhiding==true">
          <table class="table">
            <thead>
              <tr>
                <th>
                  <Icon class="add-icon" @click="add2" type="android-add-circle" v-if="data3.length<=10"></Icon>
                  <Icon type="plus-circled" v-else style="font-size:28px;"></Icon>
                </th>
                <th width=50%>选择地区</th>
                <th>设置包邮条件</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(ele,i) in data3">
                <tr>
                  <td class="center-td">
                    <Icon class="delete-icon" @click="del2(i)" type="android-remove-circle"></Icon>
                  </td>
                  <td class="num">
                    <div>{{ele.areaName}}</div>
                    <a @click="getAreaData(i,'add3')">编辑</a>
                  </td>
                  <td class="num">
                    <Select v-model="ele.freeType" style="width:33%">
                      <Option value="1">件</Option>
                      <Option value="2">金额</Option>
                      <Option value="0">金额+件</Option>
                    </Select>
                    <span style="margin-left:10px;" v-if="ele.freeType==1">
                      满
                      <Input v-model="ele.freeAmount" style="width:20%"></Input> 件包邮
                    </span>
                    <span style="margin-left:10px;" v-if="ele.freeType==2">
                      满
                      <Input v-model="ele.freeMoney" style="width:20%"></Input> 金额包邮
                    </span>
                    <p v-if="ele.freeType==0" style="margin-top:10px;">
                      <span style="margin-left:10px;">
                        满
                        <Input v-model="ele.freeAmount" style="width:20%"></Input> 件包邮
                      </span>
                      <span style="margin-left:10px;">
                        满
                        <Input v-model="ele.freeMoney" style="width:20%"></Input> 金额包邮
                      </span>
                    </p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </template>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="submit('formItem')">提交</Button>
      </FormItem>

    </Form>
    <Modal v-model="modal2" :title="modalTitle2" :loading2="loading2" @on-ok="ok2" :type="type2" style="z-index:1000;">
      <div style="max-height:400px; overflow-y:scroll">
        <Tree :data="data4" @on-check-change="getchecked" ref="tree" show-checkbox multiple></Tree>
      </div>

    </Modal>
  </div>
</template>

<script>
import { apiGet, apiPost, apiPostJson } from "@/fetch/api";
export default {
  data() {
    return {
      editIndex: null, //编辑下标
      kuaidi: true,
      zhiding: false,
      modal2: false,
      loading2: true,
      modalTitle2: "",
      type2: "",
      type3: "",
      type: "",
      dataAreaName: [],
      dataAreaId: [],
      data4: [],
      formItem: {
        id: this.$route.query.id,
        name: "",
        costType: "1",
        defaultWeight: "",
        defaultPrice: "",
        defaultStepWeight: "",
        defaultStepPrice: "",
        mdsePostageFreights: [],
        mdsePostageFrees: []
      },
      listData: [
        {
          areaId: "",
          areaName: "",
          startWeight: "",
          startPrice: "",
          stepWeight: "",
          stepPrice: ""
        }
      ],
      data3: [
        {
          areaId: "",
          areaName: "",
          freeType: "1",
          freeAmount: "",
          freeMoney: ""
        }
      ],
      ruleForm: {
        name: [
          {
            required: true,
            message: "请填写邮费模版名称",
            tirgger: "blur"
          }
        ],
        costType: [
          {
            required: true,
            message: "请选择邮费模版名称",
            tirgger: "change"
          }
        ],
        defaultWeight: [
          {
            required: true,
            message: "请填写默认件数",
            tirgger: "blur"
          }
        ],
        defaultPrice: [
          {
            required: true,
            message: "请填写默认邮费",
            tirgger: "blur"
          }
        ],
        defaultStepWeight: [
          {
            required: true,
            message: "请填写",
            tirgger: "blur"
          }
        ],
        defaultStepPrice: [
          {
            required: true,
            message: "请填写",
            tirgger: "blur"
          }
        ]
      }
    };
  },
  created() {
    if (this.$route.query.id != undefined) {
      this.type = "edit";
      apiGet(
        "/product/api/mdsePostage/selectById?postageId=" + this.$route.query.id
      ).then(res => {
        if (res.data.mdsePostageFrees.length) {
          this.zhiding = true;
        }
        this.formItem = res.data;
        let arr = res.data.mdsePostageFreights;
        arr.map((item, index) => {
          item.areaId = item.areaId;
          item.areaName = item.areaName;
        });

        this.listData = arr;
        let data = res.data.mdsePostageFrees;
        data.map((item, index) => {
          item.areaId = item.areaId;
          item.areaName = item.areaName;
        });
        this.data3 = data;
      });
    } else {
      this.type = "add";
    }
  },
  methods: {
    add() {
      this.listData.push({
        areaId: "",
        areaName: "",
        startWeight: "",
        startPrice: "",
        stepWeight: "",
        stepPrice: ""
      });

      if (this.listData.length >= 10) {
        this.$Message.warning("快递物流最多可添加10条!");
      }
    },
    del(index) {
      this.listData.splice(index, 1);
    },
    add2() {
      this.data3.push({
        areaId: "",
        areaName: "",
        freeType: "1",
        freeAmount: "",
        freeMoney: ""
      });
      if (this.data3.length >= 10) {
        this.$Message.warning("指定物流最多可添加10条!");
      }
    },
    del2(i) {
      this.data3.splice(i, 1);
    },
    getOtherareaIds(ins) {
      var arr = [];
      this.listData.forEach((el, i) => {
        if (ins != i) {
          arr = arr.concat(el.areaId);
        }
      });
      return arr;
    },
    //获取地区
    getAreaData(index, text, aaa) {
      let arrs = this.getOtherareaIds(index)
        ? this.getOtherareaIds(index).join(",")
        : "";
      this.editIndex = index;
      let _this = this;
      this.modal2 = true;
      this.modalTitle2 = "选择地区";
      this.type2 = text;
      let params = {};
      if (this.type2 == "add2") {
        params.areaId = this.listData[index].areaId;
      } else if (this.type2 == "add3") {
        params.areaId = this.data3[index].areaId;
      }

      //请求数据后怎样会得到默认选中的数据？不能给后台传params的值，默认选中实现了！！！
      apiPost("/product/mdsePostage/loadAreaData", { areaId: arrs }).then(
        res => {
          let data = res.data;
          let sheng = [],
            shi = [],
            arr = [];
          data.map(function(item, index) {
            if (item.pId === "156") {
              sheng.push(item);
            } else {
              shi.push(item);
            }
          });
          sheng.map(function(item1, index) {
            let obj = {};
            obj.title = item1.name;
            obj.id = item1.id;
            //obj.checked=_this.conTains(params.areaId.split(','),item1.id),
            (obj.selected = true), (obj.children = []);

            shi.map(function(ele, i) {
              if (ele.pId == item1.id) {
                obj.children.push({
                  title: ele.name,
                  id: ele.id,
                  checked: _this.conTains(params.areaId, ele.id)
                });
              }
            });
            arr.push(obj);
          });
          this.data4 = arr;
        }
      );
    },
    //判断数组中是否包含某元素
    conTains(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) {
          return true;
        }
      }
      return false;
    },
    ok2() {
      let data = this.$refs.tree.getCheckedNodes();
      data.map((ele, i) => {
        if (ele.checked == true) {
          this.dataAreaName.push(ele.title);
          this.dataAreaId.push(ele.id);
        }
      });

      if (this.type2 == "add2") {
        this.listData[this.editIndex].areaId = this.dataAreaId.join(",");
        this.listData[this.editIndex].areaName = this.dataAreaName.join(",");
      } else if (this.type2 == "add3") {
        this.data3[this.editIndex].areaId = this.dataAreaId.join(",");
        this.data3[this.editIndex].areaName = this.dataAreaName.join(",");
      }
      this.dataAreaId = [];
      this.dataAreaName = [];
      this.modal2 = false;
    },
    //选择地区即变化
    getchecked() {},
    submit(name) {
      let _this = this;
      this.formItem.mdsePostageFreights = this.listData;
      this.formItem.mdsePostageFrees = this.data3;
      let url =
        _this.type === "add"
          ? "/product/api/mdsePostage/savaMdsePostage"
          : "/product/api/mdsePostage/updateMdsePostage";
      this.common.formPost(this, {
        url,
        params: {
          params: JSON.stringify(this.formItem)
        },
        mold: "modal",
        callback(res) {
          if (res.status == 200) {
            _this.$Message.success("保存成功!");
            window.location.href =
              window.location.href.split("/manage")[0] +
              "/admin/index#/product/mdsePostage/list";
            // _this.$router.push('/mdsePostage')
          }
        }
      });
    }
  }
};
</script>


<style lang="scss">
.table {
  margin-bottom: 15px;
  width: 100%;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: separate;
  border-left: 0;
  border-bottom: 0;
  thead {
    tr {
      th {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
  tbody {
    tr {
      td {
        border-left: 1px solid #ddd;
        border-bottom: 1px solid #dddddd;
        padding: 8px;
        line-height: 20px;
        text-align: center;
        .tr-img {
          height: 58px;
          width: 58px;
          margin: 0 auto;
          //   line-height: 80px;
          //   border: 1px dashed#ccc;
          //   border-radius: 5px;
          //   text-align: center;
          margin-bottom: 5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

td.time {
  width: 330px;
}
.add-icon {
  cursor: pointer;
  color: green;
  font-size: 28px;
}
.delete-icon {
  cursor: pointer;
  color: red;
  font-size: 28px;
}
.center-td {
  text-align: center;
}
</style>


