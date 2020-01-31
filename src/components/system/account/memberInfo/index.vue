<<<<<<< HEAD
<template>
    <div>fvbdfbdfbd</div>
</template>
=======
<template>
<div style="width:100%; height:100%; position:relative">
	<Form class="form_class" :model="formItem" label-position="right" :label-width="100" ref="refObj">
		<FormItem label="用户名 ：">
			<div class="div_class">{{formItem.accName || '--'}}</div>
		</FormItem>
		<FormItem label="用户姓名 ：">
			<div class="div_class">{{formItem.realName || '--'}}</div>
		</FormItem>
		<FormItem label="手机号 ：">
			<div class="div_class">{{formItem.accName || '--'}}</div>
		</FormItem>
		<FormItem label="归属景区 ：">
			<div class="div_class">{{formItem.parkName || '--'}}</div>
		</FormItem>
		<FormItem label="部门 ：">
			<div class="div_class">{{formItem.department || '--'}}</div>
		</FormItem>
		<FormItem label="归属商户 ：">
			<div class="div_class">{{formItem.mchName || '--'}}</div>
		</FormItem>
	</Form>
</div>
</template>

<script>
export default {
	data(){
		return {
			formItem:{}
		}
	},
	mounted:function(){
		this.apiGet('/admin/webapi/userInfoPwd/view').then(data=>{
			if(data.success){
				this.formItem=data.userInfo;
				if(data.mchInfo)this.formItem.mchName=data.mchInfo.mchName;
			}else{
				this.$Message.warning('基本信息获取失败!');
			};
		}).catch(err=>{
			this.$Message.warning('基本信息获取失败!');
		});
	}
}
</script>

<style scoped>
.form_class {width:460px; position:absolute; left:calc(50% - 230px); top:50px;}
.div_class {width:280px; padding-left:10px; padding-right:10px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; border-radius:3px; background:#F5F5F5;}
</style>
>>>>>>> sc-um
