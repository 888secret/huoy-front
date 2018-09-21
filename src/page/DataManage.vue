<template>
    <el-container style="padding:5px 0px;">
        <el-aside style="width:200px;border:1px solid rgb(230, 207, 207);" class="split split-horizontal" id="one">
            <!-- <el-tree 
                :data="data" 
                :props="defaultProps"
                :render-content="renderContent"
                >
            </el-tree> -->
            <Tree @showDialog="showDialog"></Tree>
        </el-aside>
        <el-main style="border:1px solid rgb(230, 207, 207);" class="split split-horizontal" id="two">
            <!--地图div-->
            <FileTable ref="fileTable"></FileTable>
        </el-main>
        <el-dialog title="文件上传" :visible.sync="dialogFormVisible">
            <el-upload
              class="upload-file"
              ref="upload"
              :multiple="true"
              name="multipartfiles"
              :data="folderId"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-error="handleError"
              :file-list="fileList"
              :beforeUpload="beforeAVatarUpload"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left:10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-dialog>
    </el-container>
</template>
<script>
import {baseImgPath} from '@/config/env'
import Split from 'split.js'
import {baseUrl} from '../config/env'
import Tree from '../components/Tree'
import {mapState,mapMutations} from 'vuex'
import FileTable from '../components/FileTable'
export default {
    data(){
        return {
            fileList:[],
            dialogFormVisible:false,
            uploadUrl:baseUrl+'/file/upload',

        }
    },
    computed:{
        ...mapState(['treeList','selectNode','folderId'])
    },
    methods:{
        submitUpload(){
            
            this.$refs.upload.submit();
        },
        handleRemove(file,fileList){

        },
        handlePreview(file){

        },
        showDialog(){
           this.$refs.fileTable.fileList=[];
           this.dialogFormVisible=true;
        },
        beforeAVatarUpload(file){
            //进行文件格式判断
        },
        handleSuccess(response,file,fileList){
            if(response.code=='0'){
                this.$message("文件上传成功"); 
            }else{
                this.$message.error("文件上传失败");
            }
            this.dialogFormVisible=false;
                
        },
        handleError(err,file,fileList){
           this.$message.error("文件上传失败"+err);
        }

    },
    mounted(){
        Split(['#one', '#two'], {
            sizes: [15, 85],
            minSize: 200
        });
    },
    components:{
        Tree,
        FileTable,
    }
        
}
</script>

