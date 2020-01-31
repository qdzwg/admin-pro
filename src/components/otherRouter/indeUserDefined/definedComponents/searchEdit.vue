<template>
    <div class="component-name-list">
        <h3 class="component-title">搜索框编辑</h3>
        <!-- <div>
            <CheckboxGroup @on-change="selectItemChange" v-model="selectItems">
                <Checkbox label="ticket">
                    <span>景区</span>
                </Checkbox>
                <Checkbox label="room">
                    <span>酒店</span>
                </Checkbox>
                <Checkbox label="mdse">
                    <span>商品</span>
                </Checkbox>
                 <Checkbox label="repast">
                    <span>餐饮</span>
                </Checkbox>
                <Checkbox label="route">
                    <span>跟团游</span>
                </Checkbox>
               
            </CheckboxGroup>
        </div> -->
        暂时无需要编辑内容
    </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  props: {
    index: {
      type: Number
    },
    keyList: {
      type: Array
    }
  },
  data() {
    return {
      selectItems: this.keyList
    };
  },
  watch: {
    keyList: {
      handler: function(val, oldVal) {
        this.selectItems = val;
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    selectItemChange(arr) {
      var arr = [];
      this.selectItems.forEach(element => {
        var obj = {};
        obj.businessType = element;
        let name = "";
        if (element == "ticket") {
          name = "景区";
        } else if (element == "room") {
          name = "酒店";
        } else if (element == "mdse") {
          name = "商品";
        }else if(element=="repast"){
            name = "餐饮"
        }else if(element == "route"){
            name = "跟团游"
        }
        obj.name = name;
        arr.push(obj);
      });
      this.$emit("getSearchList", this.index, arr);
    }
  }
};
</script>
<style scope lang="scss">
</style>

