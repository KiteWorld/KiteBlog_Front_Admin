<template>
  <div ref="container" class="container">
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <el-button-group style="margin-bottom: 5px">
          <el-button v-popover:popover plain size="small">修改状态</el-button>
          <el-button plain size="small" @click="delUsers()">删除</el-button>
        </el-button-group>
      </el-col>
      <el-col :span="12" :offset="0">
        <SearchInput @onSearch="search()" @onReset="reset()" ref="search">
          <el-input
            slot="main"
            v-model="searchData.name"
            placeholder="用户名称"
            size="small"
            clearable
          ></el-input>
          <div class="search-item" slot="sub">
            <span class="search-label">角色：</span>
            <el-select
              v-model="searchData.role"
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
            <span class="search-label">状态：</span>
            <el-select
              v-model="searchData.status"
              placeholder="请选择"
              clearable
              filterable
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="(value, name) in USER_STATUS"
                :key="name"
                :value="name"
                :label="value"
              >
                {{ value }}
              </el-option>
            </el-select>
          </div>
          <div class="search-item" slot="sub">
            <span class="search-label">性别：</span>
            <el-select
              v-model="searchData.sex"
              placeholder="请选择"
              clearable
              filterable
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="(value, name) in USER_SEX"
                :key="name"
                :value="name"
                :label="value"
              >
                {{ value }}
              </el-option>
            </el-select>
          </div>
        </SearchInput>
      </el-col>
    </el-row>
    <Table ref="usersTable" :tableProps="tableProps" :columns="columns"></Table>
    <el-popover ref="popover" placement="bottom" trigger="click">
      <ul class="status-container">
        <li
          v-for="(value, name) in USER_STATUS"
          :key="name"
          class="status-item click-item"
          @click="changeStatus(name)"
        >
          {{ value }}
        </li>
      </ul>
    </el-popover>
  </div>
</template>

<script>
import { updateUserStatus, deleteUsers } from "../api/api";
import {
  USER_STATUS,
  USER_ROLE,
  USER_SEX,
  USER_STATUS_TAG_TYPE,
} from "../common/eum";
export default {
  name: "User",
  data() {
    return {
      tableData: [],
      selection: [],
      total: null,
      currentPage: 1,
      pageSize: 20,
      tableHeight: null,
      searchData: {
        name: null,
        role: null,
        status: null,
        sex: null,
        createTime: null,
      },
      tableProps: {
        selection: true,
        setting: {
          url: "users/queryUsers",
        },
      },
      columns: [
        { prop: "name", label: "名字" },
        {
          prop: "role",
          label: "角色",
          formatter: (row, column, cellValue) => USER_ROLE[cellValue], //加index eslint报错
        },
        {
          prop: "status",
          label: "状态",
          render: (h, { row }) => {
            return h(
              "el-tag",
              {
                attrs: {
                  type: USER_STATUS_TAG_TYPE[row.status],
                },
              },
              USER_STATUS[row.status]
            );
          },
        },
        {
          prop: "sex",
          label: "性别",
          formatter: (row, column, cellValue) => USER_SEX[cellValue],
        },
        {
          prop: "icon",
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
        { prop: "createTime", label: "注册日期" },
      ],
    };
  },
  async created() {
    this.searchDataBackUp = JSON.parse(JSON.stringify(this.searchData));
    this.USER_STATUS = USER_STATUS;
    this.USER_ROLE = USER_ROLE;
    this.USER_SEX = USER_SEX;
    this.tableHeight = window.innerHeight - 150;
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.tableHeight = window.innerHeight - 150;
    });
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
    async changeStatus(statusCode) {
      let param = {
        status: statusCode,
        userIds: this.$refs.usersTable.selection.map((x) => x.userId),
      };
      let res = await updateUserStatus(param);
      this.$message.success(res.msg);
      if (res.code === 0) this.search();
    },
    async delUsers() {
      let res = await deleteUsers({
        userIds: this.$refs.usersTable.selection.map((x) => x.userId),
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
}
</style>