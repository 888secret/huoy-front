<template>
    <div class="main_content">
        <el-container style="height:100%;">
            <el-header style="background:rgb(165, 187, 210);position:relative;height:60px;">
                <h1 style="color:#fff;margin:10px 10px;">海洋监测中心数管平台</h1>
                <el-menu 
                    :default-active="activeIndex" 
                    class="el-menu-demo" 
                    mode="horizontal" 
                    background-color="rgb(165, 187, 210)"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    style="position:absolute;right:200px;bottom:0px;border-bottom: solid 1px #e6e6e600;" router>
                    <el-menu-item index="/datamanage">数据管理</el-menu-item>
                    <el-menu-item index="2">测试1</el-menu-item>
                    <el-menu-item index="3">测试2</el-menu-item>
                </el-menu>
                <el-dropdown class="user_img">
                    <span style="display:flex;align-items:center;cursor:pointer;padding: 5px;box-shadow: 5px 5px 5px #000;background: rgb(189, 163, 163);border-radius: 4px;" class="el-dropdown-link">
                        <img src="../assets/img/518153.png">
                        <span>管理员</span>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>退出</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </el-container>
    </div>
</template>
<script>

export default {
    data(){
        return {
            activeIndex:'/datamanage'
        }
    }
}
</script>
<style>
@import url();
.main_content{
    width:100%;
    height:100%;
}
.left_div{
   position: absolute;
   background:gray;
   top:20px;
   left:20px;
   padding:5px;
   width:200px;
   height:400px;
}
.user_img{
    position: absolute;
    right:10px;
    top:15px;
    color:#fff;
    line-height: 25px;
}
.user_img img{
    width:25px;
    height:25px;
}
.folder-icon{
    display:block;
    width: 16px;
    height: 16px;
    background-size: 16px 16px;
    float: left;
    background-image: url('../assets/img/1084345.png')
}
.custom-tree-node{
    display: flex;
    align-items: center;
}
.gutter {
  background-color: #eee;
 
  background-repeat: no-repeat;
  background-position: 50%;
 
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}
 
.gutter.gutter-horizontal {
  background-image: url('../assets/img/vertical.png');
}
 
.gutter.gutter-vertical {
  background-image: url('../assets/img/horizontal.png');
}
 
.split {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}
 
.split, .gutter.gutter-horizontal {

  float: left;
} 
</style>


