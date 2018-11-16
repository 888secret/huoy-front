<template>
    <div>
        <el-table
          ref="fileTable"
          :data="fileList.slice((pageNum-1)*pageSize,pageNum*pageSize)"
          tooltip-effect="dark"
          style="width:100%"
          height="400"
          @selection-change="hanleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="文件路径"
            prop="filePath"
            >
          </el-table-column>
          <el-table-column
            label="文件名"
            prop="fileName">
          </el-table-column>
          <el-table-column
            label="文件类型"
            prop="fileType">
          </el-table-column>
          <el-table-column
            label="文件大小"
            prop="fileSize">
          </el-table-column>
          <el-table-column
            label="更新时间"
            prop="updateTime">
          </el-table-column>
          <el-table-column
            label="文件内容"
            prop="content">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-view" @click="viewFile(scope.row)" circle></el-button>
                <el-button type="warning" size="mini" icon="el-icon-delete" @click="deleteFile(scope.row)" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :page-sizes="[3,6,9]"
                  :page-size="pageSize"
                  :current-page="pageNum"
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import {getFileListByFolderId} from '@/api/getData'
export default {
    data(){
        return {
            fileList:[],
            pageSize:3,
            pageNum:1,
            total:0
        }
    },
    watch:{
        selectNode(val){
            this.initTable();
        }
    },

    computed:{
        ...mapState(['selectNode']),
    },
    methods:{
        async initTable(){
            const res=await getFileListByFolderId({
                folderId:this.selectNode.id
            });
            if(res.code==0){
                this.$message("查询文件列表成功");
                this.fileList=res.data;
                this.total=res.data.length;
            }else{
                this.$message.error("查询文件列表失败"+JSON.stringify(res));
            }
        },
        hanleSelectionChange(){

        },
        viewFile(row){
            //查看文件
            this.$emit("viewFile",row);
        },
        deleteFile(row){
            this.$emit("deleteFile",row);
        },
        handleSizeChange(pageSize){
            this.pageSize=pageSize;
        },
        handleCurrentChange(pageNum){
            this.pageNum=pageNum;
        }
    }
}
</script>
<style>

</style>
