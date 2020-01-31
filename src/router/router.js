// 不作为Main组件的子页面展示的页面单独写，如下
import Main from "@/components/main";
export const loginRouter = [{
    path: "/",
    redirect: {
      name: "login"
    }
  },
  {
    path: "/base",
    redirect: {
      name: "publishPark"
    }
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录"
    },
    component: resolve => {
      require(["@/components/LoginForm.vue"], resolve);
    }
  },
  {
    path: "/superLogin",
    name: "SuperLogin",
    meta: {
      title: "登录"
    },
    component: resolve => {
      require(["@/components/LoginForm.vue"], resolve);
    }
  },
  {
    path: "/main",
    name: "main",
    component: Main,
    children: [{
        path: "/theater-supplier-edit",
        name: "theaterSupplierEdit",
        meta: {
          breadcrumbList: ["剧院", "剧院供应商管理"],
          belongTab: "product",
          openName: "theaterMgt"
        },
        component: resolve => {
          require(["@/components/otherRouter/theaterSupplierEdit"], resolve);
        }
      },
      {
        path: "/theater-ticket-edit",
        name: "theaterTicketEdit",
        meta: {
          breadcrumbList: ["剧院", "剧院票型管理"],
          belongTab: "product",
          openName: "theaterMgt"
        },
        component: resolve => {
          require(["@/components/otherRouter/theaterTicketEdit"], resolve);
        }
      },
      {
        path: "/place-edit",
        name: "placeEdit",
        meta: {
          breadcrumbList: ["剧院", "剧院场所管理"],
          belongTab: "product",
          openName: "theaterMgt"
        },
        component: resolve => {
          require(["@/components/otherRouter/theaterPlaceEdit"], resolve);
        }
      },
      {
        path: "/program-edit",
        name: "programEdit",
        meta: {
          breadcrumbList: ["剧院", "剧院节目管理"],
          belongTab: "product",
          openName: "theaterMgt"
        },
        component: resolve => {
          require(["@/components/otherRouter/theaterProgramEdit"], resolve);
        }
      },
      {
        path: "/create",
        name: "create",
        meta: {
          title: "自定义页面"
        },
        meta: {
          breadcrumbList: ["店铺管理", "自定义页面"],
          belongTab: "merchnat-center",
          openName: "merchant-manage"
        },
        component: resolve => {
          require(["@/components/create/create"], resolve);
        }
      },
      {
        path: "/template-add-edit",
        name: "template-add-edit",
        meta: {
          title: "基础自定义页面"
        },
        meta: {
          breadcrumbList: ["店铺设置管理", "店铺模板设置"],
          belongTab: "system",
          openName: "account"
        },
        component: resolve => {
          require(["@/components/otherRouter/templateAddEdit"], resolve);
        }
      },
      {
        path: "/personal-custompage",
        name: "personalCustompage",
        meta: {
          title: "个人中心自定义页面"
        },
        meta: {
          breadcrumbList: ["店铺管理", "店铺装修"],
          belongTab: "merchnat-center",
          openName: "merchant-manage"
        },
        component: resolve => {
          require(["@/components/otherRouter/personal"], resolve);
        }
      },
      {
        path: "/navigation-custompage",
        name: "navigationCustompage",
        meta: {
          title: "店铺导航自定义"
        },
        meta: {
          breadcrumbList: ["店铺管理", "店铺装修"],
          belongTab: "merchnat-center",
          openName: "merchant-manage"
        },
        component: resolve => {
          require(["@/components/otherRouter/navigationCustompage"], resolve);
        }
      },
      {
        path: "/pushNavigation-custompage",
        name: "pushNavigationCustompage",
        meta: {
          title: "推荐导航自定义"
        },
        meta: {
          breadcrumbList: ["店铺管理", "店铺装修"],
          belongTab: "merchnat-center",
          openName: "merchant-manage"
        },
        component: resolve => {
          require(["@/components/otherRouter/pushNavigationCustompage"], resolve);
        }
      },
      {
        path: "/pcnavigation-custom",
        name: "pcNavigationCustom",
        meta: {
          title: "店铺PC官网导航自定义"
        },
        meta: {
          breadcrumbList: ["店铺管理", "店铺装修"],
          belongTab: "merchnat-center",
          openName: "merchant-manage"
        },
        component: resolve => {
          require(["@/components/otherRouter/pcNavigationCustom"], resolve);
        }
      },
      {
        path: "/404",
        name: "404",
        component: resolve => {
          require(["@/components/nofound"], resolve);
        }
      },
      {
        path: '/top-navigation-custompage',
        name: 'topNavigationCustompage',
        meta: {
          title: '店铺导航自定义'
        },
        meta: {
          breadcrumbList: ['店铺管理', '店铺装修'],
          belongTab: 'merchnat-center',
          openName: 'merchant-manage'
        },
        component: resolve => {
          require(['@/components/otherRouter/topNavigationCustompage'], resolve)
        }
      },
      {
        path: '/bottom-info-custompage',
        name: 'bottomInfoCustompage',
        meta: {
          title: '店铺导航自定义'
        },
        meta: {
          breadcrumbList: ['店铺管理', '店铺装修'],
          belongTab: 'merchnat-center',
          openName: 'merchant-manage'
        },
        component: resolve => {
          require(['@/components/otherRouter/bottomInfoCustompage'], resolve)
        }
      },
      // {
      //   path: '/test',
      //   name: 'role', // 所属权限名称
      //   meta: {
      //     breadcrumbList: ['用户中心', '角色管理'],
      //     belongTab: 'system',
      //     openName: 'account'
      //   },
      //   component: resolve => {
      //     require(['@/components/otherRouter/account/test'], resolve)
      //   }
      // },
      {
        path: "/accountTypeDetail/:id",
        name: "payinfo",
        meta: {
          breadcrumbList: ["账户管理", "账户类型"],
          belongTab: "system",
          openName: "accounting"
        },
        component: resolve => {
          require(["@/components/otherRouter/accountTypeDetail"], resolve);
        }
      },
      {
        path: "/parkTickets/:id", // 景区门票
        name: "merchant-park",
        meta: {
          breadcrumbList: ["店铺产品", "景区列表"],
          belongTab: "merchnat-center",
          openName: "merchant-product"
        },
        component: resolve => {
          require(["@/components/otherRouter/parkTickets"], resolve);
        }
      },
      {
        path: "/houseTypeList/:id", // 房型列表
        name: "houseTypeList",
        meta: {
          breadcrumbList: ["店铺产品", "房型列表"],
          belongTab: "merchnat-center",
          openName: "merchant-product"
        },
        component: resolve => {
          require([
            "@/components/merchnat-center/merchant-product/marchent-hotel/houseTypeList"
          ], resolve);
        }
      },
      {
        path: "/merchantParkInfo/:id", // 商品列表 - 完善信息
        name: "merchantParkInfo",
        meta: {
          breadcrumbList: ["店铺产品", "景区列表", "完善信息"],
          belongTab: "merchnat-center",
          openName: "merchant-product"
        },
        component: resolve => {
          require([
            "@/components/merchnat-center/merchant-product/merchant-park/parkInfo"
          ], resolve);
        }
      },
      {
        path: "/hotelInfo/:id", // 商品列表 - 完善信息
        name: "hotelInfo",
        meta: {
          breadcrumbList: ["店铺产品", "酒店列表", "完善信息"],
          belongTab: "merchnat-center",
          openName: "merchant-product"
        },
        component: resolve => {
          require([
            "@/components/merchnat-center/merchant-product/marchent-hotel/hotelInfo"
          ], resolve);
        }
      },
      {
        path: "/mdse/:id", // 商品列表 - 完善信息
        name: "merchant-mdse",
        meta: {
          breadcrumbList: ["店铺产品", "商品列表", "完善信息"],
          belongTab: "merchnat-center",
          openName: "merchant-product"
        },
        component: resolve => {
          require([
            "@/components/merchnat-center/merchant-product/merchant-mdse/mdseInfo"
          ], resolve);
        }
      },
      {
        path: "/mdseSpecAttr/:id", // 产品中心 商品规格  属性值
        name: "mdseSpec",
        meta: {
          breadcrumbList: ["商品", "商品规格"],
          belongTab: "product",
          openName: "mdse"
        },
        component: resolve => {
          require(["@/components/otherRouter/mdseSpecAttr"], resolve);
        }
      },
      {
        path: "/mdseInfoList", // 产品中心 商品信息
        name: "mdseInfo",
        meta: {
          breadcrumbList: ["商品", "商品管理"],
          belongTab: "product",
          openName: "mdse"
        },
        component: resolve => {
          require(["@/components/otherRouter/mdseInfoList"], resolve);
        }
      },
      {
        path: "/mdseInfoAttr", // 产品中心 商品规格  属性值
        name: "mdseInfoAttr",
        meta: {
          breadcrumbList: ["商品", "商品管理"],
          belongTab: "product",
          openName: "mdse"
        },
        component: resolve => {
          require(["@/components/otherRouter/mdseInfoAttr"], resolve);
        }
      },
      {
        path: "/ticketEdit/:id", // 产品中心 - 景区管理
        name: "ticketEdit",
        meta: {
          breadcrumbList: ["景区", "景区管理"],
          belongTab: "product",
          openName: "scenic"
        },
        component: resolve => {
          require(["@/components/otherRouter/parkEdit"], resolve);
        }
      },
      {
        path: "/ticketAddOrEdit", // 景区门票发布
        name: "ticketAddOrEdit",
        meta: {
          breadcrumbList: ["产品管理", "门票管理"],
          belongTab: "product",
          openName: "scenic"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/publishPark"], resolve);
        }
      },
      {
        path: "/comboAddOrEdit", // 产品中心 - 套票票型管理 -新增或者编辑
        name: "comboTicket",
        meta: {
          breadcrumbList: ["套票", "套票票型管理"],
          belongTab: "product",
          openName: "combo"
        },
        component: resolve => {
          require(["@/components/otherRouter/comboTicketsAddOrEdit"], resolve);
        }
      },
      {
        path: "/mchAddOrEdit",
        name: "merchant",
        meta: {
          breadcrumbList: ["用户中心", "商户管理"],
          belongTab: "system",
          openName: "account"
        },
        component: resolve => {
          require(["@/components/otherRouter/mchAddOrEdit"], resolve);
        }
      },
      {
        path: "/roleAddOrEdit",
        name: "role",
        meta: {
          breadcrumbList: ["用户中心", "角色管理"],
          belongTab: "system",
          openName: "account"
        },
        component: resolve => {
          require(["@/components/otherRouter/roleAddOrEdit"], resolve);
        }
      },
      {
        path: "/integralEdit",
        name: "integral",
        meta: {
          breadcrumbList: ["会员中心（新）", "积分使用配置"],
          belongTab: "system",
          openName: "member"
        },
        component: resolve => {
          require(["@/components/otherRouter/integralEdit"], resolve);
        }
      },
      {
        path: "/comboDetail", // 产品中心 - 套票票型管理 -新增或者编辑
        name: "comboDetail",
        meta: {
          breadcrumbList: ["套票", "套票票型管理", "产品明细"],
          belongTab: "product",
          openName: "combo"
        },
        component: resolve => {
          require(["@/components/product/combo/comboDetail"], resolve);
        }
      },
      {
        path: "/hotelAddOrEdit", // 酒店 - 酒店管理 -新增或者编辑
        name: "hotelAddOrEdit",
        meta: {
          breadcrumbList: ["酒店", "酒店管理"],
          belongTab: "product",
          openName: "hotel"
        },
        component: resolve => {
          require(["@/components/otherRouter/hotelAddOrEdit"], resolve);
        }
      },
      {
        path: "/hotelRoom-add-edit", // 酒店 - 酒店管理 -新增或者编辑
        name: "hotelRoom",
        meta: {
          breadcrumbList: ["酒店", "房型管理", "新增编辑"],
          belongTab: "product",
          openName: "hotel"
        },
        component: resolve => {
          require(["@/components/otherRouter/hotelRoom"], resolve);
        }
      },
      {
        path: "/channelManageList/:code",
        name: "channelManage",
        meta: {
          breadcrumbList: ["渠道码", "渠道码管理"],
          belongTab: "product",
          openName: "channel"
        },
        component: resolve => {
          require(["@/components/otherRouter/channelManageList"], resolve);
        }
      },
      {
        path: "/publishPark", // 景区门票
        name: "publishPark",
        meta: {
          breadcrumbList: ["产品管理", "景区信息"],
          belongTab: "product",
          openName: "publishPark"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/publishPark"], resolve);
        }
      },
      {
        path: "/publishParkTicket", // 景区门票发布
        name: "parkTicket",
        meta: {
          breadcrumbList: ["产品管理", "门票信息"],
          belongTab: "product",
          openName: "scenic"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/publish/publishParkTicket"
          ], resolve);
        }
      },
      {
        path: "/publishParkCpgl", // 景区门票
        name: "publishParkCpgl",
        meta: {
          breadcrumbList: ["产品管理", '景区发布', "景区信息"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/publishPark"], resolve);
        }
      },
      {
        path: "/travellingRouteCpgl", // 旅游线路基础信息
        name: "travellingRouteCpgl",
        meta: {
          breadcrumbList: ["产品管理", '产品发布', "线路信息"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/publish/travellingRoute"
          ], resolve);
        }
      },
      {
        path: "/publishHotel", // 酒店户型发布
        name: "publishHotel",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/publishHotel"], resolve);
        }
      },
      {
        path: "/houseType", // 酒店户型发布
        name: "houseType",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/houseType"], resolve);
        }
      },
      {
        path: "/publishCombo", // 套票发布
        name: "publishCombo",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/publishCombo"], resolve);
        }
      },
      {
        path: "/physicalCommodity", // 实物商品发布
        name: "physicalCommodity",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/publish/physicalCommodity"
          ], resolve);
        }
      },
      {
        path: "/commodityAttribute", // 实物商品SKU
        name: "commodityAttribute",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/publish/commodityAttribute"
          ], resolve);
        }
      },
      {
        path: "/restaurantInfo", // 餐饮基本信息
        name: "restaurantInfo",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/restaurantInfo"], resolve);
        }
      },
      {
        path: "/newRestaurantInfo", // 餐饮基本信息(编辑)
        name: "newRestaurantInfo",
        meta: {
          breadcrumbList: ["餐饮管理", "产品编辑"],
          belongTab: "product",
          openName: "catering"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/newEditPage/newRestaurantInfo"
          ], resolve);
        }
      },
      {
        path: "/mealCoupon", // 餐券信息
        name: "mealCoupon",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/mealCoupon"], resolve);
        }
      },
      {
        path: "/newMealCoupon", // 餐券信息(编辑)
        name: "newMealCoupon",
        meta: {
          breadcrumbList: ["餐饮管理", "新增编辑"],
          belongTab: "product",
          openName: "catering"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/newEditPage/newMealCoupon"
          ], resolve);
        }
      },
      {
        path: "/postage", // 创建邮费模板
        name: "postage",
        meta: {
          breadcrumbList: ["商品", "邮费管理"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require(["@/components/otherRouter/postage/postage"], resolve);
        }
      },
      {
        path: "/travellingRoute", // 旅游线路基础信息
        name: "travellingRoute",
        meta: {
          breadcrumbList: ["产品管理", "线路信息"],
          belongTab: "product",
          openName: "travellingRoute"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/publish/travellingRoute"
          ], resolve);
        }
      },
      {
        path: "/newTravellingRoute", // 旅游线路基础信息(编辑)
        name: "newTravellingRoute",
        meta: {
          breadcrumbList: ["团游管理", "产品编辑"],
          belongTab: "product",
          openName: "travellingRoute"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/newEditPage/newTravellingRoute"
          ], resolve);
        }
      },
      {
        path: "/travellingRouteInfo", // 旅游线路信息
        name: "travellingRouteInfo",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/travellingRule"], resolve);
        }
      },
      {
        path: "/placeRoute", // 分销市场店铺分销旅游线路信息修改
        name: "placeRoute",
        meta: {
          breadcrumbList: ["店铺产品", "跟团游信息"],
          belongTab: "merchnat-center",
          openName: "merchant-product"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/placeRoute"], resolve);
        }
      },

      {
        path: "/placeCalendar/:id", // 分销市场旅游线路列表-日历价格
        name: "placeCalendar",
        meta: {
          breadcrumbList: ["店铺产品", "价格日历"],
          belongTab: "merchnat-center",
          openName: "merchant-product"
        },
        component: resolve => {
          require(["@/components/otherRouter/placeRouteCalendar"], resolve);
        }
      },
      {
        path: "/placeRule/:id", // 分销市场旅游线路列表-规则
        name: "placeRule",
        meta: {
          breadcrumbList: ["店铺产品", "规则"],
          belongTab: "merchnat-center",
          openName: "merchant-product"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/placeRouteCalendar/placeRule"
          ], resolve);
        }
      },

      {
        path: "/ruleAndCalendar/:id", // 线路规则和日历
        name: "ruleAndCalendar",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/travellingRouteList/ruleAndCalendar"
          ], resolve);
        }
      },
      {
        path: "/newRuleAndCalendar/:id", // 线路规则和日历(编辑)
        name: "newRuleAndCalendar",
        meta: {
          breadcrumbList: ["团游管理", "产品编辑"],
          belongTab: "product",
          openName: "travellingRoute"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/newEditPage/newRuleAndCalendar"
          ], resolve);
        }
      },
      {
        path: "/xjTravellCalendar", // 线路规则和日历(编辑)
        name: "xjTravellCalendar",
        meta: {
          breadcrumbList: ["团游管理", "日历编辑"],
          belongTab: "product",
          openName: "travellingRoute"
        },
        component: resolve => {
          require([
            "@/components/product/travellingRoute/travellingRouteList/xjCalendar"
          ], resolve);
        }
      },
      {
        path: "/scTravellCalendar", // 线路规则和日历(编辑)
        name: "scTravellCalendar",
        meta: {
          breadcrumbList: ["团游管理", "日历编辑"],
          belongTab: "product",
          openName: "travellingRoute"
        },
        component: resolve => {
          require([
            "@/components/product/travellingRoute/travellingRouteList/scCalendar"
          ], resolve);
        }
      },
      {
        path: "/orderList",
        name: "orderList",
        meta: {
          breadcrumbList: ["营销管理", "订购记录"],
          belongTab: "marketing-center",
          openName: "market-manage"
        },
        component: resolve => {
          require(["@/components/marketing-center/orderList"], resolve);
        }
      },
      {
        path: "/orderInfo",
        name: "orderInfo",
        meta: {
          breadcrumbList: ["营销管理", "订购记录"],
          belongTab: "marketing-center",
          openName: "market-manage"
        },
        component: resolve => {
          require(["@/components/marketing-center/orderInfo"], resolve);
        }
      },
      {
        path: "/orderPay",
        name: "orderPay",
        meta: {
          breadcrumbList: ["营销管理", "订购记录"],
          belongTab: "marketing-center",
          openName: "market-manage"
        },
        component: resolve => {
          require(["@/components/marketing-center/orderPay"], resolve);
        }
      },
      {
        path: "/newCoupons",
        name: "newCoupons",
        meta: {
          breadcrumbList: ["营销管理", "优惠券"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/newCoupons"], resolve);
        }
      },
      {
        path: "/editCoupons",
        name: "editCoupons",
        meta: {
          breadcrumbList: ["营销管理", "优惠券"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/editCoupons"], resolve);
        }
      },
      {
        path: "/userRecord",
        name: "userRecord",
        meta: {
          breadcrumbList: ["营销管理", "优惠券"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/userRecord"], resolve);
        }
      },
      {
        path: "/lptOrder",
        name: "lptOrder",
        meta: {
          breadcrumbList: ["营销管理", "来拼团"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/lptOrder"], resolve);
        }
      },
      {
        path: "/lptFound",
        name: "lptFound",
        meta: {
          breadcrumbList: ["营销管理", "来拼团"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/lptFound"], resolve);
        }
      },
      {
        path: "/newAIphoto",
        name: "newAIphoto",
        meta: {
          breadcrumbList: ["营销管理", "AI拍一拍"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/newAIphoto"], resolve);
        }
      },
      {
        path: "/notBuyService",
        name: "notBuyService",
        meta: {
          breadcrumbList: ["营销管理", "AI拍一拍"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/notBuyService"], resolve);
        }
      },
      {
        path: "/addConfig",
        name: "addConfig",
        meta: {
          breadcrumbList: ["营销管理", "AI拍一拍"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/addConfig"], resolve);
        }
      },
      {
        path: "/newBuyorsend",
        name: "newBuyorsend",
        meta: {
          breadcrumbList: ["营销管理", "买即送"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/newBuyorsend"], resolve);
        }
      },
      {
        path: "/electronicConfig",
        name: "electronicConfig",
        meta: {
          breadcrumbList: ["营销管理", "电子发票"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/electronicConfig"], resolve);
        }
      },
      {
        path: "/newWdf",
        name: "newWdf",
        meta: {
          breadcrumbList: ["营销管理", "微多粉"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/marketing-center/newWdf"], resolve);
        }
      },
      {
        path: "/priceInventoryCl/:id",
        name: "priceInventoryCl",
        meta: {
          breadcrumbList: ["景区", "门票管理"],
          belongTab: "product",
          openName: "scenic"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/calendartest/priceInventoryCl"
          ], resolve);
        }
      },
      {
        path: "/inventoryCl/:id",
        name: "inventoryCl",
        meta: {
          breadcrumbList: ["", "门票管理"],
          belongTab: "product",
          openName: "scenic"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/calendartest/inventoryCl"
          ], resolve);
        }
      },
      {
        path: "/hotelInventoryCl/:id",
        name: "hotelInventoryCl",
        meta: {
          breadcrumbList: ["酒店", "酒店管理", "价格库存日历"],
          belongTab: "product",
          openName: "hotel"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/calendartest/hotelInventoryCl"
          ], resolve);
        }
      },
      {
        path: "/comboInventoryCl/:id",
        name: "comboInventoryCl",
        meta: {
          breadcrumbList: ["套票", "套票票型管理", "价格库存日历"],
          belongTab: "product",
          openName: "combo"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/calendartest/comboInventoryCl"
          ], resolve);
        }
      },
      {
        path: "/publishShow", // 演出新增
        name: "publishShow",
        meta: {
          breadcrumbList: ["产品管理", "产品发布"],
          belongTab: "product",
          openName: "cpgl"
        },
        component: resolve => {
          require(["@/components/otherRouter/publish/publishShow"], resolve);
        }
      },
      {
        path: "/showInventoryCl/:id",
        name: "showInventoryCl",
        meta: {
          breadcrumbList: ["演出", "价格"],
          belongTab: "product",
          openName: "yc"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/calendartest/showInventoryCl"
          ], resolve);
        }
      },
      {
        path: "/ticketInventoryCl",
        name: "ticketInventoryCl",
        meta: {
          breadcrumbList: ["门票", "价格"],
          belongTab: "product",
          openName: "scenic"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/calendartest/ticketInventoryCl"
          ], resolve);
        }
      },
      {
        // 已经被嵌入店铺装修
        path: "/userDefined",
        name: "userDefined",
        meta: {
          breadcrumbList: ["景区", "门票管理"], // 用户自定义
          belongTab: "product",
          openName: "scenic"
        },
        component: resolve => {
          require(["@/components/otherRouter/indeUserDefined"], resolve);
        }
      },
      {
        // 年卡新增编辑页面
        path: "/parkCardAddEdit",
        name: "parkCardAddEdit",
        meta: {
          breadcrumbList: ["营销工具", "公园年卡管理"], // 用户自定义
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require(["@/components/otherRouter/parkCardAddEdit"], resolve);
        }
      },
      {
        // 交易记录
        path: "/dealList",
        name: "dealList",
        meta: {
          breadcrumbList: ["营销工具", "公园年卡管理", "交易记录"], // 用户自定义
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/parkCardAddEdit/dealList"
          ], resolve);
        }
      },
      {
        // 退款配置
        path: "/refundSet",
        name: "refundSet",
        meta: {
          breadcrumbList: ["营销工具", "公园年卡管理", "退款配置"], // 用户自定义
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/parkCardAddEdit/refundSet"
          ], resolve);
        }
      },
      {
        // 线下通知地址
        path: "/undelLineAddress",
        name: "undelLineAddress",
        meta: {
          breadcrumbList: ["营销工具", "公园年卡管理", "线下通知地址"], // 用户自定义
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require([
            "@/components/otherRouter/parkCardAddEdit/undelLineAddress"
          ], resolve);
        }
      },
      {
        path: "/productPage",
        name: "productPage",
        meta: {
          breadcrumbList: ["分销市场", "分销市场产品"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/productPage"
          ], resolve);
        }
      },
      {
        path: "/supperShopDistProduct",
        name: "supperShopDistProduct",
        meta: {
          breadcrumbList: ["分销市场", "分销市场店铺"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/supperShopDistProduct"
          ], resolve);
        }
      },
      {
        path: "/productDetail",
        name: "productDetail",
        meta: {
          breadcrumbList: ["分销市场", "店铺产品详情"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/productDetail"
          ], resolve);
        }
      },
      {
        path: "/shopEdit",
        name: "shopEdit",
        meta: {
          breadcrumbList: ["分销市场", "店铺产品编辑"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/shopEdit"
          ], resolve);
        }
      },
      {
        path: "/newAddNotice",
        name: "newAddNotice",
        meta: {
          breadcrumbList: ["设置", "编辑公告"],
          belongTab: "system",
          openName: "shezhi"
        },
        component: resolve => {
          require(["@/components/system/shezhi/add/newAddNotice"], resolve);
        }
      },
      {
        path: "/user_auth",
        name: "user_auth",
        meta: {
          breadcrumbList: ["设置", "主体认证"],
          belongTab: "system",
          openName: "shezhi"
        },
        component: resolve => {
          require(["@/components/system/shezhi/user_auth"], resolve);
        }
      },
      {
        path: "/groupingManagement",
        name: "groupingManagement",
        meta: {
          breadcrumbList: ["账户", "分组管理"],
          belongTab: "accountManage",
          openName: "partner"
        },
        component: resolve => {
          require([
            "@/components/system/shezhi/add/groupingManagement"
          ], resolve);
        }
      },
      {
        path: "/userGroupNotice",
        name: "userGroupNotice",
        meta: {
          breadcrumbList: ["账户", "新增分组"],
          belongTab: "accountManage",
          openName: "partner"
        },
        component: resolve => {
          require(["@/components/system/shezhi/add/userGroupNotice"], resolve);
        }
      },
      {
        path: "/lockerPay",
        name: "lockerPay",
        meta: {
          breadcrumbList: ["账户", "支付"],
          belongTab: "accountManage",
          openName: "capitalManage"
        },
        component: resolve => {
          require(["@/components/accountManage/newAdd/lockerPay"], resolve);
        }
      },
      {
        path: "/accountBank",
        name: "accountBank",
        meta: {
          breadcrumbList: ["账户", "流水明细"],
          belongTab: "accountManage",
          openName: "partner"
        },
        component: resolve => {
          require(["@/components/system/shezhi/add/accountBank"], resolve);
        }
      },
      {
        path: "/newAddManger",
        name: "newAddManger",
        meta: {
          breadcrumbList: ["账户", "合作伙伴", "编辑联系人"],
          belongTab: "accountManage",
          openName: "partner"
        },
        component: resolve => {
          require(["@/components/accountManage/newAdd/newAddManger"], resolve);
        }
      },
      {
        path: "/billInfo",
        name: "billInfo",
        meta: {
          breadcrumbList: ["分销市场", "我要采购订单确认"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/myWantBuy/billInfo"
          ], resolve);
        }
      },
      {
        path: "/topay",
        name: "topay",
        meta: {
          breadcrumbList: ["分销市场", "我要采购支付"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/myWantBuy/topay"
          ], resolve);
        }
      },
      {
        path: "/pay-success",
        name: "paySucess",
        meta: {
          breadcrumbList: ["分销市场", "我要采购支付成功"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/myWantBuy/paySucess"
          ], resolve);
        }
      },
      {
        path: "/lockerPaySucess",
        name: "lockerPaySucess",
        meta: {
          breadcrumbList: ["账户", "备用金支付成功"],
          belongTab: "accountManage",
          openName: "capitalManage"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/myWantBuy/paySucess"
          ], resolve);
        }
      },
      {
        path: "/pay-fail",
        name: "payFail",
        meta: {
          breadcrumbList: ["分销市场", "我要采购支付失败"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/myWantBuy/payFail"
          ], resolve);
        }
      },
      {
        path: "/topay",
        name: "topay",
        meta: {
          breadcrumbList: ["分销市场", "我要采购支付"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/myWantBuy/topay"
          ], resolve);
        }
      },
      {
        path: "/pay-success",
        name: "paySucess",
        meta: {
          breadcrumbList: ["分销市场", "我要采购支付成功"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/myWantBuy/paySucess"
          ], resolve);
        }
      },
      {
        path: "/pay-fail",
        name: "payFail",
        meta: {
          breadcrumbList: ["分销市场", "我要采购支付失败"],
          belongTab: "dismarket",
          openName: "distmarket-myWantBuy"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/myWantBuy/payFail"
          ], resolve);
        }
      },
      {
        path: "/newContract",
        name: "newContract",
        meta: {
          breadcrumbList: ["合同管理", "新增合同"],
          belongTab: "dismarket",
          openName: "contract"
        },
        component: resolve => {
          require(["@/components/dismarket/contract/add/newContract"], resolve);
        }
      },
      {
        path: "/editContract",
        name: "editContract",
        meta: {
          breadcrumbList: ["合同管理", "查看合同"],
          belongTab: "dismarket",
          openName: "contract"
        },
        component: resolve => {
          require([
            "@/components/dismarket/contract/add/editContract"
          ], resolve);
        }
      },
      {
        path: "/newContractTemplate",
        name: "newContractTemplate",
        meta: {
          breadcrumbList: ["合同模板管理", "新增合同模板"],
          belongTab: "dismarket",
          openName: "contract"
        },
        component: resolve => {
          require([
            "@/components/dismarket/contract/add/newContractTemplate"
          ], resolve);
        }
      },
      {
        path: "/accountStated",
        name: "accountStated",
        meta: {
          breadcrumbList: ["备用金管理", "备用金账户"],
          belongTab: "accountManage",
          openName: "capitalManage"
        },
        component: resolve => {
          require(["@/components/accountManage/accountStated"], resolve);
        }
      },
      {
        path: "/productRoleAuthority",
        name: "productRoleAuthority",
        meta: {
          breadcrumbList: ["用户中心", "产品角色管理"],
          belongTab: "system",
          openName: "account"
        },
        component: resolve => {
          require([
            "@/components/system/account/productRoleAuthority"
          ], resolve);
        }
      },
      {
        path: "/ordertopay",
        name: "ordertopay",
        meta: {
          breadcrumbList: ["订单管理", "我要支付"],
          belongTab: "order_manage",
          openName: "all-order"
        },
        component: resolve => {
          require([
            "@/components/dismarket/distmarket-myWantBuy/myWantBuy/topay"
          ], resolve);
        }
      },
      {
        path: "/timeReserve",
        name: "timeReserve",
        meta: {
          breadcrumbList: ["营销管理", "分时预约"],
          belongTab: "marketing-center",
          openName: "market-tool"
        },
        component: resolve => {
          require([
            "@/components/marketing-center/market-tool/timeReserve"
          ], resolve);
        }
      },
      {
        path: "/hotelBaseInfo", // 酒店基础信息设置
        name: "HotelBaseInfo",
        meta: {
          breadcrumbList: ["酒店", "酒店管理", "酒店基础信息"],
          belongTab: "product",
          openName: "hotel"
        },
        component: resolve => {
          require([
            "@/components/product/hotel/hotelBaseSet/hotelBaseInfo"
          ], resolve);
        }
      },
      {
        path: "/hotelAuthentication", // 酒店认证信息设置
        name: "HotelAuthentication",
        meta: {
          breadcrumbList: ["酒店", "酒店管理", "酒店基础信息"],
          belongTab: "product",
          openName: "hotel"
        },
        component: resolve => {
          require([
            "@/components/product/hotel/hotelBaseSet/hotelAuthentication"
          ], resolve);
        }
      },
      {
        path: "/hoteldistributionSet", // 酒店分销设置
        name: "HoteldistributionSet",
        meta: {
          breadcrumbList: ["酒店", "酒店管理", "酒店基础信息"],
          belongTab: "product",
          openName: "hotel"
        },
        component: resolve => {
          require([
            "@/components/product/hotel/hotelBaseSet/hoteldistributionSet"
          ], resolve);
        }
      },
      {
        path: "/roomInfoSet", // 酒店房型基础信息设置
        name: "RoomInfoSet",
        meta: {
          breadcrumbList: ["酒店", "酒店管理", "酒店基础信息"],
          belongTab: "product",
          openName: "hotel"
        },
        component: resolve => {
          require([
            "@/components/product/hotel/hotelBaseSet/roomInfoSet"
          ], resolve);
        }
      },
      {
        path: "/allotParams", // 分账参数配置
        name: "allotParams",
        meta: {
          breadcrumbList: ["营销中心", "营销工具", "分账参数配置"],
          belongTab: "marketing-center",
          openName: "paymentLedger"
        },
        component: resolve => {
          require([
            "@/components/marketing-center/market-tool/paymentLedger/allotParams"
          ], resolve);
        }
      },
      {
        path: "/allotUnusualOrder", // 分账异常订单
        name: "allotUnusualOrder",
        meta: {
          breadcrumbList: ["营销中心", "营销工具", "分账异常订单"],
          belongTab: "marketing-center",
          openName: "paymentLedger"
        },
        component: resolve => {
          require([
            "@/components/marketing-center/market-tool/paymentLedger/allotUnusualOrder"
          ], resolve);
        }
      },
      {
        path: "/managePayinfo",
        name: "managePayinfo",
        meta: {
          title: "商户收款账号设置",
          breadcrumbList: ["店铺设置", "商户收款账号"],
          belongTab: "merchnat-center",
          openName: "merchant-set"
        },
        component: resolve => {
          require([
            "@/components/merchnat-center/merchant-set/merchant-payinfo/payInfo"
          ], resolve);
        }
      },
      {
        path: "/strategyDetail/:id",
        name: "strategyDetail",
        meta: {
          title: "游玩攻略详情",
          breadcrumbList: ["店铺设置", "游玩攻略", "攻略详情"],
          belongTab: "merchnat-center",
          openName: "merchant-set"
        },
        component: resolve => {
          require([
            "@/components/merchnat-center/merchant-adv-manage/merchant_strategy/strategyDetail"
          ], resolve);
        }
      },
      {
        path: "/strategyEdit/:id",
        name: "strategyEdit",
        meta: {
          title: "游玩攻略详情",
          breadcrumbList: ["店铺设置", "游玩攻略", "修改攻略"],
          belongTab: "merchnat-center",
          openName: "merchant-set"
        },
        component: resolve => {
          require([
            "@/components/merchnat-center/merchant-adv-manage/merchant_strategy/strategyEdit"
          ], resolve);
        }
      },
      {
        path: "/strategyAdd",
        name: "strategyAdd",
        meta: {
          title: "添加游玩攻略",
          breadcrumbList: ["店铺设置", "游玩攻略", "添加攻略"],
          belongTab: "merchnat-center",
          openName: "merchant-set"
        },
        component: resolve => {
          require([
            "@/components/merchnat-center/merchant-adv-manage/merchant_strategy/strategyAdd"
          ], resolve);
        }
      },
      {
        path: "/msgEditTemplate", // 分账异常订单
        name: "msgEditTemplate",
        meta: {
          breadcrumbList: ["系统管理", "短信管理", "编辑商品"],
          belongTab: "system",
          openName: "shezhi"
        },
        component: resolve => {
          require([
            "@/components/system/shezhi/msgManage/editTemplate"
          ], resolve);
        }
      },
      {
        path: "/recommendEdit", // 分账异常订单
        name: "recommendEdit",
        meta: {
          breadcrumbList: ["产品中心", "推荐产品", "推荐产品管理"],
          belongTab: "product",
          openName: "recommend"
        },
        component: resolve => {
          require([
            "@/components/product/recommend/manage/edit"
          ], resolve);
        }
      }
    ]
  }
];

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
// export const otherRouter = {
//   path: '/',
//   name: 'otherRouter',
//   component: Main,
//   children: [
//     { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } }
//   ]
// }

