<template>
  <div class="strategy-edit">
    <Form :model="formItemData"
          label-position="right"
          :label-width="120"
          ref="formValidate"
          :rules="ruleForm">
      <FormItem label="攻略类型：">
        <Select v-model="formItemData.strategyType"
                placeholder="请选择类型"
                style="width:200px">
          <Option v-for="item in strategyTypeList"
                  :value="item.key"
                  :key="item.value">{{ item.value }}</Option>
        </Select>
      </FormItem>
      <FormItem label="攻略名称："
                prop='name'>
        <Input v-model="formItemData.name"
               style="width:200px"
               placeholder="请输入攻略名称"
               type="text"></Input>
      </FormItem>
      <FormItem label="攻略简介：">
        <Input v-model="formItemData.decription"
               style="width:200px"
               placeholder="请输入攻略简介"
               type="text"></Input>
      </FormItem>
      <FormItem label="攻略主图：">
        <up-img :limitNum="1"
                v-model="formItemData.picAddr"></up-img>
      </FormItem>
      <FormItem label="标签：">
        <Button type="primary"
                style="margin-bottom:10px" @click="toAddLable">新增标签</Button>
        <Table :columns="columns"
               :data="formItemData.strategyTags"></Table>
      </FormItem>
      <FormItem label="样式预览:">
      </FormItem>
      <FormItem label="视频：">
        <my-video :limitNum="1"
                  type="mp4"
                  :uploadList="videoList"
                  v-model="formItemData.vedioAddr"></my-video>
        <p style="color:red">只支持mp4格式 ，建议上传小于10M;</p>
      </FormItem>
      <FormItem label="音频：">
        <my-video :limitNum="1"
                  type="mp3"
                  :uploadList="musicList"
                  v-model="formItemData.musicAddr"></my-video>
        <p style="color:red">只支持mp3格式 ，建议上传小于10M;</p>
      </FormItem>
      <FormItem label="地图定位：">
        <Input v-model="formItemData.latitudeLongitude"
               style="width:88%;"
               readonly></Input>
        <Button type="primary"
                @click="showModal">获取坐标</Button>
      </FormItem>
      <FormItem label="发稿人昵称：">
        <Input v-model="formItemData.nickName"
               style="width:200px"
               placeholder="请输入发稿人昵称"
               type="text"></Input>
      </FormItem>
      <FormItem label="发稿人图片：">
        <up-img :limitNum="1"
                v-model="formItemData.headImg"></up-img>
      </FormItem>
      <FormItem label="小标题1：">
        <Input v-model="formItemData.subHeading1"
               style="width:200px"
               placeholder="请输入小标题1"
               type="text"></Input>
      </FormItem>
      <FormItem label="详情1：">
        <ueditor id="edit1"
                 v-model="formItemData.content1"
                 :config="config"></ueditor>
      </FormItem>

      <FormItem label="小标题2：">
        <Input v-model="formItemData.subHeading2"
               style="width:200px"
               placeholder="请输入小标题2"></Input>
      </FormItem>
      <FormItem label="详情2：">
        <ueditor id="edit2"
                 v-model="formItemData.content2"
                 :config="config"></ueditor>
      </FormItem>

      <FormItem label="小标题3：">
        <Input v-model="formItemData.subHeading3"
               style="width:200px"
               placeholder="请输入小标题3"
               type="text"></Input>
      </FormItem>
      <FormItem label="详情3：">
        <ueditor id="edit3"
                 v-model="formItemData.content3"
                 :config="config"></ueditor>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="submit">提交</Button>
        <Button type="ghost"
                style="margin-left: 8px"
                @click="cancel">取消</Button>
      </FormItem>

    </Form>
    <!-- 弹出层 -->
    <amap ref="mapModel" @getPoint="getPoint"></amap>
  </div>
</template>

