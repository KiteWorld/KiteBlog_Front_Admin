<template>
  <div class="search-container">
    <el-dropdown>
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
      <el-button type="primary" size="default" @click="onSearch"
        >搜索</el-button
      >
      <el-button size="default" @click="onReset">重置</el-button>
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
    };
  },
  methods: {
    onSearch() {
      this.$emit("onSearch");
    },
    onReset() {
      this.$emit("onReset");
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
    display: flex;
    align-items: center;
    .search-label {
      width: 100px;
      color: #606266;
    }
  }
}
</style>