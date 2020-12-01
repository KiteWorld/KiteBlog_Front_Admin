<template>
  <div class="container">
    <div class="login-form-container">
      <img src="../assets/logo.png" alt="" class="logo" />
      <el-form
        :model="loginForm"
        ref="form"
        :rules="rules"
        label-width="100px"
        :inline="false"
        size="small"
        class="login-form"
      >
        <el-form-item label="UserName：" prop="name">
          <el-input v-model="loginForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="Password：" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { adminLogin } from "../api/api";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        name: null,
        password: null,
      },
      rules: {
        name: [
          {
            required: true,
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          let res = await adminLogin(this.loginForm);
          if (res.code !== 0) {
            this.$message.error(res.msg);
          } else {
            Cookies.set("token", res.data.token);
            Cookies.set("name", res.data.name);

            this.$router.push({ name: "Main" });
          }
        }
      });
    },
    reset() {
      this.loginForm.name = null;
      this.loginForm.password = null;
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form-container {
    position: relative;
    display: flex;
    justify-content: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgb(196, 196, 196);
    width: 300px;
    height: 180px;
    padding: 20px;
    .logo {
      position: absolute;
      top: 0;
      background-color: rgba(255, 255, 255, 0.823);
      transform: translateY(-60%);
      width: 110px;
      height: 110px;
      border-radius: 50%;
      box-shadow: 0px 0px 10px rgb(196, 196, 196);
    }
    .login-form {
      margin-top: 50px;
    }
  }
}
</style>