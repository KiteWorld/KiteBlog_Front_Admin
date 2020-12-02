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
        <SearchInput @onSearch="search()" @onReset="reset()">
          <el-input
            slot="main"
            v-model="searchData.name"
            placeholder="用户名称"
            size="small"
            clearable
          ></el-input>
          <div class="search-item" slot="sub">
            <span class="search-label" >角色：</span>
            <el-input
              v-model="searchData.role"
              placeholder="角色"
              size="small"
              clearable
            ></el-input>
          </div>
        </SearchInput>
      </el-col>
    </el-row>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      :height="tableHeight"
      @selection-change="selectionChange"
    >
      <el-table-column align="center" prop="name" type="selection">
      </el-table-column>
      <el-table-column align="center" prop="name" label="名字">
      </el-table-column>
      <el-table-column align="center" prop="role" label="角色">
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status == 0">{{
            USER_STATUS[scope.row.status]
          }}</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status == 1">{{
            USER_STATUS[scope.row.status]
          }}</el-tag>
          <el-tag type="danger" v-else-if="scope.row.status == 2">{{
            USER_STATUS[scope.row.status]
          }}</el-tag>
          <el-tag type="info" v-else>{{
            USER_STATUS[scope.row.status]
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sex" label="性别">
      </el-table-column>
      <el-table-column align="center" prop="icon" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.icon" v-if="scope.row.icon" class="user-icon" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="注册日期"
      ></el-table-column>
      <!-- <el-table-column align="center" prop="do" label="操作"> </el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="currentPage"
      :page-sizes="[20, 50, 100, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="margin-top: 6px; text-align: center"
    >
    </el-pagination>
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
import { getUsers, updateUserStatus, deleteUsers } from "../api/api";
import { USER_STATUS } from "../common/eum";
import SearchInput from "../components/SearchInput";
export default {
  name: "",
  components: {
    SearchInput,
  },
  data() {
    return {
      tableData: [],
      selection: [],
      total: null,
      currentPage: 1,
      pageSize: 20,
      //   set_modify: {
      //     visible: false,
      //     loading: true,
      //     title: "修改用户信息",
      //   },
      //   modifyForm: {},
      USER_STATUS: {},
      tableHeight: null,
      searchData: {
        name: null,
        role: null,
        status: null,
        sex: null,
        createTime: null,
      },
    };
  },
  async created() {
    this.searchDataBackUp = JSON.parse(JSON.stringify(this.searchData));
    this.USER_STATUS = USER_STATUS;
    this.tableHeight = window.innerHeight - 160;
    this.getUsers();
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.tableHeight = window.innerHeight - 160;
    });
  },
  methods: {
    search() {
      this.getUsers();
    },
    reset() {
      this.searchData = JSON.parse(JSON.stringify(this.searchDataBackUp));
      this.pageSize = 20;
      this.currentPage = 1;
      this.search();
    },
    async getUsers() {
      let param = Object.assign(
        {},
        { pageSize: this.pageSize, page: this.currentPage },
        this.searchData
      );
      let res = await getUsers(param);
      this.tableData = res.data.users;
      this.total = res.total;
    },

    async changeStatus(statusCode) {
      let param = {
        status: statusCode,
        userIds: this.selection.map((x) => x.userId),
      };
      let res = await updateUserStatus(param);
      this.$message.success(res.msg);
      if (res.code === 0) this.getUsers();
    },
    async delUsers() {
      let res = await deleteUsers({
        userIds: this.selection.map((x) => x.userId),
      });
      this.$message.success(res.msg);
      if (res.code === 0) this.getUsers();
    },
    selectionChange(selection) {
      this.selection = selection;
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.getUsers();
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getUsers();
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
  .user-icon {
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