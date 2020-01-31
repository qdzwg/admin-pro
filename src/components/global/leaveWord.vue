<template>
    <div>
        <template v-if="leaveWordArr.length">
          <Row :gutter="16"
               style="width:55%; margin-bottom:24px;"
               v-for="(item,index) in leaveWordArr"
               :key="index">
            <Col span="6">
                <FormItem :prop="'leaveArr.' + index + '.title'" :rules="{required: true, message: '请填写留言标题', trigger: 'blur'}">
                    <Input v-model="item.title" placeholder="请输入留言标题" :maxlength="8"></Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem :prop="'leaveArr.' + index + '.type'" :rules="{required: true, message: '请选择留言类型', trigger: 'change'}">
                    <Select v-model="item.type" placeholder="请选择留言类型" @on-change="typeChange($event,index)">
                        <Option v-for="sitem in leaveType" :value="sitem.value" :key="sitem.value">{{sitem.key}}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem>
                    <Input v-model="item.tips" placeholder="请输入提示语" :maxlength="12"></Input>
                </FormItem>
            </Col>
            <Col span="6">
                <FormItem>
                    <Checkbox v-model="item.isRequired">必填</Checkbox>
                    <Button type="ghost" icon="minus-round"  style="margin-left:2%;"  @click="delPlugins(index)"></Button>
                    <Button type="info"  icon="plus"  style="margin-left:2%;" v-if="index===leaveArr.length-1&&index<4" @click="addPlugins"></Button>
                </FormItem>
            </Col>
          </Row>
        </template>
        <Button type="info" icon="plus" v-else @click="addPlugins"></Button>
    </div>
</template>
<script>
import { apiGet } from '@/fetch/api'
export default {
    data() {
        return {
            leaveWordArr: this.leaveArr,
            leaveType: []
        }
    },
    props: ['leaveArr'],
    watch:{

    },
    computed: {

    },
    methods: {
        typeChange (value, index) {
            this.leaveWordArr[index].name = value
        },
        addPlugins() {
            this.leaveWordArr.push({
                title: '',
                type: '',
                tips: '',
                name: '',
                isRequired: false
            })
        },
        delPlugins (index) {
            this.leaveWordArr.splice(index, 1)
        }
    },
    mounted() {
        apiGet('/admin/api/sysParam/changeList?key=leaveType').then(res => {
            if (res.status === 200) {
                this.leaveType = res.data;
            } else {
                this.$Message.warning(res.message)
            }
        })
    }
}
</script>