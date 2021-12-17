<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 问题模板表管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-fluid">
                <el-input @keyup.enter.native="handleSearch" v-model="searchContent" placeholder="问题名称" class="input-with-select">
                    <el-select v-model="IsSelected" slot="prepend" clearable="true">
                        <el-option value="1" label="模板" class="labelClass"></el-option>
                        <el-option value="2" label="问题" class="labelClass"></el-option>
                    </el-select>
                </el-input>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh" style="margin-left: 15px">刷新</el-button>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
                <el-button type="danger" icon="el-icon-close" @click="handleDelete">删除</el-button>
            </div>
        </div>
        <el-table
            :data="questionTemplateForm"
            header-cell-class-name="table-header"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            @selection-change="selected"
            :total="pageTotal"
            @current-change="handlePageChange"
            @prev-click="handlePagePrev"
            @next-click="handlePageNext"
            class="table"
        >
            <el-table-column type="selection" width="75px"> </el-table-column>
            <el-table-column prop="id" label="id" width="50px"> </el-table-column>
            <el-table-column prop="questionTemplate" label="问题权值模板" width="500px"></el-table-column>
            <el-table-column prop="preciseQuestion" label="准确的问题" width="400px"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150px">
                <template slot-scope="scope">
                    <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
                    <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="addVisible" title="添加模板问题" width="30%">
            <el-form ref="addEntity" :model="addQuestionTemplate">
                <el-form-item label="问题模板:" label-width="120px">
                    <el-input v-model="addQuestionTemplate.questionTemplate" />
                </el-form-item>
                <el-form-item label="准确问题:" label-width="120px">
                    <el-input v-model="addQuestionTemplate.preciseQuestion" />
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="add">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :visible.sync="changeVisible" title="编辑模板问题" width="30%">
            <el-form ref="changeEntity" :model="changeQuestionTemplate">
                <el-form-item label="问题模板:" label-width="120px">
                    <el-input v-model="changeQuestionTemplate.questionTemplate" />
                </el-form-item>
                <el-form-item label="准确问题:" label-width="120px">
                    <el-input v-model="changeQuestionTemplate.preciseQuestion" />
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="changeVisible = false">取 消</el-button>
                <el-button type="primary" @click="changeTemplate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Axios from 'axios';
export default {
    name: 'QuestionTemplateForm',
    data() {
        return {
            addVisible: false,
            changeVisible: false,
            questionTemplateForm: [],
            oldTemplate: '',
            pageTotal: 32,
            searchContent: '',
            haveSelect: [],
            IsSelected: '',
            changeQuestionTemplate: {},
            addQuestionTemplate: {
                questionTemplate: '',
                preciseQuestion: ''
            }
        };
    },
    methods: {
        handleSearch() {
            let that = this;
            console.log(this.IsSelected);
            this.$axios
                .post('/api/search_template', {
                    field: that.IsSelected.toString(),
                    inquire: that.searchContent
                })
                .then(response => {
                    that.questionTemplateForm = response.data;
                });
            this.$axios
                .post('/api/get_template', {
                    start: '1',
                    number: '10'
                })
                .then(response => {
                    console.log(response);
                    that.questionTemplateForm = response.data;
                });
            this.$axios.post('/api/count_template').then(response => {
                that.pageTotal = response.data;
            });
        },
        handleDelete() {
            let that = this;
            this.$axios
                .post('/api/remove_template', {
                    questionTemplate: that.haveSelect[0].questionTemplate
                })
                .then(response => {
                    that.$message({
                        message: '删除数据成功',
                        type: 'success'
                    });
                });
            this.handleRefresh();
        },
        changeTemplate() {
            let that = this;
            this.$axios
                .post('/api/change_template', {
                    questionId: that.changeQuestionTemplate.id,
                    oldTemplate: that.oldTemplate,
                    newTemplate: that.changeQuestionTemplate.questionTemplate
                })
                .then(() => {
                    that.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    that.changeVisible = false;
                });
        },
        handleEdit(e) {
            console.log(e);
            this.changeQuestionTemplate = e;
            this.oldTemplate = e.questionTemplate;
            this.changeVisible = true;
        },
        selected(e) {
            console.log(e);
            this.haveSelect = e;
        },
        handleAdd() {
            this.addVisible = true;
        },
        handleRefresh() {
            let that = this;
            this.$axios
                .post('/api/get_template', {
                    start: '1',
                    number: '10'
                })
                .then(response => {
                    console.log(response);
                    that.questionTemplateForm = response.data;
                });
            this.$axios.post('/api/count_template').then(response => {
                that.pageTotal = response.data;
            });
            this.searchContent = '';
            this.IsSelected = '';
        },
        add() {
            let that = this;
            if (this.addQuestionTemplate.preciseQuestion != '' && this.addQuestionTemplate.questionTemplate != '') {
                this.$axios
                    .post('/api/add_template', {
                        questionTemplate: that.addQuestionTemplate.questionTemplate,
                        preciseQuestion: that.addQuestionTemplate.preciseQuestion
                    })
                    .then(response => {
                        if (response.data == true) {
                            that.$message({
                                message: '插入数据成功',
                                type: 'success'
                            });
                            that.addVisible = false;
                        } else {
                            that.$message({
                                message: '插入数据失败，数据库已经存在',
                                type: 'danger'
                            });
                        }
                    });
            } else {
                this.$message({
                    message: '请填写必要信息',
                    type: 'danger'
                });
            }
        }
    },
    mounted() {
        let that = this;
        this.$axios
            .post('/api/get_template', {
                start: '1',
                number: '10'
            })
            .then(response => {
                console.log(response);
                that.questionTemplateForm = response.data;
            });
        this.$axios.post('/api/count_template').then(response => {
            that.pageTotal = response.data;
        });
    }
};
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    margin-top: 20px;
}
.table-header {
    text-align: center;
}
.container-fluid {
    display: flex;
    flex-direction: row;
}
.handle-input {
    width: 300px;
    height: 32px;
    /* display: inline-block; */
}
.table {
    width: 100%;
    font-size: 14px;
}
.input-with-select {
    width: 300px;
    background-color: #fff;
}
.fixContainer {
    /* visibility: hidden */
    width: 500px;
    height: 400px;
    background-color: #a70404;
    position: fixed;
}
.labelClass {
    color: #011608;
}
.el-select {
    width: 100px;
}
.table {
    width: 100%;
    font-size: 14px;
}
</style>