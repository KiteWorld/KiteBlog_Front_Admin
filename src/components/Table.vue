<template>
  <el-table :data="tableData" v-bind="tableProps" border style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
    <el-table-column prop="address" label="地址"> </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "",
  props: {
    tableProps: {
      type: Object,
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
};
</script>

<style lang="less" scoped>
</style>