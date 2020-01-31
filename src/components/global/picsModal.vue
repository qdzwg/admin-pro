<template>
  <div>
    <Modal width="800" class="img-modal" v-model="modalShow" :title="title" @on-cancel="cancel">
      <div class="clearfix" style="margin-bottom:10px;">
        <pics-select v-if='imgList.length<=49' @returnDataURL="getUrls">
          <Icon type="plus-round" color="#1a8fe0" size="16"></Icon>
          <span style="color:#1a8fe0;font-size:14px">批量上传图片</span>
        </pics-select>

        <Button v-if="!sortFlag" class="fr" @click="sortFlag=true">退出排序</Button>
        <Button v-if="sortFlag" class="fr" @click="sortFlag=false">点击排序</Button>
        <Button
          style="margin-right:10px;"
          v-if="!sortFlag"
          @click="sort"
          :loading="btnLoading"
          class="fr"
          type="primary"
        >保存排序</Button>
        <span style="margin-right:10px;font-size:14px;" class="fr" v-if="!sortFlag">
            直接拖动图片可调整顺序，第一张为封面图
        </span>
      </div>

      <div class="img-list" v-if='imgList.length'>
        <draggable
          :list="imgList"
          :options="{animation:150,disabled:sortFlag}"
          :no-transition-on-drag="true"
        >
          <div class="img-item" v-for="(item,index) in imgList" :key="index">
            <div class="img-item-box">
              <span v-if="index==0" class="main-img">主图</span>
              <img class="img" :src="item.imgUrl+'?imageMogr2/thumbnail/640x/strip/quality/50'" alt>
              <div class="img-item-cover">
                <div @click.stop="imgDel(item.id,index)" class="del-box" style="display:inline-block">
                  <Icon type="trash-a" size="18" color="#fff"></Icon>
                  <span class="text">删除</span>
                </div>
              </div>
            </div>
          </div>
        </draggable>
      </div>
      <div style="margin-top:10px">{{title}}最大不超过10M，建议图片长高比16：9；图片大小750*422以上，请保证图片的无水印、高质量、合法性。</div>
      <div slot="footer"></div>
    </Modal>
    <Modal width="250" class="img-modal" v-model="delteModalShow" title="提示消息">
      <div>确认删除吗？</div>
      <div slot="footer">
          <Button @click="delteModalShow=false">取消</Button>
          <Button type="primary" @click="deletImg">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import axios from "axios";
