<template>
    <div>
    
        <!-- <button class="add" @click="add">test</button> -->
        <div class="banner-handler">
            <Button size="small" @click="del(index)" type="error">删除</Button>
            <Button size="small" @click="bannerEdit(index)" type="primary">编辑</Button>
        </div>
        <div class="list-banner">
            <div v-for="(item,index) in imgList" :key="index">
                <img class="list-banner-img" v-if='item.picAddr' :src="item.picAddr" alt="">
                <img class="list-banner-img" v-else src="../../../../assets/images/default.jpg" alt="">
            </div>
        </div>
        <!-- <template v-if="imgList.length">
             <Carousel autoplay>
                <CarouselItem v-for="(item,index) in imgList" :key="index">
                    <div class="demo-carousel">
                        <img :src="item.picAddr" alt="">
                    </div>
                </CarouselItem>
            </Carousel>
        </template> -->
       
        <div class="add-notice" v-if="!imgList.length">
            <div> 最多上传5张，建议尺寸640*110px</div>
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
                // console.log(this.data)
                return this.data
            }
        },
        // watch:{
        //     data(val){
        //         this.imgList.splice(0, this.imgList.length,val)   
        //     }
        // },
        data(){
            return {
                // imgList:[],
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
            // add(){
            //     this.imgList= [//默认图片
            //         {
            //             picAddr:require("../../../../assets/images/login_bg.jpg")
            //         },
            //         {
            //             upicAddrrl:require("../../../../assets/images/login_bg.jpg")
            //         },
            //         {
            //             picAddr:require("../../../../assets/images/login_bg.jpg")
            //         }
            //     ]
            // },
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
        padding-top:25px;
        height: 64px;
        text-align: center;
        font-size: 16px;
         background: #cccccc
    }
    .list-banner{
        .list-banner-img{
            height: 64px;
            width: 100%;
        }
    }
</style>