<script>
import amap from '@/components/global/amap'
import myVideo from "@/components/global/video";
export default {
  components: { myVideo, amap },
  props: {
  },
  data () {
    return {
      videoList:[],
      musicList:[],
      strategyTypeList: [
        /*{
          key: 0,
          value: '资讯攻略'
        },
        {
          key: 1,
          value: '游玩攻略'
        }*/
      ],
      styleList: [
        /*{
          value: '样式1',
          key: 0,
        },
        {
          value: '样式2',
          key: 1,
        },
        {
          value: '样式3',
          key: 2,
        }*/
      ],
      // modal: true,
      config: {
        initialFrameWidth: 600,
        initialFrameHeight: 200
      },
      ruleForm: {
        strategyType: [
          { required: true, message: "请选选择攻略类型", trigger: "change", type: 'number' }
        ],
        name: [
          { required: true, message: "请写入攻略名称", trigger: "change" }
        ]
      },
      columns: [
        {
          title: '标签名称',
          key: 'labelName',
          render: (h, params) => {
            let { index } = params
            return h('Input', {
              props: {
                value: this.formItemData.strategyTags[index].labelName
              },
              on: {
                'on-blur': (event) => {
                  this.formItemData.strategyTags[index].labelName = event.target.value
                }
              }
            })
          }
        },
        {
          title: '样式标签',
          key: 'labelStyle',
          render: (h, params) => {
            let { index } = params
            return h('Select', {
              props:{
                value:this.formItemData.strategyTags[index].labelStyle
              },
              on: {
                'on-change': (value) => {
                  this.formItemData.strategyTags[index].labelStyle = value
                }
              }
            }, this.styleList.map(item => {
              return h('Option', {
                props: {
                  value: item.value
                }
              }, item.value)
            }))
          }
        },
        {
          title: '操作',
          width: 80,
          align: 'center',
          key: 'action',
          render: (h, params) => {
            let { index } = params
            return h('span', {
              style:{
                cursor:'pointer'
              },
              on: {
                click: () => {
                  this.formItemData.strategyTags.splice(index, 1);
                }
              }
            }, '删除')
          }
        }
      ],
      formItemData: {
        strategyType: '1', // 店铺攻略类型
        name: '',  // 活动名称
        decription: '', // 攻略简介
        picAddr: '', // 图片地址
        strategyTags: [], // 攻略标签
        vedioAddr: '', // 视频地址
        musicAddr: '', // 音频地址
        latitudeLongitude: '120.218685, 30.298503', // 地图坐标
        nickName: '', // 发稿人昵称
        headImg: '', // 发稿人头像
        subHeading1: '', // 小标题1
        content1: '', // 详情1
        subHeading2: '', // 小标题2
        content2: '', // 详情2
        subHeading3: '', // 小标题3
        content3: '', // 详情3
      },
    };
  },
  watch: {
  },
  computed: {},
  methods: {
    toAddLable(){
      this.formItemData.strategyTags.push({labelName: "", labelStyle:this.styleList[0]?this.styleList[0].value:''});
    },
    setAudioMusic (music) {
      this.formItemData.musicAddr = music[0];
    },
    setAudioVideo (video) {
      this.formItemData.vedioAddr = video[0];
    },

    submit(){
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          let json=Object.assign({}, this.formItemData);
          json.strategyTags=JSON.stringify(json.strategyTags);
          delete json.createTime;
          delete json.modifyTime;
          delete json.pv;
          this.apiPost('/merchant/webApi/merchantStrategy/updateMerchantStrategyFL', json).then(data=>{
            if(data.success){
              this.$Message.success('修改成功!');
              this.$router.push('/merchant_strategy');
            }else{
              this.$Message.warning(data.message);
            };
          }).catch(err=>{
            this.$Message.warning('修改失败!');
          });
        }
      })

    },
    cancel (val) {
      this.$router.push('/merchant_strategy');
    },
    showModal () {
      this.$refs.mapModel.showModal(this.formItemData.latitudeLongitude);
    },
    getPoint (point) {
      this.formItemData.latitudeLongitude = point.lat + ',' + point.lng
    },
  },
  created () {
    
  },
  mounted () {
    this.apiGet('/merchant/webApi/merchantStrategy/editFL', {id:this.$route.params.id}).then(data=>{
      if(data.status==200){
        this.strategyTypeList=data.data.strategyTypeList;
        this.styleList=data.data.strategyTagStyleList;
        if('strategyTags' in data.data.merchantStrategy)data.data.merchantStrategy.strategyTags=JSON.parse(data.data.merchantStrategy.strategyTags);
        if('strategyType' in data.data.merchantStrategy)data.data.merchantStrategy.strategyType=data.data.merchantStrategy.strategyType+'';
        this.formItemData=Object.assign(this.formItemData, data.data.merchantStrategy);
        this.videoList=this.formItemData.vedioAddr?this.formItemData.vedioAddr.split(','):[];
        this.musicList=this.formItemData.musicAddr?this.formItemData.musicAddr.split(','):[];
      }else{
        this.$Message.warning('详情获取失败!');
      };
    }).catch(err=>{
      this.$Message.warning('详情获取失败!');
    });
  }
};
</script>
<style lang="scss" scoped>
.strategy-edit {
}
</style>