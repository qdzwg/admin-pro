<template>
  <div>
    <Row v-for="(item,index) in row"
         :key="item.id"
         :class="index==row.length-1?'':'expand-row'">
      <Col span="1"
           v-if="multiple">
      <Checkbox v-model="item.checked"
                @on-change="handleCheck($event,item)"></Checkbox>
      </Col>
      <Col span="4">
      <span class="expand-key">姓名: </span>
      <span class="expand-value">{{ item.linkMan }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">身份证: </span>
      <span class="expand-value">{{ item.idcardNo }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      checkedItems: []
    }
  },
  props: {
    row: Array,
    multiple: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCheck (event, item) {
      if (event) {
        this.checkedItems.push(item)
      } else {
        this.checkedItems.forEach((element, index) => {
          if (element.id === item.id) {
            this.checkedItems.splice(index, 1)
          }
        })
      }
      this.$emit('checks', this.checkedItems)
    }
  }
}
</script>
<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
