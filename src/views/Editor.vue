<template>
  <div class="editor-container" @click="routerPopoverVisible = false">
    <div class="editor-header">
      <el-radio-group v-model="type" @change="changeContent">
        <el-radio label="article" :disabled="id && type != 'article'"
          >文章</el-radio
        >
        <el-radio label="hotpoint" :disabled="id && type != 'hotpoint'"
          >沸点</el-radio
        >
        <el-radio
          label="reject-template"
          :disabled="id && type != 'reject-template'"
          >官方消息模板</el-radio
        >
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
          v-popover:routerPopover
          >{{ saveBtnText }}</el-button
        >
        <el-button size="small" @click="resetEditor">重置</el-button>
      </el-button-group>
    </div>
    <div class="editor-main">
      <el-input
        v-model="post.title"
        placeholder="标题"
        size="normal"
        clearable
        style="margin-bottom: 2px"
        v-show="type !== 'hotpoint'"
      ></el-input>
      <!-- VueSimplemde编辑器 图标默认使用Font Awesome, CDN 地址用的是 Font Awesome 官方提供的地址，国内无法访问，可以在 node_modules 里搜索 simplemde.js 
      并修改下方的 CDN 地址，图标就可以正常显示了。  
      https://cdn.bootcdn.net/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css -->
      <div class="editor-container">
        <vue-simplemde
          v-model="post.markdown"
          ref="markdownEditor"
          :configs="configs"
          :highlight="true"
          :key="resetKey"
        />
      </div>
    </div>
    <el-popover
      ref="routerPopover"
      placement="bottom"
      width="200"
      trigger="manual"
      :value="routerPopoverVisible"
    >
      <!-- trigger="manual" 设置为手动控制显示/隐藏 -->
      <p>是否跳转到{{ typeText }}列表页面</p>
      <el-button
        size="default"
        @click="OkRouter"
        style="width: 103%; margin-top: 1px"
        >确认</el-button
      >
    </el-popover>
  </div>
</template>

<script>
import "codemirror/lib/codemirror.css";
import VueSimplemde from "vue-simplemde";
// import "simplemde/dist/simplemde.min.css";
import "simplemde-theme-base/dist/simplemde-theme-base.min.css";
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
    VueSimplemde,
  },
  data() {
    return {
      catergorySeletion: [],
      post: {
        title: null,
        content: null,
        markdown: null,
        categoryId: null,
        userId: null,
      },
      type: "article",
      typeText: "文章",
      id: null,
      configs: {
        spellChecker: false, //取消语法检查，VueSimplemde 使用的是英文语法的校验，输入中文会高亮红色。当字数超过5000字数时，巨卡！
      },
      resetKey: 0,
      routerPopoverVisible: false,
    };
  },
  computed: {
    saveBtnText() {
      return this.id ? "保存" : "添加";
    },
  },
  async created() {
    this.postInit = JSON.parse(JSON.stringify(this.post));
    this.type = this.$route.query.type || "article";
    this.id = this.$route.query.id || null;
    let res = {};
    switch (this.type) {
      case "article":
        if (this.id) res = await queryArticleById({ articleId: this.id });
        this.catergorySeletion = (await getCategoriesList()).data.dataList;
        break;
      case "hotpoint":
        if (this.id) res = await queryHotPointById({ hotPointId: this.id });
        this.catergorySeletion = (
          await getHotPointCategoriesList()
        ).data.dataList;
        break;
      default:
        break;
    }
    this.post = Object.assign(this.post, res.data);
  },
  mounted() {},
  methods: {
    async changeContent(radioValue) {
      this.post.categoryId = null;
      switch (radioValue) {
        case "article":
          this.catergorySeletion = (await getCategoriesList()).data.dataList;
          this.typeText = "文章";
          break;
        case "hotpoint":
          this.catergorySeletion = (
            await getHotPointCategoriesList()
          ).data.dataList;
          this.typeText = "沸点";
          break;
        case "reject-template":
          this.typeText = "官方消息模板";
          break;
        default:
          break;
      }
    },
    async saveContent() {
      this.post.userId = Cookies.get("userId");
      this.post.content = this.post.markdown
        ? this.$refs.markdownEditor.simplemde.markdown(this.post.markdown)
        : null;
      if (!this.post.title && this.type !== "hotpoint")
        return this.$message.warning("请输入标题");
      if (!this.post.markdown || !this.post.content)
        return this.$message.warning("内容不能为空");
      if (!this.post.categoryId) return this.$message.warning("请选择分类");
      let res = null;
      switch (this.type) {
        case "article":
          res = await saveArticle(this.post);
          this.post.articleId = this.id = res.data ? res.data.articleId : null;
          break;
        case "hotpoint":
          res = await saveHotPoint(this.post);
          this.post.hotPointId = this.id = res.data
            ? res.data.hotPointId
            : null;
          break;
        case "reject-template":
          break;
        default:
          break;
      }
      if (res.code !== 0) {
        return this.$message.error(res.msg);
      }
      this.routerPopoverVisible = true;
      this.$message.success(res.msg);
    },
    imgUpload() {},
    resetEditor() {
      this.$confirm(`标题、内容将被清空,确认进行重置？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.id = null;
          this.post = Object.assign(this.post, this.postInit);
          this.resetKey++;
        })
        .catch(() => {
          return;
        });
    },
    OkRouter() {
      this.$router.push({ path: `/${this.type}` });
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
    .editor-container {
      flex: 1;
      padding-bottom: 50px;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
}
/deep/.CodeMirror,
/deep/.CodeMirror-scroll {
  min-height: 200px;
}
/deep/.CodeMirror {
  height: 450px;
}
// /deep/.vue-simplemde {
//   height: 100%;
// }
</style>