<template>
  <div class="total-card box-shadow">
    <i :class="['total-card-icon', icon]"></i>
    <span class="total-number">{{ total }}</span>
  </div>
</template>

<script>
export default {
  name: "TotalCard",
  props: {
    icon: {
      type: String,
    },
    total: {
      type: String,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.total-card {
  height: 130px;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 10px rgb(224, 224, 224);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #303133;
  overflow: hidden;
  padding: 0 30px 0 20px;
  box-sizing: border-box;
  // color: #2ec7c9;
  color: #65dbdd;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: #409eff;
    transform: scale(1.07);
  }
  .total-card-icon {
    font-size: 56px;
  }
  .total-number {
    font-size: 34px;
  }
}
</style>