const paySet = {
  data() {
    return {
      comList: [
        // {
        //   key: 0,
        //   comName: 'OldApliy',
        //   icon: require('@/assets/images/zfb.png'),
        //   name: '支付宝(旧方式,即将下架)',
        // },

        // {
        //   key: 1,
        //   comName: 'NewApliy',
        //   icon: require('@/assets/images/zfb.png'),
        //   name: '支付宝',
        // },
        {
          key: 2,
          comName: 'wx',
          icon: require('@/assets/images/wx.png'),
          name: '微信',
          detailUrl: '/merchant/merchantPayInfo/wxpayFL',
          saveUrl: '/merchant/merchantPayInfo/saveWxPay'
        },
        {
          key: 3,
          comName: 'WxApplet',
          icon: require('@/assets/images/wx.png'),
          name: '微信小程序',
          detailUrl: '/merchant/merchantPayInfo/wxMiniProgramFL',
          saveUrl: '/merchant/merchantPayInfo/saveWxMiniProgram'
        },
        // {
        //   key: 4,
        //   comName: 'GhPay',
        //   icon: require('@/assets/images/icbc.png'),
        //   name: '工行聚合支付',
        // },
        // {
        //   key: 5,
        //   comName: 'JhWx',
        //   icon: require('@/assets/images/ccb.png'),
        //   name: '微信建行聚合支付',
        // },
        // {
        //   key: 6,
        //   comName: 'JhWxApplet',
        //   icon: require('@/assets/images/ccb.png'),
        //   name: '小程序建行聚合支付',
        // },
      ]
    }
  }
}

export {
  paySet
}
