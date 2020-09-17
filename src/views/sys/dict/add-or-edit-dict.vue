<template>
    <el-dialog
        :title="title()"
        :close-on-click-modal="false"
        :visible.sync="visibvle"
        width="500px"
        @close="handleCancel">
        <el-form :model="form" :rules="dictRules" ref="dictForm" v-loading="loading">
                    <el-form-item label="字典名称" :label-width="formLabelWidth" prop="dictName">
                            <el-input v-model="form.dictName" placeholder="请输入字典名称"></el-input>
                    </el-form-item>
                    <el-form-item label="字典标记" :label-width="formLabelWidth" prop="dictMark">
                            <el-input v-model="form.dictMark" placeholder="请输入字典标记"></el-input>
                    </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { fetchDict } from "@/api/dict";
    export default {
        name: "AddOrEditDict",
        data() {
            return {
                loading: false,
                isEdit: false,
                visibvle: false,
                form: {
                    dictName: "",
                    dictMark: "",
                },
                formLabelWidth: "100px",
                dictRules: {
                    dictName: [
                        { required: true, message: "请输入字典名称", trigger: "blur" },
                    ],
                    dictMark: [
                        { required: true, message: "请输入字典标记", trigger: "blur" },
                    ],
                },
            }
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
                fetchDict(data.id)
                        .then((res) => {
                            if (res.code === '00000') {
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
                this.$refs.dictForm.resetFields();
            },
            handleConfirm() {
                this.$refs.dictForm.validate((valid) => {
                    if (!valid) {
                        return false;
                    } else {
                        this.$emit("ok", this.isEdit, this.form);
                    }
                });
            },
            title() {
                return (this.isEdit ? "编辑" : "添加") + "数据字典";
            },
        },
    };
</script>

<style>
</style>
