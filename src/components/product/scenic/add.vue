<template>
  <div>
    <Form :model="formItem" :label-width="100" ref="formItem" :rules="ruleForm">
      <Row :gutter="16">
          <Col span="12">
            <FormItem label="所属供应商：" prop="supplyId">
              <Select v-model="formItem.supplyId">
                  <Option value="1">黄山风景区</Option>
                  <Option value="2">黄山风景区云谷索道</Option>
                  <Option value="3">黄山风景区玉屏索道</Option>
                  <Option value="4">测试的供应商xb1221</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="片区名称：" prop="regionCode">
              <Select v-model="formItem.regionCode">
                  <Option value="hsfjq">黄山风景区</Option>
                  <Option value="213213">测试的运营片区xb</Option>
                  <Option value="hsfjqsd">黄山风景区山顶</Option>
                  <Option value="hssqjd">黄山市区酒店</Option>
                  <Option value="hszbjqjd">黄山周边景区酒店</Option>
                  <Option value="hssjjd">黄山山脚酒店</Option>
                  <Option value="tskz">特色客栈</Option>
                  <Option value="hszbjq">黄山周边景区</Option>
              </Select>
            </FormItem>
          </Col>
      </Row>
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="景区名称：">
            <Input v-model="formItem.name"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="是否同步地心：">
            <i-switch v-model="formItem.switch" size="large">
                <span slot="close">停用</span>
                <span slot="open">启用</span>
            </i-switch>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="景区等级：">
            <Select v-model="formItem.goodsLevel">
                <Option value="0">无等级</Option>
                <Option value="1">1A</Option>
                <Option value="2">2A</Option>
                <Option value="3">3A</Option>
                <Option value="4">4A</Option>
                <Option value="5">5A</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="开园时间：">
            <Row>
                <Col span="11">
                    <FormItem prop="openTime">
                        <TimePicker type="time" placeholder="开始时间" v-model="formItem.openTime"></TimePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <FormItem prop="endTime">
                        <TimePicker type="time" placeholder="结束时间" v-model="formItem.endTime"></TimePicker>
                    </FormItem>
                </Col>
            </Row>
          </FormItem>
        </Col>
      </Row>
      <Row>
          <FormItem label="景区地址：">
            <Row :gutter="16" type="flex">
              <Col span="4">
                <al-cascader v-model="formItem.area" level="2" data-type="name" @on-change="areaChange"></al-cascader>
              </Col>
              <Col span="20">
                <Input v-model="formItem.addr" placeholder="请填写景区详细地址"></Input>
              </Col>
            </Row>
          </FormItem>
      </Row>
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="地图坐标：">
            <Input v-model="formItem.latitudeLongitude" readonly @on-focus="showMap"></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="景点描述：">
            <Input v-model="formItem.summary" type="textarea" :autosize="{minRows: 1,maxRows: 5}"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="pc主图：">
            <upload :multiple="true"></upload>
            <!-- <Input v-model="formItem.linkImg" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input> -->
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="pc轮播图：">
            <upload></upload>
            <!-- <Input v-model="formItem.pcUrl" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input> -->
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="12">
          <FormItem label="wap主图：">
            <upload></upload>
            <!-- <Input v-model="formItem.linkMobileImg" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input> -->
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="wap轮播图：">
            <upload></upload>
            <!-- <Input v-model="formItem.wapUrl" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input> -->
          </FormItem>
        </Col>
      </Row>
      <FormItem label="景点介绍：">
        <ueditor :content="content.content" :config="content.config" :id="content.id"></ueditor>
        <!-- <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input> -->
      </FormItem>
      <FormItem label="预定须知：">
        <ueditor :content="orderNotice.content" :config="orderNotice.config" :id="orderNotice.id"></ueditor>
        <!-- <Input v-model="formItem.orderNotice" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input> -->
      </FormItem>
      <FormItem>
        <Button type="primary" size="large">保存</Button>
        <Button type="ghost" style="margin-left: 8px" size="large">返回</Button>
      </FormItem>
    </Form>
    <amap ref="mapModel" @getPoint="getPoint"></amap>
  </div>
</template>
<script>
import amap from '@/components/global/amap'
import ueditor from '@/components/global/ueditor'
import upload from '@/components/global/upload'
export default {
  data () {
    return {
      formItem: {
        supplyId: '',
        area: [],
        latitudeLongitude: ''
      },
      ruleForm: {
        supplyId: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ]
      },
      content: {
        content: '编辑器默认文字',
        config: {},
        id: 'content'
      },
      orderNotice: {
        content: '编辑器默认文字2',
        config: {},
        id: 'orderNotice'
      }
    }
  },
  methods: {
    areaChange (data) {
    },
    showMap () {
      this.$refs.mapModel.modal = true
    },
    getPoint (point) {
      this.formItem.latitudeLongitude = point.lat + ',' + point.lng
    }
  },
  components: {amap, ueditor, upload}
}
</script>
