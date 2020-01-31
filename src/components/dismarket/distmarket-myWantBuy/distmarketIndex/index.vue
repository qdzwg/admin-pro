<template>
<div>
    <div class="indexTitle">
        <div @click="curChange('')" :class="params.goodsType?'':'cur'">首页</div>
        <div @click="curChange('park')" :class="params.goodsType=='park'?'cur':''"><Icon type="icon-jingdian"></Icon>景区</div>
        <div @click="curChange('hotel')" :class="params.goodsType=='hotel'?'cur':''"><Icon type="icon-icon-hotel"></Icon>酒店</div>
        <div @click="curChange('mdse')" :class="params.goodsType=='mdse'?'cur':''"><Icon type="icon-gouwuche1"></Icon>商品</div>
        <div @click="curChange('route')" :class="params.goodsType=='route'?'cur':''"><Icon type="icon-nav-tours"></Icon> 跟团游</div>
        <div @click="curChange('traffic')" :class="params.goodsType=='traffic'?'cur':''"><Icon type="icon-nav-tours"></Icon> 小交通</div>
    </div>
    <div class="indexBox">

        <!-- 轮播图 -->
        <div class="indexCarousel" v-if='!params.goodsType&&!indexSearch'>
            <Carousel
                :autoplay="setting.autoplay"
                :autoplay-speed="setting.autoplaySpeed"
                :dots="setting.dots"
                :radius-dot="setting.radiusDot"
                :trigger="setting.trigger"
                :arrow="setting.arrow">
                <CarouselItem @click="productDetail(item,'park')" v-for='(item,index) in res.dynamic' :key='index'>
                    <div class="demo-carousel">
                        <img style="width: 100%;height:100%;" :src="item.adImgUrl" alt="">
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
        <div class="search">
            <Input class="searchInput" v-model="params.goodsName"></Input>
            <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            <div class="sortList" v-if='params.goodsType||indexSearch'>
                <div class="sort" @click='sortBy("hot")'>
                    <span>人气</span>
                    <Icon :type="params.hot?'android-arrow-up':'android-arrow-down'"></Icon>
                </div>
                <div class="sort" @click='sortBy("newOrder")'>
                    <span>新品</span>
                    <Icon :type="params.newOrder?'android-arrow-up':'android-arrow-down'"></Icon>
                </div>
                <div class="sort" @click='sortBy("saleOrder")'>
                    <span>销量</span>
                    <Icon :type="params.saleOrder?'android-arrow-up':'android-arrow-down'"></Icon>
                </div>
                <div class="sort" @click='sortBy("priceOrder")'>
                    <span>价格</span>
                    <Icon :type="params.priceOrder?'android-arrow-up':'android-arrow-down'"></Icon>
                </div>
            </div>
        </div>
        <div class="indexContent" v-if='!params.goodsType&&!indexSearch'>
            <div class="section">
                <div class="sectionTitle">景区 / <span>SCENIC SPOT</span></div>
                <div class="items">
                    <div class="item" @click="productDetail(item,'park')" v-for='(item,index) in res.parks' :key='index'>
                        <div class="itemImg"><img :src="item.url" alt=""></div>
                        <div class="itemDes">
                            <div class="itemTitle">{{item.goodsName}}</div>
                            <div class="itemPrice">
                                <span>供货价</span><em>￥</em><span class="priceNum">{{item.price}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="sectionTitle">酒店 / <span>HOTLE WINESHOP</span></div>
                <div class="items">
                    <div class="item" @click="productDetail(item,'hotel')" v-for='(item,index) in res.hotels' :key='index'>
                        <div class="itemImg"><img :src="item.url" alt=""></div>
                        <div class="itemDes">
                            <div class="itemTitle">{{item.goodsName}}</div>
                            <div class="itemPrice">
                                <span>供货价</span><em>￥</em><span class="priceNum">{{item.price}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="sectionTitle">商品 / <span>MERCHANDISE</span></div>
                <div class="items">
                    <div class="item" @click="productDetail(item,'mdse')" v-for='(item,index) in res.mdses' :key='index'>
                        <div class="itemImg"><img :src="item.url" alt=""></div>
                        <div class="itemDes">
                            <div class="itemTitle">{{item.goodsName}}</div>
                            <div class="itemPrice">
                                <span>供货价</span><em>￥</em><span class="priceNum">{{item.price}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="sectionTitle">跟团游 / <span>PACKAGE TOUR</span></div>
                <div class="items">
                    <div class="item" @click="productDetail(item,'route')" v-for='(item,index) in res.routes' :key='index'>
                        <div class="itemImg"><img :src="item.url" alt=""></div>
                        <div class="itemDes">
                            <div class="itemTitle">{{item.goodsName}}</div>
                            <div class="itemPrice">
                                <span>供货价</span><em>￥</em><span class="priceNum">{{item.price}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="indexContent" v-else>
            <div class="section">
                <div class="items">
                    <div class="item" @click="productDetail(item,item.goodsType)" v-for='(item,index) in goodsList' :key='index'>
                        <div class="itemImg"><img :src="item.url" alt=""></div>
                        <div class="itemDes">
                            <div class="itemTitle">{{item.goodsName}}</div>
                            <div class="itemPrice">
                                <span>供货价</span><em>￥</em><span class="priceNum">{{item.price}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Page v-if='params.goodsType||indexSearch' :current='params.page' :page-size='params.size' :page-size-opts="[15]" @on-page-size-change="sizeChange" :total="res.total" class-name="pages" @on-change="changepage" show-elevator show-sizer></Page>
    </div>
    <div class="indexFoot">
        <p>技术支持：深大智能</p>
    </div>
</div>
</template>
<script>
import { apiGet, apiPost } from "@/fetch/api";
export default {
    data () {
        return {
            indexSearch: false,
            res: {
                total: 100
            },
            goodsList: [],
            params: {
                page: 1,
                size: 15,
                goodsType: '',
                goodsName: '',
                hot: false,
                newOrder: false,
                saleOrder: false,
                priceOrder: false,
            },
            setting: {
                loop: true,
                autoplay: true,
                autoplaySpeed: 3000,
                dots: 'inside',
                radiusDot: true,
                trigger: 'click',
                arrow: 'hover'
            },
        }
    },
    mounted () {
        this.indexList();
    },
    components: {
        
    },
    methods: {
        indexList() {
            apiGet("/distmarket/index/indexFl").then(res => {
                if(res.status==200){
                    this.res = res.data;
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        productDetail(item,type) {
            this.$router.push({path:'/productPage',query:{goodsCode:item.code||item.goodsCode,goodsType:this.params.goodsType||type}})
        },
        sizeChange(num) {
            this.params.size = num;
            this.search()
        },
        changepage(num) {
            this.params.page = num;
            this.search()
        },
        curChange(arg) {
            this.params.page = 1;
            this.params.goodsName = '';
            this.params.goodsType = arg;
            if(arg){
                this.search()
            }else{
                this.indexSearch = false;
            }
        },
        search() {
            if(!this.params.goodsType){
                this.indexSearch = true;
            }
            apiPost("/distmarket/index/pageFl",this.params).then(res => {
                if(res.status==200){
                    this.goodsList = res.data.products;
                    this.res.total = res.data.size;
                }else{
                    this.$Message.warning(res.message)
                }
            });
        },
        sortBy(arg) {
            if (!this.params[arg]) {
                this.params.hot = false;
                this.params.newOrder = false;
                this.params.saleOrder = false;
                this.params.priceOrder = false;
                this.params[arg] = !this.params[arg];
            } else {
                this.params.hot = false;
                this.params.newOrder = false;
                this.params.saleOrder = false;
                this.params.priceOrder = false;
            }
            this.search();
        }
    }
}
</script>
<style lang="scss" scoped>
.indexTitle {
    display: flex;
    padding: 8px 0px;
    line-height: 20px;
    font-size: 14px;
    color: #a7aab0;
    .cur {
        border-bottom: 2px solid #0188fb;
    }
    div {
        cursor: pointer;
        margin-right: 44px;
        &:hover {
            text-decoration: underline;
            color: #06c;
        }
    }
}
.indexBox {
    padding-top: 15px;
    padding-bottom: 15px;
    .indexCarousel {
        background: #f1f2f7;
    }
    .search {
        padding: 20px 30px;
        display: flex;
        background-color: #fff;
        .searchInput {
            width: 220px;
            margin-right: 10px;
        }
        .sortList {
            display: flex;
            margin-left: 10%;
            .sort {
                cursor: pointer;
                line-height: 30px;
                width: 72px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-right: 1px solid #eee;
            }
        }
    }
    .indexContent {
        padding: 0px 30px;
        background-color: #fff;
        .section {
            .sectionTitle {
                line-height: 25px;
                font-size: 14px;
                color: #333;
                span {
                    color: #c3c5c7;
                    font-size: 16px;
                }
            }
            .items {
                overflow: hidden;
                .item {
                    cursor: pointer;
                    width: 24%;
                    float: left;
                    margin-right: 1%;
                    margin-bottom: 15px;
                    &:hover {
                        .itemDes {
                            box-shadow: 0px 1px 9px rgba(0,0,0,0.1);
                        }
                    }
                    .itemImg {
                        height: 200px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .itemDes {
                        border: 1px solid #eee;
                        overflow: hidden;
                        padding: 10px;
                        .itemTitle {
                            font-size: 15px;
                            line-height: 22px;
                            color: #666;
                            margin-bottom: 7px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .itemPrice {
                            font-size: 12px;
                            color: #ff5b33;
                            line-height: 24px;
                            em {
                                font-style: normal;
                                margin-left: 10px;
                                margin-right: 8px;
                            }
                            .priceNum {
                                font-size: 16px;
                            }
                        }
                    }
                }
            }
        }
    }
}
.indexFoot {
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #e0e0e3;
    font-size: 12px;
    color: #666666;
}
</style>