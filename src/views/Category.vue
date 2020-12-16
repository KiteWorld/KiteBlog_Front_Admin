<template>
  <div class="container">
    <div class="category-tree">
      <el-button
        class="add-root-button"
        type="default"
        size="small"
        @click="addRootCat"
        >添加一级分类</el-button
      >
      <el-scrollbar style="height: 100%">
        <el-tree
          :data="catergreyData"
          node-key="categoryId"
          default-expand-all
          :expand-on-click-node="false"
          :props="defaultProps"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="!data.isEdit">{{ data.categoryName }}</span>
            <el-input
              v-else
              v-model="data.categoryName"
              placeholder="请输入类名"
              size="mini"
              style="width: 250px"
              maxlength="50"
            ></el-input>
            <div class="cat-button-container">
              <el-input-number
                v-model="data.categoryOrder"
                size="mini"
                controls-position="right"
                :min="1"
                title="值为分类的顺序(1,2,3..)"
                style="width: 80px"
              ></el-input-number>
              <el-button-group>
                <el-button
                  size="mini"
                  icon="el-icon-circle-plus-outline"
                  @click="() => append(node, data)"
                  v-if="!data.isEdit"
                >
                </el-button>
                <el-button
                  size="mini"
                  icon="el-icon-circle-check"
                  @click="() => saveCat(data)"
                  v-else
                >
                </el-button>
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  @click="() => modify(data)"
                >
                </el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  @click="() => remove(node, data)"
                >
                </el-button>
              </el-button-group>
            </div>
          </div>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {
  getCategories,
  insertCategories,
  deleteCategory,
  updateCategory,
} from "../api/api";
export default {
  name: "Catergrey",
  data() {
    return {
      dialogVisible: false,
      catergreyData: [],
      categoryNameTemp: null,
      defaultProps: {
        children: "children",
        label: "categoryName",
      },
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      let res = await getCategories();
      this.catergreyData = res.data.dataList;
    },
    async addRootCat() {
      let params = {
        categoryStatus: 0,
        categoryName: null,
        categoryParentId: 0,
        categoryLevel: 1,
        categoryType: "category",
        description: "",
        categoryOrder: 1,
        children: [],
        isEdit: true,
      };
      this.catergreyData.push(params);
    },
    append(node, data) {
      const newChild = {
        categoryParentId: data.categoryId || 0,
        categoryName: null,
        categoryStatus: 0,
        categoryLevel: data.categoryLevel + 1,
        categoryOrder: 1,
        description: null,
        children: [],
        isEdit: true,
      };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },
    modify(data) {
      this.$set(data, "isEdit", true);
      this.$set(data, "categoryNameTemp", data.categoryName);
    },
    async remove(node, data) {
      if (data.children) {
        if (data.children.length != 0)
          return this.$message.warning("该分类有下级分类，无法删除");
      }
      let res = await deleteCategory({ categoryId: data.categoryId });
      if (res.code == 0) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(
          (d) => d.categoryId === data.categoryId
        );
        children.splice(index, 1);
        this.$message.success(res.msg);
      }
    },
    async saveCat(data) {
      if (!data.categoryName) {
        return this.$message.warning("请填写类名");
      }
      let res = null;
      if (data.categoryId) {
        res = await updateCategory(data);
      } else {
        res = await insertCategories({ insertCats: [data] });
      }
      if (res.code === 0) {
        data.isEdit = false;
        if (res.data) {
          this.$set(data, "categoryId", res.data.categoryId || null);
        }
        this.$message.success(res.msg);
      } else {
        this.$message.warning(res.msg);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  flex: 1;
  padding: 10px;
  overflow: hidden;
  box-sizing: border-box;
}
.category-tree {
  height: 100%;
  position: relative;
  padding: 40px 10px 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 0 10px #d6d6d6;
  .add-root-button {
    position: absolute;
    top: 5px;
    right: 20px;
  }
  .scroll {
    height: 100%;
    overflow: auto;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding-right: 8px;
  height: auto;
  line-height: 40px;
  .cat-button-container {
    margin-left: 10px;
    display: flex;
    align-items: center;
  }
}
/deep/.el-tree-node__content {
  height: auto;
}
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>