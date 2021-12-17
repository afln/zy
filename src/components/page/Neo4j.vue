<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> neo4j图形界面 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input
                @keyup.enter.native="handleEntity"
                v-model="entityContent"
                placeholder="请输入要查询的实体名称"
                class="handle-input mr10"
                style="width: 400px"
            >
                <el-select v-model="IsSelected" slot="prepend" style="width: 100px" clearable="true">
                    <div v-for="(item, index) in select" v-bind:key="item">
                        <el-option v-model="select[index]" class="labelClass">{{ item }}</el-option>
                    </div>
                </el-select>
            </el-input>

            <el-input
                @keyup.enter.native="handleRelation"
                v-model="relationContent"
                placeholder="请输入要查询的关系名称"
                class="handle-input mr10"
                style="margin-left: 30px; width: 400px"
                ><el-select v-model="relationIsSelected" slot="prepend" style="width: 100px" clearable="true">
                    <div v-for="(item, index) in relationSelect" v-bind:key="item">
                        <el-option v-model="relationSelect[index]" class="labelClass">{{ item }}</el-option>
                    </div>
                </el-select>
            </el-input>

            <el-button type="primary" icon="el-icon-search" @click="handleRelation">查找</el-button>
            <el-input-number v-model="num" :step="10" style="margin-left: 20px"></el-input-number>
        </div>
        <div class="handle-box" style="margin-top: 30px"></div>
        <frame style="width: 100%" id="tempHtml" ref="tempHtml" @load="neo4jLoad()">
            <div id="viz" style="width: 100%; height: 500px"></div>
        </frame>
    </div>
</template>
<script>
import neovis from '../../utils/neovis';
export default {
    name: 'Neo4j',
    data() {
        return {
            controller: 'MATCH p=(n)-[]->() return p LIMIT 20',
            relationContent: '',
            entityContent: '',
            num: 20,
            select: [],
            relationSelect: [],
            relationIsSelected: '',
            IsSelected: '',
            LabelContent: '',
            selectedLabel: ''
        };
    },
    methods: {
        // handleEntity() {
        //     console.log(this.$data.entityContent);
        //     this.$data.controller =
        //         'MATCH p=(n:' + this.$data.IsSelected + '{name:"' + this.$data.entityContent + '"})-[]->() RETURN p,n LIMIT 100';
        //     this.$refs.tempHtml.src += '';
        // },
        handleRelation() {
            let myControl = 'MATCH p=';
            if (this.IsSelected != '') {
                myControl += '(:' + this.$data.IsSelected;
            } else {
                myControl += '(';
            }
            if (this.entityContent != '') {
                myControl += '{name:"' + this.entityContent + '"})-';
            } else {
                myControl += ')-';
            }
            if (this.relationIsSelected != '') {
                myControl += '[:' + this.relationIsSelected;
            } else {
                myControl += '[';
            }
            if (this.relationContent != '') {
                myControl += '{name:"' + this.relationContent + '"}]->() RETURN p LIMIT ';
            } else {
                myControl += ']->() RETURN p LIMIT ';
            }
            this.controller = myControl + this.num;
            console.log(myControl);
            this.$refs.tempHtml.src += '';
        },
        handleLabel() {
            this.$data.controller = 'MATCH (n:' + this.$data.IsSelected + ') RETURN n LIMIT 100';
            this.$refs.tempHtml.src += '';
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
        let that = this;
        this.$axios.post('/api/get_all_label').then(res => {
            for (let i in res.data) {
                console.log(i);
                that.$data.select.push(i);
            }
        });
        this.$axios.post('/api/get_entity_label').then(res => {
            that.select = res.data;
        });
        this.$axios.post('/api/get_relation_label', {}).then(response => {
            console.log(response);
            that.relationSelect = response.data;
        });
        console.log(this.$data.select);
    }
};
</script>

<style scoped>
.selectClass {
    width: 70px;
}
.handle-input {
    width: 300px;
    /* display: inline-block; */
}
.labelClass {
    color: #011608;
}
.table {
    width: 100%;
    font-size: 14px;
}
.input-with-select {
    width: 100px;
    background-color: #fff;
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
