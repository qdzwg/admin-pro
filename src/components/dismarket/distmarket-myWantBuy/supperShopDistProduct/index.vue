<template>
    <div>
        <div class="shopDetail">
            <div class="shopInfo">
                <div class="shopImg">
                    <img :src="shop.headPortrait" alt="">
                </div>
                <div class="shopDes">
                    <div class="shopName">{{shop.name}}</div>
                    <div class="briefIntro">简介：{{shop.briefIntro}}</div>
                </div>
            </div>
            <div class="shopWX">
                <div class="weixinCustomerTel">服务电话：{{shop.weixinCustomerService}}</div>
                <div class="weixinRepair">售后微信：{{shop.weixinRepair}}</div>
            </div>
        </div>
        <div class="searchForm">
            <searchForm :search-items='searchItems'></searchForm>
        </div>
        <div class="goodsList">
            <div class="item" @click="productDetail(item)" v-for='(item,index) in res.distMarketProductDtos' :key='index'>
                <div class="itemImg"><img :src="item.masterPic" alt=""></div>
                <div class="itemDes">
                    <div class="itemTitle">{{item.goodsName}}</div>
                    <div class="itemPrice">
                        <span>供货价</span>
                        <em>￥</em>
                        <span class="priceNum">{{item.orderPrice}}</span>
                        <span>起</span>
                    </div>
                </div>
            </div>
        </div>
        <Page :page-size='params.size' :page-size-opts="[15,20,50]" @on-page-size-change="sizeChange" :total="res.distSize" class-name="pages" @on-change="changepage" show-elevator show-sizer></Page>
    </div>
</template>
<script>
import searchForm from "@/components/global/searchForm";
import { apiGet, apiPost } from "@/fetch/api";
export default {
  data() {
    return {
      test: "",
      searchItems: [
        {
          label: "商品名称",
          type: "input",
          name: "goodsName"
        },
        {
          label: "业务类型",
          type: "select",
          name: "goodsType",
          default: "xjsc_all",
          allValue: "",
          data: [
            {
              value: "xjsc_all",
              label: "请选择业务类型"
            },
            {
              value: "park",
              label: "景区"
            },
            {
              value: "hotel",
              label: "酒店"
            },
            {
              value: "mdse",
              label: "商品"
            },
            {
              value: "route",
              label: "跟团游"
            }
          ]
        }
      ],
      url: "/distmarket/distMarketProduct/getSupperShopDistProductFl",
      params: {
        spc: "",
        gc: "",
        size: 15,
        page: 1
      },
      shop: {
        weixinCustomerService: "",
        weixinRepair: "",
        headPortrait: "",
        briefIntro: "",
        name: ""
      }
    };
  },
  computed: {
    res() {
      return this.$store.state.list.res.data
        ? this.$store.state.list.res.data
        : { distSize: 0, distMarketProductDtos: [] };
    }
  },
  mounted() {
    this.params.spc = this.$route.query.spc;
    this.params.gc = this.$route.query.gc;
    this.$store.state.list.url = this.url;
    this.$store.state.list.params = this.params;
    this.search();
    apiPost("/distmarket/webApi/distMarketShop/selectShopById", {
      id: this.$route.query.spc
    }).then(res => {
      if (res.status == 200) {
        if (res.data) this.shop = res.data;
      } else {
        this.$Message.warning(res.message);
      }
    });
  },
  components: {
    searchForm
  },
  methods: {
    productDetail(item) {
      this.$router.push({
        path: "/productPage",
        query: { goodsCode: item.code, goodsType: item.goodsType }
      });
    },
    search() {
      apiPost(
        "/distmarket/distMarketProduct/getSupperShopDistProductFl",
        this.params
      ).then(res => {
        if (res.status == 200) {
          this.$store.state.list.res = res;
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    sizeChange(num) {
      this.params.size = num;
      this.search();
    },
    changepage(num) {
      this.params.page = num;
      this.search();
    }
  }
};
</script>
<style lang="scss" scoped>
.shopDetail {
  display: flex;
  .shopInfo {
    flex-grow: 1;
    display: flex;
    .shopImg {
      padding-right: 15px;
      img {
        width: 75px;
        height: 75px;
      }
    }
    .shopDes {
      flex-grow: 1;
      .shopName {
        font-size: 16px;
        color: #333;
        line-height: 24px;
      }
      .briefIntro {
        color: #666;
        padding: 5px 0px;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
  .shopWX {
    width: 280px;
    color: #666;
    font-size: 12px;
    line-height: 35px;
    padding: 0px 10px;
    div {
      background: url("../../../../assets/images/wx-icon.png") no-repeat left
        center;
      padding-left: 25px;
      background-size: 20px;
    }
    .weixinCustomerTel {
      background-image: url('../../../../assets/images/tel.png');
    }
  }
}
.searchForm {
  padding-top: 20px;
}
.goodsList {
  overflow: hidden;
  .item {
    cursor: pointer;
    width: 19%;
    float: left;
    margin: 0px 0.5% 10px;
    &:hover {
      .itemDes {
        box-shadow: 0px 1px 9px rgba(0, 0, 0, 0.1);
      }
    }
    .itemImg {
      height: 140px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .itemDes {
      border: 1px solid #eee;
      overflow: hidden;
      padding: 10px;
      .itemTitle {
        font-size: 15px;
        line-height: 22px;
        color: #666;
        margin-bottom: 7px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .itemPrice {
        font-size: 12px;
        color: #ff5b33;
        line-height: 24px;
        em {
          font-style: normal;
          margin-left: 10px;
          margin-right: 8px;
        }
        .priceNum {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>