<template>
    <div>
        <el-table
          ref="fileTable"
          :data="fileList"
          tooltip-effect="dark"
          style="width:100%"
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
        
        </el-table>

    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
import {getFileListByFolderId} from '@/api/getData'
export default {
    data(){
        return {
            tableData:[],
            ...mapState(['selectNode']),
            fileList:[]

        }
    },
    watch:{
        selectNode(val){
            this.initTable();
        }
    },
    methods:{
        ...mapMutations(['setFileList']),
        async initTable(d){
            const res=await getFileListByFolderId({
                folderId:d.id
            });
            if(res.code==0){
                this.$messgae("查询文件列表成功");
                this.fileList=res.data;
            }else{
                this.$message.error("查询文件列表失败"+JSON.stringify(res));
            }
        },
        hanleSelectionChange(){

        }
    }
}
</script>
<style>

</style>
