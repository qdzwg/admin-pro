<template>
  <div>
    <Row class="code-row-bg">
      <Col class="warper" span="6">
        <div
          @click="setType('ticket')"
          class="publishType"
          :class="{ active: type == 'ticket' }"
        >
          <img src="../../../../assets/images/index03.png" alt="" />
          <div class="typeName">景区门票</div>
          <div class="typeNotice">(无需物流)</div>
        </div>
      </Col>
      <Col class="warper" span="6">
        <div
          @click="setType('hotel')"
          class="publishType"
          :class="{ active: type == 'hotel' }"
        >
          <img src="../../../../assets/images/index05.png" alt="" />
          <div class="typeName">酒店户型</div>
          <div class="typeNotice">(无需物流)</div>
        </div>
      </Col>
      <Col class="warper" span="6">
        <div
          @click="setType('msde')"
          class="publishType"
          :class="{ active: type == 'msde' }"
        >
          <img src="../../../../assets/images/index07.png" alt="" />
          <div class="typeName">实物商品</div>
          <div class="typeNotice">(物流发货)</div>
        </div>
      </Col>
      <Col class="warper" span="6">
        <div
          @click="setType('cater')"
          class="publishType"
          :class="{ active: type == 'msde' }"
        >
          <img src="../../../../assets/images/index07.png" alt="" />
          <div class="typeName">餐饮餐券</div>
          <div class="typeNotice">(无需物流)</div>
        </div>
      </Col>
      <Col class="warper" span="6">
        <div
          @click="setType('travel')"
          class="publishType"
          :class="{ active: type == 'msde' }"
        >
          <img src="../../../../assets/images/index07.png" alt="" />
          <div class="typeName">跟团游</div>
          <div class="typeNotice">(无需物流)</div>
        </div>
      </Col>
      <Col class="warper" span="6">
        <div
          @click="setType('guide')"
          class="publishType"
          :class="{ active: type == 'guide' }"
        >
          <img src="../../../../assets/images/index07.png" alt="" />
          <div class="typeName">导游</div>
          <div class="typeNotice"></div>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type: ""
    };
  },
  methods: {
    setType(type) {
      if (type == "ticket") {
        this.$router.push("/publishParkCpgl");
      } else if (type == "hotel") {
        this.$router.push("/publishHotel");
      } else if (type == "msde") {
        this.$router.push("/physicalCommodity");
      } else if (type == "cater") {
        this.$router.push("/restaurantInfo");
      } else if (type == "travel") {
        this.$router.push("/travellingRouteCpgl");
      } else if (type == "guide") {
        this.$router.push("/publishGuide");
      }
    }
  }
};
</script>
<style scoped lang="scss">
.warper {
  padding: 15px;
}
.publishType {
  padding: 30px;
  cursor: pointer;
  text-align: center;
  .typeName {
    font-size: 22px;
    color: rgb(16, 142, 233);
    margin: 10px 0px;
  }
}

.publishType:hover {
  padding: 29px;
  border: 1px solid rgb(16, 142, 233);
  .typeNotice {
    color: rgb(16, 142, 233);
    text-decoration: underline;
  }
  .typeName {
    text-decoration: underline;
  }
}
.submit-button {
  text-align: center;
  margin-top: 10px;
}
</style>
