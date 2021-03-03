<template>
  <div class="container">
    <div class="login-form-container" @keyup.enter="submit">
      <div class="tip">
        <table>
          <tr>
            <th>角色</th>
            <th>账号</th>
            <th>密码</th>
          </tr>
          <tr>
            <td>超级管理员</td>
            <td>100000001</td>
            <td>123123</td>
          </tr>
          <tr>
            <td>普通管理员</td>
            <td>000001</td>
            <td>123123</td>
          </tr>
          <tr>
            <td>审核员</td>
            <td>000002</td>
            <td>123123</td>
          </tr>
          <tr>
            <td>编辑</td>
            <td>000003</td>
            <td>123123</td>
          </tr>
          <tr>
            <td>游客</td>
            <td>000004</td>
            <td>123123</td>
          </tr>
        </table>
      </div>
      <img src="@/assets/logo.png" alt="logo" class="logo" />
      <el-form
        :model="loginForm"
        ref="form"
        :rules="rules"
        label-width="80px"
        :inline="false"
        class="login-form"
      >
        <el-form-item label="工号：" prop="jobNo">
          <el-input v-model="loginForm.jobNo"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button type="primary" :plain="false" @click="submit"
          >登录</el-button
        >
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { adminLogin } from "@/api/api";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        jobNo: "100000001",
        password: "123123",
      },
      rules: {
        jobNo: [
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
        console.log(valid);
        if (!valid) {
          return;
        } else {
          let res = await adminLogin(this.loginForm);
          if (res.code !== 0) {
            this.$message.error(res.msg);
          } else {
            Cookies.set("token", res.data.token);
            Cookies.set("name", res.data.name);
            Cookies.set("userId", res.data.userId || "");
            Cookies.set("role", res.data.role);
            this.$router.replace({ path: "/" });
          }
        }
      });
    },
    reset() {
      this.loginForm.jobNo = "100000001";
      this.loginForm.password = "123123";
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgb(196, 196, 196);
    width: 300px;
    height: 200px;
    padding: 20px;
    .tip {
      position: absolute;
      bottom: -180px;
      line-height: 20px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0px 0px 10px rgb(196, 196, 196);
      padding: 10px;
      width: 100%;
      box-sizing: border-box;
      list-style: none;
      table {
        width: 100%;
        text-align: center;
      }
    }
    .logo {
      position: absolute;
      top: 0;
      background-color: #fff;
      transform: translateY(-60%);
      width: 110px;
      height: 110px;
      border-radius: 50%;
      box-shadow: 0px 0px 10px rgb(223, 223, 223);
    }
    .login-form {
      margin-top: 50px;
    }
  }
}
</style>