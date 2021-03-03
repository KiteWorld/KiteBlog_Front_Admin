<template>
  <div class="container">
    <div class="category-tree">
      <div class="category-tree-header">
        <el-input
          placeholder="搜索分类"
          v-model="filterText"
          style="width: 300px"
        >
        </el-input>
        <el-button-group>
          <el-button class="add-root-button" @click="addRootCat"
            >添加一级分类</el-button
          >
          <el-button class="add-root-button" v-popover:catPopover
            >分类文章迁移</el-button
          >
          <el-button class="add-root-button" @click="getCategories"
            >刷新[分类排序]</el-button
          >
        </el-button-group>
      </div>
      <el-scrollbar style="height: 100%">
        <el-tree
          :data="categoryData"
          node-key="categoryId"
          :props="defaultProps"
          :filter-node-method="filterNode"
          show-checkbox
          check-strictly
          ref="catTree"
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
              @click.native.stop=""
            ></el-input>
            <div class="cat-button-container" @click.stop="">
              <el-switch
                v-model="data.categoryStatus"
                active-text="显示"
                inactive-text="隐藏"
                style="margin-right: 10px"
                @change="saveCat(data, false)"
              >
              </el-switch>
              <el-input-number
                v-model="data.categoryOrder"
                size="mini"
                controls-position="right"
                :min="1"
                title="值为分类排列顺序(1,2,3..)"
                style="width: 90px; margin-right: 4px"
                @change="saveCat(data, false)"
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
              <div class="article-count" title="分类下文章数量">
                {{ data.articleCount || 0 }}
              </div>
            </div>
          </div>
        </el-tree>
      </el-scrollbar>
      <el-popover
        ref="catPopover"
        v-model="catPopoverVisible"
        placement="bottom"
        width="200"
        trigger="click"
        @show="showPopoverHandle()"
      >
        <el-select
          v-model="categorySeletionItem"
          placeholder="选择分类"
          style="margin: 10px"
        >
          <el-option
            v-for="item in categorySeletion"
            :key="item.categoryId"
            :label="item.categoryName"
            :value="item.categoryId"
          >
          </el-option>
        </el-select>
        <el-button
          style="width: calc(100% + 4px); border-bottom: none"
          @click="transferCateArticle"
          >确认迁移</el-button
        >
      </el-popover>
    </div>
  </div>
</template>

<script>
import {
  getCategories,
  insertCategories,
  deleteCategory,
  updateCategory,
  getCategoriesList,
  transferCategory,
} from "@/api/api";
import { checkTableSelect } from "@/common/mixin";
export default {
  name: "ArticleCategory",
  mixins: [checkTableSelect],
  data() {
    return {
      dialogVisible: false,
      categoryData: [],
      categoryNameTemp: null,
      defaultProps: {
        children: "children",
        label: "categoryName",
      },
      filterText: null,
      categorySeletion: [],
      categorySeletionItem: null,
      catPopoverVisible: false,
      nodeKeys: [],
    };
  },
  async created() {
    this.getCategories();
    this.categorySeletion = (
      await getCategoriesList({ categoryType: "article" })
    ).data.dataList;
  },
  beforeMount() {},
  mounted() {},
  updated() {
    console.timeEnd();
  },
  watch: {
    filterText(val) {
      this.$refs.catTree.filter(val);
    },
  },
  methods: {
    async getCategories() {
      let res = await getCategories();
      this.categoryData = res.data.dataList;
      console.time();
    },
    // async getCategoriesList() {
    //   let res = await getCategories();
    //   this.catergreySeletion = res.data.dataList;
    //   console.log(this.catergreySeletion);
    // },
    // 原本更新可以公用一个接口，为了避免逻辑混淆，维护成本。单独做了个更新的接口

    // 1、order是排序，当改变order时，我们需要改变分类的位置，最简单无脑的办法就是 重新调用一下获取分类的接口
    // 刷新试图（写的接口是有排序的），考虑到数据多的时候，会影响性能。
    // 2、尝试用前端的方式来完成，发现如果数据嵌套很多层，改变数组时，也要强制刷新试图，性能也不好。
    // 3、考虑到每更新一次order就刷新一下视图，数据跳来跳去也不好。于是决定弃用上方所述两种方案。而是加多一个按钮让用户来决定是否刷新视图（也就是重新调用分类的接口）。我觉得是一个还算不错的方案。如果你有其他更好的方案，欢迎到Github或者博客留言。
    // async changeCategoryOrders(data) {
    //   if (!data.categoryId) return;
    //   let params = {
    //     categoryId: data.categoryId,
    //     categoryOrder: data.categoryOrder,
    //   };
    //   let res = await updateCategoryOrder(params);
    //   if (res.code == 0) {
    //     this.$message.success(res.msg);
    //   } else {
    //     this.$message.warning(res.msg);
    //   }
    // },
    async addRootCat() {
      let params = {
        categoryStatus: true,
        categoryName: null,
        categoryParentId: 0,
        categoryLevel: 1,
        categoryType: "category",
        description: "",
        categoryOrder: 1,
        children: [],
        isEdit: true,
      };
      this.categoryData.push(params);
    },
    
    append(node, data) {
      const newChild = {
        categoryParentId: data.categoryId || 0,
        categoryName: null,
        categoryStatus: true,
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
      if (data.categoryId) {
        let res = await deleteCategory({ categoryId: data.categoryId });
        if (res.code !== 0) {
          return this.$message.warning(res.msg);
        }
      }
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d == data);
      children.splice(index, 1);
      this.$message.success("删除成功");
    },

    async saveCat(data, insert = true) {
      let res = null;
      if (data.categoryId) {
        if (!data.categoryName) return this.$message.warning("请填写类名");
        res = await updateCategory(data);
      } else {
        if (insert) {
          if (!data.categoryName) return this.$message.warning("请填写类名");
          res = await insertCategories({ insertCats: [data] });
        }
      }
      if (res.code === 0) {
        this.$set(data, "isEdit", false);
        if (res.data) {
          this.$set(data, "categoryId", res.data.categoryId || null);
        }
        this.$message.success(res.msg);
      } else {
        this.$message.warning(res.msg);
      }
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.categoryName.indexOf(value) !== -1;
    },

    showPopoverHandle() {
      this.catPopoverVisible = false;
      this.nodeKeys = this.$refs.catTree.getCheckedKeys();
      if (this.nodeKeys.length !== 1) {
        return this.$message.warning("请选择一项进行操作");
      }
      this.catPopoverVisible = true;
    },

    async transferCateArticle() {
      const loading = this.$loading({
        lock: true,
        text: "数据迁移中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await transferCategory({
        categoryId: this.nodeKeys[0],
        afterCategoryId: this.categorySeletionItem,
      });
      loading.close();
      if (res.code !== 0) {
        return this.$message.warning(res.msg);
      }
      this.$message.success(res.msg);
      this.getCategories();
      this.catPopoverVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  flex: 1;
  padding: 8px;
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
  .category-tree-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 5px;
    left: 0;
    padding: 0 20px;
    box-sizing: border-box;
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
  .article-count {
    line-height: 28px;
    padding: 0 8px;
    border-radius: 4px;
    margin: 0 4px;
    box-sizing: border-box;
    background-color: #eeeeee;
  }
}
/deep/.el-tree-node__content {
  height: auto;
}
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>