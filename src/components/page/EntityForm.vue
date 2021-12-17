<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 实体表管理 </el-breadcrumb-item>
            </el-breadcrumb>
            <div class="container">
                <div class="container-fluid">
                    <el-input
                        @keyup.enter.native="handleSearch"
                        v-model="searchContent"
                        placeholder="实体名字或标签"
                        class="input-with-select"
                    >
                        <el-select v-model="IsSelected" slot="prepend" clearable="true">
                            <el-option value="1" label="标签" class="labelClass"></el-option>
                            <el-option value="2" label="实体" class="labelClass"></el-option>
                        </el-select>
                    </el-input>
                    <el-button type="primary" icon="el-icon-refresh" @click="handleRefresh" style="margin-left: 15px">刷新</el-button>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
                    <el-button type="danger" icon="el-icon-close" @click="handleDelete">删除</el-button>
                </div>
            </div>
            <el-table
                :data="entityForm"
                header-cell-class-name="table-header"
                :cell-style="{ 'text-align': 'center' }"
                :header-cell-style="{ 'text-align': 'center' }"
                @selection-change="selected"
                class="table"
            >
                <el-table-column type="selection" width="55px"> </el-table-column>
                <el-table-column prop="id" label="id" width="150px"></el-table-column>
                <el-table-column prop="label" label="实体标签" width="400px"></el-table-column>
                <el-table-column prop="name" label="实体名称" width="400px"></el-table-column>
                <el-table-column fixed="right" label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                        <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
                    @selection-change="selected"
                ></el-pagination>
            </div>
            <el-dialog :visible.sync="watchVisible" width="50%" @close="watchClose" title="查看实体">
                <frame style="width: 100%" id="tempHtml" ref="tempHtml" @load="neo4jLoad()">
                    <div id="viz" style="width: 100%; height: 400px"></div>
                </frame>
            </el-dialog>
            <el-dialog :visible.sync="addVisible" title="添加实体" width="30%">
                <el-form ref="addEntity" :model="addEntityFrom">
                    <el-form-item label="实体标签" label-width="120px">
                        <el-input v-model="addEntityFrom.label" />
                    </el-form-item>
                    <el-form-item label="实体名字" label-width="120px">
                        <el-input v-model="addEntityFrom.name" />
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="addVisible = false">取 消</el-button>
                    <el-button type="primary" @click="add">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog :visible.sync="editVisible" title="编辑实体" width="30%">
                <el-form ref="addEntity" :model="addEntityFrom">
                    <el-form-item label="实体id" label-width="120px">
                        <el-input v-model="addEntityFrom.id" disabled />
                    </el-form-item>
                    <el-form-item label="实体标签" label-width="120px">
                        <el-input v-model="addEntityFrom.label" />
                    </el-form-item>
                    <el-form-item label="实体名字" label-width="120px">
                        <el-input v-model="addEntityFrom.name" />
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="edit">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import Axios from 'axios';
import neovis from '../../utils/neovis';
export default {
    name: 'EntityForm',
    data() {
        return {
            haveSelected: [],
            addVisible: false,
            editVisible: false,
            IsSelected: '',
            controller: '',
            currentPage: 1,
            searchContent: '',
            watchVisible: false,
            addEntityFrom: {
                id: 1,
                label: '',
                name: ''
            },
            pageTotal: 32,
            entityForm: [
                {
                    id: 15,
                    label: 'Person',
                    name: 'Al Pacino'
                },
                {
                    id: 7,
                    label: 'Person',
                    name: 'Andy Wachowski'
                },
                {
                    id: 3,
                    label: 'Person',
                    name: '朱佳达'
                },
                {
                    id: 4,
                    label: 'Person',
                    name: '朱佳达'
                }
            ]
        };
    },
    methods: {
        handleAdd() {
            this.$data.addVisible = true;
            this.$data.addEntityFrom = {
                id: 1,
                label: '',
                name: ''
            };
        },
        handleRefresh() {
            let that = this;
            this.$axios.post('/api/get_entity', { start: 1, number: 10 }).then(res => {
                console.log(res);
                that.$data.entityForm = res.data;
            });
            this.$data.searchContent = '';
            this.$data.IsSelected = null;
            this.$axios.post('/api/count_entity').then(res => {
                console.log(res);
                that.$data.pageTotal = res.data;
            });
            this.$data.currentPage = 1;
        },
        handleEdit(res) {
            console.log(res);
            this.$data.editVisible = true;
            this.$data.addEntityFrom = res;
        },
        add() {
            console.log(this.$data.addEntityFrom);
            this.$data.addVisible = false;
            let that = this;
            this.$axios
                .post('/api/add_entity', { label: that.$data.addEntityFrom.label, name: that.$data.addEntityFrom.name })
                .then(res => {
                    that.$message({
                        message: '插入数据成功',
                        type: 'success'
                    });
                });
        },
        edit() {
            console.log(this.$data.addEntityFrom);
            this.$data.editVisible = false;
            let that = this;
            this.$axios
                .post('/api/change_entity', {
                    label: that.$data.addEntityFrom.label,
                    name: that.$data.addEntityFrom.name,
                    id: that.$data.addEntityFrom.id
                })
                .then(res => {
                    that.$message({
                        message: '修改数据成功',
                        type: 'success'
                    });
                })
                .catch(err => {
                    console.log(err);
                    that.$message({
                        message: '修改数据失败',
                        type: 'danger'
                    });
                });
        },
        handleSearch() {
            console.log(this.$data.searchContent);
            console.log(this.$data.IsSelected);
            let that = this;
            this.$axios
                .post('/api/search_entity', { field: that.$data.IsSelected, inquire: that.$data.searchContent })
                .then(res => {
                    console.log(res);
                    that.$data.entityForm = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        handleClick(res) {
            console.log(res);
            this.$data.watchVisible = true;
            this.$data.controller =
                'MATCH k=(n:' +
                res.label +
                '{name:"' +
                res.name +
                '"})-[]-() where id(n) = ' +
                res.id +
                ' return k LIMIT 20 UNION MATCH k=(n:' +
                res.label +
                '{name:"' +
                res.name +
                '"}) where id(n) = ' +
                res.id +
                ' return k UNION ' +
                'MATCH k=()-[]->(n:' +
                res.label +
                '{name:"' +
                res.name +
                '"}) where id(n) =' +
                res.id +
                ' return k;';
            this.$refs.tempHtml.src += '';
        },
        handlePageChange(e) {
            this.$data.currentPage = e;
            let that = this;
            this.$axios.post('/api/get_entity', { start: that.$data.currentPage * 10 - 9, number: 10 }).then(res => {
                console.log(res);
                that.$data.entityForm = res.data;
            });
        },
        handlePageNext() {
            console.log(this.$data.currentPage);
            this.$data.currentPage += 1;
            let that = this;
            this.$axios.post('/api/get_entity', { start: that.$data.currentPage * 10 - 9, number: 10 }).then(res => {
                console.log(res);
                that.$data.entityForm = res.data;
            });
        },
        handlePagePrev() {
            console.log(this.$data.currentPage);
            this.$data.currentPage -= 1;
            let that = this;
            this.$axios.post('/api/get_entity', { start: that.$data.currentPage * 10 - 9, number: 10 }).then(res => {
                console.log(res);
                that.$data.entityForm = res.data;
            });
        },
        handleDelete() {
            let that = this;
            this.$axios.post('/api/remove_entity', { id: that.$data.haveSelected[0].id }).then(res => {
                that.$message({
                    message: '删除数据成功',
                    type: 'success'
                });
            });
        },
        watchClose() {
            this.$data.controller = '';
        },
        selected(selection) {
            this.$data.haveSelected = selection;
            console.log(selection);
        },
        neo4jLoad() {
            var viz;
            var config = {
                container_id: 'viz',
                server_url: 'bolt://47.113.226.5:7687',
                server_user: 'neo4j',
                server_password: 'Zh020825',
                arrows: true,
                // hierarchical: true,   树形结构
                labels: {
                    //"Character": "name",
                    Character: {
                        caption: 'name',
                        size: '12',
                        community: 'community'
                        // sizeCypher: 'MATCH (n) RETURN distinct labels(n)'
                    }
                    // image
                },
                relationships: {
                    INTERACTS: {
                        thickness: 'small',
                        caption: false
                    }
                },
                initial_cypher: this.$data.controller
            };
            viz = new NeoVis.default(config);
            console.log(viz);
            viz.render();
        }
    },
    mounted() {
        // this.$data.entityForm;
        console.log(this);
        let that = this;
        this.$axios.post('/api/get_entity', { start: that.$data.currentPage * 10 - 9, number: 10 }).then(res => {
            console.log(res);
            that.$data.entityForm = res.data;
        });
        this.$axios.post('/api/count_entity').then(res => {
            that.$data.pageTotal = res.data;
        });
    }
};
</script>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
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
