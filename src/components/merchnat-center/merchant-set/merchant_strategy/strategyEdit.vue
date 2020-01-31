<template>
  <div class="strategy-edit">
    <Form :model="formItemData"
          label-position="right"
          :label-width="120"
          ref="formValidate"
          :rules="ruleForm">
      <FormItem label="攻略类型："
                prop="strategyType">
        <Select v-model="formItemData.strategyType"
                placeholder="请选择类型"
                style="width:200px">
          <Option v-for="item in strategyTypeList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
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
                style="margin-bottom:10px">新增标签</Button>
        <Table :columns="columns"
               :data="formItemData.strategyTags"></Table>
      </FormItem>
      <FormItem label="样式预览:">
      </FormItem>
      <FormItem label="视频：">
        <my-video :limitNum="1"
                  type="mp4"
                  v-model="formItemData.musicAddr"></my-video>
        <p style="color:red">只支持mp4格式 ，建议上传小于10M;</p>
      </FormItem>
      <FormItem label="音频：">
        <my-video :limitNum="1"
                  :uploadList="formItemData.vedioAddr?formItemData.vedioAddr.split(','):[]"
                  @getImgUrl="setAudioVideo"></my-video>
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
    <amap ref="mapModel"
          @getPoint="getPoint"></amap>
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
      strategyTypeList: [
        {
          value: 0,
          label: '资讯攻略'
        },
        {
          value: 1,
          label: '游玩攻略'
        }
      ],
      styleList: [
        {
          label: '样式1',
          value: 0,
        },
        {
          label: '样式2',
          value: 1,
        },
        {
          label: '样式3',
          value: 2,
        }
      ],
      // modal: true,
      formItemData: {

      },
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
          key: 'labelKey',
          render: (h, params) => {
            let { index } = params
            return h('Select', {
              props: {
                value: params.row.labelKey
              },
              on: {
                'on-change': (value) => {
                  this.formItemData.strategyTags[index].labelKey = value
                }
              }
            }, this.styleList.map(item => {
              return h('Option', {
                props: {
                  value: item.value
                }
              }, item.label)
            }))
          }
        },
        {
          title: '操作',
          width: 80,
          align: 'center',
          key: 'action',
          render: (h, params) => {
            return h('span', {
              on: {
                click: () => {

                }
              }
            }, '删除')
          }
        }
      ],
      formItemData: {
        id: 208,
        strategyType: 1,
        name: '现在在改变0',
        decription: '12312312313',
        picAddr: 'https://statics.lotsmall.cn/image/20191108/20191108151455i5vzfh.PNG',
        strategyTags: [
          { labelName: "", labelKey: 0 },
          { labelName: "新标签", labelKey: 0 },
          { labelName: "新标签2", labelKey: 1 },
          { labelName: "新标签44", labelKey: 2 }
        ],
        vedioAddr: 'https://statics.lotsmall.cn/image/20191107/20191107162310k6bwq0.mp4',
        musicAddr: 'https://statics.lotsmall.cn/image/20191107/20191107162824r5dt7h.mp4',
        latitudeLongitude: '120.218685, 30.298503',
        nickName: '高222',
        headImg: 'https://statics.lotsmall.cn/image/20191108/20191108151520fexy8u.jpg',
        subHeading1: 'sd搜索',
        content1: '<p>士大夫敢死队风格<img src="https://statics.lotsmall.cn/image/20191107/201911071624068ezbl8.PNG" title="" alt="" /><br />哒哒哒哒哒<br /></p>',
        subHeading2: '标题22',
        content2: '<p>详情我我我我我我22222详情我我我我我我22222详情我我我我我我22222详情我我我我我我22222</p>',
        subHeading3: 3,
        content3: '<p>是大大大<img src="https://statics.lotsmall.cn/image/20191108/20191108110151st9lmf.gif" title="" alt="" /></p>',
      },
    };
  },
  watch: {
  },
  computed: {},
  methods: {
    setAudioMusic (music) {
      this.formItemData.musicAddr = music[0];
    },
    setAudioVideo (video) {
      this.formItemData.vedioAddr = video[0];
    },

    submit (val) {
      this.$refs.formValidate.validate((valid) => {
        console.log(this.formItemData)
        console.log(this.data)
        this.$emit('input', true)
        if (valid) {
          this.$emit('update')
          // let url =
          //   this.modalTitle.includes('新增')
          //     ? "merchant/merchantPushInfo/saveMerchantPushInfo"
          //     : 'merchant/merchantPushInfo/updateMerchantPushInfo'

          // this.$refs.pageWrap.request({ url, param: this.formItem }).then(res => {
          //   if (res.success) {
          //     this.modal = false
          //   }
          // })
        }
      })

    },
    cancel (val) {

    },
    showModal () {
      this.$refs.mapModel.showModal(this.formItem.latitudeLongitude)
    },
    getPoint (point) {
      this.formItem.latitudeLongitude = point.lat + ',' + point.lng
    },
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      // this.$refs.detail1.init();
      // this.$refs.detail2.init();
      // this.$refs.detail3.init();
    })

    // this.$refs.introduce.getUEContent();
  }
};
</script>
<style lang="scss" scoped>
.strategy-edit {
}
</style>