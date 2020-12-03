<template>
  <div class="search-container">
    <el-dropdown
      ref="messageDrop"
      trigger="click"
      @keyup.enter.native="onSearch"
      @mouseenter.native="$refs.messageDrop.show()"
    >
      <div class="search-main">
        <slot name="main"></slot>
      </div>
      <el-dropdown-menu slot="dropdown">
        <div class="search-item-container">
          <slot name="sub"></slot>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
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
    };
  },
  mounted() {
    // this.$refs.messageDrop.show();
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
  .search-main {
    width: 330px;
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
</style>