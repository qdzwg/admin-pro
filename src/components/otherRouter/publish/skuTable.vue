<template>
  <div class="ivu-table-wrapper">
    <Form ref="skuForm"
          :model="skuForm">
      <div class="ivu-table ivu-table-border sku-table">
        <table cellspacing="0"
               cellpadding="0"
               border="0">
          <thead>
            <tr>
              <template v-for="item in columns">
                <th class="ivu-table-column-center"
                    :key="item.title"
                    v-if="typeof item.key =='string'">
                  <div class="ivu-table-cell">
                    {{item.title}}
                  </div>
                </th>
                <th class="ivu-table-column-center"
                    :key="item.title"
                    v-else-if="typeof item.key =='object'"
                    width="20%">
                  <div class="ivu-table-cell">
                    {{item.title}}
                  </div>
                </th>
                <th class="ivu-table-column-center"
                    :key="item.title"
                    v-else
                    width="80">
                  <div class="ivu-table-cell">
                    {{item.title}}
                  </div>
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(skuitem,index) in skuForm.items"
                :key="index">
              <template v-for="item in columns">
                <td class="ivu-table-column-center"
                    v-if="item.key"
                    :key="item.title">
                  <div class="ivu-table-cell">
                    <template v-if="typeof item.key=='string'">
                      <FormItem v-if="item.key=='stockNum'"
                                :prop="'items.' + index + '.' + item.key"
                                :rules="[{required: true,type: 'number', message: '库存不能为空！', trigger: 'blur'},
                                {validator:common.validate.integer, trigger: 'blur'},
                                {validator(rule, value, callback){
                                  if(skuitem.distStockNum>value){
                                    callback('库存不能小于分销库存！')
                                  }else{
                                    callback()
                                  }
                                }, trigger: 'blur'}]">
                        <Input number
                               v-model="skuitem[item.key]"></Input>
                      </FormItem>
                      <FormItem v-else-if="item.key=='distStockNum'"
                                :prop="'items.' + index + '.' + item.key"
                                :rules="[{required: true,type: 'number', message: '分销库存不能为空！', trigger: 'blur'},
                                {validator:common.validate.integer, trigger: 'blur'},
                                {validator(rule, value, callback){
                                  if(value>skuitem.stockNum){
                                    callback('分销库存不能大于库存！')
                                  }else{
                                    callback()
                                  }
                                }, trigger: 'blur'}]">
                        <Input number
                               v-model="skuitem[item.key]"></Input>
                      </FormItem>
                      <FormItem v-else
                                :prop="'items.' + index + '.' + item.key"
                                :rules="[{required: true,type: 'number', message: item.title+'不能为空！', trigger: 'blur'},
                                {validator:common.validate.floatNumber, trigger: 'blur'}]">
                        <Input number
                               v-model="skuitem[item.key]"></Input>
                      </FormItem>
                    </template>
                    <Row v-else>
                      <Col span="11">
                      <FormItem :prop="'items.' + index + '.' + item.key[0]"
                                :rules="[{required: true,type: 'number', message: '该项不能为空！', trigger: 'blur'},
                                {validator:common.validate.floatNumber, trigger: 'blur'},
                                {validator(rule, value, callback){
                                  if(value>skuitem[item.key[1]]){
                                    callback('最低价不能大于最高价！')
                                  }else{
                                    callback()
                                  }
                                }, trigger: 'blur'}]">
                        <Input number
                               v-model="skuitem[item.key[0]]"
                               placeholder="最低价"></Input>
                      </FormItem>
                      </Col>
                      <Col span="2"
                           style="text-align: center; margin-top:10px;">-</Col>
                      <Col span="11">
                      <FormItem :prop="'items.' + index + '.' + item.key[1]"
                                :rules="[{required: true,type: 'number', message: '该项不能为空！', trigger: 'blur'},
                                {validator:common.validate.floatNumber, trigger: 'blur'},
                                {validator(rule, value, callback){
                                  if(skuitem[item.key[0]]>value){
                                    callback('最高价不能小于最低价！')
                                  }else{
                                    callback()
                                  }
                                }, trigger: 'blur'}]">
                        <Input number
                               v-model="skuitem[item.key[1]]"
                               placeholder="最高价"></Input>
                      </FormItem>
                      </Col>
                    </Row>
                  </div>
                </td>
                <td class="ivu-table-column-center"
                    v-else-if="item.level==0&&(index%(level1*level2)==0||index==0)"
                    :rowspan="level1*level2"
                    :key="item.title">
                  <div class="ivu-table-cell">
                    {{data[parseInt(index/(level1*level2))].title}}
                  </div>
                </td>
                <td class="ivu-table-column-center"
                    v-else-if="item.level==1&&(index%level2==0||index==0)"
                    :rowspan="level2"
                    :key="item.title">
                  <div class="ivu-table-cell">
                    {{data[parseInt(index/(level1*level2))].items[parseInt(index/level2)%level1].title}}
                  </div>
                </td>
                <td class="ivu-table-column-center"
                    v-else-if="item.level==2"
                    :key="item.title">
                  <div class="ivu-table-cell">
                    {{data[parseInt(index/(level1*level2))].items[parseInt(index/level2)%level1].items[index%level2].title}}
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      level0: 0,
      level1: 1,
      level2: 1,
      skuForm: {},
      totalPrice: 0
    }
  },
  props: {
    columns: {
      type: Array
    },
    data: {
      type: Array
    },
    tableData: {
      type: Array
    }
  },
  watch: {
    data: {
      handler (value) {
        this.level0 = value.length
        let skuItems = []
        let skuinfo = {}
        // console.log(this.columns)
        this.columns.forEach(element => {
          if (typeof element.key === 'string') {
            skuinfo[element.key] = ''
          } else if (typeof element.key === 'object') {
            skuinfo[element.key[0]] = ''
            skuinfo[element.key[1]] = ''
          }
        })
        value.forEach((element, index0) => {
          if (element.items.length) {
            this.level1 = element.items.length
            element.items.forEach((sel, index1) => {
              if (sel.items.length) {
                this.level2 = sel.items.length
                sel.items.forEach((tel, index2) => {
                  if (this.skuForm.items.length) {
                    let skuFlag = false
                    this.skuForm.items.forEach(skuitem => {
                      if (element.title === skuitem.specValue1 && sel.title === skuitem.specValue2 && tel.title === skuitem.specValue3) {
                        // skuItems.push(Object.assign({ specValue1: element.title, specValue2: sel.title, specValue3: tel.title }, skuinfo, skuitem))
                        skuFlag = skuitem
                        return false
                      }
                    })
                    if (skuFlag) {
                      skuItems.push(Object.assign({ specValue1: element.title, specValue2: sel.title, specValue3: tel.title }, skuinfo, skuFlag))
                    } else {
                      skuItems.push(Object.assign({ specValue1: element.title, specValue2: sel.title, specValue3: tel.title }, skuinfo))
                    }
                  } else {
                    skuItems.push(Object.assign({ specValue1: element.title, specValue2: sel.title, specValue3: tel.title }, skuinfo))
                  }
                })
              } else {
                this.level2 = 1
                if (this.skuForm.items[index0 * index1] && this.skuForm.items[index0 * index1].specValue3) {
                  skuItems.push(Object.assign({ specValue1: element.title, specValue2: sel.title }, skuinfo))
                } else {
                  let skuFlag = false
                  this.skuForm.items.forEach(skuitem => {
                    if (element.title === skuitem.specValue1 && sel.title === skuitem.specValue2) {
                      // skuItems.push(Object.assign({ specValue1: element.title, specValue2: sel.title }, skuinfo, skuitem))
                      skuFlag = skuitem
                      return false
                    }
                  })
                  if (skuFlag) {
                    skuItems.push(Object.assign({ specValue1: element.title, specValue2: sel.title }, skuinfo, skuFlag))
                  } else {
                    skuItems.push(Object.assign({ specValue1: element.title, specValue2: sel.title }, skuinfo))
                  }
                }
              }
            })
          } else {
            this.level1 = 1
            this.level2 = 1
            if (this.skuForm.items[index0] && (this.skuForm.items[index0].specValue2 || this.skuForm.items[index0].specValue3)) {
              skuItems.push(Object.assign({ specValue1: element.title }, skuinfo))
            } else {
              let skuFlag = false
              this.skuForm.items.forEach(skuitem => {
                if (element.title === skuitem.specValue1) {
                  // skuItems.push(Object.assign({ specValue1: element.title }, skuinfo, skuitem))
                  skuFlag = skuitem
                  return false
                }
              })
              if (skuFlag) {
                skuItems.push(Object.assign({ specValue1: element.title }, skuinfo, skuFlag))
              } else {
                skuItems.push(Object.assign({ specValue1: element.title }, skuinfo))
              }
            }
          }
        })
        this.$set(this.skuForm, 'items', skuItems)
        // this.getTotalPrice()
      },
      deep: true,
      immediate: true
    },
    tableData: {
      handler (value) {
        this.skuForm.items.forEach((element, index) => {
          element = Object.assign(element, value[index])
        })
        // this.getTotalPrice()
      },
      deep: true,
      immediate: true
    },
    'skuForm.items': {
      handler (value) {
        this.getTotalPrice()
        this.$emit('totalPrice', this.totalPrice)
      },
      deep: true
    }
  },
  methods: {
    submitForm () {
      let skuForm = this.skuForm.items
      this.$refs['skuForm'].validate((valid) => {
        if (valid) {

        } else {
          skuForm = false
        }
      })
      return skuForm
    },
    setPrice (key, value) {
      this.skuForm.items.forEach(element => {
        if (typeof key === 'object') {
          key.forEach((el, index) => {
            element[el] = value[index]
          })
        } else {
          element[key] = value
        }
      })
    },
    getTotalPrice () {
      // console.log(this.skuForm.items)
      let totalPrice = 0
      this.skuForm.items.forEach(element => {
        totalPrice += element.stockNum - 0
      })
      this.totalPrice = totalPrice
    }
  }
}
</script>
<style>
.sku-table table {
  width: 100%;
}
.sku-table table .ivu-table-cell .ivu-form-item {
  margin-bottom: 20px;
}
</style>