import picsSelect from "./picsSelect";
import { apiPost, apiGet, apiPostJson } from "@/fetch/api";
import confirm from "@/components/global/confirm";
export default {
  props: {
    imgType: {
      type: String,
      default: "hotel"
    },
    title: {
      type: String,
      default:'酒店风光'
    },
    coute:{
        type: String,
      default:'edit'
    }
  },
  data() {
    return {
      btnLoading: false,
      delteModalShow: false,
      modalShow: false,
      sortFlag: true,
      imgList: [],
      imgarr:[],
      xindex:0,
      deleteImgIndex:"",
      deleteImgId:''
    };
  },
  components: {
    picsSelect,
    draggable
  },
  created() {
    // this.getImgList();
  },
  methods: {
      cancel(){
          this.modalShow=false
          this.imgList=[]
        //   this.imgarr=[]
        //   this.xindex=[]
      },
    sort() {
      let arr = [];
      this.imgList.forEach((item, index) => {
        arr.push({ id: item.id, sort: index });
      });
      if(this.coute=='edit'){
           apiPostJson(
        "/pmsproduct/api/pmsImg/updatePmsImgSort?mainUserId=" +
          this.$route.query.mainUserId,
        {
          pmsImgSortList: arr
        }
      ).then(res => {
        if (res.status == 200 || res.success) {
          this.$Message.success("排序成功");

          this.getImgList();
        }
      });
      }else{
        this.$emit("getImg", this.imgList);
        this.$Message.success("排序成功");  
      }
     
    },
    show(id) {
      this.typeId = id
      this.sortFlag = true;
      this.modalShow = true;
      console.log(this.coute)
      if(this.coute=='edit'){
         this.getImgList(); 
      }else{
           this.imgList=this.imgarr
      }
      
    },
    deletImg() {
        if(this.coute=='edit'){
          apiPost("/pmsproduct/api/pmsImg/deletePmsImg", {
        ids: this.deleteImgId,
        mainUserId: this.$route.query.mainUserId
      }).then(res => {
        this.$Message.success("删除成功");
        this.delteModalShow = false;
        this.getImgList();
      });  
        }else{
            this.imgList.splice(this.deleteImgIndex,1)
            this.$Message.success("删除成功");
        this.delteModalShow = false;
        this.$emit("getImg", this.imgList.length?this.imgList:[]);
        }
      
    },
    imgDel(id,i) {
      this.delteModalShow = true;
      this.deleteImgId = id;
      this.deleteImgIndex = i;
    },
    getImgList() {
      apiPost("/pmsproduct/api/pmsImg/queryPmsImg", {
        pmsId: this.imgType=='hotel_type'?this.typeId:this.$route.query.id,
        mainUserId: this.$route.query.mainUserId,
        type: this.imgType
      }).then(res => {
        this.imgList = res.data;
        if(res.data&&res.data.length){
          this.$emit("getImg", res.data[0]);
        }else{
             this.$emit("getImg", []);
        } 
        
        // if (!this.sortFlag) {
        //   this.$emit("getImg", res.data[0]);
        //   // this.modalShow = false;
        //   //  this.sortFlag = true
        // }
      });
    },
    getUrls(arr) {
      // console.log(arr);
      let apiArr = [];
      arr.forEach(item => {
        let base64 = item.replace(/^(data:\s*image\/(\w+);base64,)/, "");
        apiArr.push(
          axios({
            method: "POST",
            url: "/admin/api/ui/uplodeBase64",
            data: base64,
            headers: {
              "content-type": "application/json"
            }
            // baseURL: process.env.NODE_ENV !== "production" ? baseUrl : ""
          })
        );
      });
      axios.all(apiArr).then(resArr => {
        // console.log(resArr);
        let imgLength = this.imgList.length+resArr.length
        if(imgLength>50){
          this.$Message.warning("至多还能上传"+(50-this.imgList.length)+"张图片")
          return false
        }
        let objArr = resArr.map(item => {
          return item.data.message;
        });
        if(this.coute=='edit'){
            apiPostJson(
          "/pmsproduct/api/pmsImg/savePmsImg?mainUserId=" +
            this.$route.query.mainUserId +
            "&type=" +
            this.imgType +
            "&pmsId=" +
            (this.imgType=='hotel_type'?this.typeId:this.$route.query.id),
          {
            imgUrlList: objArr
          }
        ).then(res => {
          this.$Loading.finish();
          this.getImgList();
        });
        }else{
            // console.log(objArr)
             if(objArr.length==1){
                 this.xindex++
                  objArr.forEach((item,index)=>{
                  this.imgarr.push({
                     type:this.imgType,
                     sort:this.xindex,
                     id:this.xindex,
                     imgUrl:item 
             })
             })
             }else{
                objArr.forEach((item,index)=>{
                  this.imgarr.push({
                     type:this.imgType,
                     sort:index+1,
                     id:index+1,
                     imgUrl:item 
             })
             })  
             }
            //  let imgarr=[]
            console.log(this.imgarr)
             this.$emit("getImg", this.imgarr);
             this.imgList =this.imgarr
            
        }
        
      });
    }
  }
};
</script>
<style lang='scss'>
.img-modal {
  .ivu-modal-wrap {
    .img-up {
      cursor: pointer;
      display: inline-block;
      padding: 5px 0;
    }
    .img-list {
      max-height: 392px;
      min-height: 100px;
      overflow-y: auto;
      .img-item {
        width: 20%;
        display: inline-block;
        height: 130px;
        padding: 5px;
        .img-item-box {
          height: 100%;
          width: 100%;
          position: relative;
          .main-img {
            position: absolute;
            left: 0;
            top: 0;
            background: red;
            color: #fff;
            font-size: 14px;
            padding: 2px 5px;
          }
          .img-item-cover {
            display: none;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 28px;
            line-height: 28px;
            background: rgba(0, 0, 0, 0.5);
            text-align: right;
            .del-box {
              cursor: pointer;
              .text {
                font-size: 16px;
                color: #fff;
                margin-right: 5px;
              }
              .ivu-icon-trash-a {
              }
            }
          }
          img.img {
            height: 100%;
            width: 100%;
          }
          &:hover {
            .img-item-cover {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>

