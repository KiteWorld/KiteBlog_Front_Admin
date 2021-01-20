<template>
  <div class="table-container" ref="TableContainer">
    <el-table
      ref="baseTable"
      :data="tableData"
      border
      style="width: 100%"
      :height="tableHeight"
      @selection-change="selectionChange"
    >
      <!-- v-bind="tableProps" -->
      <el-table-column
        align="center"
        prop="name"
        type="selection"
        fixed="left"
        v-if="tableProps.selection"
      >
      </el-table-column>
      <!-- <template v-for="(item, index) in columns" v-if="item.visable !== false"> -->
      <template v-for="(item, index) in columns">
        <el-table-column
          v-bind="Object.assign({}, columnsProp, item)"
          :key="item.prop + index"
          v-if="item.render"
        >
          <template slot-scope="scope">
            <Cell
              :row="scope.row"
              :column="item"
              :index="scope.$index"
              :render="item.render"
            ></Cell>
          </template>
        </el-table-column>
        <el-table-column
          v-bind="Object.assign({}, columnsProp, item)"
          :key="index"
          v-else
        ></el-table-column>
      </template>
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
  </div>
</template>

<script>
import { getTableData } from "@/api/api";
import Cell from "./Cell";
export default {
  components: {
    Cell,
  },
  name: "",
  props: {
    tableProps: {
      type: Object,
    },
    columns: {
      type: Array,
    },
    dataList: {
      type: Array,
    },
  },
  data() {
    return {
      tableData: [],
      columnsProp: {
        align: "center",
      },
      total: null,
      currentPage: 1,
      pageSize: 20,
      tableHeight: null,
      selection: [],
      setting: {},
    };
  },
  async created() {
    this.setting = this.tableProps.setting || {};
    this.pageSize = this.setting.pageSize || 20;
    this.currentPage = this.setting.page || 1;
  },
  async beforeMount() {
    if (this.setting.url) {
      await this.getTableData();
    } else {
      this.tableData = this.dataList;
    }
  },
  mounted() {
    if (this.tableProps.height) {
      this.tableHeight = this.tableProps.height;
    } else {
      this.tableHeight =
        window.innerHeight - this.$refs.TableContainer.offsetTop - 50;
      window.addEventListener("resize", () => {
        if (this.$refs.TableContainer) {
          this.tableHeight =
            window.innerHeight - this.$refs.TableContainer.offsetTop - 50;
        }
      });
    }
  },
  watch: {
    dataList() {
      if (this.setting.url) {
        this.tableData = this.dataList;
      } else {
        this.localPageChange();
        this.total = this.dataList.length;
      }
    },
  },
  methods: {
    selectionChange(selection) {
      this.selection = selection;
    },
    getSelection() {
      return this.selection;
    },
    currentChange(currentPage) {
      this.currentPage = currentPage;
      if (this.setting.url) {
        this.getTableData();
      } else {
        this.localPageChange();
      }
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize;
      if (this.setting.url) {
        this.getTableData();
      } else {
        this.localPageChange();
      }
    },
    async getTableData() {
      const param = Object.assign(
        {},
        { pageSize: this.pageSize, page: this.currentPage },
        this.setting.params || {}
      );
      let res = await getTableData(this.setting.url, param);
      this.total = res.total;
      this.tableData = res.data.dataList;
    },
    localPageChange() {
      const index = this.currentPage * this.pageSize;
      this.tableData = this.dataList.slice(
        index - this.pageSize,
        index > this.dataList.length ? this.dataList.length : index
      );
    },
    searchTableData() {
      this.pageSize = 20;
      this.currentPage = 1;
      this.getTableData();
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  font-size: 13px;
  /deep/th.gutter {
    display: table-cell !important;
  }
  /deep/td,
  /deep/th {
    padding: 4px 0;
  }
}
</style>