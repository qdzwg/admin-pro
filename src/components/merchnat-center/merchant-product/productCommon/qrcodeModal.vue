<template>
    <div>
        <!-- <Modal width="550" v-model="preLookModal" title="预览" :loading="loading">
            <div class="modalPrlook-content">
                <div class="copy-content">
                     领取链接:http://t.cn/Rr96xAV<button class="tag-read" data-clipboard-text="http://t.cn/Rr96xAV" @click="copy">复制</button><button class="tag-read" data-clipboard-text="http://t.cn/Rr96xAV" @click="copy">复制长链接</button>
                 </div>
              <div>
                领取二维码 <a href="">下载二维码</a>
              </div>
              <p class="notice">
                  扫一扫查看，推荐使用支付宝、微信、手机浏览器   全员推广请使用长链接
              </p>
              <div class="qrcode-warper">
                <qrcode 
                :value="qrcodeUrl" 
                :options="{ size: 170 }">
                </qrcode>
              </div>
            </div>
          <div slot="footer"></div>
        </Modal> -->
        <!-- 预览 -->
        <Modal width="550" v-model="preLookModal" title="预览">
          <div>
            <span>领取短链接：{{data.qrCodeUrl}}</span>
            <Button
              v-clipboard:copy="data.qrCodeUrl"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >复制</Button>
            <Button
              v-clipboard:copy="data.qrCodeLongUrl"
              v-clipboard:success="onCopy2"
              v-clipboard:error="onError2"
            >复制长链接</Button>
            <p>
              <span>
                领取二维码:
                <a :href="data.codeUrl" download>下载二维码</a>
              </span>
            </p>
            <p style="background:yellow;padding:5px 0;margin-top:5px;">扫一扫查看，推荐使用支付宝、微信、手机浏览器 全员推广请使用长链接</p>
            <center id="target" style="margin-top:20px;">
              <qrcode :value="data.qrCodeLongUrl" :options="{ size: 170}"></qrcode>
            </center>
          </div>
          <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
import QRcode from '@xkeshi/vue-qrcode'
import Clipboard from 'clipboard'
export default {
  data () {
    return {
      codeUrl: '',
      preLookModal: false,
      loading: true
    }
  },
  props:{
      data:{
          type: Object,
          default: new Object()
      }
    },
  components: {
    qrcode: QRcode
  },
  mounted() {
    //把生成的二维码转换成图片
                      this.$nextTick(function() {
                        let canvasData = $("#target").children("canvas");
                        this.codeUrl = canvasData[0].toDataURL();
                      });
  },
  methods: {
    onCopy() {
      this.$Message.success("复制成功！");
    },
    onError() {
      this.$Message.error("复制失败！");
    },
    onCopy2() {
      this.$Message.success("复制成功！");
    },
    onError2() {
      this.$Message.error("复制失败！");
    },
    copy() {
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", e => {
        this.$Message.success("地址复制成功");
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        // console.log('该浏览器不支持自动复制')
        this.$Message.warning('该浏览器不支持自动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    cancel () {
      this.$emit('input', this.preLookModal)
    }
  }
}
</script>
<style scope lang="scss">
.qrcode-warper {
  text-align: center;
  margin-top: 20px;
}
.copy-content {
  margin-bottom: 10px;
  button {
    padding: 2px 5px;
    background: #ffffff;
    margin-right: 5px;
    margin-left: 5px;
    border: 1px solid #cccccc;
    border-radius: 3px;
  }
}
.modalPrlook-content {
  padding: 5px 25px;
  font-size: 14px;
}
.notice {
  background: yellow;
  margin-top: 10px;
}
</style>
