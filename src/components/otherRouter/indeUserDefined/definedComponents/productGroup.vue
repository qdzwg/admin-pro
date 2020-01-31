<template>
  <div class="product-list p-t-30">
    <div class="banner-handler">
      <Button size="small" @click="del(index)" type="error">删除</Button>
      <Button size="small" @click="productGroupEdit(index)" type="primary">编辑</Button>
    </div>
    <div class="tab-list">
      <Tabs v-if="productList.length" :class='"test" + productList.length'>
        <TabPane v-for="(item,index) in productList" :key="index" :label="item.groupName">
          <Row v-if="item.data.length">
            <Col v-for="(it,i) in item.data" :key="i" span="12">
            <div class="tab-list-item">
              <!-- <Icon class="product-del" type="android-cancel"></Icon> -->
              <img class="showImg" :src="it.linkMobileImg" alt="">
              <div class="title">
                <!-- <span v-if='it.businessType=="ticket"'>{{it.parkNickName?filter.cutstr(it.parkNickName,50):''}}</span>
                <span v-if='it.businessType=="room"'>{{filter.cutstr((((it.name||it.nickName)?(it.name||it.nickName):'')),50)}}</span>
                <span v-if='it.businessType=="mdse"'>{{(it.nickName||it.name)?filter.cutstr(it.nickName||it.name,50):''}}</span> -->
                <span>{{(it.nickName||it.name)?(it.nickName||it.name):''}}</span>
              </div>
              <div class="buy-info">
                <div style="float:left">￥
                  <span class="price">{{it.priceShow?it.priceShow:''}}</span>
                </div>
                <span style="float:right;color:#999;margin-top:3px">{{it.virtualSale?it.virtualSale:it.sellNum}}人购买</span>
              </div>
            </div>
            </Col>
          </Row>
          <Row v-else>
            <Col span="24">
            <div class="pleaseSelect">请选择产品</div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <div class="no-data" v-else>
        请新增产品分组
      </div>
    </div>
  </div>
</template>
 <script>
export default {
  props: {
    index: {
      type: Number
    },
    productList: {
      type: Array
    }
  },
  data() {
    return {};
  },
  methods: {
    del(index) {
      this.$emit("delteCom", index);
    },
    productGroupEdit(index) {
      this.$emit("indexProductGroupEdit", index);
      this.$store.dispatch("setIndex", index);
    },
    cutstr(str, len) {
      var str_length = 0;
      var str_len = 0;
      var str_cut = new String();
      str_len = str.length;
      for (var i = 0; i < str_len; i++) {
        var a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
          //中文字符的长度经编码之后大于4
          str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
          str_cut = str_cut.concat("...");
          return str_cut;
        }
      }
      //如果给定字符串小于指定长度，则返回源字符串；
      if (str_length < len) {
        return str;
      }
    }
  }
};
</script>
 <style lang="scss">
.tab-list {
  .ivu-tabs-tabpane {
    padding: 0px 8px;
  }
  .tab-list-item {
    position: relative;
    padding: 0px 9px;
    .title {
      font-size: 14px;
      color: #000;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .showImg {
      width: 100%;
      height: 100px;
    }
    .buy-info {
      color: #999;
      // padding: 10px 0px;
      height: 24px;
      color: #ff5400;
    }
    .price {
      font-size: 16px;
    }
    .buy-num {
      float: right;
    }
  }
}
.ivu-tabs-bar {
  margin-bottom: 12px;
}
.product-list {
  .ivu-tabs-nav {
    float: none;
    display: -webkit-flex;
    display: flex;
    justify-content: space-around;

    .ivu-tabs-tab {
      margin-right: 0px;
      display: inline-flex !important;
      padding: 11px 4px;
      font-weight: bold;
      color: #000;
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }
    .ivu-tabs-tab.ivu-tabs-tab-active {
      border-bottom: 4px solid #3f98f6;
      color: #3f98f6;
      font-size: 18px;
      font-weight: 500;
      // width: 50%;
    }
    .ivu-tabs-ink-bar-animated {
      display: none !important;
    }
  }
}
.no-data {
  height: 200px;
  background: #cccccc;
  font-size: 24px;
  text-align: center;
  padding-top: 80px;
}
.pleaseSelect {
  height: 200px;
  background: #cccccc;
  font-size: 24px;
  text-align: center;
  padding-top: 80px;
}
</style>
 