<template>
  <div class="editor-container">
    <div class="editor-header">
      <el-radio-group v-model="radioValue" @change="changeContent">
        <el-radio label="article">文章</el-radio>
        <el-radio label="hotpoint">沸点</el-radio>
        <el-radio label="reject-template">驳回模板</el-radio>
      </el-radio-group>
      <el-select
        v-model="post.categoryId"
        placeholder="选择分类"
        clearable
        filterable
        size="small"
        style="margin-left: 20px"
      >
        <el-option
          v-for="item in catergorySeletion"
          :key="item.categoryId"
          :label="item.categoryName"
          :value="item.categoryId"
        >
        </el-option>
      </el-select>
      <el-button-group>
        <el-button
          type="primary"
          size="small"
          style="margin-left: 4px"
          @click="saveContent"
          >保存</el-button
        >
      </el-button-group>
    </div>
    <div class="editor-main">
      <el-input
        v-model="post.title"
        placeholder="标题"
        size="normal"
        clearable
        style="margin-bottom: 2px"
        v-show="radioValue !== 'hotpoint'"
      ></el-input>
      <!-- 需要重新刷新视图才能 -->
      <editor
        height="99%"
        ref="editor"
        :initialValue="post.markdown"
        :key="post.markdown"
      />
      <!-- <editor height="99%" ref="editor" :key="post.markdown"  /> -->
    </div>
  </div>
</template>

<script>
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import {
  getCategoriesList,
  getHotPointCategoriesList,
  queryArticleById,
  queryHotPointById,
  saveHotPoint,
  saveArticle,
} from "@/api/api";
import Cookies from "js-cookie";
export default {
  name: "Editor",
  components: {
    editor: Editor,
  },
  data() {
    return {
      radioValue: "article",
      catergorySeletion: [],
      post: {
        title: null,
        content: null,
        markdown: null,
        categoryId: null,
        userId: null,
      },
      type: "article",
    };
  },
  async created() {
    this.type = this.$route.query.type;
    let res = null;
    switch (this.type) {
      case "article":
        this.post.articleId = this.$route.query.id;
        res = await queryArticleById({ articleId: this.post.articleId });
        this.post = Object.assign(this.post, res.data);
        this.catergorySeletion = (await getCategoriesList()).data.dataList;

        break;
      case "hotpoint":
        res = await queryHotPointById({ hotPointId: this.post.hotPointId });
        this.catergorySeletion = (
          await getHotPointCategoriesList()
        ).data.dataList;
        break;
      default:
        break;
    }
  },
  mounted() {
    // this.$refs.editor.invoke("setMarkdown", this.post.markdown);
  },
  methods: {
    async changeContent(radioValue) {
      this.post.categoryId = null;
      switch (radioValue) {
        case "article":
          this.catergorySeletion = (await getCategoriesList()).data.dataList;
          break;
        case "hotpoint":
          this.catergorySeletion = (
            await getHotPointCategoriesList()
          ).data.dataList;
          break;
        case "reject-template":
          break;
        default:
          break;
      }
    },
    async saveContent() {
      this.post.userId = Cookies.get("userId");
      this.post.markdown = this.$refs.editor.invoke("getMarkdown");
      this.post.content = this.$refs.editor.invoke("getHtml");
      if (!this.post.title && this.radioValue !== "hotpoint")
        return this.$message.warning("请输入标题");
      if (!this.post.categoryId) return this.$message.warning("请选择分类");
      if (!this.post.markdown || !this.post.content)
        return this.$message.warning("内容不能为空");
      let res = null;
      switch (this.type) {
        case "article":
          res = await saveArticle(this.post);
          break;
        case "hotpoint":
          res = await saveHotPoint(this.post);
          break;
        case "reject-template":
          break;
        default:
          break;
      }
      res = await saveArticle(this.post);
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      this.post.articleId = res.data.articleId;
      this.$message.success(res.msg);
    },
  },
};
</script>

<style lang="less" scoped>
.editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .editor-header {
    display: flex;
    align-items: center;
    padding: 5px 20px;
    box-sizing: border-box;
  }
  .editor-main {
    padding: 0 10px 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>