<template>
    <div style="width: 100%;position: absolute;top: 60px;bottom: 0px;left: 0px;">
        <!-- <el-switch
        v-model="showList"
        active-text="文件列表"
        inactive-text="三维地图">
        </el-switch> -->
       <el-container style="padding:5px 0px;align-items: stretch;" v-show="showList">
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
                
                        
                        <el-autocomplete
                        class="inline-input"
                        v-model="content"
                        :fetch-suggestions="doQuery"
                        placeholder="请输入内容"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                        style="width:100%"
                        clearable
                        ></el-autocomplete>

                        <FileTable ref="fileTable" @viewFile="showFileView" @deleteFile="deleteFile"></FileTable>
                    
                
                
            </el-main>
            <el-dialog title="文件上传" :visible.sync="dialogFormVisible">
                <el-upload
                class="upload-file"
                ref="upload"
                :multiple="true"
                name="multipartfiles"
                :data="params"
                :action="uploadUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-error="handleError"
                :file-list="fileList"
                :beforeUpload="beforeAVatarUpload"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left:10px;" size="small" type="success" @click="submitUpload" :loading="uploading">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传shp文件，且不超过500kb</div>
                </el-upload>
            </el-dialog>

            <el-dialog
            :title="viewFileTitle"
            :visible.sync="viewFileVisible"
            fullscreen
            center>
            <div style="width:100%;height:90%;display:block;">
                <embed width="100%" height="600" style="overflow:auto;" :src="fileUrl" v-if="viewFileVisible"></embed>
            </div>
            </el-dialog>
        </el-container>
        <div style="width:100%;height:100%;"  v-show="!showList">
            <div id="viewDiv">

            </div>
            <div style="position:absolute;top:20px;left:50px;width:400px;height:400px;overflow:hidden;background-color:#fff;padding:10px;">
                <el-tabs>
                    <el-tab-pane>
                        <span slot="label"><i class="el-icon-date"></i> 项目属性</span>
                        <el-table
                            :data="projectInfo"
                            style="width: 100%"
                            height="350">
                            <el-table-column
                            prop="key"
                            label="属性">
                            </el-table-column>
                            <el-table-column
                            prop="value"
                            label="值">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="相关文档">
                        <el-table
                            :data="projectFileList"
                            style="width: 100%"
                            :span-method="objectSpanMethod"
                            height="350"
                            border>
                            <el-table-column
                            prop="fileAssort"
                            label="周期">
                            </el-table-column>
                            <el-table-column
                            prop="createTime"
                            label="生成时间">
                            </el-table-column>
                            <el-table-column
                            prop="fileName"
                            label="文件名">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="临时事件">临时事件</el-tab-pane>
                </el-tabs>
            </div>
            <div style="position:absolute;top:10px;left:45%;">
              
                <el-button type="primary" icon="el-icon-upload" @click="showShpUploadDialog"></el-button>
                
                <el-popover
                    placement="bottom"
                    width="400"
                    trigger="click">
                    <el-table
                      :data="shpList"
                      style="width:100%">

                        <el-table-column
                        type="index"
                        width="50">
                        </el-table-column>
                        <el-table-column property="fileName" label="文件名"></el-table-column>
                        <el-table-column width="150" label="操作" fixed="right">
                            <template slot-scope="scope">
                               <el-button type="primary" @click="handleAddToMap(scope.$index,scope.row)" size="small">叠加</el-button>
                               <el-button type="primary" @click="handleDelShp(scope.$index,scope.row)" size="small">删除</el-button>
                            </template>
                            
                        </el-table-column>
                    </el-table>
                    <el-button type="primary" icon="el-icon-more" slot="reference"></el-button>
                </el-popover>
                <el-button type="primary" icon="el-icon-delete"></el-button>
            </div>
            <div style="position:absolute;top:">

            </div>
            <el-dialog title="shp文件上传" :visible.sync="shpUploadVisible">
                <el-upload
                class="upload-file"
                ref="shpUpload"
                :multiple="true"
                name="shpfiles"
                :action="shpUploadUrl"
                :on-preview="handlePreview2"
                :on-remove="handleRemove2"
                :on-success="handleSuccess2"
                :on-error="handleError2"
                :file-list="shpFileList"
                :beforeUpload="beforeAVatarUpload2"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left:10px;" size="small" type="success" @click="submitUpload2" :loading="uploading">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传shp文件，且不超过500kb</div>
                </el-upload>
            </el-dialog>
        </div>
        
        
    </div>
    
