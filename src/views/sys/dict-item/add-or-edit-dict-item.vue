<template>
  <el-dialog
    :title="title()"
    :close-on-click-modal="false"
    :visible.sync="visibvle"
    width="500px"
    @close="handleCancel"
  >
    <el-form :model="form" :rules="dictItemRules" ref="dictItemForm" v-loading="loading">
      <el-form-item label="所属字典" :label-width="formLabelWidth" prop="dictId">
        <el-select style="width: 100%" v-model="form.dictId" placeholder="请选择字典名称">
          <el-option
            v-for="item in dictList"
            :key="item.id"
            :label="item.dictName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" :label-width="formLabelWidth" prop="label">
        <el-input v-model="form.label" placeholder="请输入字典标签"></el-input>
      </el-form-item>
      <el-form-item label="字典值" :label-width="formLabelWidth" prop="value">
        <el-input v-model="form.value" placeholder="请输入字典值"></el-input>
      </el-form-item>
      <el-form-item label="显示排序号" :label-width="formLabelWidth" prop="sort">
        <el-input-number style="width: 100%" v-model="form.sort" label="请输入显示排序号"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchDictItem } from "@/api/dict-item";
import { fetchDictList } from "@/api/dict";
export default {
  name: "AddOrEditDictItem",
  data() {
    return {
      loading: false,
      isEdit: false,
      visibvle: false,
      form: {
        dictId: undefined,
        label: undefined,
        value: undefined,
        sort: 1
      },
      formLabelWidth: "100px",
      dictItemRules: {
        dictId: [{ required: true, message: "请输入字典", trigger: "blur" }],
        label: [{ required: true, message: "请输入字典标签", trigger: "blur" }],
        value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
        sort: [{ required: true, message: "请输入显示排序号", trigger: "blur" }]
      },
      dictList: []
    };
  },
  mounted() {
    this.handleSearchDict();
  },
  methods: {
    handleSearchDict() {
      fetchDictList().then(res => {
        if (res.code === "00000") {
          console.log(this.searchObject, "searchObject");
          this.dictList = res.data;
        }
      });
    },
    add() {
      this.isEdit = false;
      this.visibvle = true;
    },
    edit(data) {
      this.isEdit = true;
      this.visibvle = true;
      this.loading = true;
      fetchDictItem(data.id)
        .then(res => {
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
      this.$refs.dictItemForm.resetFields();
    },
    handleConfirm() {
      this.$refs.dictItemForm.validate(valid => {
        if (!valid) {
          return false;
        } else {
          this.$emit("ok", this.isEdit, this.form);
        }
      });
    },
    title() {
      return (this.isEdit ? "编辑" : "添加") + "字典项";
    }
  }
};
</script>

<style>
</style>
