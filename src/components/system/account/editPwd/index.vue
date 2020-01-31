<<<<<<< HEAD
<template>
    <div>vsdvsvsd</div>
</template>
=======
<template>
<div style="width:100%; height:100%; position:relative">
	<Form class="form_class" :model="formItem" label-position="right" :label-width="100" ref="refObj" :rules="ruleForm">
		<FormItem label="原密码 ：" prop="oldpass">
			<Input v-model="formItem.oldpass" placeholder="填写原密码" style="width: 300px;" type="password"></Input>
		</FormItem>
		<FormItem label="新密码 ：" prop="newpass">
			<Input v-model="formItem.newpass" placeholder="填写新密码" style="width: 300px;" type="password"></Input>
		</FormItem>
		<FormItem label="确认新密码 ：" prop="newpass_repeat">
			<Input v-model="formItem.newpass_repeat" placeholder="请确认新密码" style="width: 300px;" type="password"></Input>
		</FormItem>
		<Button class="btn_class" type="primary" @click="submit">保存</Button>
	</Form>
</div>
</template>

<script>
export default {
	data(){
		return {
			formItem:{
				oldpass:'',
				newpass:'',
				newpass_repeat:''
			},
			ruleForm: {
				oldpass: [
					{ required: true, message: "原密码不能为空!", trigger: "blur" }
				],
				newpass: [
					{ required: true, message: "新密码不能为空!", trigger: "blur" }
				],
				newpass_repeat: [
					{ required: true, message: "确认密码不能为空!", trigger: "blur" }
				]
			}
		}
	},
	methods:{
		submit(){
			this.$refs.refObj.validate(async valid => {
				if(valid){
					if(this.formItem.newpass_repeat!=this.formItem.newpass){
						this.$Message.warning('两次新密码不一致!');
						return;
					}
					this.apiPost('/admin/webapi/userInfoPwd/changpwd', {oldpass:this.formItem.oldpass, newpass:this.formItem.newpass}).then(data=>{
						if(data.success){
							this.$Message.success('修改成功!');
							this.formItem={
								oldpass:'',
								newpass:'',
								newpass_repeat:''
							};
						}else{
							this.$Message.warning(data.message);
						};
					}).catch(err=>{
						this.$Message.warning('密码修改失败!');
					});
				}
			});
		}
	}
}
</script>

<style scoped>
.form_class {width:460px; position:absolute; left:calc(50% - 230px); top:50px;}
.btn_class {width:260px; position:relative; left:50%; transform:translate(-50%, 0); margin-top:20px;}
</style>
>>>>>>> sc-um
