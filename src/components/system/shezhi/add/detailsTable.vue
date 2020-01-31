<template>
    <div class="newtable">
        <table v-if='detailsData.authType=="person"' border class="table" style="width:90%;margin:0 auto;">
            <tr>
                <td class="details-title">认证类型</td>
                <td>个人</td>
                <td class="details-title">用户类型</td>
                <td>{{detailsData.customType=='provider'?'供应商':(detailsData.customType=='travel'?'旅行社':(detailsData.customType?detailsData.customType:'供应商'))}}</td>
            </tr>
            <tr>
                <td class="details-title">姓名</td>
                <td>{{detailsData.name}}</td>
                <td class="details-title">身份证</td>
                <td>{{detailsData.certNo}}</td>
            </tr>
            <tr>
                <td class="details-title">身份证图片地址（正面）</td>
                <td><img :src="detailsData.certNoPositiveAddr" /></td>
                <td class="details-title">身份证图片地址（反面）</td>
                <td><img :src="detailsData.certNoReverseSideAddr" alt=""></td>
            </tr>
            <tr>
                <td class="details-title">手持身份证图片地址</td>
                <td><img :src="detailsData.certNoInHandAddr" alt=""></td>
                <td class="details-title">所属地区</td>
                <td>{{detailsData.areaName}}</td>
            </tr>
            <tr v-if='detailsData.customType=="travel"'>
                <td class="details-title">旅行社许可证</td>
                <td><img :src="detailsData.travelAddr" alt=""></td>
                <td class="details-title">旅行社许可证号码</td>
                <td>{{detailsData.travelNum}}</td>
            </tr>
            <tr v-if='detailsData.customType=="travel"'>
                <td class="details-title">旅行社类型</td>
                <td colspan="3">{{detailsData.travelType=='inland'?'国内社':(detailsData.travelType=='foreign'?'国际社':'')}}</td>
            </tr>
            <tr>
                <td class="details-title">审核状态</td>
                <td>{{detailsData.auditStatus|accountauditStatus}}</td>
                <td class="details-title">审核信息</td>
                <td>{{detailsData.auditMsg}}</td>
            </tr>
            <tr v-if='detailsData.auditStatus=="audit_success"'>
                <td class="details-title">推荐人</td>
                <td>{{detailsData.recommendName}}</td>
                <td class="details-title">景区名称</td>
                <td>{{detailsData.parkName}}</td>
            </tr>
            <tr>
                <td class="details-title">创建时间</td>
                <td colspan="3">{{detailsData.createTime}}</td>
            </tr>
        </table>
         <table v-if='detailsData.authType=="corp"' border class="table" style="width:90%;margin:0 auto;">
            <tr>
                <td class="details-title">认证类型</td>
                <td colspan="3" >企业</td>
            </tr>
            <tr>
                <td class="details-title">用户类型</td>
                <td>{{detailsData.customType=='provider'?'供应商':(detailsData.customType=='travel'?'旅行社':(detailsData.customType?detailsData.customType:'供应商'))}}</td>
                <td class="details-title">企业名称</td>
                <td>{{detailsData.corpName}}</td>
            </tr>
            <tr>
                <td class="details-title">法人</td>
                <td>{{detailsData.legalPerson}}</td>
                <td class="details-title">法人证件号</td>
                <td>{{detailsData.legalPersonCertNo}}</td>
            </tr>
            <tr>
                <td class="details-title">身份证图片地址（正面）</td>
                <td><img :src="detailsData.certNoPositiveAddr" /></td>
                <td class="details-title">身份证图片地址（反面）</td>
                <td><img :src="detailsData.certNoReverseSideAddr" alt=""></td>
            </tr>
            <tr>
                <td class="details-title">营业执照</td>
                <td><img :src="detailsData.businessLicenseAddr" alt=""></td>
                <td class="details-title">营业执照号</td>
                <td>{{detailsData.businessLicenseNo}}</td>
            </tr>
            <tr>
                <td class="details-title">联系人</td>
                <td>{{detailsData.contactPerson}}</td>
                <td class="details-title">邮箱</td>
                <td>{{detailsData.email}}</td>
            </tr>
            <tr>
                <td class="details-title">电话</td>
                <td>{{detailsData.phone}}</td>
                <td class="details-title">所属地区</td>
                <td>{{detailsData.areaName}}</td>
            </tr>
            <tr v-if='detailsData.customType=="travel"'>
                <td class="details-title">旅行社许可证</td>
                <td><img :src="detailsData.travelAddr" alt=""></td>
                <td class="details-title">旅行社许可证号码</td>
                <td>{{detailsData.travelNum}}</td>
            </tr>
            <tr v-if='detailsData.customType=="travel"'>
                <td class="details-title">旅行社类型</td>
                <td colspan="3">{{detailsData.travelType=='inland'?'国内社':(detailsData.travelType=='foreign'?'国际社':'')}}</td>
            </tr>
            <tr>
                <td class="details-title">审核状态</td>
                <td>{{detailsData.auditStatus|accountauditStatus}}</td>
                <td class="details-title">审核信息</td>
                <td>{{detailsData.auditMsg}}</td>
            </tr>
            <tr v-if='detailsData.auditStatus=="audit_success"'>
                <td class="details-title">推荐人</td>
                <td>{{detailsData.recommendName}}</td>
                <td class="details-title">景区名称</td>
                <td>{{detailsData.parkName}}</td>
            </tr>
            <tr>
                <td class="details-title">创建时间</td>
                <td colspan="3">{{detailsData.createTime}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    props:['detailsData']
}
</script>