</template>
<script>
import {baseImgPath} from '@/config/env'
import Split from 'split.js'
import {baseUrl} from '../config/env'
import Tree from '../components/Tree'
import {mapState,mapMutations} from 'vuex'
import FileTable from '../components/FileTable'
import {getFileListByLike,deleteFileById,getShpFileList,getJSONFromShp,getGeoJSONFile} from '@/api/getData'
import esriLoader from 'esri-loader'
import Terraformer from 'terraformer'
import TerraformerArcGIS from 'terraformer-arcgis-parser'
import {projectFileList} from './projectinfo.js'

export default {
    data(){
        return {
            fileList:[],
            shpFileList:[],
            shpList:[],//shp文件列表
            projectInfo:[],//用海项目属性列表
            projectFileList:projectFileList,//用海项目文件列表
            OrderIndexArr:[],
            dialogFormVisible:false,
            uploadUrl:baseUrl+'/file/upload',
            shpUploadUrl:baseUrl+'/file/uploadShpFiles',

            params:{
                folderId:""
            },
            content:"",
            viewFileTitle:"文件查看",
            viewFileVisible:false,
            shpUploadVisible:false,
            fileUrl:'',
            uploading:false,
            showList:false,
            activeName:'second',
            mapObj:{},
            htMap:{}

        }
    },
    computed:{
        ...mapState(['treeList','selectNode','folderId'])
    },
    methods:{
        submitUpload(){
            this.params.folderId=this.folderId;
            this.$refs.upload.submit();
            this.uploading=true;
        },
        submitUpload2(){
            this.$refs.shpUpload.submit();
            this.uploading=true;
        },
        handleRemove(file,fileList){

        },
        handleRemove2(file,fileList){

        },
        handlePreview(file){

        },
        handlePreview2(file){

        },
        showDialog(){
           this.$refs.fileTable.fileList=[];
           this.dialogFormVisible=true;
        },
        beforeAVatarUpload(file){
            //进行文件格式判断
        },
        beforeAVatarUpload2(file){
            //进行文件格式判断
        },
        handleSuccess(response,file,fileList){
            if(response.code=='0'){
                this.$message("文件上传成功"); 
            }else{
                this.$message.error("文件上传失败");
            }
            this.dialogFormVisible=false;
            this.uploading=false;
            this.$refs.fileTable.initTable();
        },
        handleSuccess2(response,file,fileList){
            if(response.code=='0'){
                this.$message("文件上传成功"); 
            }else{
                this.$message.error("文件上传失败");
            }
            this.shpUploadVisible=false;
            this.uploading=false;
        },
        handleError(err,file,fileList){
           this.$message.error("文件上传失败"+err);
        },
        handleError2(err,file,fileList){
           this.$message.error("文件上传失败"+err);
        },
        async doQuery(queryString,cb){
           const res=await getFileListByLike({content:queryString});
           if(res.code==0){
               //this.$refs.fileTable.fileList=res.data;
               var data=res.data;

               data.forEach((ele,index) => {
                   ele.value=ele.fileName+"--------......"+ele.content.substring(ele.content.indexOf(queryString));
                   //newData.push({value:ele.fileName+"--------"+ele.content})
               })
               cb(data)
           }
        },
        async getShpFileList(){
           const res=await getShpFileList();
           if(res.code==0){
               this.shpList=res.data;
           }
        },
        showFileView(row){
            this.viewFileTitle=row.fileName;
            this.viewFileVisible=true;
            this.fileUrl=baseUrl+'/upload/'+row.showFileName;
            
        },
        async deleteFile(row){
            const res=await deleteFileById(row,'POST');
            if(res.code==0){
                this.$message("文件删除成功");
            }else{
                this.$message.error("文件删除失败");
            }
            this.$refs.fileTable.initTable();
        },
        
        loadArcgis(){
            //该方法用于加载arcgis依赖的js，css等
            esriLoader.loadScript({
                //加载js
                url:'http://localhost:8080/arcgis_js_api/library/4.9/dojo/dojo.js',
                dojoConfig:{
                    async:true
                }
            });
            //加载css
            esriLoader.loadCss('http://localhost:8080/arcgis_js_api/library/4.9/esri/css/main.css');
            //加载模块
            esriLoader.loadModules([
                'esri/Map',
                'esri/config',
                'esri/request',
                'esri/Color',
                'esri/views/SceneView',
                'esri/widgets/LayerList',
                'esri/layers/BaseTileLayer',
                'esri/layers/ImageryLayer',
                'esri/layers/TileLayer',
                'esri/layers/MapImageLayer',
                'esri/Graphic',
                'esri/layers/GraphicsLayer',
                'esri/symbols/SimpleMarkerSymbol',
                'esri/symbols/SimpleLineSymbol',
                'esri/symbols/SimpleFillSymbol',
                'esri/renderers/SimpleRenderer',
                'esri/geometry/SpatialReference',
                'esri/geometry/support/webMercatorUtils',
                'esri/geometry/Geometry',
                'esri/geometry/Point',
                'esri/geometry/Multipoint',
                'esri/geometry/Polyline',
                'esri/geometry/Polygon',
                'dojo/_base/url',
                'dojo/_base/lang',
                'esri/layers/FeatureLayer'
            ],{
                url:'http://localhost:8080/arcgis_js_api/library/4.9/dojo/dojo.js'
            })
                .then(this.loading)
                .then(obj => {
                    this.initMap(obj);
                }).catch((err) => {
                    console.trace(err.message);
                })

        },
        loading([Map,esriConfig,esriRequest,Color,SceneView,LayerList,BaseTileLayer,ImageryLayer,TileLayer,MapImageLayer,
                  Graphic,GraphicsLayer,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,SimpleRenderer,SpatialReference,
                  webMercatorUtils,Geometry,Point,Multipoint,Polyline,Polygon,Url,lang,FeatureLayer]){

            let GeoJsonLayer=GraphicsLayer.createSubclass({
                properties:{
                    

                },
                constructor:function(options){
                    this._terrafomer=(typeof Terraformer!=='undefined')?Terraformer:null,
                    this._terrafomerArcGIS=(typeof TerraformerArcGIS!=='undefined')?TerraformerArcGIS:null,
                    this._validState=true;
                    this._url=options.url;
                    this._data=options.data;
                    this._inSpatialReference=new SpatialReference({wkid:4326});
                    this._outSpatialReference=null;;
                    if(options.renderer){
                        this.renderer=options.renderer;
                    }
                    this._height=options.height;
                    this._setDefaultSymbols();
                    //this._setCorsSevers();
                    //this._setXhrDefaults(10000);
                    this._maxDraw=options.maxdraw||1000;
                    this._drawCount=0;
                    this._drawCountTotal=0;
                    this.fullExtent=null;
                    if(options.onLoad&&typeof options.onLoad==='function'){
                        this.onLoad=options.onLoad;
                    }
                    this._updateState();
                    this._loadGeoJson();
                },
                _setDefaultSymbols:function(){
                    function getRandomColor(mainColor,transparency){
                        function getRandomInt(min,max){
                            return Math.floor(Math.random()*(max-min+1))+min;
                        }
                        switch(mainColor){
                            case "red":
                               return new Color([getRandomInt(150,255),getRandomInt(0,255),getRandomInt(0,255),transparency]);
                            case "green":
                               return new Color([getRandomInt(0,155),getRandomInt(150,255),getRandomInt(0,155),transparency]);
                            case "blue":
                               return new Color([getRandomInt(0,255),getRandomInt(0,255),getRandomInt(150,255),transparency]);
                        }
                    }
                    this._simplePointSym=new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,8,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,getRandomColor("blue",0.5),1),
                            getRandomColor("blue",0.75));
                    this._simpleLineSym=new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,getRandomColor("red",0.9),2);
                    
                    this._simplePolygonSym = {
                        type: "simple-fill", // autocasts as new SimpleFillSymbol()
                        color: [227, 139, 79, 0.8],
                        outline: { // autocasts as new SimpleLineSymbol()
                            color: [255, 255, 255],
                            width: 1
                        }
                    };
                             
                },
                _setCorsSevers:function(){
                    esriConfig.defaults.io.corsEnabledServers.push("http://localhost");
                    if(this._url){
                        var url=new Url(this._url),
                            scheme=url.scheme,
                            host=url.host,
                            port=url.port,
                            server=scheme+"://"+host;
                        if(scheme&&host){
                            esriConfig.defaults.io.corsEnabledServers.push(server);
                        }
                    }
                },
                _setXhrDefaults:function(postSize){
                    esriConfig.defaults.io.postLength=postSize;
                },
                _updateState:function(){
                    if(!this._inSpatialReference){
                        this._validState=false;
                        console.error("GeoJsonLayer Error:Invalid SpatialReference.");
                    }
                    if(!this._terrafomer){
                        this._validState=false;
                        console.error("GeoJsonLayer Error: Invalid Terraformer reference. Please add a reference to your html page.");
                    }
                },
                _setMap:function(map,surface){
                    var div=this.inherited(arguments);
                    if(!this._validState){
                        return div;
                    }
                    this._outSpatialReference=map.SpatialReference;
                    this._loadGeoJson();
                    return div;
                },
                _unsetMap:function(){
                    return this.inherited(arguments);
                },
                /* add:function(graphic){
                    if(!this._validState){
                        return;
                    }
                    this.inherited(arguments)
                    this._incrementDrawCount();
                    return;
                }, */
                clear:function(){
                    this._drawCount=0;
                    this._drawCountMax=0;
                    return this.inherited(arguments);
                },
                _loadGeoJson:function(){
                    if(this._data){
                        this._getGeoJson(this._data);
                    }else if(this._url){
                        this._getGeoJsonXhr(this._url);
                    }
                },
                _getGeoJsonXhr:function(url){
                    var requestHandle=esriRequest({
                        url:url,
                        handleAs:"json"
                    });
                    requestHandle.then(lang.hitch(this,this._getGeoJson),
                        lang.hitch(this,this._errorGetGeoJsonXhr));
                },
                _getGeoJson:function(geojson){
                    if(geojson.type!=="FeatureCollection"||!geojson.features){
                        console.error("GeoJsonLayer Error: Invalid GeoJSON FeatureCollection. Check url or data structure.");
                        return;
                    }
                    var arcgisJson=this._terraformerConverter(geojson);
                    this._addGraphics(arcgisJson);
                },
                _terraformerConverter:function(geojson){
                    var json,arcgis;
                    json=new this._terrafomer.Primitive(geojson);
                    arcgis=this._terrafomerArcGIS.convert(json);
                    return arcgis;
                },
                _errorGetGeoJsonXhr:function(e){
                    console.error("GeoJsonLayer Error: Could not load GeoJSON. Check url. File must be on the same domain or server must be CORS enabled.\n\n"+e);
                },
                _incrementDrawCount:function(){
                    this._drawCount++;
                    if(this._drawCount===this._drawCountTotal){
                        this._updateLayerExtent();
                        this.onUpdateEnd();
                    }
                },
                _decrementDrawCount:function(){
                    this._drawCountTotal--;
                },
                _updateLayerExtent:function(){
                    var extent;
                    if(this.graphics.length){
                        //得到所有graphics的范围
                        //extent=graphicsUtils.graphicsExtent(this.graphics);
                    }
                    this.fullExtent=extent;
                },
                _getEsriSymbol:function(geometryType){
                    var sym;
                    switch(geometryType){
                        case "point":
                           sym=this._simplePointSym;
                           break;
                        case "multipoint":
                           sym=this._simplePointSym;
                           break;
                        case "polyline":
                           sym=this._simpleLineSym;
                           break;
                        case "polygon":
                           sym=this._simplePolygonSym;
                           break;
                        case "extent":
                           sym=this._simplePolygonSym;
                           break;
                    }
                    return sym;
                },
                _addGraphicToLayer:function(graphic){
                    if(this._inSpatialReference.wkid===4326||this._inSpatialReference.wkid===102100){
                        /* if(graphic.geometry.spatialReference.wkid===4326){
                            graphic.geometry=webMercatorUtils.geographicToWebMercator(graphic.geometry);
                        } */
                        this.add(graphic);
                    }
                },
                _createGraphic:function(arcgisJson){
                    var graphic;
                    graphic=new Graphic({attributes:arcgisJson.attributes});
                    var geometry=arcgisJson.geometry;
                    var geo;
                    if(geometry!=null){
                        if(geometry.x){
                            geo=new Point(geometry);
                        }else if(geometry.points){
                            geo=new Multipoint(geometry);
                        }else if(geometry.paths){
                            geo=new Polyline(geometry);
                        }else if(geometry.rings){
                            for(var i=0;i<geometry.rings[0].length;i++){
                                geometry.rings[0][i].push(this._height);
                            }
                            geo=new Polygon(geometry);
                        }
                    }else{
                        return null;
                    }
                    
                    if(geo)
                       graphic.geometry=geo;
                    if(this.renderer&&this.renderer.symbol){
                        graphic.symbol=this.renderer.symbol;
                    }else{
                        graphic.symbol=this._getEsriSymbol(graphic.geometry.type);
                    }
                    graphic.geometry.spatialReference=this._inSpatialReference;
                    return graphic;
                },
                _addGraphics:function(arcgisJson){
                    var i,
                        feature,
                        graphic;
                    if(arcgisJson.length>this._maxDraw){
                        this._drawCountTotal=this._maxDraw;
                        console.warn("GeoJsonLayer Warning: Large dataset detected. On drawing the first "+this._maxDraw+" features!");
                    }else{
                        this._drawCountTotal=arcgisJson.length;
                    }
                    for(i=0;i<this._drawCountTotal;i++){
                        feature=arcgisJson[i];
                        graphic=this._createGraphic(feature);
                        if(graphic)
                            this._addGraphicToLayer(graphic);
                    }
                    this.load(this);
                }
            });
            let TintLayer=BaseTileLayer.createSubclass({
                properties:{
                    urlTemplate:null,
                    tint:{
                        value:null,
                        type:Color
                    }
                },
                getTileUrl:function(level,row,col){
                    
                    return this.urlTemplate.replace("{z}",level).replace("{x}",col).replace("{y}",row);
                },
                fetchTile:function(level,row,col){
                    let url=this.getTileUrl(level,row,col);
                    return esriRequest(url,{
                        responseType:"image",
                        allowImageDataAccess:true
                    }).then(function(response){
                        let image=response.data;
                        let width=this.tileInfo.size[0];
                        let height=this.tileInfo.size[0];
                        let canvas=document.createElement("canvas");
                        let context=canvas.getContext("2d");
                        canvas.width=width;
                        canvas.height=height;
                        context.drawImage(image,0,0,width,height);
                        return canvas;
                    }.bind(this));
                }
            })
            return {
                Map,esriConfig,esriRequest,Color,SceneView,LayerList,BaseTileLayer,ImageryLayer,TileLayer,MapImageLayer,
                Graphic,GraphicsLayer,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,SimpleRenderer,SpatialReference,
                  webMercatorUtils,Geometry,Point,Multipoint,Polyline,Polygon,Url,lang,FeatureLayer,GeoJsonLayer,TintLayer
            }
        },
        initMap(obj){
            //将对象保存到vue data的mapObj中，方便调用
            this.mapObj=obj;
            this.mapObj.esriConfig.request.corsEnabledServers.push("t0.tianditu.cn");
            let stamenTileLayer=new this.mapObj.TintLayer({
                urlTemplate:"http://t0.tianditu.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles",
                tint:new this.mapObj.Color("#004FBB"),
                title:"北斗天地图"
            });

            let anoLayer = new this.mapObj.TintLayer({           	       
			   urlTemplate:"http://t0.tianditu.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles",       
			   tint: new this.mapObj.Color("#004FBB"),          
			   title: "北斗天地图标注"        
            });  
            
            let yxLayer = new this.mapObj.MapImageLayer("http://localhost:6080/arcgis/rest/services/MyMapService/MapServer");
            this.htMap.map=new this.mapObj.Map({
                ground:'world-elevation',
                basemap:'satellite',
                layers:[anoLayer]
            });
            this.htMap.map.add(yxLayer);

            let featureLayer=new this.mapObj.FeatureLayer({
                url:'https://192.168.1.26:6443/arcgis/rest/services/PyTownBoundMapService/MapServer'
            })
            this.htMap.map.add(featureLayer);
            this.htMap.view=new this.mapObj.SceneView({
                container:"viewDiv",
                map:this.htMap.map,
                camera:{
                    position:[
                        114.18354871976737,
                        21.803958177703183,
                        
                        58961.122179054655
                    ],
                    heading:356.8913789613909,
                    tilt:58.52182524115889
                },
                popup: {
                    dockEnabled: true,
                    dockOptions: {
                        // Disables the dock button from the popup
                        buttonEnabled: false,
                        // Ignore the default sizes that trigger responsive docking
                        breakpoint: false,
                    },
                    
                },
            });
            var layerList=new this.mapObj.LayerList({
                view:this.htMap.view
            });
            this.htMap.view.ui.add(layerList,"top-right");
            var _this=this;
            _this.htMap.view.on("click",function(event){
               
                _this.htMap.view.hitTest(event).then(function(response){
                
                   if(response.results.length){
                       var graphic=response.results.filter(function(result){
                           return result.graphic.layer===_this.htMap.geoJsonLayer;
                       })[0].graphic;
                       var attributes=graphic.attributes;
                      _this.projectInfo=[];
                       for(var key in attributes){
                           var value=attributes[key];
                           
                           _this.projectInfo.push({
                               'key':key,
                               'value':value
                           })
                       }
                       /* var content='<table>';
                       for(var key in attributes){
                           content+='<tr><td>'+key+'</td><td>'+attributes[key]+'</td></tr>';
                       }
                       content+='</table>';
                       var popup=htMap.view.popup;
                       popup.open({
                           title:attributes['业主单位'],
                           location:graphic.geometry.extent.center,
                           content:content,
                           alignment:'bottom-left'
                       }) */
                   }
                })
            })
            /* this.htMap.view.watch("camera",function(camera){
                var tilt=camera.tilt;
                var heading=camera.heading;
                var x=camera.position.x;
                var y=camera.position.y;
                var z=camera.position.z;
                console.log("tilt:"+tilt+";heading:"+heading+";x:"+x+";y:"+y+";z:"+z)
            }) */
            
        },
        showShpUploadDialog(){
            this.shpUploadVisible=true;
        },
        async handleAddToMap(index,row){
            const res=await getJSONFromShp({fileId:row.fileId});
            
            if(res.code==0){
                var symbol1={
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [227, 139, 79, 0.8],
                    outline: { // autocasts as new SimpleLineSymbol()
                        color: [255, 255, 255],
                        width: 1
                    }
                }
                var symbol2={
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [0, 0, 255, 0.8],
                    outline: { // autocasts as new SimpleLineSymbol()
                        color: [0, 255, 0],
                        width: 1
                    }
                }
                var symbol,height;
                if(row.fileName=='深圳市行政区划图_演示用.shp'){
                    symbol=symbol1;
                    height=100;
                }else{
                    symbol=symbol2;
                    height=150;
                }
               this.htMap.geoJsonLayer=new this.mapObj.GeoJsonLayer({
                   data:res.data,
                   renderer:{
                       symbol:symbol
                   },
                   height:height
                });
               
               this.htMap.map.add(this.htMap.geoJsonLayer);
            }
            /* var polygon={
                type:"polygon",
                rings:[
                   [ 114.503180556205095, 22.587116666923123], 
                   [ 114.503319444268087, 22.587286111123859], 
                   [ 114.503577778211195, 22.586799999679055], 
                   [ 114.503819444304057, 22.586530556430379], 
                   [ 114.503888889215176, 22.586333333392314], 
                   [ 114.50386944536092, 22.586094444040395], 
                   [ 114.50372777793747, 22.585811111211793], 
                   [ 114.503519443883448, 22.585649999740291], 
                   [ 114.503258106009127, 22.585575014747668], 
                   [ 114.502970221619108, 22.58559277519571], 
                   [ 114.502649999875416, 22.585741666764712], 
                   [ 114.502213889393829, 22.585944443918141], 
                   [ 114.502336110626786, 22.58609722231806], 
                   [ 114.503108332671218, 22.585755556006482], 
                   [ 114.503400726886042, 22.585794833626576], 
                   [ 114.503580555538335, 22.585941667074003], 
                   [ 114.503677778398242, 22.586172222429497], 
                   [ 114.503647222138241, 22.586413889003548], 
                   [ 114.50341111145049, 22.586691666960462], 
                   [ 114.503180556205095, 22.587116666923123] 
                ]
            }
            var fillSymbol = {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: [227, 139, 79, 0.8],
                outline: { // autocasts as new SimpleLineSymbol()
                    color: [255, 255, 255],
                    width: 1
                }
            };
            var polygonGraphic = new this.mapObj.Graphic({
                geometry: polygon,
                symbol: fillSymbol
            });
            this.htMap.graphicsLayer=new this.mapObj.GraphicsLayer();
            this.htMap.graphicsLayer.add(polygonGraphic);
            
            
            var point={
                type:"point",
                x:114.503180556205095,
                y:22.587116666923123
            }
            var markerSymbol={
                type:"simple-marker",
                color:[226,119,40],
                outline:{
                    color:[255,255,255],
                    width:2
                }
            };
            var pointGraphic=new this.mapObj.Graphic({
                geometry:point,
                symbol:markerSymbol
            })
            this.htMap.graphicsLayer.add(pointGraphic);
            this.htMap.map.add(this.htMap.graphicsLayer); */
            
        },
        handleDelShp(index,row){

        },
        getOrderNumber(){
            let OrderObj={}
            this.projectFileList.sort((obj1,obj2) => {
                    var val1=obj1.sort;
                    var val2=obj2.sort;
                    if(val1<val2){
                        return -1;
                    }else if(val1>val2){
                        return 1;
                    }else{
                        return 0;
                    }
            })
            this.projectFileList.forEach((element,index) => {
                element.rowIndex=index;
                if(OrderObj[element.fileAssort]){
                    OrderObj[element.fileAssort].push(index);
                }else{
                    OrderObj[element.fileAssort]=[];
                    OrderObj[element.fileAssort].push(index)
                }
            })

            //将数组长度大于1的值，存储到this.OrderIndexArr(也就是需要合并的项)
            for(let k in OrderObj){
                if(OrderObj[k].length>1){
                    this.OrderIndexArr.push(OrderObj[k]);
                }
            }

        },

        //合并单元格
        objectSpanMethod({row,column,rowIndex,columnIndex}){
           
            if(columnIndex==0){
                for(let i=0;i<this.OrderIndexArr.length;i++){
                    let element=this.OrderIndexArr[i];
                    for(let j=0;j<element.length;j++){
                        let item=element[j];
                        if(rowIndex==item){
                            if(j==0){
                                return {
                                    rowspan:element.length,
                                    colspan:1
                                }
                            }else if(j!=0){
                                return {
                                    rowspan:0,
                                    colspan:0
                                }
                            }
                        }
                    }
                }
            }
            
        },
        handleSelect(item){
           delete item.content;
           this.$refs.fileTable.fileList=[item];
           this.$refs.fileTable.total=1;
        }
    },
    mounted(){
        Split(['#one', '#two'], {
            sizes: [15, 85],
            minSize: 200
        });
        this.loadArcgis();
        this.getShpFileList();
        this.getOrderNumber();
    },
    components:{
        Tree,
        FileTable,
    }
        
}
</script>
<style>
/*滑块轨道样式*/
.file_content>div::-webkit-scrollbar-track{
    box-shadow:inset 0 0 6px rgba(0,0,0,.3);
    border-radius:5px;
}
/*滑块里面小方块样式*/
.file_content>div::-webkit-scrollbar-thumb{
    background-color:rgba(50,65,87,0.5);
    outline:1px solid slategrey;
    border-radius:5px;
}
.file_content>div::-webkit-scrollbar{
    width:10px;
}
#viewDiv{
    width:100%;
    height:100%;
}
.el-tabs__content{
    height:92%;
    overflow-x:hidden;
    overflow-y:scroll;
}
#infoDiv{
    position: absolute;
    top:15px;
    left:60px;
}
#infoDiv input{
    border:none;
    box-shadow:rgba(0,0,0,0.3) 0px 1px 2px;
}
</style>
