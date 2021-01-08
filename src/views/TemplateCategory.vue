<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-button-group style="margin-bottom: 5px">
          <el-button plain size="small" @click="addCat">添加分类</el-button>
          <el-button plain size="small" v-popover:catPopover
            >分类模板迁移</el-button
          >
          <el-button plain size="small" @click="getTemplateCategories"
            >刷新</el-button
          >
        </el-button-group>
      </el-col>
      <el-col :span="12" :offset="0">
        <SearchInput @onSearch="search()" @onReset="reset()" ref="search">
          <el-input
            slot="main"
            v-model="searchData.categoryName"
            placeholder="请输入类名"
            size="small"
            clearable
          ></el-input>
        </SearchInput>
      </el-col>
    </el-row>
    <Table
      ref="templateCategoryTable"
      :tableProps="tableProps"
      :columns="columns"
      :dataList="dataList"
    ></Table>
    <el-popover
      ref="catPopover"
      v-model="catPopoverVisible"
      placement="bottom"
      width="200"
      trigger="click"
      @show="
        showPopoverHandle(
          'catPopoverVisible',
          'templateCategoryTable',
          'single'
        )
      "
    >
      <el-select
        v-model="categorySeletionItem"
        placeholder="选择分类"
        clearable
        filterable
        size="small"
        style="margin: 10px"
      >
        <el-option
          v-for="item in catergorySeletion"
          :key="item.categoryId"
          :label="item.categoryName"
          :value="item.categoryId"
        >
        </el-option>
      </el-select>
      <el-button
        size="small"
        @click="transferTemplate"
        style="width: calc(100% + 4px); border-bottom: none"
        >确认迁移</el-button
      >
    </el-popover>
  </div>
</template>

<script>
import {
  insertTemplateCategories,
  getTemplateCategories,
  updateTemplateCategory,
  deleteTemplateCategory,
  transferCategory,
  getCategoriesList,
} from "@/api/api";
import { checkTableSelect, showPopoverHandle } from "@/common/mixin";
export default {
  name: "TemplateCategory",
  mixins: [checkTableSelect, showPopoverHandle],
  data() {
    return {
      searchData: {},
      set_add: {
        visible: false,
        data: {
          categoryId: null,
          categoryName: null,
          categoryOrder: 1,
          categoryStatus: true,
        },
      },
      rows: null,
      tableProps: {
        selection: true,
        setting: {
          pageSize: 50,
        },
      },
      dataList: [],
      columns: [
        {
          prop: "categoryName",
          label: "分类名称",
          render: (h, { row }) => {
            if (row.isEdit) {
              return h("el-input", {
                attrs: {
                  value: row.categoryName,
                  size: "small",
                },
                on: {
                  input: (value) => {
                    row.categoryName = value;
                  },
                },
              });
            } else {
              return h("span", row.categoryName);
            }
          },
        },
        {
          prop: "categoryStatus",
          label: "是否显示",
          render: (h, { row }) => {
            return h("el-switch", {
              attrs: {
                value: row.categoryStatus,
                "active-text": "显示",
                "inactive-text": "隐藏",
                disabled: !row.isEdit,
              },
              on: {
                change: () => {
                  row.categoryStatus = !row.categoryStatus;
                },
              },
            });
          },
        },
        {
          prop: "categoryOrder",
          label: "排序",
          render: (h, { row }) => {
            if (row.isEdit) {
              return h("el-input-number", {
                attrs: {
                  value: row.categoryOrder,
                  size: "small",
                  min: 1,
                },
                on: {
                  change: (value) => {
                    row.categoryOrder = value;
                  },
                },
              });
            } else {
              return h("span", row.categoryOrder);
            }
          },
        },
        {
          prop: "templateCount",
          label: "模板数量",
        },
        {
          prop: "do",
          label: "操作",
          render: (h, { row, index }) => {
            let buttonList = [
              h("el-button", {
                attrs: {
                  icon: "el-icon-delete",
                  size: "small",
                },
                on: {
                  click: async () => {
                    let res;
                    if (row.categoryId) {
                      res = await deleteTemplateCategory({
                        categoryId: row.categoryId,
                      });
                      if (res.code !== 0) {
                        return this.$message.warning(res.msg);
                      }
                    }
                    this.$message.success("删除成功");
                    this.dataList.splice(index, 1);
                  },
                },
              }),
              h("el-button", {
                ref: "edit" + index,
                style: {
                  display: row.isEdit ? "none" : "inline-block",
                },
                attrs: {
                  icon: "el-icon-edit",
                  size: "small",
                },
                on: {
                  click: () => {
                    if (Object.prototype.hasOwnProperty.call(row, "isEdit")) {
                      this.$set(row, "isEdit", !row.isEdit);
                    } else {
                      this.$set(row, "isEdit", true);
                    }
                  },
                },
              }),
              h("el-button", {
                attrs: {
                  icon: "el-icon-circle-check",
                  size: "small",
                },
                style: {
                  display: row.isEdit ? "inline-block" : "none",
                },
                on: {
                  click: async () => {
                    if (!row.categoryName) {
                      return this.$message.warning("类名不为空！");
                    }
                    let res;
                    if (row.categoryId) {
                      res = await updateTemplateCategory(row);
                    } else {
                      res = await insertTemplateCategories({
                        insertCats: [row],
                      });
                      row.categoryId = res.data.categoryId;
                    }
                    if (res.code !== 0) {
                      return this.$message.warning(res.msg);
                    }
                    this.$set(row, "isEdit", !row.isEdit);
                    this.$message.success(res.msg);
                  },
                },
              }),
            ];
            return h("div", {}, buttonList);
          },
        },
      ],
      catergorySeletion: [],
      categorySeletionItem: null,
      catPopoverVisible: false,
    };
  },
  async created() {
    this.searchDataBackUp = JSON.parse(JSON.stringify(this.searchData));
    this.getTemplateCategories();
    this.catergorySeletion = (
      await getCategoriesList({ categoryType: "template" })
    ).data.dataList;
  },
  methods: {
    search() {
      if (this.searchData.categoryName) {
        this.dataList = this.dataListBackUp.filter((x) => {
          return x.categoryName.indexOf(this.searchData.categoryName) !== -1;
        });
      } else {
        this.dataList = this.dataListBackUp;
      }
    },
    reset() {
      this.searchData = JSON.parse(JSON.stringify(this.searchDataBackUp));
      this.dataList = this.dataListBackUp;
    },
    addCat() {
      this.dataList.unshift({
        isEdit: true,
        categoryName: null,
        categoryId: null,
        categoryStatus: true,
        categoryOrder: 1,
        templateCount: 0,
      });
    },
    async transferTemplate() {
      const loading = this.$loading({
        lock: true,
        text: "数据迁移中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await transferCategory({
        categoryId: this.rows[0].categoryId,
        afterCategoryId: this.categorySeletionItem,
      });
      loading.close();
      if (res.code !== 0) {
        return this.$message.warning(res.msg);
      }
      this.getTemplateCategories();
      this.catPopoverVisible = false;
      this.$message.success(res.msg);
    },
    async getTemplateCategories() {
      let res = await getTemplateCategories();
      this.dataList = res.data.dataList;
      this.dataListBackUp = JSON.parse(JSON.stringify(this.dataList));
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
}
</style>