// 用户中心
// const account = [
//   {
//     path: '/admin/account/role',
//     name: 'role',
//     component: resolve => { require(['@/components/system/account/role/list.vue'], resolve) },
//     meta: {
//       breadcrumbList: ['用户中心', '角色管理'],
//       belongTab: 'system',
//       openName: 'account'
//     }
//   },
//   {
//     path: '/admin/account/userManage',
//     name: 'leaguer_pfofile',
//     component: resolve => { require(['@/components/system/account/userManage/list.vue'], resolve) },
//     meta: {
//       breadcrumbList: ['用户中心', '会员档案'],
//       belongTab: 'system',
//       openName: 'account'
//     }
//   },
//   {
//     path: '/admin/account/loginLog',
//     name: 'user_manage',
//     component: resolve => { require(['@/components/system/account/loginLog/list.vue'], resolve) }
//   }
// ]

// 产品中心
// const product = [
//   {
//     path: '/product/scenic/list',
//     name: 'parkInfo',
//     component: resolve => { require(['@/components/product/scenic/list.vue'], resolve) },
//     meta: {
//       breadcrumbList: ['景区', '景区管理'],
//       belongTab: 'product',
//       openName: 'scenic'
//     }
//   },
//   {
//     path: '/product/scenic/add',
//     name: 'parkTicket',
//     component: resolve => { require(['@/components/product/scenic/add.vue'], resolve) },
//     meta: {
//       breadcrumbList: ['景区', '门票管理'],
//       belongTab: 'product',
//       openName: 'scenic'
//     }
//   },
//   {
//     path: '/admin/ticket/list',
//     name: 'parkTicket',
//     component: resolve => { require(['@/components/system/account/userManage/list.vue'], resolve) }
//   },
//   {
//     path: '/admin/ticket/channelCode',
//     name: 'ticketRatecode',
//     component: resolve => { require(['@/components/system/account/loginLog/list.vue'], resolve) }
//   },
//   {
//     path: '/admin/ticket/channelCodeRule',
//     name: 'ticektRatecodeRule',
//     component: resolve => { require(['@/components/system/account/loginLog/list.vue'], resolve) }
//   },
//   {
//     path: '/admin/ticket/channelCodePrice',
//     name: 'ticketRatecodePrice',
//     component: resolve => { require(['@/components/system/account/loginLog/list.vue'], resolve) }
//   }
// ]

// 系统管理
// const system = [
//   {
//     path: '/admin/sysFunctions',
//     name: 'user',
//     component: resolve => { require(['@/components/system/user/list.vue'], resolve) }
//   },
//   {
//     path: '/admin/loginLogs',
//     name: 'login_log',
//     component: resolve => { require(['@/components/system/loginLogs/list.vue'], resolve) }
//   },
//   {
//     path: '/admin/sysAnnouncement',
//     name: 'sysAnnouncement',
//     component: resolve => { require(['@/components/system/news/list.vue'], resolve) }
//   },
//   ...account,
//   ...product
// ]

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
// export const appRouter = {
//   path: '/main',
//   name: 'main',
//   component: Main,
//   children: [
//     ...system
//   ]
// }

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  ...loginRouter
  // otherRouter,
];
