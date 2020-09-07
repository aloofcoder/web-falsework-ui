<template>
  <el-dialog
    :close-on-click-modal="false"
    title="角色分配"
    :visible.sync="visibvle"
    width="500px"
    @close="handleCancel"
  >
    <el-form :model="form" :rules="roleRules" ref="roleForm" v-loading="loading">
      <el-form-item label="用户" :label-width="formLabelWidth" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入用户名" readonly></el-input>
      </el-form-item>
      <el-form-item label="角色" :label-width="formLabelWidth" prop="userRoles">
        <el-select
          v-model="form.userRoles"
          multiple
          placeholder="请选择角色"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchUserRole } from "@/api/user";
export default {
  name: "AssignRole",
  data() {
    return {
      roles: [],
      loading: false,
      visibvle: false,
      form: {
        userNum: "",
        userName: "",
        userRoles: []
      },
      formLabelWidth: "100px",
      roleRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        userRoles: [
          { required: true, message: "请选择角色", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    assign(data) {
      this.visibvle = true;
      this.loading = true;
      fetchUserRole(data.userNum)
        .then(res => {
          if (res.code === 0) {
            this.roles = res.roleList;
            this.form.userRoles = res.userRoles;
            this.form.userName = data.userName;
            this.form.userNum = data.userNum;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCancel() {
      this.visibvle = false;
      this.$emit("cancel");
      this.$refs.roleForm.resetFields();
    },
    handleConfirm() {
      this.$refs.roleForm.validate(valid => {
        if (!valid) {
          return false;
        } else {
          this.$emit("ok", this.form);
        }
      });
    }
  }
};
</script>

<style>
</style>
