<template>
  <el-table :data="tableData" v-bind="tableProps" border style="width: 100%">
	  
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