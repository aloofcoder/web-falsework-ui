<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        style="width: 240px"
        class="filter-item"
        placeholder="请输入条件"
        v-model="searchObject.condition"
        type="text"
        clearable
        @change="handleSearch"
      />
      <el-button
        style="margin-left: 10px;"
        class="filter-item"
        icon="el-icon-search"
        type="primary"
        @click="handleSearch()"
      >查询</el-button>
      <el-button
        style="margin-left: 10px;"
        class="filter-item"
        icon="el-icon-plus"
        type="primary"
        @click="handleAdd()"
      >添加</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        class="filter-item"
        icon="el-icon-delete"
        type="danger"
        @click="handleRemoveAll"
      >批量删除</el-button>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
        show-overflow-tooltip
        v-loading="loading"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="orgName" label="组织名" sortable="custom"></el-table-column>
        <el-table-column prop="orgDesc" label="组织描述" sortable="custom"></el-table-column>
        <el-table-column prop="orgSort" label="组织排序" sortable="custom"></el-table-column>
        <el-table-column prop="status" label="状态" sortable="custom">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button @click="handleOperate(scope.row, 'edit')" type="text" size="small">编辑</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm :title="`您确定删除公司组织吗？`" @onConfirm="handleOperate(scope.row, 'delete')">
              <el-button slot="reference" class="el-delete-btn" type="text" size="small">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
        <div slot="empty" class="el-table-empty">
          <svg-icon icon-class="empty" class-name="el-table-empty-icon" />

          <br />暂无数据
        </div>
      </el-table>
    </div>
    <el-pagination
      v-if="total > 0"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchObject.page"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="searchObject.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <add-or-edit-org ref="orgDialog" @ok="handleConfirm" @cancel="handleCancel"></add-or-edit-org>
  </div>
</template>

<script>
import { fetchList, removeOrg, addOrg, editOrg } from "@/api/org";
import AddOrEditOrg from "./add-or-edit-org";
export default {
  name: "OrgList",
  components: {
    AddOrEditOrg,
  },
  data() {
    return {
      searchObject: {
        condition: "",
        page: 1,
        limit: 10,
      },
      total: 0,
      multipleSelection: [],
      tableData: [],
      loading: false,
    };
  },
  mounted() {
    this.handleSearch();
  },
  methods: {
    handleAdd() {
      this.$refs.orgDialog.add();
    },
    handleSearch() {
      this.loading = true;
      fetchList({
        ...this.searchObject,
      })
        .then((res) => {
          if (res.code === 0) {
            this.searchObject.page = res.data.currPage;
            this.searchObject.limit = res.data.pageSize;
            this.total = res.data.totalCount;
            this.tableData = res.data.list;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSortChange(column, prop, order) {
      let desc = column.order === "descending" ? 1 : 0;
      let field = column.order ? column.prop : undefined;
      console.log(column.prop, column.order);
    },
    handleOperate(data, param) {
      switch (param) {
        case "edit":
          this.$refs.orgDialog.edit(data);
          break;
        case "delete":
          this.handleDelete([data.id]);
          break;
        default:
      }
    },
    handleSizeChange(val) {
      this.searchObject.limit = val;
      this.handleSearch();
    },
    handleCurrentChange(val) {
      this.searchObject.page = val;
      this.handleSearch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(ids) {
      removeOrg(ids).then((res) => {
        if (res.code === 0) {
          this.$message.success("删除成功");
          this.handleSearch();
        }
      });
    },
    handleRemoveAll() {
      this.$confirm(`确认删除公司组织吗?`, "确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: (action) => {
          if (action === "confirm") {
            let ids = this.multipleSelection.map((item) => item.id);
            this.handleDelete(ids);
          }
        },
      });
    },
    handleConfirm(param, data) {
      this.$refs.orgDialog.loading = true;
      if (param) {
        editOrg(data.id, data)
          .then((res) => {
            this.$refs.orgDialog.loading = true;
            if (res.code === 0) {
              this.$message.success("修改成功");
              this.$refs.orgDialog.handleCancel();
              this.handleSearch();
            }
          })
          .finally(() => {
            this.$refs.orgDialog.loading = false;
          });
      } else {
        addOrg(data)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success("添加成功");
              this.$refs.orgDialog.handleCancel();
              this.handleSearch();
            }
          })
          .finally(() => {
            this.$refs.orgDialog.loading = false;
          });
      }
    },
    handleCancel() {},
  },
};
</script>
