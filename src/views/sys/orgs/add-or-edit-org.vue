<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title()"
    :visible.sync="visibvle"
    width="500px"
    @close="handleCancel"
  >
    <el-form :model="form" :rules="orgRules" ref="orgForm" v-loading="loading">
      <el-form-item label="部门名" :label-width="formLabelWidth" prop="orgName">
        <el-input v-model="form.orgName" placeholder="请输入部门名"></el-input>
      </el-form-item>
      <el-form-item label="部门描述" :label-width="formLabelWidth" prop="orgDesc">
        <el-input v-model="form.orgDesc" placeholder="请输入部门描述"></el-input>
      </el-form-item>
      <el-form-item label="部门排序" :label-width="formLabelWidth" prop="orgSort">
        <el-input-number style="width: 100%" v-model="form.orgSort" label="请输入部门排序"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchOrg } from "@/api/org";
export default {
  name: "AddOrEditOrg",
  data() {
    return {
      loading: false,
      isEdit: false,
      visibvle: false,
      form: {
        parentId: 0,
        orgName: undefined,
        orgDesc: undefined,
        orgSort: 0,
      },
      formLabelWidth: "100px",
      orgRules: {
        parentId: [
          { required: true, message: "请输入父部门", trigger: "blur" },
          { type: "number", message: "无效的父部门", trigger: "blur" },
        ],
        orgName: [
          { required: true, message: "请输入部门名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "部门名长度在2-10个字符",
            trigger: "blur",
          },
        ],
        orgDesc: [
          { required: true, message: "请输入部门描述", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "部门描述长度在2-50个字符",
            trigger: "blur",
          },
        ],
        orgSort: [
          { required: true, message: "请输入部门排序", trigger: "blur" },
          { type: "number", message: "排序号格式为数字", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    add() {
      this.isEdit = false;
      this.visibvle = true;
    },
    edit(data) {
      this.isEdit = true;
      this.visibvle = true;
      this.loading = true;
      fetchOrg(data.id)
        .then((res) => {
          if (res.code === "00000") {
            this.form = Object.assign({}, this.form, res.data);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCancel() {
      this.visibvle = false;
      this.$emit("cancel");
      this.$refs.orgForm.resetFields();
    },
    handleConfirm() {
      this.$refs.orgForm.validate((valid) => {
        if (!valid) {
          return false;
        } else {
          this.$emit("ok", this.isEdit, this.form);
        }
      });
    },
    title() {
      return (this.isEdit ? "编辑" : "添加") + "部门";
    },
  },
};
</script>

<style>
</style>
