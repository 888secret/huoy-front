<template>
    <el-container style="padding:5px 0px;">
        <el-aside style="width:200px;border:1px solid rgb(230, 207, 207);" class="split split-horizontal" id="one">
            <!-- <el-tree 
                :data="data" 
                :props="defaultProps"
                :render-content="renderContent"
                >
            </el-tree> -->
            <Tree></Tree>
        </el-aside>
        <el-main style="border:1px solid rgb(230, 207, 207);" class="split split-horizontal" id="two">
            <!--地图div-->
            <div class="map_div" id="mapDiv">
            </div>
        </el-main>
    </el-container>
</template>
<script>
import {baseImgPath} from '@/config/env'
import Split from 'split.js'
import Tree from '../components/Tree'
export default {
    data(){
        return {
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            data:[{
                label:'一级1',
                className:'folder-icon',
                children:[{
                    label:'二级1-1',
                    className:'folder-icon',
                    children:[{
                        label:'三级1-1-1',
                        className:'folder-icon'
                    }]
                },{
                    label:'一级2',
                    className:'folder-icon',
                    children:[{
                        label:'二级2-1',
                        className:'folder-icon',
                        children:[{
                            label:'三级2-1-1',
                            className:'folder-icon'
                        }]
                    },{
                        label:'二级2-2',
                        className:'folder-icon',
                        children:[{
                            label:'三级2-2-1',
                            className:'folder-icon'
                        }]
                    }]
                }]
            }]
        }
    },
    methods:{
        renderContent(h,{node,data,store}){
           return (
              <span class="custom-tree-node">
                <i class={data.className}></i>
                <span style="margin-left:5px;">{node.label}</span>
                <i class="el-icon-edit-outline"></i>
                <i class="el-icon-plus"></i>
                <i class="el-icon-minus"></i>
              </span>
              );
        }

    },
    mounted(){
        Split(['#one', '#two'], {
            sizes: [25, 75],
            minSize: 200
        });
    },
    components:{
        Tree
    }
        
}
</script>

