<template>
    <div style="width:100%;height:100%;">
        
        <!-- <el-tooltip class="item" effect="dark" :content="tooltipMsg" placement="top-start">
           <i :class="isExpand?'el-icon-arrow-up':'el-icon-arrow-down'" @click="handleExpand"></i>
        </el-tooltip> -->
        <div style="padding:5px;display:flex;align-items:center;align-content:space-between">
            <el-input
              style="width:150px;"
              placeholder="请输入文件名"
              v-model="filterText">
            </el-input>
            <el-tooltip class="item" effect="dark" content="新建顶部节点" placement="top-start">
              <i class="el-icon-plus" @click="handleAddTop"></i>
            </el-tooltip>
        </div>
        <div  class="expand">
            <el-tree ref="expandMenuList" class="expand-tree"
                    v-if="isLoadingTree"
                    :data="treeList"
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    :render-content="renderContent"
                    :filter-node-method="filterNode"
                    :default-expand-all="true"
                    :default-expanded-keys="defaultExpandedKeys"
                    @node-click="handleNodeClick"></el-tree>
        </div>
        
    </div>
</template>
<!-- VUE饿了么树形添加增删改功能按钮 -->
<script>
import TreeRender from '../components/TreeRender'
import api from '@/api/api'
import {selectTree,saveNode} from '@/api/getData'
import {mapState,mapMutations} from 'vuex'
export default {
    data(){
        return {
            isLoadingTree: false,//是否加载节点树
            defaultProps:{
                children: 'childList',
                label:'nodeName'
            },
            isExpand:false,//是否全部展开
            tooltipMsg:'全部展开',
            filterText:'',
            defaultExpandedKeys:[],//默认展开的节点
            
        }
    },
    computed:{
        ...mapState(['treeList','selectNode','folderId'])
    },
    mounted(){
        
    },
    created(){
        this.initExpand();

    },
    activated(){
        this.initExpand();

    },
    watch:{
        filterText(val){
            this.$refs.expandMenuList.filter(val);
        }
    },
    methods:{
        ...mapMutations(['setTreeList','setSelectNode','setFolderId']),
        filterNode(value,data){
            if(!value) return true;
            return data.name.indexOf(value)!==-1;
        },
        async initExpand(){
            /* this.setTree.map((a) => {
                this.allExpandKeys.push(a.id);
            }); */
            const res=await selectTree('POST');
            if(res.code==0){
                this.setTreeList(res.data);
                this.$message.success('查询树成功');
            }else{
                this.$message.error('查询树失败');
            }
            this.isLoadingTree=true;
        },
        handleNodeClick(d,n,s){//点击节点
            //d.isEdit='0';//放弃编辑状态
            this.setSelectNode(d);
        },
        renderContent(h,{node,data,store}){
            //加载节点
            let that=this;
            return h(TreeRender,{
                props:{
                    DATA: data,
                    NODE: node,
                    STORE: store
                },
                on: {
                    nodeAdd: ((s,d,n) => that.handleAdd(s,d,n)),
                    nodeEdit: ((s,d,n) => that.handleEdit(s,d,n)),
                    nodeDel: ((s,d,n) => that.handleDelete(s,d,n)),
                    nodeSave:((s,d,n) => that.handleSave(s,d,n)),
                    fileUpload:((s,d,n) => that.fileUpload(s,d,n))
                }
            });
        },
        handleAddTop(){
            this.setTree.push({
                parentId:'0',
                userId:'',
                projectId:'',
                nodeName:'新增节点',
                createTime:new Date(),
                folderName:'新增节点',
                isEdit:'1',
                childList:[]
            })
        },
        handleAdd(s,d,n){
            //增加节点
            if(n.level>=6){
                this.$message.error("最多只支持五级")
                return false;
            }
            //添加数据
            d.childList.push({
                parentId:d.id,
                userId:'',
                projectId:'',
                nodeName:'新增节点',
                createTime:new Date(),
                folderName:'',
                isEdit:'1',
                childList:[]
            });
            //展开节点
            if(!n.expanded){
                n.expanded=true;
            }
        },
        handleEdit(s,d,n){

        },
        handleDelete(s,d,n){
            //删除节点
            let that=this;
            //有子级的不删除
            if(d.children && d.children.length!==0){
                this.$message.error("此节点有子级，不可删除");
                return false;
            }else{
                //新增节点直接删除，否则要询问是否删除
                let delNode = () => {
                    let list=n.parent.data.children || n.parent.data,//节点同级数据
                      _index=99999;//要删除的index
                    list.map((c,i) => {
                        if(d.id==c.id){
                            _index=i;
                        }
                    })
                    let k=list.splice(_index,1);
                    this.$message.success("删除成功");
                }
                let isDel = () => {
                    that.$confirm("是否删除此节点？","提示",{
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        delNode()
                    }).catch(() => {
                        return false;
                    })
                }
                //判断是否新增
                d.id > this.non_maxexpandId?delNode():isDel()
            }
        },
        async handleSave(s,d,n){
            d.folderName=d.nodeName;
            const res=await saveNode(d,'POST');
            if(res.code==0){
                this.$message("保存节点成功")
            }else{
                this.$message.error('保存节点失败')
            }
            this.initExpand();
        },
        handleExpand(){
            if(this.isExpand){
                this.isExpand=false;
                for(var i=0;i<this.$refs.expandMenuList.store._getAllNodes().length;i++){
                  this.$refs.treeX.store._getAllNodes()[i].expanded=this.isexpand;
                }
                this.tooltipMsg="全部展开";
                
            }else{
                this.isExpand=true;
                for(var i=0;i<this.$refs.expandMenuList.store._getAllNodes().length;i++){
                  this.$refs.treeX.store._getAllNodes()[i].expanded=this.isexpand;
                }
                this.tooltipMsg="全部收起";
            }
        },
        fileUpload(s,d,n){
            //文件上传
            this.setFolderId(d.id);
            this.$emit('showDialog');
        }
    }
}
</script>
<style>
.expand{
    width:100%;
    height:90%;
    overflow:hidden;
}
.expand i{
    font-size: 15px;
    font-weight: bold;
    color:gray;
    margin-left: 20px;
    margin-bottom: 10px;
    cursor:pointer;
}
.expand i:hover{
    font-size: 18px;
}
.expand{
    padding-bottom: 10px;
    height:90%;
    padding-top:0px;
    margin:0px auto;
    overflow-y:auto;
    min-width: 200px;
}
.expand>div::-webkit-scrollbar-track{
    box-shadow:inset 0 0 6px rgba(0,0,0,.3);
    border-radius:5px;
}
.expand::-webkit-scrollbar-thumb{
    background-color:rgba(50,65,87,0.5);
    outline:1px solid slategrey;
    border-radius:5px;
}
.expand::-webkit-scrollbar{
    width:10px;
}
.expand-tree{
    border:none;
    margin-top:10px;
}
.expand-tree .is-tree-node.is-current,
.expand-tree .el-tree-node__content:hover .tree-btn{
    display:inline-block;
}
.expand-tree .is-current>.el-tree-node__content .tree-label{
    font-weight:600;
    white-space:normal;
}
.expand-tree .el-tree-node__content{
    height:30px;
}
</style>
