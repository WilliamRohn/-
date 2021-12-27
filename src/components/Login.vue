<template>
  <div id="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="login_avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="formLabelAlign"
        :rules="login_rules"
        ref="loginForm"
        hide-required-asterisk
      >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="formLabelAlign.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            v-model="formLabelAlign.password"
            type="password"
          ></el-input>
        </el-form-item>
        <div class="btn">
          <el-button type="success" @click="login_">登录</el-button>
          <el-button type="info" @click="login_reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      labelPosition: "right",
      formLabelAlign: {
        username: "admin",
        password: "123456",
      },
      login_rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 8,
            message: "长度在 5 到 8 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //登录按钮：先验证再请求登录
    login_() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return;
        const {
          data: { data, meta },
        } = await this.$http.post("login", this.formLabelAlign);
        if (meta.status !== 200) return this.$message.error(meta.msg);
        //登录成功后提示信息、存token、跳转
        this.$message.success({
          message: meta.msg,
          offset: 80,
          duration: 1000,
          onClose: () => {
            window.sessionStorage.setItem("token", data.token);
            this.$router.push("/home");
          },
        });
      });
    },
    //重置按钮
    login_reset() {
      this.$refs.loginForm.resetFields();
    },
  },
  mounted() {},
  components: {},
};
</script>

<style scoped lang="less">
#login_container {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .login_avatar {
      position: absolute;
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      > img {
        height: 100%;
        width: 100%;
        background-color: #eee;
        border-radius: 50%;
      }
    }
    .el-form {
      position: absolute;
      width: 80%;
      top: 50%;
      left: 50%;
      margin: 30px auto;
      transform: translate(-50%, -50%);
      .el-form-item__label {
        text-align: center !important;
      }
      .btn {
        text-align: center;
        margin-bottom: 10px;
        .el-button--success {
          background-color: #41b883;
          border-color: #41b883;
        }
      }
    }
  }
}
</style>
