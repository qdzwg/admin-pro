<template>
  <div>
    <Form :model="formItem" label-position="right" :label-width="150" ref="formItem" :rules="ruleForm">
      <FormItem label="规则名称：" prop="name">
        <Input v-model="formItem.name" placeholder="填写规则名称" style="width: 300px;"></Input>
      </FormItem>
      <FormItem label="规则属性：">
        <Form :model="formItem" label-position="right" :label-width="150" ref="radioRef" :rules="ruleForm">
          <RadioGroup v-model="formItem.type" @on-change="toChangeRule">
              <Radio label="固定积分抵扣"></Radio>
              <FormItem style="display:inline-block" prop="fixed">
                <Input v-model="formItem.fixed" :disabled="formItem.type=='订单金额百分比'" style="width: 120px;"></Input>
                &nbsp;&nbsp;
                <span style="color:#bbbec4; font-size:10px; position:relative; top:2px">一个订单能使用的最大积分数量，每1积分固定抵扣1元</span>
              </FormItem>
              <br/><br/>
              <Radio label="订单金额百分比"></Radio>
              <FormItem style="display:inline-block" prop="percent">
                <Input v-model="formItem.percent" :disabled="formItem.type=='固定积分抵扣'" style="width: 60px;"></Input> %
              </FormItem>
          </RadioGroup>
        </Form>
      </FormItem>
      <FormItem label="有效期：" @mouseenter.native="toNomal">
        <DatePicker :class="{backRed:isRed, backNm:!isRed}" :value="formItem.startTime" format="yyyy-MM-dd" type="date" @on-change="startDateSet" placeholder="请选择开始时间"></DatePicker>
        &nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;
        <DatePicker :class="{backRed:isRed, backNm:!isRed}" :value="formItem.endTime" format="yyyy-MM-dd" type="date" @on-change="endDateSet" placeholder="请选择结束时间"></DatePicker>
      </FormItem>
      <FormItem label="禁启用：">
        <Select v-model="formItem.enable" style="width:180px">
          <Option v-for="item in useFlagList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <div class="save-cancel">
          <Button type="primary" @click="submit">保存</Button>
          <Button type="ghost" @click="back" style="margin-left: 8px">返回列表</Button>
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      type:'',
      id:null,
      isRed:false,
      useFlagList: [
        {
          value: "T",
          label: "启用"
        },
        {
          value: "F",
          label: "停用"
        }
      ],
      formItem: {
        name:'',
        type:'fixed',
        fixed:'',
        percent:'',
        startTime:'',
        endTime:'',
        enable:'T'
      },
      ruleForm: {
        name:[
          { required: true, message: "规则名称不能为空!", trigger: "blur" }
        ],
        fixed:[
          { required: true, message: "不能为空!", trigger: "blur" }
        ],
        percent:[
          { required: true, message: "不能为空!", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    toChangeRule(val){
      this.formItem.percent='';
      this.formItem.fixed='';
      this.$refs.radioRef.resetFields();
    },
    toNomal(){
      this.isRed=false;
    },
    startDateSet(time) {
      this.formItem.startTime = time
    },
    endDateSet(time) {
      this.formItem.endTime = time
    },
    back() {
      this.$router.push("/integral");
    },
    submit() {
      console.log(this.formItem.type)
        if(this.formItem.type == '固定积分抵扣'){
          this.ruleForm.fixed[0].required=true;
          this.ruleForm.percent[0].required=false;
        }else{
          this.ruleForm.fixed[0].required=false;
          this.ruleForm.percent[0].required=true;
        };
        this.$refs.formItem.validate(async valid => {
            this.$refs.radioRef.validate(async valid2 => {

              if (valid && valid2 && this.formItem.startTime!='' && this.formItem.endTime!='') {
                  let url = "";
                  if(this.type == 'add'){
                    url = '/leaguer/web/deduction/rule/manage/add';
                  }else{
                    url = '/leaguer/web/deduction/rule/manage/update';
                  };

                  let json=Object.assign({}, this.formItem);
                  if(json.type=='固定积分抵扣'){
                    json.type='fixed';
                  }else{
                    json.type='percent';
                  };
                  if(this.type == 'edit')json.id=this.id;
                  json=JSON.stringify(json);

                  this.apiPost(url, {merchantInfoId:this.$route.query.merchantInfoId, rule:json}).then(data=>{
                    if(data.status==200){
                      this.$Message.success(data.message);
                      this.back();
                    }else{
                      this.$Message.warning(data.message);
                    };
                  }).catch(err=>{
                    this.$Message.warning("添加失败!");
                  });
              }else{
                if(this.formItem.startTime=='' || this.formItem.endTime=='')this.isRed=true;
                this.$Message.warning("资料填写不完整!");
              };

            });
        })
    }
  },
  created() {
      let _isJson=function (obj){             //判断一个对象是否为json对象,返回布尔值
        var boolean_isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
        return boolean_isjson;
      };
      if(this.$route.query && this.$route.query.data && _isJson(this.$route.query.data)){
          this.type = 'edit';
          this.id=this.$route.query.data.id+'';
          this.formItem={
            corpCode:this.$route.query.data.corpCode,
            name:this.$route.query.data.name,
            type:this.$route.query.data.type=='fixed'?'固定积分抵扣':'订单金额百分比',
            fixed:this.$route.query.data.fixed?this.$route.query.data.fixed+'':'',
            percent:this.$route.query.data.percent?this.$route.query.data.percent+'':'',
            startTime:this.$route.query.data.startTime,
            endTime:this.$route.query.data.endTime,
            enable:this.$route.query.data.enable
          };
      }else if(this.$route.query && this.$route.query.data && !_isJson(this.$route.query.data)){
        this.type = '';
        this.back();
      }else{
          this.type = 'add';
          this.formItem={
            corpCode:this.$route.query.corpCode,
            name:'',
            type:'固定积分抵扣',
            fixed:'',
            percent:'',
            startTime:'',
            endTime:'',
            enable:'T'
          };
      }
  }
};
</script>
<style lang="scss" scoped>
.pro-main {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    justify-content:center;
    flex-direction:row;
    // align-items : center;
    .pro-left{
        flex: 7;
    }
    .pro-center{
        flex: 1;
        text-align: center;
    }
    .pro-right{
        flex: 7;
    }
}
.backRed {
  animation:TORED .5s forwards;
  -webkit-animation:TORED .5s forwards;
  -ms-animation:TORED .5s forwards;
  -moz-animation:TORED .5s forwards;
  -o-animation:TORED .5s forwards;
  border-radius:5px;
}
.backNm {
  animation:TONOMAL .5s forwards;
  -webkit-animation:TONOMAL .5s forwards;
  -ms-animation:TONOMAL .5s forwards;
  -moz-animation:TONOMAL .5s forwards;
  -o-animation:TONOMAL .5s forwards;
  border-radius:5px;
}
@keyframes TORED {
  from {box-shadow:none;}
  to {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
}
@-webkit-keyframes TORED {
  from {box-shadow:none;}
  to {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
}
@-ms-keyframes TORED {
  from {box-shadow:none;}
  to {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
}
@-moz-keyframes TORED {
  from {box-shadow:none;}
  to {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
}
@-o-keyframes TORED {
  from {box-shadow:none;}
  to {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
}
@keyframes TONOMAL {
  from {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
  to {box-shadow:none;}
}
@-webkit-keyframes TONOMAL {
  from {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
  to {box-shadow:none;}
}
@-ms-keyframes TONOMAL {
  from {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
  to {box-shadow:none;}
}
@-moz-keyframes TONOMAL {
  from {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
  to {box-shadow:none;}
}
@-o-keyframes TONOMAL {
  from {box-shadow:1px 0px red,0px 1px red,-1px 0px red,0px -1px red;}
  to {box-shadow:none;}
}

</style>