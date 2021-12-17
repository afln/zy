<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 用户反馈管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="container-fluid">
                <el-input v-model="searchContent" placeholder="请输入需要查询的问题"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" style="margin-left: 15px">查找</el-button>
                <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh" style="margin-left: 15px">刷新</el-button>
            </div>
            <div class="container-fluid">
                <el-select v-model="isSelect" style="width: 150px">
                    <el-option value="未审批">未审批</el-option>
                    <el-option value="审批未通过">审批未通过</el-option>
                    <el-option value="审批且通过">审批且通过</el-option>
                    <el-option value="全部">全部</el-option>
                </el-select>
            </div>
        </div>
        <el-table
            :data="feedbackForm"
            header-cell-class-name="table-header"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }"
            @selection-change="selected"
            class="table"
        >
            <el-table-column prop="phone" label="反馈用户号码" width="200px"></el-table-column>
            <el-table-column prop="question" label="问题" width="300px"></el-table-column>
            <el-table-column prop="opinion" label="用户观点" width="300px"></el-table-column>
            <el-table-column prop="status" label="状态" width="100px">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === '0'" type="info">未审核</el-tag>
                    <el-tag v-else-if="scope.row.status === '1'" type="success">审核通过</el-tag>
                    <el-tag v-else-if="scope.row.status === '2'" type="danger">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="feedback_time" label="反馈时间" width="200px" sortable></el-table-column>
            <el-table-column fixed="right" label="操作" width="150px">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="edit" title="问题反馈" width="30%">
            <el-form ref="editFeedback" :model="editFeedback">
                <el-form-item label="用户手机号:" label-width="120px">
                    <el-input v-model="editFeedback.phone" disabled />
                </el-form-item>
                <el-form-item label="用户反馈问题:" label-width="120px">
                    <el-input v-model="editFeedback.question" disabled />
                </el-form-item>
                <el-form-item label="用户观点:" label-width="120px">
                    <el-input type="textarea" v-model="editFeedback.opinion" disabled />
                </el-form-item>
                <el-form-item label="反馈回复:" label-width="120px">
                    <el-input type="textarea" v-model="editFeedback.evaluation" />
                </el-form-item>
                <el-form-item label="用户反馈问题:" label-width="120px">
                    <el-radio v-model="feedStatus" label="0" class="typeClasss">审核通过</el-radio>
                    <el-radio v-model="feedStatus" label="1" class="typeClasss">审核未通过</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="edit = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Axios from 'axios';
export default {
    name: 'FeedbackForm',
    data() {
        return {
            edit: false,
            isSelect: '全部',
            feedStatus: '0',
            editFeedback: {},
            searchContent: '',
            feedbackForm: [
                {
                    phone: '17352638120',
                    opinion: '你看我应有几分的欢喜',
                    status: '0',
                    question: '咩咩咩咩咩咩咩咩咩咩咩咩咩咩',
                    feedback_time: '2021/11/27 10:51:30'
                },
                {
                    phone: '17352638120',
                    opinion: '你看我应有几分的欢喜',
                    status: '1',
                    question: '咩咩咩咩咩咩咩咩咩咩咩咩咩咩',
                    feedback_time: '2021/11/27 10:51:30'
                },
                {
                    phone: '17352638120',
                    opinion: '你看我应有几分的欢喜',
                    status: '2',
                    question: '咩咩咩咩咩咩咩咩咩咩咩咩咩咩',
                    feedback_time: '2021/11/27 10:51:30'
                },
                {
                    phone: '17352638120',
                    opinion: '你看我应有几分的欢喜',
                    status: '0',
                    question: '咩咩咩咩咩咩咩咩咩咩咩咩咩咩',
                    feedback_time: '2021/11/27 10:51:30'
                }
            ]
        };
    },
    methods: {
        handleClick(e) {
            console.log(e);
        },
        handleEdit(e) {
            this.edit = true;
            this.editFeedback = e;
        },
        edit() {}
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