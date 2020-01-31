<template>
    <div class="userRecord">
        <div class="user-title" :data="dataList">
            <span class="user-lab">优惠券名称：</span>
            <span class="user-val">{{dataList.name}}</span>
            <span class="user-lab">优惠面值：</span>
            <span class="user-val">{{dataList.amount}} 元</span>
            <span class="user-lab">使用门槛：</span>
            <span class="user-val">{{dataList.targetAmout?'满'+dataList.targetAmout+'元可用':'无'}}</span>
            <span class="user-lab">使用有效期： </span>
            <span class="user-val" v-if="dataList.validStartDate&&dataList.validEndDate">{{dataList.validStartDate}}至{{dataList.validEndDate}}</span>
            <span class="user-val" v-else>{{dataList.relativeDay}}天</span>
            <span class="user-lab">优惠券状态：</span>
            <span class="user-val">{{filter.marketStatus(dataList.status)}}</span>
        </div>
    <searchForm :search-items='searchItems'></searchForm>
    <Button type="primary" icon="android-add" style="margin-bottom:20px;" @click="getBack">返回</Button>
    <gridTable ref="gridTable" :columns="columns" :params="params" :data="data" :url="url"></gridTable>

    </div>
</template>

<script>
import searchForm from "@/components/global/searchForm";
import gridTable from "@/components/global/gridTable";
import { apiPost, apiGet } from "@/fetch/api";
export default {
  components: {
    searchForm,
    gridTable
  },
  data() {
    return {
      dataList: {},
      searchItems: [
        {
          label: "状态",
          type: "select",
          name: "status",
          data: [
            {
              value: "",
              label: "--请选择状态--"
            },
            {
              value: "1",
              label: "未开始"
            },
            {
              value: "2",
              label: "进行中"
            },
            {
              value: "3",
              label: "已结束"
            },
            {
              value: "4",
              label: "已失效"
            }
          ]
        }
      ],
      columns: [
        {
          title: "用户昵称",
          key: "userName"
        },
        {
          title: "用户来源",
          key: "userSrc"
        },
        {
          title: "领取时间",
          key: "createTime"
        },
        {
          title: "使用时间",
          key: "useTime"
        },
        {
          title: "使用状态",
          key: "status",
          render: (h, params) => {
            return h("span", this.filter.marketStatus(params.row.status));
          }
        }
      ],
      params: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc",
        couponTempletId: this.$route.query.id
      },
      data: "",
      url: "/marketing/marketCouponDetail/grid"
    };
  },
  created() {
    apiGet(
      "/marketing/marketCouponDetail/listFL?templetId=" + this.$route.query.id
    ).then(res => {
      this.dataList = res.data.templet;
    });
  },
  methods: {
    getBack() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.userRecord {
  width: 100%;
  .user-title {
    width: 100%;
    margin-bottom:20px;
    span {
      margin: 0 5px;
    }
    .user-lab {
      font-weight: 700;
      font-size: 15px;
    }
    .user-val {
      font-size: 14px;
      color: rgb(133, 131, 131);
    }
  }
}
</style>


