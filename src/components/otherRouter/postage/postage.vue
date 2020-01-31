<template>
  <div>
    <Form :model="formItem" label-position="right" :label-width="150" :rules="ruleForm" ref="formItem">
      <FormItem label="邮费模版名称：" prop="name">
        <Input v-model="formItem.name" style="width:33%;"></Input>
      </FormItem>
      <FormItem label="计价方式：">
        <RadioGroup @on-change='setUnit' v-model="formItem.costType">
          <Radio label="1">按件数</Radio>
          <Radio label="0">按重量</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="快递方式：">
        <p>除指定区域外，其余地区的配送费采用“默认配送费”</p>
        <!-- <span>快递物流</span> -->
        <template v-if="kuaidi==true">
          <div style="border:1px solid #ccc; padding:10px;">
            <div style="padding:10px 0;">
              <Row>
                <Col span="4">
                <FormItem prop="defaultWeight" v-if="formItem.costType==0" :rules="[{required: true,type: 'number', message: '请填写默认重量', tirgger: 'blur'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                  <span>默认运费</span>
                  <Input v-model="formItem.defaultWeight" :maxlength="5" number style="width:39%"></Input>
                  <span>kg</span>
                  <span>内</span>
                </FormItem>
                <FormItem prop="defaultWeight" v-if="formItem.costType==1" :rules="[{required: true,type: 'number', message: '请填写默认件数', tirgger: 'blur'},{pattern:/^[1-9]\d*$/,message:'请输入正整数'}]">
                  <span>默认运费</span>
                  <Input v-model="formItem.defaultWeight" :maxlength="5" number style="width:39%"></Input>
                  <span>件</span>
                  <span>内</span>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem prop="defaultPrice">
                  <Input v-model="formItem.defaultPrice" :maxlength="5" number style="width:39%"></Input>
                  <span> 元；每增加</span>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem prop="defaultStepWeight" v-if="formItem.costType==0" :rules="[{required: true,type: 'number', message: '请填写默认重量', tirgger: 'blur'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                  <Input v-model="formItem.defaultStepWeight" :maxlength="5" number style="width:39%"></Input>
                  <span>kg</span>
                  <span>,增加运费</span>
                </FormItem>
                <FormItem prop="defaultStepWeight" v-if="formItem.costType==1" :rules="[{required: true,type: 'number', message: '请填写默认件数', tirgger: 'blur'},{pattern:/^[1-9]\d*$/,message:'请输入正整数'}]">
                  <Input v-model="formItem.defaultStepWeight" :maxlength="5" number style="width:39%"></Input>
                  <span>件</span>
                  <span>,增加运费</span>
                </FormItem>
                </Col>
                <Col span="4">
                <FormItem prop="defaultStepPrice">
                  <Input v-model="formItem.defaultStepPrice" :maxlength="5" number style="width:39%"></Input>
                  <span>元</span>
                </FormItem>
                </Col>
              </Row>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>
                    <Icon class="add-icon" @click="add" type="android-add-circle" v-if="formItem.listData.length<10"></Icon>
                    <Icon type="plus-circled" @click="listDataLimit" v-else style="font-size:28px;"></Icon>
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
                <template v-for="(item,index) in formItem.listData">
                  <tr>
                    <td class="center-td">
                      <Icon class="delete-icon" @click="del(index)" type="android-remove-circle"></Icon>
                    </td>
                    <td>
                      <div>{{item.areaName}}</div>
                      <a @click="getAreaData(index,'add2')">编辑</a>
                    </td>
                    <td class="num">
                      <FormItem :prop="'listData.' + index + '.startWeight'" v-if="item.areaName" :rules="[{required: true, message:'该项不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                        <Input v-model="item.startWeight" number></Input>
                      </FormItem>
                      <FormItem :prop="'listData.' + index + '.startWeight'" v-else>
                        <Input v-model="item.startWeight" number></Input>
                      </FormItem>
                    </td>
                    <td class="num">
                      <FormItem :prop="'listData.' + index + '.startPrice'" v-if="item.areaName" :rules="[{required: true, message:'该项不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                        <Input v-model="item.startPrice" number></Input>
                      </FormItem>
                      <FormItem :prop="'listData.' + index + '.startPrice'" v-else>
                        <Input v-model="item.startPrice" number></Input>
                      </FormItem>
                    </td>
                    <td class="num">
                      <FormItem :prop="'listData.' + index + '.stepWeight'" v-if="item.areaName" :rules="[{required: true, message:'该项不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                        <Input v-model="item.stepWeight" number></Input>
                      </FormItem>
                      <FormItem :prop="'listData.' + index + '.stepWeight'" v-else>
                        <Input v-model="item.stepWeight" number></Input>
                      </FormItem>
                    </td>
                    <td class="num">
                      <FormItem :prop="'listData.' + index + '.stepPrice'" v-if="item.areaName" :rules="[{required: true, message:'该项不能为空', trigger: 'blur',type:'number'},{pattern:/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'数据格式不正确'}]">
                        <Input v-model="item.stepPrice" number></Input>
                      </FormItem>
                      <FormItem :prop="'listData.' + index + '.stepPrice'" v-else>
                        <Input v-model="item.stepPrice" number></Input>
                      </FormItem>
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
                  <Icon class="add-icon" @click="add2" type="android-add-circle" v-if="formItem.data3.length<10"></Icon>
                  <Icon type="plus-circled" @click="data3Limit" v-else style="font-size:28px;"></Icon>
                </th>
                <th width=50%>选择地区</th>
                <th>设置包邮条件</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(ele,i) in formItem.data3">
                <tr>
                  <td class="center-td">
                    <Icon class="delete-icon" @click="del2(i)" type="android-remove-circle"></Icon>
                  </td>
                  <td class="num">
                    <div>{{ele.areaName}}</div>
                    <a @click="getAreaData(i,'add3')">编辑</a>
                  </td>
                  <td class="num">
                    <Select v-model="ele.freeType" style="width:33%;vertical-align: middle;">
                      <Option value="1">件</Option>
                      <Option value="2">金额</Option>
                      <Option value="0">金额+件</Option>
                    </Select>
                    <p v-if="ele.freeType==1" style="width:66%; display:inline-block; vertical-align: middle;">
                      <FormItem :prop="'data3.' + i + '.freeAmount'" :rules="[{required: true, message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]" style="margin-left:10px;" v-if="ele.areaName">
                        满
                        <Input v-model="ele.freeAmount" style="width:40%"></Input> 件包邮
                      </FormItem>
                      <FormItem :prop="'data3.' + i + '.freeAmount'" :rules="[{required: true, message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]" style="margin-left:10px;" v-else>
                        满
                        <Input v-model="ele.freeAmount" style="width:40%"></Input> 件包邮
                      </FormItem>
                    </p>
                    <p v-if="ele.freeType==2" style="width:66%; display:inline-block; vertical-align: middle;">
                      <FormItem :prop="'data3.' + i + '.freeMoney'" :rules="[{required: true, message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]" style="margin-left:10px;" v-if="ele.areaName">
                        满
                        <Input v-model="ele.freeMoney" style="width:40%"></Input> 金额包邮
                      </FormItem>
                      <FormItem :prop="'data3.' + i + '.freeMoney'" :rules="[{required: true, message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]" style="margin-left:10px;" v-else>
                        满
                        <Input v-model="ele.freeMoney" style="width:40%"></Input> 金额包邮
                      </FormItem>
                    </p>
                    <p v-if="ele.freeType==0" style="width:66%; display:inline-block; vertical-align: middle;">
                      <FormItem :prop="'data3.' + i + '.freeAmount'" :rules="[{required: true, message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]" style="margin-left:10px;width:33%;display:inline-block;" v-if="ele.areaName">
                        满
                        <Input v-model="ele.freeAmount" style="width:40%"></Input> 件包邮
                      </FormItem>
                      <FormItem :prop="'data3.' + i + '.freeAmount'" :rules="[{required: true, message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]" style="margin-left:10px;width:33%;display:inline-block;" v-else>
                        满
                        <Input v-model="ele.freeAmount" style="width:40%"></Input> 件包邮
                      </FormItem>
                      <FormItem :prop="'data3.' + i + '.freeMoney'" :rules="[{required: true, message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]" style="margin-left:10px;width:60%;display:inline-block;" v-if="ele.areaName">
                        满
                        <Input v-model="ele.freeMoney" style="width:40%"></Input> 金额包邮
                      </FormItem>
                      <FormItem :prop="'data3.' + i + '.freeMoney'" :rules="[{required: true,message:'该项不能为空'},{ pattern: /^[1-9]\d*$/,message: '数据格式不正确'}]" style="margin-left:10px;width:60%;display:inline-block;" v-else>
                        满
                        <Input v-model="ele.freeMoney" style="width:40%"></Input> 金额包邮
                      </FormItem>
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
import { setTimeout } from "timers";
export default {
  data() {
    return {
      editIndex: null, //编辑下标
      kuaidi: true, //默认快递显示
      zhiding: false, //指定地区显示
      modal2: false, //选择地区模态框
      loading2: true, //模态框加载状态
      modalTitle2: "",
      type2: "",
      type3: "",
      type: "",
      dataAreaName: [], //所选地区名字
      dataAreaId: [], //所选地区id
      data4: [], //地区所有数据
      formItem: {
        id: this.$route.query.id,
        name: "",
        costType: "1",
        defaultWeight: "",
        defaultPrice: "",
        defaultStepWeight: "",
        defaultStepPrice: "",
        mdsePostageFreights: [],
        mdsePostageFrees: [],
        listData: [
          {
            areaId: "",
            areaName: "",
            startWeight: null,
            startPrice: null,
            stepWeight: null,
            stepPrice: null
          }
        ],
        data3: [
          {
            areaId: "",
            areaName: "",
            freeType: "1",
            freeAmount: null,
            freeMoney: null
          }
        ]
      },
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
        // defaultWeight: [
        //   {
        //     required: true,
        //     type: "number",
        //     message: "请填写默认件数",
        //     tirgger: "blur"
        //   },
        //   {pattern:/^[1-9]\d*$/,message:'请输入正整数'}
        // ],
        defaultPrice: [
          {
            required: true,
            type: "number",
            message: "请填写默认邮费",
            tirgger: "blur"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
          }
        ],
        // defaultStepWeight: [
        //   {
        //     required: true,
        //     type: "number",
        //     message: "请填写递增件数",
        //     tirgger: "blur"
        //   },
        //   {pattern:/^[1-9]\d*$/,message:'请输入正整数'}
        // ],
        defaultStepPrice: [
          {
            required: true,
            type: "number",
            message: "请填写递增邮费",
            tirgger: "blur"
          },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: "数据格式不正确"
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
        this.formItem.costType = res.data.costType ? res.data.costType : "";
        this.formItem.defaultPrice = res.data.defaultPrice
          ? res.data.defaultPrice
          : null;
        this.formItem.defaultStepPrice = res.data.defaultStepPrice
          ? res.data.defaultStepPrice
          : null;
        this.formItem.defaultStepWeight = res.data.defaultStepWeight
          ? res.data.defaultStepWeight
          : null;
        this.formItem.defaultWeight = res.data.defaultWeight
          ? res.data.defaultWeight
          : null;
        this.formItem.id = res.data.id ? res.data.id : "";
        this.formItem.name = res.data.name ? res.data.name : "";
        let arr = res.data.mdsePostageFreights;
        arr.map((item, index) => {
          item.areaId = item.areaId;
          item.areaName = item.areaName;
        });

        this.formItem.listData = arr;
        let data = res.data.mdsePostageFrees;
        data.map((item, index) => {
          item.areaId = item.areaId;
          item.areaName = item.areaName;
        });

        this.formItem.data3 = data;
      });
    } else {
      this.type = "add";
    }
  },
  methods: {
    setUnit(val) {
      if (val == "1") {
        this.ruleForm = {
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
              type: "number",
              message: "请填写默认件数",
              tirgger: "blur"
            }
          ],
          defaultPrice: [
            {
              required: true,
              type: "number",
              message: "请填写默认邮费",
              tirgger: "blur"
            }
          ],
          defaultStepWeight: [
            {
              required: true,
              type: "number",
              message: "请填写递增件数",
              tirgger: "blur"
            }
          ],
          defaultStepPrice: [
            {
              required: true,
              type: "number",
              message: "请填写递增邮费",
              tirgger: "blur"
            }
          ]
        };
      } else {
        this.ruleForm = {
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
              type: "number",
              message: "请填写默认重量",
              tirgger: "blur"
            }
          ],
          defaultPrice: [
            {
              required: true,
              type: "number",
              message: "请填写默认邮费",
              tirgger: "blur"
            }
          ],
          defaultStepWeight: [
            {
              required: true,
              type: "number",
              message: "请填写递增重量",
              tirgger: "blur"
            }
          ],
          defaultStepPrice: [
            {
              required: true,
              type: "number",
              message: "请填写递增邮费",
              tirgger: "blur"
            }
          ]
        };
      }
    },
    listDataLimit() {
      this.$Message.warning("快递物流最多可添加10条!");
    },
    add() {
      if (this.formItem.listData.length >= 10) {
        this.$Message.warning("快递物流最多可添加10条!");
      } else {
        this.formItem.listData.push({
          areaId: "",
          areaName: "",
          startWeight: "",
          startPrice: "",
          stepWeight: "",
          stepPrice: ""
        });
      }
    },
    del(index) {
      this.formItem.listData.splice(index, 1);
    },
    data3Limit() {
      this.$Message.warning("指定物流最多可添加10条!");
    },
    add2() {
      if (this.formItem.data3.length >= 10) {
        this.$Message.warning("指定物流最多可添加10条!");
      } else {
        this.formItem.data3.push({
          areaId: "",
          areaName: "",
          freeType: "1",
          freeAmount: null,
          freeMoney: null
        });
      }
    },
    del2(i) {
      this.formItem.data3.splice(i, 1);
    },
    //过滤出已选择的地区id，待传给后台（默认快递物流）
    getOtherareaIds(ins) {
      var arr = [];
      this.formItem.listData.forEach((el, i) => {
        if (ins != i) {
          arr = arr.concat(el.areaId);
        }
      });
      return arr;
    },
    //过滤出已选择的地区id，待传给后台（指定地区物流）
    getOtherareaIds2(ins) {
      var arr = [];
      this.formItem.data3.forEach((el, i) => {
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
      let arrs2 = this.getOtherareaIds2(index)
        ? this.getOtherareaIds2(index).join(",")
        : "";
      this.editIndex = index;
      let _this = this;
      this.modal2 = true;
      this.modalTitle2 = "选择地区";
      this.type2 = text;
      let params = {};
      if (this.type2 == "add2") {
        params.areaId = this.formItem.listData[index].areaId;
      } else if (this.type2 == "add3") {
        params.areaId = this.formItem.data3[index].areaId;
      }
      let passBackId = this.type2 == "add2" ? arrs : arrs2;
      //请求数据后怎样会得到默认选中的数据？不能给后台传params的值，默认选中实现了！！！
      apiPost("/product/mdsePostage/loadAreaData", { areaId: passBackId }).then(
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
        this.formItem.listData[this.editIndex].areaId = this.dataAreaId.join(
          ","
        );
        this.formItem.listData[
          this.editIndex
        ].areaName = this.dataAreaName.join(",");
      } else if (this.type2 == "add3") {
        this.formItem.data3[this.editIndex].areaId = this.dataAreaId.join(",");
        this.formItem.data3[this.editIndex].areaName = this.dataAreaName.join(
          ","
        );
      }
      this.dataAreaId = [];
      this.dataAreaName = [];
      this.modal2 = false;
    },
    //选择地区即变化
    getchecked() {},
    submit(name) {
      let _this = this;
      this.formItem.mdsePostageFreights = this.formItem.listData;
      this.formItem.mdsePostageFrees = this.formItem.data3;
      this.formItem.mdsePostageFreights.forEach((item, i) => {
        if (!item.areaName) {
          _this.formItem.mdsePostageFreights.splice(i, 1);
        }
      });
      this.formItem.mdsePostageFrees.forEach((item, i) => {
        if (!item.areaName) {
          _this.formItem.mdsePostageFrees.splice(i, 1);
        }
      });
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
            setTimeout(function() {
              window.location.href =
                window.location.href.split("/manage")[0] +
                "/admin/index#/product/mdsePostage/list";
            }, 500);

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


