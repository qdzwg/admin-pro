<template>
    <div>
        <div class="banner-handler">
            <Button size="small" @click="del(index)" type="error">删除</Button>
            <Button size="small" @click="bannerEdit(index)" type="primary">编辑</Button>
        </div>
        <template v-if="imgList.length">
             <Carousel arrow='never' autoplay>
                <CarouselItem v-for="(item,index) in imgList" :key="index">
                    <div class="demo-carousel">
                        <!-- {{index}} -->
                        <img v-if='item.picAddr' :src="item.picAddr" alt="">
                        <img v-else src="../../../../assets/images/default.jpg" alt="">
                    </div>
                </CarouselItem>
            </Carousel>
        </template>
       
        <div class="add-notice" v-if="!imgList.length">
            <div>请新增轮播图片</div>
            <div>
                最多上传5张，建议尺寸640x310px
            </div> 
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            index:{
                type:Number
            },
            data:{
                type:Array
            }
        },
        computed:{
            imgList(){
                return this.data
            }
        },
        data(){
            return {
                defaultImgList:[//默认图片
                    {
                        url:require("../../../../assets/images/login_bg.jpg")
                    },
                    {
                        url:require("../../../../assets/images/login_bg.jpg")
                    },
                    {
                        url:require("../../../../assets/images/login_bg.jpg")
                    }
                ]
            }
        },
        methods:{
            del(index){
                this.$emit("delteCom",index)
            },
            bannerEdit(index){
                this.$emit("showBannerEdit",index)
                this.$store.dispatch("setIndex",index);
            }
        }
    }
</script>
<style scoped lang="scss">
    .add-notice{
        // line-height: 187px;
        padding-top: 50px;
        height: 187px;
        text-align: center;
        font-size: 16px;
        background: #cccccc
    }
    .ivu-carousel-active{
        padding: 4px;
    }
</style>
