<template>
  <div class="numSpinner">
    <span :class="{unUsed: num<=min}"
          @click="changeNum('minus')">
      <Icon type="android-remove"></Icon>
    </span>
    <input type="text"
           v-model="num"
           @blur="keyNum"
           @input="convertNum">
    <span :class="{unUsed: num>=max}"
          @click="changeNum('add')">
      <Icon type="android-add"></Icon>
    </span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      num: 0
    }
  },
  props: {
    value: {
      type: [String, Number]
    },
    max: {
      type: Number
    },
    min: {
      type: Number
    }
  },
  watch: {
    value: {
      handler (value) {
        this.num = this.value
      },
      immediate: true
    }
  },
  methods: {
    changeNum (mold) {
      this.num = this.num || 0
      switch (mold) {
        case 'minus':
          if (typeof this.min !== 'undefined' && this.num <= this.min) {
          } else {
            this.num--
          }
          break
        case 'add':
          if (typeof this.max !== 'undefined' && this.num >= this.max) {

          } else {
            this.num++
          }
          break
      }
      this.$emit('input', this.num)
      this.$emit('on-change', this.num)
    },
    keyNum () {
      if (typeof this.max !== 'undefined' && this.num > this.max) {
        this.num = this.max
      }
      if (typeof this.min !== 'undefined' && this.num < this.min) {
        this.num = this.min
      }
      this.$emit('input', this.num !== '' ? parseFloat(this.num) : '')
      this.$emit('on-change', this.num !== '' ? parseFloat(this.num) : '')
    },
    convertNum (event) {
      if ((event.data !== '-' && isNaN(event.data)) && (event.data !== '.' && isNaN(event.data))) {
        this.num = this.value
      }
    }
  }
}
</script>

<style lang="scss" scoped >
.numSpinner {
  user-select: none;
  line-height: 30px;
  text-align: center;
  display: inline-block;
  overflow: hidden;
  font-size: 0;
  border-radius: 3px;
  color: #413838;
  span {
    width: 30px;
    cursor: pointer;
    display: inline-block;
    border: 1px solid #c0c7d8;
    vertical-align: middle;
    font-size: 14px;
  }
  input {
    width: 70px;
    outline: none;
    border: none;
    user-select: none;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #c0c7d8;
    border-top: 1px solid #c0c7d8;
    font-size: 14px;
  }
}
.numSpinner span.unUsed {
  color: #c0c7d8;
  cursor: no-drop;
  input {
    color: #c0c7d8;
  }
}
</style>
