<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 管理员管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="姓名或ID" class="handle-input mr10">
                </el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table :data="adminList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="account" label="账号" width="280" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号" width="250" align="center"></el-table-column>
                <el-table-column label="账号类型" width="140" align="center">
                    <template slot-scope="scope">
                        <el-tag>{{ scope.row.adminType === '1' ? '超级管理员' : '管理员' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="registerTime" label="创建时间" width="200" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" class="blue" @click="handleEdit(scope.$index, scope.row)"
                            >修改</el-button
                        >
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="currentPage"
                    :page-size="10"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                    @prev-click="handlePagePrev"
                    @next-click="handlePageNext"
                ></el-pagination>
            </div>
        </div>

        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="管理员姓名" prop="adminName">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="管理员账号" prop="adminAccount">
                    <el-input v-model="form.account" disabled></el-input>
                </el-form-item>
                <el-form-item label="管理员手机号" prop="phone">
                    <el-input v-model="form.phone" oninput="value=value.replace(/[^\d]/g,'')" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="选择管理员类型" prop="adminType">
                    <el-radio-group v-model="form.adminType">
                        <el-radio :label="'0'">普通管理员</el-radio>
                        <el-radio :label="'1'">超级管理员</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
                <el-form-item label="管理员姓名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="管理员账号" prop="account">
                    <el-input v-model="addForm.account"></el-input>
                </el-form-item>
                <el-form-item label="管理员手机号" prop="phone">
                    <el-input v-model="addForm.phone" oninput="value=value.replace(/[^\d]/g,'')" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="管理员密码" prop="password">
                    <el-input type="password" placeholder="password" v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="确认管理员密码" prop="againPassword">
                    <el-input type="password" placeholder="againPassword" v-model="addForm.againPassword"></el-input>
                </el-form-item>
                <el-form-item label="选择管理员类型" prop="adminType">
                    <el-radio-group v-model="addForm.adminType">
                        <el-radio :label="0">普通管理员</el-radio>
                        <el-radio :label="1">超级管理员</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import Axios from 'axios';
import Vue from 'vue';
export default {
    name: 'basetable',
    data() {
        return {
            searchContent: '',
            allData: [],
            adminList: [],
            currentPage: 1,
            pageTotal: 0,
            currentMode: 'AllTypeList',
            form: {},
            idx: -1,
            id: -1,
            editVisible: false,
            addVisible: false,
            addForm: {},
            radio: 1,
            rules: {
                name: [{ required: true, message: '请输入管理员姓名', trigger: 'blur' }],
                account: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }],
                phone: [{ required: true, message: '请输入管理员手机号码', trigger: 'blur' }],
                againPassword: [{ required: true, message: '请确认密码', trigger: 'blur' }],
                adminType: [{ required: true, message: '请选择账号类型', trigger: 'blur' }]
            }
        };
    },
    created() {
        let that = this;
        this.$axios
            .post('/api/get_web_user', {
                start: '1',
                number: '10'
            })
            .then(response => {
                console.log(response);
                that.adminList = response.data;
                that.adminList.forEach((index, data) => {
                    console.log(index);
                    that.adminList[data].registerTime = index.registerTime.substring(0, 19);
                    that.adminList[data].registerTime = that.adminList[data].registerTime.replace('T', ' ');
                });
            });
        this.$axios.post('/api/count_web_user').then(response => {
            that.pageTotal = response.data;
        });
    },
    methods: {
        handleRefresh() {
            let that = this;
            this.$axios
                .post('/api/get_web_user', {
                    start: '1',
                    number: '10'
                })
                .then(response => {
                    console.log(response);
                    that.adminList = response.data;
                    that.adminList.forEach((index, data) => {
                        console.log(index);
                        that.adminList[data].registerTime = index.registerTime.substring(0, 19);
                        that.adminList[data].registerTime = that.adminList[data].registerTime.replace('T', ' ');
                    });
                });
        },
        handleEdit(index, e) {
            this.form = e;
            this.editVisible = true;
        },
        saveEdit() {
            console.log(this.form);
        },
        handleDelete(index, e) {
            let that = this;
            this.$axios
                .post('/api/remove_web_user', {
                    account: e.account
                })
                .then(() => {
                    that.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                });
            this.handleRefresh();
        },
        handleAdd() {
            this.addForm = {};
            this.addVisible = true;
        },
        add() {
            let that = this;
            console.log(this.addForm);
            if (this.addForm.password === this.addForm.againPassword) {
                this.$axios
                    .post('/api/add_web_user', {
                        name: that.addForm.name,
                        account: that.addForm.account,
                        password: that.addForm.password,
                        phone: that.addForm.phone,
                        adminType: that.addForm.adminType.toString()
                    })
                    .then(function(response) {
                        if (response.data == true) {
                            that.$message({
                                message: '新增管理员成功',
                                type: 'success'
                            });
                            that.addVisible = false;
                        } else {
                            that.$message({
                                message: '新增管理员失败',
                                type: 'error'
                            });
                        }
                    });
            } else {
                this.$message({
                    message: '两次密码输入不正确',
                    type: 'error'
                });
            }
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
