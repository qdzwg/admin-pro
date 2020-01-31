<template>
  <div>    
    <Row :gutter="16" class="btn-groups">
  
      <Col span="3">
        <Button type="primary" icon="android-add" @click="batchImport">批量导入</Button>
      </Col>
      <Col span="3">
        <Button type="error" icon="android-delete" @click="delAll">批量删除</Button>
      </Col>
      <Col span="3">
        <Button type="primary" icon="android-done" @click="downloadTemplate">导入模板下载</Button>
      </Col>      
    </Row>
    <scsForm :search-list='parkList'></scsForm>
    <gridTable ref="gridTable" :params="params" :columns="columns" :data="data" :url="url"></gridTable>
    <confirm ref="confirmModel" :mode="mode" :content="content" :sucessMsg="sucessMsg"></confirm>

  <Modal v-model="uploadModal" width="500" title="批量导入">
    <Form :model="uploadForm"
            label-position="right"
            ref="uploadForm"
            :rules="ruleUploadForm"
            :label-width="130">
        <FormItem label="景区名称:" required>
          <Select v-model="uploadForm.parkId" style="width:180px" placeholder="请选择景区名称">
              <Option v-for="(item, index) in parkList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem  label="演出日期：" required>
            <DatePicker type="date" @on-change="showDateSet" :value="nowTime"  placeholder="请选择演出日期" style="width: 150px"></DatePicker>
        </FormItem>
        <FormItem label="导入文件:" required>
          <Upload 
            :show-upload-list="false"   
            :before-upload="handleBeforeUpload"         
            :on-success="handleSuccess"
            :on-error="handleError"
            :format="['xlsx','xls']"
            :max-size="3072"
            :on-exceeded-size="handleMaxSize"
            action="/product/api/programmeApi/uploadExcel"
           >
            <a href="javascript:void(0);" v-if="fileName">{{fileName}}</a>
            <a href="javascript:void(0);" v-else class="choose-file">选择</a>            
        </Upload>
        </FormItem>
      </Form>
    <div slot="footer"
           style="text-align:center">
        <Button type="error"
                @click="realImport('uploadForm')">提交</Button>
        <Button type="ghost"
                @click="uploadCancel">取消</Button>
      </div>
  </Modal>
  </div>
</template>
<script>
import scsForm from '@/components/global/scsForm'
import gridTable from '@/components/global/gridTable'
import confirm from '@/components/global/confirm'
import QRcode from '@xkeshi/vue-qrcode'
export default {
  data () {
    return {
      nowTime:(new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
      parkList: [],
      uploadModal: false,
      mode:"",
      content:"",
      sucessMsg:'',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '景区名称',
          key: 'parkName'
        },
        {
          title: '演出日期',
          key: 'showDate'
        },
        {
          title: '演出时间',
          key: 'showTime'
        },
        {
          title: '节目',
          key: 'name'          
        },
        {
          title: '地点',
          key: 'address'         
        },
        {
          title: '标签',
          key: 'label'         
        },
        {
          title: '导入人',
          key: 'createBy'         
        },
        {
          title: '导入时间',
          key: 'createTime'         
        },
        {
          title: '操作',
          key: 'action',
          width:250,
          align: 'center',
          render: (h, params) => {
            const actions = [{
              title: '删除',
              action: () => {
                this.del(params.row.id)
              }
            }]
            return this.common.columnsHandle(h, actions)
          }
        }
      ],
      data: '',
      params: {page: 1, limit: 10},
      url: '/product/api/programmeApi/grid',
      fileName: '',
      canSubmit: false,
      codeUrl: '', // 二维码图片
      qrcodeUrl: '', // 生成二维码地址
      copyUrl: '', // 短链接
      copyLongUrl: '', // 长链接
      preLookModal: false, // 显示预览
      marketModal: false, // 显示全员营销
      marketTableModal: false, // 显示推广地址列表
      marketTableShow: false, // 是否替换已配置地址
      tableLoading: false, // 加载状态
      marketName: '',
      marketCode: '',      
      blurGet: false, // 排序是否请求接口
      delMarketModal: false, // 取消绑定

      uploadForm: {
        parkId: '',
        showDate: (new Date()).getFullYear()+"-"+((new Date()).getMonth()+1) + "-" +(new Date()).getDate(),
        excelKey: ''
      },
      ruleUploadForm: {
        parkId: [{ required: true, message: '请选择景区', trigger: 'blur' }]
      }
    }
  },
  components: {scsForm, gridTable, confirm, qrcode: QRcode},
  mounted () {
    this.apiGet('/product/api/programmeApi/list').then(res => {
      if(res.success){
        this.parkList = res.park;
      }
    })
  },
  methods: {
    delAll () {
      let arr = this.$refs.gridTable.selection.map(item => {
        return item.id
      })
      if (arr.length > 0) {
        this.del(arr)
      } else {
        this.$Message.warning('请选择删除项')
      }
    },
    handleBeforeUpload(e) {
      console.log(e.name)
      this.fileName = e.name
    },
    del (ids) {
      this.mode = 'done'
      this.content = '确认删除吗?'
      this.sucessMsg = '删除成功!'
      this.$refs.confirmModel.confirm(
        '/product/api/programmeApi/delete?id=' + ids
      )
    },
    //模板下载
    downloadTemplate() {
      window.location.href = '/product/api/programmeApi/download';    
    },
    //批量导入
    batchImport() {
      this.uploadModal = true;
    },
    realImport(name) {
      let flag = true
      if (!this.uploadForm.parkId || this.uploadForm.parkId == '') {
        this.$Message.warning('请选择景区名称！');
        flag = false;
        return;
      }else if(!this.uploadForm.showDate || this.uploadForm.showDate==''){
        this.$Message.warning('请选择演出日期！');
        flag = false;
        return;
      }else if(!this.uploadForm.excelKey || this.uploadForm.excelKey==''){
        this.$Message.warning('请上传导入文件！');
        flag = false;
        return;
      }
      if(flag&&this.canSubmit){
        this.apiPost('/product/api/programmeApi/saveExcel', this.uploadForm).then(res => {
          if(res.success){
            this.$Message.success('导入成功');
            this.$store.dispatch("postApi");
            this.uploadCancel();
          }else{
            this.$Message.warning('导入失败，请重新导入');
          }
        })
      }     
    },
    uploadCancel() {
      this.fileName='';
      this.uploadModal = false;
    },
    handleSuccess(res, file) {
      if (res.success) {
          this.$Message.success("上传成功")
          this.canSubmit = true;
          this.uploadForm.excelKey = res.excelKey          
      } else {
          this.$Message.warning("上传失败，请重新上传");
      }
    },
    handleError(err){
      this.fileName='';
      this.canSubmit = false;
      this.uploadForm.excelKey = '';  
      this.$Message.warning("上传失败，请重新上传");
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '上传的文件过大',
        desc: '文件  ' + file.name + ' 过大, 不能超过 2M'
      });
    },
    showDateSet(time) {
      this.uploadForm.showDate = time
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-file{
  color: #2d8cf0;
  display: block;
  border: 1px solid #2d8cf0;
  padding: 0 30px;
  border-radius: 5px;
  height: 28px;
  line-height: 28px;
}
</style>
