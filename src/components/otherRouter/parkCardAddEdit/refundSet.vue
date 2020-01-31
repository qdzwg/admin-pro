<template>
    <div>
        <Form :model="formItem" :label-width="120" :rules="ruleComplteForm">
            <FormItem label="是否允许退款：" prop="nickName">
                <RadioGroup v-model="formItem.input">
                    <Radio label="T">
                        <span>是</span>
                    </Radio>
                    <Radio label="F">
                        <span>否</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="退款是否审核：" prop="nickName">
                <Select v-model="formItem.select" style="width:200px">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="submit">保存</Button>
                <!-- <Button type="ghost" style="margin-left: 8px">取消</Button> -->
            </FormItem>
        </Form>
    </div>
</template>
<script>
export default {
  data() {
    return {
      cityList: [
        {
          value: "T",
          label: "审核通过"
        },
        {
          value: "F",
          label: "审核不通过"
        }
      ],
      model1: "",
      ruleComplteForm: {
        linkMobileImg: [{ required: true, message: "请上传缩略图" }],
        useNight: [
          { required: true, message: "请填写几夜", trigger: "blur" },
          {
            pattern: /^\d+$/,
            message: "数据格式不正确"
          }
        ],
        channel: [
          { required: true, message: "请选择景点类型", trigger: "change" }
        ],
        openTime: [
          { required: true, message: "请填写开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请填写结束时间", trigger: "blur" }
        ],
        distType: [
          { required: true, message: "请选择分销渠道", trigger: "change" }
        ],
        nickName: [
          { required: true, message: "请填写景点别名", trigger: "blur" }
        ],
        subTitle: [
          { required: true, message: "请填写景点副标题", trigger: "blur" }
        ],
        priceShow: [
          { required: true, message: "请填写店铺展示起价", trigger: "blur" }
        ],
        virtualSale: [
          { required: true, message: "请填写店铺虚拟销量", trigger: "blur" }
        ],
        priceDist: [
          { required: true, message: "请填写分销展示价", trigger: "blur" }
        ]
      },
      formItem: {
        input: "T",
        select: "T"
      }
    };
  },
  methods: {
    submit() {}
  }
};
</script>