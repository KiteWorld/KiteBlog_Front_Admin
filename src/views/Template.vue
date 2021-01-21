<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-button-group style="margin-bottom: 5px">
          <el-button @click="deleteArticle()">删除</el-button>
          <el-button v-popover:catPopover>修改分类</el-button>

          <el-button @click="addTemplate">新增模板</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="12" :offset="0">
        <SearchInput @onSearch="search()" @onReset="reset()" ref="search">
          <el-input
            slot="main"
            v-model="searchData.title"
            placeholder="模板标题"
          ></el-input>
          <div class="search-item" slot="sub">
            <span class="search-label">分类：</span>
            <el-select
              v-model="searchData.categoryId"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in catergorySeletion"
                :key="item.categoryId"
                :label="item.categoryName"
                :value="item.categoryId"
              >
              </el-option>
            </el-select>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">创建人：</span>
            <el-input
              v-model="searchData.userName"
              placeholder="请输入"
            ></el-input>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">状态：</span>
            <el-select
              v-model="searchData.status"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="(value, name) in APPROVE_STATUS"
                :key="name"
                :value="name"
                :label="value"
              >
                {{ value }}
              </el-option>
            </el-select>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">创建时间：</span>
            <el-date-picker
              type="datetimerange"
              v-model="searchData.createDate"
              style="width: 100%"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">更新时间：</span>
            <el-date-picker
              type="datetimerange"
              v-model="searchData.updateDate"
              style="width: 100%"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </SearchInput>
      </el-col>
    </el-row>
    <Table
      ref="templateTable"
      :tableProps="tableProps"
      :columns="columns"
    ></Table>
    <el-popover
      ref="catPopover"
      v-model="catPopoverVisible"
      placement="bottom"
      width="200"
      trigger="click"
      @show="showPopoverHandle('catPopoverVisible', 'templateTable')"
    >
      <el-select
        v-model="categorySeletionItem"
        placeholder="选择分类"
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
        @click="updateArticleCat"
        style="width: calc(100% + 4px); border-bottom: none"
        >保存修改</el-button
      >
    </el-popover>
  </div>
</template>
<script>
import {
  deleteArticle,
  updateArticleCat,
  updateArticleType,
  getCategoriesList,
} from "@/api/api";
import { APPROVE_STATUS, ARTICLE_RECOMMEND_TYPE } from "@/common/eum";
import { checkTableSelect, showPopoverHandle, toEdit } from "@/common/mixin";
export default {
  name: "Template",
  mixins: [checkTableSelect, showPopoverHandle, toEdit],
  data() {
    return {
      searchData: {
        title: null,
        categoryName: null,
        userName: null,
        createDate: null,
        updateDate: null,
      },
      tableProps: {
        selection: true,
        setting: {
          url: "article/queryTemplate",
        },
      },
      columns: [
        {
          prop: "title",
          label: "标题",
          render: (h, { row }) => {
            return h(
              "a",
              {
                style: {
                  color: "#409EFF",
                  cursor: "pointer",
                },
                on: {
                  click: () => {
                    this.toEdit(row.userId, row.articleId, "template", "模板");
                  },
                },
              },
              row.title
            );
          },
        },
        {
          prop: "categoryName",
          label: "分类",
        },
        {
          prop: "userName",
          label: "创建人",
        },
        { prop: "createDate", label: "创建时间" },
        { prop: "updateDate", label: "更新时间" },
      ],
      templateList: [],
      catergorySeletion: [],
      categorySeletionItem: null,
      catPopoverVisible: false,
      recomPopoverVisible: false,
      rows: [],
    };
  },
  async created() {
    this.APPROVE_STATUS = APPROVE_STATUS;
    this.ARTICLE_RECOMMEND_TYPE = ARTICLE_RECOMMEND_TYPE;
    this.searchDataBackUp = JSON.parse(JSON.stringify(this.searchData));
    this.catergorySeletion = (
      await getCategoriesList({ categoryType: "template" })
    ).data.dataList;
  },
  methods: {
    search() {
      this.tableProps.setting.params = this.searchData;
      this.$refs.templateTable.searchTableData();
    },
    reset() {
      this.searchData = JSON.parse(JSON.stringify(this.searchDataBackUp));
      this.search();
    },
    async deleteArticle() {
      let rows = this.checkTableSelect("templateTable");
      if (!rows) return;
      let res = await deleteArticle({
        articleIds: rows.map((x) => x.articleId),
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.search();
      }
    },
    async updateArticleCat() {
      let res = await updateArticleCat({
        articleIds: this.rows.map((x) => x.articleId),
        categoryId: this.categorySeletionItem,
      });
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.catPopoverVisible = false;
        this.search();
      }
    },
    async changeType(articleType) {
      let params = {
        articleType: articleType,
        articleIds: this.rows.map((x) => x.articleId),
      };
      let res = await updateArticleType(params);
      this.$message.success(res.msg);
      if (res.code === 0) {
        this.recomPopoverVisible = false;
        this.search();
      }
    },
    addTemplate() {
      this.$router.push({ name: "Editor", query: { type: "template" } });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 8px;
  /deep/.banner-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .reject-template {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2px;
  }
}
</style>