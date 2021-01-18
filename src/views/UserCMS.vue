<template>
  <div ref="container" class="container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-button-group style="margin-bottom: 5px">
          <el-button plain size="small" @click="set_user.visible = true"
            >新增</el-button
          >
          <el-button plain size="small" @click="delUsers()">删除</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="12" :offset="0">
        <SearchInput @onSearch="search()" @onReset="reset()" ref="search">
          <el-input
            slot="main"
            v-model="searchData.userName"
            placeholder="用户名称"
            size="small"
            clearable
          ></el-input>
          <div class="search-item" slot="sub">
            <span class="search-label">角色：</span>
            <el-select
              v-model="searchData.userRole"
              placeholder="请选择"
              clearable
              filterable
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="(value, name) in USER_ROLE"
                :key="name"
                :value="name"
                :label="value"
              >
                <!-- $refs.search.$refs.messageDrop.show() 为了解决下拉选择之后，dropdown收起问题 -->
                {{ value }}
              </el-option>
            </el-select>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">注册时间：</span>
            <el-date-picker
              type="datetimerange"
              v-model="searchData.createDate"
              size="small"
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </SearchInput>
      </el-col>
    </el-row>
    <Table ref="usersTable" :tableProps="tableProps" :columns="columns"></Table>
    <el-dialog
      :title="set_user.title"
      :visible.sync="set_user.visible"
      width="620px"
    >
      <el-form
        :model="set_user.data"
        ref="UserForm"
        label-width="100px"
        :inline="false"
        size="samll"
      >
        <el-form-item label="用户名：">
          <el-input
            size="small"
            v-model="set_user.data.userName"
            placeholder="请输入"
            style="width: 400px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input
            size="small"
            v-model="set_user.data.password"
            placeholder="请输入"
            type="password"
            style="width: 400px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="角色类型:">
          <el-radio-group
            v-model="set_user.data.role"
            size="mini"
            @change="changeRole"
          >
            <el-radio label="superadmin" border>超级管理员</el-radio>
            <el-radio label="admin" border>管理员</el-radio>
            <el-radio label="auditor" border>审核员</el-radio>
            <el-radio label="editor" border>编辑</el-radio>
            <el-radio label="visitor" border>看客</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="关联ToC用户:">
          <el-select
            v-model="set_user.data.tocUserId"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入用户名搜索（需要先选择角色类型）"
            :remote-method="searchUser"
            :loading="set_user.loading"
            size="small"
            style="width: 400px"
          >
            <el-option
              v-for="item in set_user.tocUserList"
              :key="item.userId"
              :label="userName"
              :value="item.userId"
            >
              {{ item.userName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传头像：">
          <UploadAvatar
            ref=""
            :uploadProps="set_user.uploadProps"
            :imgUrl="set_user.data.avtarUrl"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="set_user.visible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="saveUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deleteUsers } from "../api/api";
import { USER_ROLE } from "../common/eum";
import Cookies from "js-cookie";
import { checkTableSelect, showPopoverHandle } from "@/common/mixin";
import UploadAvatar from "@/components/UploadAvatar";

export default {
  name: "UserCMS",
  components: {
    UploadAvatar,
  },
  mixins: [checkTableSelect, showPopoverHandle],
  data() {
    return {
      propverVisible: false,
      searchData: {
        userName: null,
        userRole: null,
        userStatus: null,
        userSex: null,
        userCreateDate: null,
      },
      set_user: {
        title: "添加CMS用户",
        visible: false,
        loading: false,
        data: {
          userName: null,
          password: null,
          role: null,
          tocUserId: null,
          avtarUrl: null,
        },
        tocUserList: [],
        uploadProps: {
          action: "http://localhost:1874/upload/uploadAvatar",
          headers: {
            Authorization: "Bearer " + Cookies.get("token"),
          },
          accept: "image/jpeg,image/png",
          onSuccess: (res) => {
            this.set_user.data.avtarUrl = res.data.imgUrl;
          },
        },
      },
      rules: {},
      tableProps: {
        selection: true,
        setting: {
          url: "users/queryUsers",
        },
      },
      columns: [
        { prop: "userName", label: "用户名" },
        {
          prop: "userRole",
          label: "角色",
          formatter: (row, column, cellValue) => USER_ROLE[cellValue], //加index eslint报错
        },
        {
          prop: "userIcon",
          label: "头像",
          render: (h, { row }) => {
            if (row.icon) {
              return h("img", {
                attrs: {
                  class: "user-icon", // less可以使用 /deep/使样式生效
                  src: row.icon,
                },
              });
            }
          },
        },
        { prop: "createDate", label: "注册日期" },
        {
          prop: "doSome",
          label: "操作",
          render: (h, { row }) => {
            return h("el-button", {
              attrs: {
                icon: "el-icon-edit",
                size: "small",
              },
              on: {
                click: () => {
                  this.set_user.data = Object.assign(this.set_user.data, row);
                  this.set_user.visible = true;
                },
              },
            });
          },
        },
      ],
    };
  },
  async created() {
    this.searchDataBackUp = JSON.parse(JSON.stringify(this.searchData));
    this.USER_ROLE = USER_ROLE;
  },
  methods: {
    search() {
      this.tableProps.setting.params = this.searchData;
      this.$refs.usersTable.searchTableData();
    },
    reset() {
      this.searchData = JSON.parse(JSON.stringify(this.searchDataBackUp));
      this.search();
    },
    changeRole(label) {
      console.log(label);
    },
    searchUser(query) {
      if (query !== "") {
        this.set_user.loading = true;
        console.log(query);
      } else {
        this.options = [];
      }
    },
    addUser() {},
    saveUser() {
      console.log(this.set_user.data);
    },
    async delUsers() {
      let rows = this.checkTableSelect("usersTable");
      if (!rows) return;
      let res = await deleteUsers({
        userIds: rows.map((x) => x.userId),
      });
      this.$message.success(res.msg);
      if (res.code === 0) this.search();
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px 4px;
  /deep/.user-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  /deep/.status-container {
    height: 100%;
    width: 100%;
    list-style: none;
    flex-direction: column;
  }
  /deep/ .el-radio {
    margin-right: 0;
  }
}
</style>