<template>
  <div class="main-container">
    <div class="main">
      <div class="left" v-show="isCollapse" @click.stop="">
        <el-scrollbar style="height: 100%">
          <el-menu
            class="left-menu"
            default-active="dashboard"
            @open="handleOpen"
            @close="handleClose"
            background-color="#fff"
            router
          >
            <el-menu-item index="dashboard">
              <i class="el-icon-setting"></i>
              <span slot="title">Dashboard</span>
            </el-menu-item>
            <el-submenu index="article">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>文章管理</span>
              </template>
              <el-menu-item index="article">文章列表</el-menu-item>
              <el-menu-item index="articleconfig">文章相关配置</el-menu-item>
            </el-submenu>
            <!-- <el-menu-item index="article">
              <i class="el-icon-menu"></i>
              <span slot="title">文章管理</span>
            </el-menu-item> -->
            <el-menu-item index="User">
              <i class="el-icon-document"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-submenu index="ArticleCategory">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>分类管理</span>
              </template>
              <el-menu-item index="ArticleCategory">文章分类</el-menu-item>
              <el-menu-item index="HotPointcategory">沸点分类</el-menu-item>
            </el-submenu>
            <el-menu-item index="hotPoint">
              <i class="el-icon-document"></i>
              <span slot="title">沸点管理</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="right" ref="right">
        <div class="header">
          <div class="collapse-icon-container">
            <i
              class="el-icon-s-fold"
              @click="isCollapse = false"
              v-show="isCollapse"
            ></i>
            <i
              class="el-icon-s-unfold"
              @click="isCollapse = true"
              v-show="!isCollapse"
            ></i>
          </div>
          <div class="history-record-tags"></div>
          <el-popover
            placement="bottom"
            trigger="click"
            popper-class="logout-container"
          >
            <a class="click-item" @click="logout">退出</a>
            <span slot="reference" class="username">{{ userName }}</span>
          </el-popover>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Cookies from "js-cookie";
export default {
  name: "Main",
  components: {},
  data() {
    return {
      userName: null,
      isCollapse: true,
    };
  },
  created() {
    this.userName = Cookies.get("name");
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    logout() {
      Cookies.remove("name");
      Cookies.remove("token");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .main {
    height: 100%;
    width: 100%;
    display: flex;
    .left {
      overflow: hidden;
      height: 100%;
      width: 220px;
      box-shadow: 0 0 10px rgb(211, 211, 211);
      /deep/ .left-menu {
        overflow: hidden;
        border-right: none;
      }
      /deep/.el-scrollbar__wrap {
        // overflow: auto;
        overflow-x: hidden !important;
      }
    }
    .right {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .header {
        display: flex;
        align-items: center;
        height: 50px;
        box-shadow: 0 0 10px rgb(211, 211, 211);
        .collapse-icon-container {
          cursor: pointer;
          font-size: 22px;
          margin-left: 10px;
        }
        .history-record-tags {
          flex: 1;
          overflow: hidden;
          border-right: 1px solid #eee;
          height: 50px;
        }
        .username {
          font-size: 12px;
          padding: 10px;
          color: gray;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }
}
/deep/.el-menu {
  margin: 0;
}
.el-menu-item {
  &:hover {
    background-color: #f1f1f1 !important;
    color: #409eff;
    i {
      color: #409eff;
    }
  }
}
.el-menu-item.is-active {
  background-color: #f1f1f1 !important;
}
</style>
