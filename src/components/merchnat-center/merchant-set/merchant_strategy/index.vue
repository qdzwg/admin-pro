<template>
  <div class="merchant_strategy">
    <page-template :search-items='searchItems'
                   :columns="columns"
                   pageFlag
                   :url="url"
                   ref="pageWrap">
      <Row v-if="pageBtnParams.length"
           slot="topbtn"
           slot-scope="slotProps">
        <Button class="page-btn"
                :type="item.type"
                :icon="item.icon"
                v-for="(item,index) in pageBtnParams"
                @click="actionBtns(index,slotProps.selectedList)"
                :key="index">{{item.name}}</Button>
      </Row>
    </page-template>
  </div>
</template>
<script>
export default {
  data () {
    return {
      searchItems: [
        {
          label: '请选择类型',
          type: 'select',
          name: 'strategyType',
          data: [
            {
              value: '0',
              label: '资讯攻略'
            },
            {
              value: '1',
              label: '游玩攻略'
            }
          ]
        },
        {
          label: '攻略名称',
          type: 'input',
          name: 'name'
        },
      ],
      columns: [
        {
          title: '攻略类型',
          key: 'strategyType'
        },
        {
          title: '攻略名称',
          key: 'name',
        },
        {
          title: '发布人',
          key: 'promulgator'
        },
        {
          title: '发布时间',
          key: 'createTime',
        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          align: 'center',
          render: (h, params) => {
            let { id } = params.row
            const actions = [{
              title: '详情',
              action: () => {
                this.$router.push({ path: '/strategyDetail/' + id })
              }
            },
            {
              title: '修改',
              action: () => {
                this.$router.push({ path: '/strategyEdit/' + id })
              }
            },
            {
              title: '删除',
              action: () => {
                // merchant/merchantStrategy/del?id=121&121
                this.$refs.confirmModel.confirm('list/merchant/merchantStrategy/grid/' + params.row.id)
              }
            },
            ]
            return this.common.columnsHandle(h, actions)
          }
        }

      ],
      pageBtnParams: [
        {
          btnType: 'router',
          link: '',
          icon: 'android-add',
          type: 'primary',
          name: '添加'
        }
      ],
      url: 'merchant/merchantStrategy/grid',
      config: {
        initialFrameWidth: 600,
        initialFrameHeight: 200
      },
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

      upDateFlag: false,
      upDateTitle: '修改',
      detailFlag: false,
      detailTitle: '详情',
    }
  },
  components: {
  },
  mounted () {
  },
  methods: {
    /**获取详情信息接口
     * @param {any} id 列表id
     * @param {number} index 0:详情，1:修改  
     */
    getDetail (id, index) {
      if (index) {
        this.upDateFlag = true
        this.upDateTitle = '修改'
      } else {
        this.detailFlag = true
      }
    },
    actionBtns () {
      this.upDateFlag = true
      this.upDateTitle = '新增'
      this.formItem = this.initFormData()
    },
    updateFun () {
      console.log(this.formItem)
    },
    initFormData () {
      return {
        strategyType: '',
        name: '',
        decription: '',
        picAddr: "",
        strategyTags: [
          // { labelName: "", labelKey: 0 },
        ],
        vedioAddr: "",
        musicAddr: "",
        latitudeLongitude: "",
        nickName: '',
        headImg: "",
        subHeading1: '',
        content1: '',
        subHeading2: '',
        content2: '',
        subHeading3: '',
        content3: '',
      }
    }
  }
}
</script>

<style>
#mImg {
  max-width: 50%;
  margin-top: 20px;
}
</style>




