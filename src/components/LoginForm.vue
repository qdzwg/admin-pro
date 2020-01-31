<template>
  <div class="login-main">
    <h3 class="login-title">宋城旅游后台管理系统</h3>
    <Form ref="formInline"
          :model="formInline"
          :rules="ruleInline"
          class="login-from">
      <FormItem prop="username">
        <Input type="text"
               v-model="formInline.username"
               placeholder="用户名">
        <Icon type="ios-person-outline"
              slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password"
               @on-enter="handleSubmit('formInline')"
               v-model="formInline.password"
               placeholder="密码">
        <Icon type="ios-locked-outline"
              slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="checkcode">
        <Row>
          <Col span="9">
          <Input type="text"
                 @on-enter="handleSubmit('formInline')"
                 v-model="formInline.checkcode"
                 placeholder="验证码"></Input>
          </Col>
          <Col span="9">
          <img :src=codeImg
               @click="getCode"
               class="code-img">
          </Col>
          <Col span="6">
          <a @click="getCode"
             href='javascript:;'>换一换</a>
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <Button type="primary" long @click="handleSubmit('formInline')">登录</Button>
        <div class="login-cz clearfix">
          <!-- <a href="" @click="goDhy('register')">立即注册</span>
          <span @click="goDhy('account')">账户验证</span>
          <span @click="goDhy('forgetPwd')">忘记密码</span> -->
          <a href="http://platform.zhiyoubao.com/platform/regSetName.htm" target="_blank" class="register">立即注册</a>
          <a href="http://platform.zhiyoubao.com/platform/pwdSetName.htm" target="_blank" class="forgetPwd">忘记密码</a>
          <a href="http://platform.zhiyoubao.com/platform/validAccnt.htm" target="_blank" class="account">账户验证</a>          
        </div>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Main from './main'
export default {
  data () {
    return {
      formInline: {
        username: '',
        password: '',
        checkcode: ''
      },
      codeImg: '',
      ruleInline: {
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }
        ],
        checkcode: [
          { required: true, message: '请填写验证码', trigger: 'blur' }
        ]
      }
    }
  },
  beforeCreate () {
    document.getElementsByTagName('body')[0].className = 'login-bg'
  },
  beforeDestroy () {
    document.body.removeAttribute('class', 'add_bg')
  },
  mounted () {
    this.getCode()
  },
  methods: {
    // ...actions([
    //   'setUserIdAction'
    // ]),
    // goDhy(way) {
    //   switch(way){
    //     case 'register': 

    //       break;
    //     case 'account': 
    //       break;
    //     case 'forgetPwd': 
    //       break;
    //   }
    // },
    getCode () {
      this.codeImg = '/admin/api/checkCode?rand=' + new Date().getTime()
    },
    handleSubmit (name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          // this.$Message.success('提交成功!')
          let res = await this.$store.dispatch('login', {
            url:
              this.$route.path === '/login'
                ? '/admin/storeMerchant/logining'
                : '/admin/logining',
            params: this.formInline
          })
          // console.log(res)
          if (res.success) {

            this.$cookies.set('xiaojingToken', "testToken123456")
            this.$cookies.set('userId', "userId24567")
            this.$cookies.set('sessionId', res.user.sessionId)
            this.$cookies.set('userName', res.user.realName)
            this.$cookies.set('accType', res.user.accType)
            this.$cookies.set('userInfoId', res.user.id)
            this.$cookies.set('isSuperAdmin', this.$route.path === '/login'?'':'1');
            
            this.$store.dispatch('setUserIdAction', 'userId24567')

            await this.$store.dispatch('getApi') // 获取权限
            await this.$store.dispatch('formaterRouterHandle') // 根据权限获取路由
            // console.log(this.$store.state.menu.asyncRouter);
            this.$router.addRoutes([
              {
                path: '/main',
                name: 'main',
                component: Main,
                children: [...this.$store.state.menu.asyncRouter]
              }
            ]) // 动态加载路由
            // this.formaterRouterHandle()
            this.$router.push(this.$store.state.menu.asyncRouter[0].path)

          } else {
            this.$Message.error(res.message)
          }
        }
      })
    }
  }
}
</script>
<style>
@import "../assets/styles/login.css";
/* .login-bg {
  width: 100%;
  height: 100%;
  background: url(../assets/images/login_bg);
} */
/* @import "../assets/styles/iconfont.css" */
.login-cz a{
  display: inline-block;
  vertical-align: middle;
  /* margin: 0 10px; */
  cursor: pointer;
  /* color: #495060; */
}
.login-cz a.register{
  float: left;
}
.login-cz a.forgetPwd,.login-cz a.account{
  float: right;
}
.login-cz a.account{
  margin-right: 10px;
}
</style>
