<template>
  <Form :model="formItem"
        label-position="right"
        :label-width="120"
        ref="formValidate">
    <FormItem label="攻略类型：">
      <span>{{formItem.strategyType|filterType}}</span>
    </FormItem>
    <FormItem label="攻略名称：">
      <span>{{formItem.name}}</span>
    </FormItem>
    <FormItem label="攻略简介：">
      <span>{{formItem.decription}}</span>
    </FormItem>
    <FormItem label="攻略主图：">
      <img :src="formItem.picAddr"
           style="width:100px;height:100px"
           alt="攻略主图">
    </FormItem>
    <FormItem label="标签：">
      <Table :columns="columns"
             :data="data"></Table>
    </FormItem>
    <FormItem label="样式预览:">
    </FormItem>
    <FormItem label="视频：">
      <video :src="formItem.musicAddr?formItem.musicAddr.split(',')[0]:[]"
             height=100
             width=200
             autoplay="autoplay">
        您的浏览器不支持 video 标签。
      </video>
    </FormItem>
    <FormItem label="音频：">
      <audio :src="formItem.vedioAddr?formItem.vedioAddr.split(',')[0]:[]"
             height="40"
             controls="controls">
        您的浏览器不支持 audio 标签。
      </audio>
    </FormItem>
    <FormItem label="地图定位：">
      <span>{{formItem.latitudeLongitude}}</span>
    </FormItem>
    <FormItem label="发稿人昵称：">
      <span>{{formItem.nickName}}</span>
    </FormItem>
    <FormItem label="发稿人图片：">
      <img :src="formItem.headImg?formItem.headImg.split(',')[0]:''"
           style="width:100px;height:100px"
           alt="攻略主图">
    </FormItem>
    <FormItem label="小标题1：">
      <span>{{formItem.subHeading1}}</span>
    </FormItem>
    <FormItem label="详情1：">
      <ueditor id="detail1"
               :isDisable="isDisable"
               v-model="formItem.content1"
               :config="config"></ueditor>
    </FormItem>
    <FormItem label="小标题2：">
      <span>{{formItem.subHeading2}}</span>
    </FormItem>
    <FormItem label="详情2：">
      <ueditor id="detail2"
               :isDisable="isDisable"
               v-model="formItem.content2"
               :config="config"></ueditor>
    </FormItem>
    <FormItem label="小标题3：">
      <span>{{formItem.subHeading3}}</span>
    </FormItem>
    <FormItem label="详情3：">
      <ueditor id="detail3"
               :isDisable="isDisable"
               v-model="formItem.content3"
               :config="config"></ueditor>
    </FormItem>
  </Form>
</template>

<script>
import myVideo from "@/components/global/video";
export default {
  components: { myVideo, },
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
      isDisable: true,
      config: {
        initialFrameWidth: 600,
        initialFrameHeight: 200
      },
      columns: [
        {
          title: '标签名称',
          key: 'labelName',
          render: (h, params) => {
            return h('span', params.row.labelName)
          }
        },
        {
          title: '样式标签',
          key: 'labelKey',
          render: (h, params) => {
            return h('span', this.$flType(params.row.labelKey, this.styleList))
          }
        }
      ],
      data: [
        { labelName: "1", labelKey: 0, labelStyle: "样式1" },
        { labelName: "新标签", labelKey: 0, labelStyle: "样式1" },
        { labelName: "新标签2", labelKey: 1, labelStyle: "样式2" },
        { labelName: "新标签44", labelKey: 2, labelStyle: "样式3" }
      ],
      formItem: {
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
  watch: {},
  computed: {},
  methods: {
    cancel () {

    }
  },
  filters: {
    filterType: function (value) {
      let list = [
        {
          value: '0',
          label: '资讯攻略'
        },
        {
          value: '1',
          label: '游玩攻略'
        }
      ]
      let text = list.filter(item => {
        return item.value == value
      })
      return text ? text[0].label : ''
    }
  },
  created () { },
  mounted () {

  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let id = to.params.id
      // merchant/merchantStrategy/infoNew?id=208&
      vm.apiGet('merchant/merchantStrategy/infoNewFL', { id }).then(res => {
        // if (res && res.success) {
        //   vm.$router.go(-1)
        // } else {
        //   vm.$Message(res.message ? res.message : '操作失败')
        // }
      })
    })
  }
};
</script>
<style lang="scss" scoped>
.strategy-edit {
}
</style>