<template>
  <div class="login_container">
    <div class='login_box'>
        <div class="avater-box">
          <!-- 头像 -->
          <img src="../assets/logo.png" alt="">
        </div>
          <!-- 登录表单 rules 添加验证规则对象 ref="loginForRef" 定义表单的引用
            通过 loginForRef 后去表单实例
          -->
        <el-form ref="loginForRef" :model="loginForm" label-width="0px" :rules="loginFormRules" class="login_form">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item prop='password'>
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
          </el-form-item>
          <!-- 表达按钮 -->
          <el-form-item class="btns">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button @click="resetLoginForm" type="info">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        // 验证规则组合的名称, trigger: 'blur' 文本框失去焦点的是触发验证
        username: [
          { required: true, message: '请输入登录用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '请输入 3 到 10 长度的用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '请输入 6 到 15 长度的密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // element-ui 方法，重置表单
      this.$refs.loginForRef.resetFields()
    },
    login () {
      // 点击 login 之后在所有的校验 rule 结束之后调用 validate 方法，这里 valid 的值就是之前rule 校验是否全部通过标志
      this.$refs.loginForRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message({
            message: '登录失败!',
            type: 'error'
          })
        }

        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        console.log(res)
        // 编程式导航跳转到后台主页，路由地址 /home
        this.$router.push('home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
  background-color: #fff;
  height: 300px;
  width: 450px;
  // 圆角
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  // 位移，横轴和纵轴各偏移50%
  transform: translate(-50%, -50%);

  .avater-box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%; // 图像边框加圆圈
      padding: 8px; // 图像和边框添加间距
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #eee;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%; // 图像加圆圈
        background-color: #eee;
      }
  }
}
</style>
