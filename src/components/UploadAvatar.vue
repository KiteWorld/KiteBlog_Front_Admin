<template>
  <div class="avatar-uploader-container">
    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      v-bind="uploadProps"
    >
      <el-image v-if="imgUrl" :src="imgUrl" fit="cover" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <p class="file-tips">仅支持 {{ this.uploadProps.accept }} 格式的文件</p>
  </div>
</template>

<script>
export default {
  name: "UploadAvatar",
  props: {
    uploadProps: {
      type: Object,
      default: () => {
        return {};
      },
    },
    imgUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    //可以在uploadProps 里覆盖该方法
    beforeAvatarUpload(file) {
      console.log(this.uploadProps.accept);
      if (this.uploadProps.accept) {
        if (this.uploadProps.accept.indexOf(file.type) === -1)
          return this.$message.warning("不支持该格式的上传！");
      }
      if (file.size > 1024 * 1024) {
        return this.$message.warning("图片大小不能大于1M");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.avatar-uploader-container {
  display: flex;
  align-items: center;
  .avatar-uploader {
    flex-shrink: 0;
    /deep/.el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    /deep/.el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .file-tips {
    flex: 1;
    margin-left: 20px;
  }
}
</style>