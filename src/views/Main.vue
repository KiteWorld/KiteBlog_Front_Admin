<template>
  <div class="main-container">
    <div class="main">
      <div class="left" v-show="isCollapse" @click.stop="">
        <el-scrollbar style="height: 100%">
          <el-menu
            class="left-menu"
            default-active="/dashboard"
            background-color="#fff"
            v-if="routerList.length > 0"
          >
            <sidemenu-Item
              v-for="(item, index) in routerList"
              :key="index"
              :item="item"
            ></sidemenu-Item>
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
          <el-popover
            placement="bottom"
            trigger="click"
            popper-class="logout-container"
          >
            <a class="click-item" @click="logout">退出</a>
            <span slot="reference" class="username">{{ userName }}</span>
          </el-popover>
        </div>
        <tags-view />
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import TagsView from "@/components/TagsView";
import SidemenuItem from "@/components/SidemenuItem";

export default {
  name: "Main",
  components: {
    TagsView,
    SidemenuItem,
  },
  data() {
    return {
      userName: null,
      isCollapse: true,
    };
  },
  async created() {
    this.userName = Cookies.get("name");
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    },
    routerList() {
      return this.$store.state.permission.routerList;
    },
  },
  methods: {
    // toPath(view) {
    //   this.$store.dispatch("tagsView/addVisitedView", view);
    // },
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
        justify-content: space-between;
        height: 50px;
        box-shadow: 0 0 10px rgb(211, 211, 211);
        .collapse-icon-container {
          cursor: pointer;
          font-size: 22px;
          margin-left: 10px;
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
