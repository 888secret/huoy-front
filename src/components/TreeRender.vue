<template>
    <span class="tree-expand">
        
        <span class="tree-label">
           <img src="../assets/img/1084345.png">
        </span>
        <span class="tree-label" v-show="DATA.isEdit=='1'?true:false">
            <el-input class="edit" size="mini" autofocus
              v-model="DATA.nodeName"
              :ref="'treeInput'+DATA.id"
              @click.stop.native="nodeEditFocus"
              @keyup.enter.stop.native="nodeEditPass(STORE,DATA,NODE)"></el-input>
            <i class="el-icon-check" @click="nodeEditPass(STORE,DATA,NODE)"></i>
        </span>
        <span v-show="DATA.isEdit=='0'?true:false"
          :class="[DATA.id > maxexpandId?'tree-new tree-label':'tree-label']">
          <span>{{DATA.nodeName}}</span>
        </span>
        <span class="tree-btn" v-show="DATA.isEdit=='0'?true:false">
            <i class="el-icon-plus" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>
            <i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
            <i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
        </span>
    </span>
</template>

<script>
export default {
    name:'treeExpand',
    props:['NODE','DATA','STORE','maxexpandId'],
    methods:{
        nodeAdd(s,d,n){
            this.$emit('nodeAdd',s,d,n)
        },
        nodeEdit(s,d,n){
            d.isEdit='1';
            this.$nextTick(()=>{
                this.$refs['treeInput'+d.id].$refs.input.focus();
            })
            this.$emit('nodeEdit',s,d,n)
        },
        nodeDel(s,d,n){
            this.$emit('nodeDel',s,d,n);
        },
        nodeEditPass(s,d,n){
            d.isEdit='0';
            this.$emit('nodeSave',s,d,n)
        },
        nodeEditFocus(){

        }
    }
}
</script>
<style>
.tree-expand{
    overflow:hidden;
    display: flex;
    align-items: center;
}
.tree-expand .tree-label.tree-new{
    font-weight:600;
}
.tree-expand .tree-label{
    font-size:0.9em;
}
.tree-expand .tree-label .edit{
    width:80%;
}
.tree-expand .tree-btn{
    display:none;
    float:right;
    margin-right:20px;
}
.tree-expand .tree-btn i{
    color:#8492a6;
    font-size:0.9em;
    margin-right:3px;
}
</style>

