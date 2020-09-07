<template>
  <el-dialog
    :close-on-click-modal="false"
    title="分配权限"
    :visible.sync="visibvle"
    width="500px"
    @close="handleCancel"
  >
    <el-form :model="form" :rules="roleRules" ref="roleForm" v-loading="loading">
      <el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色名" readonly></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" :label-width="formLabelWidth" prop="roleMark">
        <el-tree
          ref="menuAuthTree"
          node-key="id"
          :data="menuData"
          :check-strictly="checkStrictly"
          show-checkbox
          :props="defaultProps"
          :default-checked-keys="roleMenuId"
        ></el-tree>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchRoleMenu } from "@/api/role";
export default {
  name: "AddRoleAuth",
  data() {
    return {
      checkStrictly: true,
      loading: false,
      visibvle: false,
      form: {
        roleId: "",
        roleName: "",
        authMenus: []
      },
      formLabelWidth: "100px",
      roleRules: {
        roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      menuData: [],
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      roleMenuId: []
    };
  },
  methods: {
    auth(data) {
      this.roleMenuId = [];
      this.menuData = [];
      this.visibvle = true;
      this.loading = true;
      this.checkStrictly = true;
      fetchRoleMenu(data.roleId)
        .then(res => {
          if (res.code === 0) {
            this.form.roleId = data.roleId;
            this.form.roleName = data.roleName;
            this.menuData = res.menuList;
            this.roleMenuId = res.roleMenus.map(item => item.id);
            this.checkStrictly = false;
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
          let authMenus = [
            ...this.$refs.menuAuthTree.getHalfCheckedKeys(),
            ...this.$refs.menuAuthTree.getCheckedKeys()
          ];
          this.form.authMenus = authMenus;
          this.$emit("ok", this.form);
        }
      });
    }
  }
};
</script>

<style>
</style>
