<template>
  <div>
    <!-- {{data}} -->
    <banner v-if='data.category=="banner"' :data='data.data'></banner>
    <navigation v-if='data.category=="navigation"' :data='data.data'></navigation>
    <user-title v-if='data.category=="title"' :data='data.data'></user-title>
    <search v-if='data.category=="search"' :data='data.data'></search>
    <address-phone v-if='data.category=="addressPhone"' :data='data.data'></address-phone>
    <rich-text v-if='data.category=="richText"' :data='data.data'></rich-text>
    <free-layout v-if='data.category=="freeLayout"' :data='data.data'></free-layout>
    <product-group v-if='data.category=="productGroup"' :data='data.data'></product-group>
    <product v-if='data.category=="product"' :data='data.data'></product>
    <notice v-if='data.category=="notice"' :data='data.data'></notice>
    <text-box v-if='data.category=="text"' :data='data.data'></text-box>
    <subline v-if='data.category=="subline"' :data='data.data'></subline>
    <sub-blank v-if='data.category=="subBlank"' :data='data.data'></sub-blank>
    <shop-info v-if='data.category=="shopinfo"' :data='data.data'></shop-info>
    <weather v-if='data.category=="weather"' :data='data.data'></weather>
    <layer v-if='data.category=="layer"' :data='data.data'></layer>
    <strategy v-if='data.category=="strategy"' :listType='data.data.listType' :data='data.data' :comData='data.data'></strategy>
    <!-- <strategy-group v-if='data.category=="strategyGroup"' :data='data.data'></strategy-group> -->
  </div>
</template>
<script>
import banner from "./banner/banner";
import navigation from "./navigation/navigation";
import userTitle from "./title/title";
import search from "./search/search";
import addressPhone from "./addressPhone/addressPhone";
import richText from "./richText/richText";
import freeLayout from "./freeLayOut/freeLayOut";
import productGroup from "./productGroup/productGroup";
import notice from "./notice/notice";
import product from "./product/product";
import textBox from "./textBox/textBox";
import subline from "./subline/subline";
import subBlank from "./subBlank/subBlank"
import shopInfo from "./shopinfo/shopInfo"
import weather from "./weather/weather"
import strategy from "./strategy/strategy"
// import strategyGroup from "./strategyGroup/strategyGroup"
import layer from "./layer/layer"
export default {
  components: {
    banner,
    navigation,
    userTitle,
    search,
    addressPhone,
    richText,
    freeLayout,
    productGroup,
    product,
    notice,
    textBox,
    subline,
    subBlank,
    shopInfo,
    weather,
    strategy,
    // strategyGroup,
    layer
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
