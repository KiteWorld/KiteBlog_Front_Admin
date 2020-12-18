<template>
  <div class="search-container">
    <div
      class="search-input-container"
      ref="messageDrop"
      @keyup.enter="onSearch"
      @mouseenter="showDropdown = true"
      @click.stop=""
    >
      <!-- @click.stop 阻止冒泡 -->
      <div class="search-main">
        <slot name="main"></slot>
      </div>
      <transition name="bounce">
        <div class="dropdown" v-show="showDropdown">
          <div class="search-item-container">
            <slot name="sub"></slot>
          </div>
        </div>
      </transition>
    </div>
    <el-button-group style="margin-left: 4px">
      <el-button type="primary" size="small" @click="onSearch">搜索</el-button>
      <el-button size="small" @click="onReset">重置</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  props: {},
  data() {
    return {
      test: null,
      visible: false,
      trigger: "hover",
      showDropdown: false,
    };
  },
  mounted() {
    document.onclick = () => {
      this.showDropdown = false;
    };
  },
  methods: {
    onSearch() {
      this.$emit("onSearch");
    },
    onReset() {
      this.$emit("onReset");
    },
    visibleChange() {
      // console.log(this.$refs.messageDrop);
      // this.$refs.messageDrop.triggerElm.removeEventListener(
      //   "mouseleave",
      //   () => {
      //     this.$refs.messageDrop.hide();
      //   },
      //   false
      // );
    },
  },
};
</script>

<style lang="less">
.search-container {
  display: flex;
  justify-content: flex-end;
  .search-input-container {
    position: relative;
    .search-main {
      width: 330px;
    }
    .dropdown {
      position: absolute;
      padding: 10px;
      margin-top: 10px;
      border-radius: 4px;
      box-shadow: 0 0 10px rgb(221, 221, 221);
      background-color: #fff;
      z-index: 999;
      overflow: hidden;
      &::before {
        content: "";
        top: -8px;
        position: absolute;
        border-right: 8px solid transparent;
        border-left: 8px solid transparent;
        border-bottom: 8px solid #fff;
        border-radius: 4px;
        transform: translateX(-50%);
        left: 50%;
      }
    }
  }
}
.search-item-container {
  padding: 0 10px;
  .search-item {
    margin: 5px 0;
    display: flex;
    align-items: center;
    .search-label {
      font-size: 13px;
      width: 100px;
      color: #606266;
    }
  }
}
.bounce-enter-active,
.bounce-leave-active {
  transition: all 0.05s ease;
}
.bounce-enter-to,
.bounce-leave {
  height: 100%;
}
.bounce-enter,
.bounce-leave-to {
  height: 0%;
}
</style>