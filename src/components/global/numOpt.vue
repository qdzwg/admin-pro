<template>
    <div class="numOpt">
        <span :class="{unUsed: num<=min}" @click='numOpt(0)'>-</span><input type="text" @change='numChange' v-model="num"><span :class="{unUsed: num>=max}" @click='numOpt(1)'>+</span>
    </div>
</template>
<script>
export default {
    data () {
        return {
            num: 0,
        }
    },
    props: ['max','min','numChange'],
    // props:{
    //     max:{
    //         type: Number,
    //         default: ""
    //     },
    //     min:{
    //         type: Number,
    //         default: 0 
    //     },
    //     numChange:{
    //         type: Function,
    //     }
    // },
    methods: {
        numOpt(bool) {
            if(bool){
                if(this.num<this.max){
                    this.num++;
                    // this.$emit('callBack',bool);
                }
            }else{
                if(this.num>this.min){
                    this.num--;
                    // this.$emit('callBack',bool);
                }
            }
        }
    },
    mounted () {
        console.log(this.numChange)
    }
}
</script>
<style lang="scss" scoped >
.numOpt {
    user-select: none;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    overflow: hidden;
    font-size: 14px;
    border-radius: 3px;
    color: #413838;
    span {
        width: 30px;
        cursor: pointer;
        display: inline-block;
        border: 1px solid #c0c7d8;
        vertical-align: middle;
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
    }
}
.unUsed {
    color: #c0c7d8;
    input {
        color: #c0c7d8;
    }
}
</style>
