<template>
    <div class="newContractTemplate">
        <Form :model="formItem" label-position="right" :label-width="120" ref="formItem" :rules="ruleForm">
            <FormItem label="合同模板：" prop="name">
                <Input v-model="formItem.name" style="width:33%;" :maxlength="30"></Input>
            </FormItem>
            <FormItem label="合同期限：" required>
                <Row style="width:33%;">
                    <Col span="11">
                    <FormItem prop="startDate">
                        <DatePicker transfer :value="formItem.startDate" @on-change="setBegDate" type="date" :options="options3" format="yyyy-MM-dd"></DatePicker>
                    </FormItem>
                    </Col>
                    <Col span="2">-</Col>
                    <Col span="11">
                    <FormItem prop="endDate">
                        <DatePicker transfer :value="formItem.endDate" @on-change="setEndDate" type="date" :options="options4" format="yyyy-MM-dd"></DatePicker>
                    </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="合同状态：" required>
                <RadioGroup v-model="formItem.status">
                    <Radio label="T">启用</Radio>
                    <Radio label="F">禁用</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="合同内容：" prop="content">
                <!-- <Input v-model="formItem.content" style="display:none;"></Input>
                <ueditor v-if="flag" id="ue2" ref="mustKnow" :content="formItem.content" :config="config"></ueditor> -->
                  <vueUEditor v-model="formItem.content" :config="config"></vueUEditor>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">保存</Button>
                <Button  @click="test">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import ueditor from "@/components/global/ueditor";
import vueUEditor from "@/components/global/vueUEditor";
import { apiPost, apiGet } from "@/fetch/api";
export default {
  components: {
    ueditor,
    vueUEditor
  },
  data() {
    return {
      config: {
        initialFrameWidth: 800,
        initialFrameHeight: 200
      },
      formItem: {
        id: "",
        // mainUserId: localStorage.getItem("xjsc_2018_userId"),
        name: "",
        startDate: null,
        endDate: null,
        status: "T",
        content: ""
      },
      ruleForm: {
        name: [
          { required: true, message: "请填写合同模板名称", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "请选择合同开始日期", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "请选择合同结束日期", trigger: "change" }
        ],
        content: [
          { required: true, message: "请填写合同内容", trigger: "blur" }
        ]
      },
      options4: {},
       options3: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      flag: false
    };
  },
  created() {
    if (this.$route.query.id) {
      apiGet(
        "/admin/webApi/contractTemplate/detailById?id=" + this.$route.query.id
      ).then(res => {
        if (res.status == 200) {
          this.formItem = res.data;
          this.flag = true;
        }
      });
    } else {
      this.flag = true;
    }
  },
  methods: {
    setBegDate(time) {
      this.formItem.startDate = time;
      this.options4 = {
        disabledDate: date => {
          let startTime = this.formItem.startDate
            ? new Date(this.formItem.startDate).valueOf()
            : "";
          return date && date.valueOf() < startTime;
        }
      };
    },
    setEndDate(time) {
      if (time) {
        this.formItem.endDate = time;
        let endTime = this.formItem.endDate
          ? new Date(this.formItem.endDate).valueOf() - 1 * 24 * 60 * 60 * 1000
          : "";
        this.options3 = {
          disabledDate(date) {
            return date && date.valueOf() > endTime;
          }
        };
      } else {
        this.options3 = {
          disabledDate(date) {
            return false;
          }
        };
      }
    },
    test(){
        this.$router.back()
    },
    submit() {
    //   this.formItem.content = this.$refs.mustKnow.getUEContent();

      delete this.formItem.modifyTime;
      delete this.formItem.createTime;
      this.$refs.formItem.validate(valid => {
        if (valid) {
          apiPost("/admin/webApi/contractTemplate/save", this.formItem).then(
            res => {
              if (res.status == 200) {
                this.$Message.success(res.message);
                this.$router.back();
              } else {
                this.$Message.warning(res.message);
              }
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="scss">
.newContractTemplate {
}
</style>


