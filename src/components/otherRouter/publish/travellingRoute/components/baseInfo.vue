<template>
  <Form :model="formItem"
        label-position="right"
        :label-width="120"
        ref="baseForm"
        class="ticket-base"
        :rules="baseRule"
        v-if="getBaseInfo">
    <FormItem label="商户名称："
              v-if="s_mchId&&s_mchId.show"
              prop="mchId" :rules="{required:true,message:'请选择商户名称'}">
      <Select v-model="formItem.mchId"
              style="width:200px">
        <Option :value="item.mchId"
                v-for="item in mchList"
                :key="item.mchId">{{
          item.label
        }}</Option>
      </Select>
    </FormItem>
    <FormItem label="跟团游名称："
              prop="name">
      <Input v-model="formItem.name"
             placeholder="控制在100个汉字内，产品名称+（行程特色）"
             style="width:33%"
             :maxlength="64"></Input>
    </FormItem>
    <FormItem label="跟团游别名："
              v-if="isSongcheng"
              prop="lineAlias"
              :rules="baseRule.lineAlias">
      <Input ref="hotelName"
             v-model="formItem.lineAlias"
             style="width:33%"
             :maxlength="64"></Input>
    </FormItem>
    <FormItem label="出发地："
              prop="begAddress"
              v-if="!isSongcheng">
      <Input v-model="formItem.begAddress"
             placeholder="字数限制20个字"
             style="width:33%"
             :maxlength="20"></Input>
    </FormItem>
    <FormItem label="所属城市："
              v-if="isSongcheng"
              prop="mchName">
      <Select v-model="formItem.cityId"
              style="width:200px">
        <Option :value="item.cityId"
                v-for="item in cityList"
                :key="item.cityId">{{
          item.label
        }}</Option>
      </Select>
    </FormItem>
    <FormItem label="目的地："
              v-if="!isSongcheng"
              prop="endAddress">
      <Input v-model="formItem.endAddress"
             placeholder="字数限制20个字"
             style="width:33%"
             :maxlength="20"></Input>
    </FormItem>

    <FormItem label="目的地："
              style="width:600px"
              v-if="isSongcheng"
              prop="endAddress">
      <area-select :areaCode="formItem.extendParamOne"
                   @getAll="getAllAreaList"></area-select>
      <Input v-model="formItem.endAddress"
             placeholder="字数限制20个字"
             style="display:none"
             :maxlength="20"></Input>
    </FormItem>
    <FormItem label="跟团游主题："
              prop="lineTheme">
      <div style="height:32px;"
           class="travellSubject">
        <div class="subject-list">
          <div v-for='(item,index) in tagNameList'
               :key='index'
               class="subject-list-item">
            <Icon @click="subjectItemDel(index)"
                  class="subject-list-item-del"
                  type="close-circled"></Icon>
            <Button>{{item}}</Button>
          </div>
        </div>
        <div class="subject-input">
          <Input @on-enter='setSubjectTag'
                 :maxlength="4"
                 v-model='tagName'
                 placeholder='回车添加标签，如“跟团游”'
                 style="width: 200px"></Input>
        </div>
        <div style="color:red;margin-left:10px;float:left">输入后，回车添加</div>
      </div>
      <Input v-model="formItem.lineTheme"
             style="display:none"></Input>
    </FormItem>
    <FormItem label="几天几夜："
              required>
      <FormItem style="width:100px;display:inline-block"
                prop="useDay">
        <Input style="width:100px"
               v-model="formItem.useDay"
               :maxlength="2"></Input>
      </FormItem>
      <span class="unit">天</span>
      <FormItem style="width:100px;display:inline-block"
                prop="useNight">
        <Input style="width:100px"
               v-model="formItem.useNight"
               :maxlength="2"></Input>
      </FormItem>
      <span class="unit">夜</span>
    </FormItem>
    <FormItem label="所属景区："
              v-if="s_merchantParkInfoId&&s_merchantParkInfoId.show">
      <Button @click="senicSelect"
              v-if='showTableSelection.length<20'
              type="primary">景区选择</Button>
      </Button>
      <div v-if='showTableSelection&&showTableSelection.length'>
        <div v-for='(item,index) in showTableSelection'
             :key='index'
             class="senicInfo">
          <Icon @click="senicDel(index)"
                class="senicDel"
                type="close-circled"></Icon>
          <div class="name">{{item.name}}</div>
          <div class="address">{{item.areaAddr}}</div>
        </div>
        <!-- <div v-else class="senicInfo" v-show="formItem.areaName">请选择酒店/新增酒店</div> -->
      </div>
    </FormItem>
    <!-- 弹出层 -->
    <the-modal v-model="modal"
               :title="modalTitle"
               okText="添加"
               width="900"
               @ok="okFun"
               @cancel="cancelFun">
      <page-template :search-items="searchItems"
                     :columns="scenicColumns"
                     :url="url"
                     :pageKey="pageKey"
                     :params="params"
                     hasDataKey
                     pageFlag
                     firstUnload
                     ref="pageWrap">
        <p slot="remark"
           style="color:red">备注：没有相关信息，请重新搜索或联系小鲸客服(400-875-9009)</p>
      </page-template>
    </the-modal>
  </Form>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import areaSelect from "@/components/global/select"
export default {
  components: { areaSelect },
  data () {
    return {
      mchList: [],
      cityList: [],
      tagName: '',
      tagNameList: [],
      // showTableSelection: [],
      formItem: {},
      baseRule: {
        name: [
          { required: true, message: '请填写跟团游名称', trigger: 'blur' }
        ],
        begAddress: [
          { required: true, message: '请填写出发地', trigger: 'blur' }
        ],
        endAddress: [
          { required: true, message: '请填写目的地', trigger: 'blur' }
        ],
        lineTheme: [
          { required: true, message: '请填添加跟团游主题', trigger: 'blur' }
        ],
        lineAlias: [
          { required: true, message: '请填写跟团游别名', trigger: 'blur' },
          { max: 100, message: '跟团游别名字数不能超过100个' }
        ],
      },
      url: 'product/api/routePush/pageParkToRoute',
      params: {
        name: '',
      },
      pageKey: {
        currPage: 'currPage',
        pageSize: 'pageSize'
      },
      searchItems: [
        {
          label: "请输入对应景区关键字",
          type: "input",
          name: "name"
        }
      ],
      scenicColumns: [
        {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '序号',
        key: 'name',
        render: (h, params) => {
          return h('div', params.index + 1)
        }
      },
      {
        title: '景区名称',
        key: 'name'
      },
      {
        title: '景区地址',
        key: 'areaAddr'
      }
      ],
      modal: false,
      modalTitle: '选择景区',
    };
  },
  watch: {
    getBaseInfo: function (val) {
      this.formItem = this.cloneDeep(val);
      if (val && val.lineTheme) {
        this.tagNameList = val.lineTheme.split(',')
      }
    }
  },
  computed: {
    ...mapState('travelling', ['showTableSelection', 'diffValue']),
    //所属景区id字符串集合
    merchantParkInfoId: function () {
      if (this.showTableSelection) {
        let ids = []
        this.showTableSelection.forEach(item => {
          ids.push(item.id)
        })
        return ids.join(',')
      } else {
        return ''
      }
    },
    ...mapGetters("travelling", [
      "getBaseInfo",
      's_projectName',
      's_mchId',
      's_begAddress',
      's_extendParamOne',
      's_merchantParkInfoId',
      's_cityId',
      'isSongcheng'
    ])
  },
  methods: {
    ...mapMutations('travelling', ['setTableSelection']),
    //选择景区
    senicSelect () {
      this.modal = true
      this.$refs.pageWrap.getTableList()
    },
    // 删除景区
    senicDel (index) {
      this.showTableSelection.splice(index, 1)
      this.setTableSelection(this.showTableSelection)
    },
    okFun () {
      this.modal = false
      let pageWrapRef = this.$refs.pageWrap
      pageWrapRef.initPage()
      let selectList = pageWrapRef.getSelectData()
      this._diffScenicData(selectList)
    },
    cancelFun () {
      this.modal = false
      this.$refs.pageWrap.initPage()
    },
    /**景区数据去重 */
    _diffScenicData (selectData) {

      if (!selectData || !selectData.length) return
      let showData = this.showTableSelection
      if (showData && showData.length) {
        let list = selectData.filter(slec => {
          let flag = showData.some(show => { return slec.id == show.id })
          return !flag
        })

        if (list && list.length) {
          list = list.map(item => {
            let { id, areaAddr, name } = item
            return { id, areaAddr, name }
          })
        }
        showData = showData.concat(list)
      } else {
        showData = selectData.map(item => {
          let { id, areaAddr, name } = item
          return { id, areaAddr, name }
        })
      }
      this.setTableSelection(showData)
    },
    //添加主题
    setSubjectTag () {
      if (this.tagNameList && this.tagNameList.length < 5) {
        let isrepeat = this.tagNameList.some(item => {
          return item == this.tagName
        })
        if (isrepeat) {
          this.$Message.warning('主题名字重复')
          return
        }
        if (this.tagName) {
          this.tagNameList.push(this.tagName)
          this.formItem.lineTheme = this.tagNameList.join(',')
          this.tagName = ''
        } else {
          this.$Message.warning('请输入标签名！')
        }
      } else {
        this.$Message.warning('最多添加五个标签！')
      }
    },
    //删除主题
    subjectItemDel (index) {
      this.tagNameList.splice(index, 1)
    },
    getAllAreaList (list) {
      this.formItem.extendParamOne = list[0].code + '-' + list[1].code + '-' + list[2].code
      this.formItem.endAddress = list[0].name + '-' + list[1].name + '-' + list[2].name
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        try {
          this.$refs.baseForm.validate(valid => {
            if (valid) {

              let info = this.cloneDeep(this.formItem);
              info.merchantParkInfoId = this.merchantParkInfoId
              resolve(info);
            } else {
              this.$Message.warning("基础信息验证不通过");
              reject("Fail!");
            }
          });
        } catch (err) {
          reject(err);
        }
      });
    }
  },
  created () {
    let mchInfo = this.apiPost("/product/api/park/selectMchInfo")
    let cityIfo = this.apiPost('/product/api/park/selectCityInfo')
    Promise.all([mchInfo, cityIfo]).then(res => {
      let mchList = res[0]
      let cityList = res[1]
      if (mchList.status == "200") {
        this.mchList = mchList.data.map(item => {
          return { mchId: item.id, label: item.mchName };
        });
      }
      if (mchList.status == "200") {
        this.cityList = cityList.data.map(item => {
          return { cityId: item.id, label: item.cityName };
        });
      }
    })
    // this.apiPost("/product/api/park/selectMchInfo").then(res => {
    //   if (res.status == "200") {
    //     this.mchList = res.data.map(item => {
    //       return { id: item.id, label: item.mchName };
    //     });
    //   }
    // });
  },
  mounted () { }
};
</script>
