(function($){
    window.selectedTreeNode = "";
    //支持在弹出框中选择
    if(frameElement && frameElement.api){
        window.api = frameElement.api;

        $(function(){
            var operName =  ["选择", "关闭"];
            api.button({
                id: 'confirm',
                name: operName[0],
                focus: true,
                callback: function() {
                    var selectRowListArray = window.selectedTreeNode;
                    if(selectRowListArray.length == ""){
                        Public.tips({
                            type: 2,
                            content: "请"+window.api.data.title+"!"
                        });
                        return false;
                    }
                    // 
                    // console.log(selectRowListArray)
                    window.api.data.callback(selectRowListArray,window);
                    return false;
                }
            },{
                id: 'cancel',
                name: operName[1]
            });
        });
    }
    $(function(){

        function imgFormatter(val,opt,row){
            if(val!=null && val!=''&& typeof(val)!='undefined'){
                return "<img height='38px' src='"+val+"'/>";
            }else{
                return "";
            }
        }

        //搜索
        $("#queryBtn").click(function(){
          
            var data = $("#queryForm").serializeObject();
            // $("#grid").jqGrid('setGridParam',{page:1,postData: data}).trigger("reloadGrid");
        });

        function updateNodes(tree,nodeList,highlight) {
            var zTree = $.fn.zTree.getZTreeObj(tree);
            //递归查找父类别，展开
            if(nodeList != null){
                for( var i=0, l=nodeList.length; i<l; i++) {
                    nodeList[i].highlight = highlight;
                    zTree.updateNode(nodeList[i]);//改颜色
                    if(highlight){//查找的时候才展开，重置的时候不展开
                        openParent(zTree,nodeList[i]);//展开
                    }
                }
            }

        }
        function openParent(zTree,node) {//递归展开父
            if(node != null){
                var parent = node.getParentNode();
                if(parent != null && parent.id !=0){//父级为全部的时候就不用展开了
                    zTree.expandNode(parent, true, true, false);
                } else {
                    return true;
                }
            }
        }
        function getFontCss(treeId, treeNode) {
            return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
        }

        var brandNodeList = [];
        $("#brandTreeSearch").change(function(){
            myfun()
        });
        //实现实时搜索树
        var element = document.getElementById("brandTreeSearch");  //获取元素对象
    　　if("\v"=="v") {  //判断是否IE浏览器
    　　　　element.onpropertychange = myfun;   //IE的话添加onpropertychange 事件
    　　}else{
    　　　　element.addEventListener("input",myfun,false);  //非IE的话用 addEventListener 添加监听事件
    　　}
        function myfun(){
              
            var treeObj = $.fn.zTree.getZTreeObj("institutions");
            updateNodes("institutions",brandNodeList,false);
            if( $("#brandTreeSearch").val() != null &&  $("#brandTreeSearch").val() !=''){
                brandNodeList = treeObj.getNodesByParamFuzzy("name", $("#brandTreeSearch").val());
                                 
                updateNodes("institutions",brandNodeList,true);
            }
        }
        //生成品牌树
        Business.institutions = {
            zTree: {},
            opts:{
                showRoot:false,
                defaultClass:'',
                disExpandAll:false,//showRoot为true时无效
                callback:'',
                rootTxt:'全部'
            },
            setting: {
                view: {
                    fontCss: getFontCss,
                    dblClickExpand: false,
                    showLine: true,
                    selectedMulti: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: ""
                    }
                },
                check:{
                    autoCheckTrigger:false,
                    chkStyle:"checkbox"
                },
                callback: {
                     beforeCheck: zTreeBeforeCheck
                }
            },
            _getTemplate: function(opts) {
                this.id = 'institutions';
                var _defaultClass = "ztree";
                if (opts) {
                    if(opts.defaultClass){
                        _defaultClass += ' ' + opts.defaultClass;
                    }
                }
                return '<ul id="'+this.id+'" class="' + _defaultClass + '"></ul>';
            },
            init: function($target, opts, setting ,callback) {
                if ($target.length === 0) {
                    return;
                }
                var self = this;
                self.opts = $.extend(true, self.opts, opts);
                self.container = $($target);
                self.obj = $(self._getTemplate(opts));
                self.container.append(self.obj);
                setting = $.extend(true, self.setting, setting);
                Public.ajaxPost(setting.url, {}, function(data) {
                    // if(data.length){
                    //     for(var i=0;i<data.length;i++){
                    //         data[i].name = '['+data[i].id+']'+data[i].name;
                    //     }
                    // }
                    self._callback(data);
                   
                });
                return self;
            },
            _callback: function(data){
                var self = this;
                var callback = self.opts.callback;
                if(self.opts.showRoot){
                    data.unshift({name:self.opts.rootTxt,id:0,open:true});
                    self.obj.addClass('showRoot');
                }
                if(!data.length) return;
                self.zTree = $.fn.zTree.init(self.obj, self.setting, data);
                //self.zTree.selectNode(self.zTree.getNodeByParam("id", 101));
                // self.zTree.expandAll(!self.opts.disExpandAll);
                
                //默认选中  --->上次的选中情况
                if(window.api.data.checkedPos){
                    var treeNode =  self.zTree.getNodeByParam("id",window.api.data.checkedPos);
                    self.zTree.selectNode(treeNode);
                    self.zTree.updateNode(treeNode);//设置checked属性之后，一定要更新该节点，否则会出现只有鼠标滑过的时候节点才被选中的情况
                    self.zTree.expandNode(treeNode,true,false);//展开选中节点
                    self.zTree.expandNode(treeNode.getParentNode(),true,false);//展开选中节点的父节点
                }
               
               
              
                //初始化选中值
                window.selectedTreeNode = self.zTree.getCheckedNodes(true);
                if(callback && typeof callback === 'function'){
                    callback(self, data);
                }
            }
        };
        function zTreeBeforeCheck(treeId, treeNode) {
            // console.log(treeNode)
            // window.selectedTreeNode.push(treeNode);
        };
        window.queryConditions = {};
        var institutions = Business.institutions.init($('.ztreeDefault'), {showRoot:true}, {
            url:window.api.data.dataUrl,
            callback:{
                beforeClick: function(treeId, treeNode) {
                    //alert(treeNode.id+'_'+treeNode.name);
                    //queryConditions.catId = treeNode.id;
                    // console.log(treeNode)
                    // console.log(treeNode)
                    //只有是3级节点的时候才选择上
                    if(treeNode.level == '3'){
                        window.selectedTreeNode= treeNode;
                    }
                    if(treeNode.id == '0'){
                        $("#pCode").val("");
                    }else{
                        $("#pCode").val(treeNode.id);
                    }
                    $('#queryBtn').trigger('click');
                }
            }
        });
        $("#treeType").combo({
            data: function(){
                return [{id:'institutions',name:'品牌'}];
            },
            text: 'name',
            value: 'id',
            width:202,
            trigger:true,
            triggerCls:'ui-icon-triangle-1-s'
            //callback:{
                //onChange:function(selectedRawData){
                //  if(selectedRawData.id == 'storeGroup'){
                //      $("#institutions").hide();
                //      $("#storeGroup").show();
                //      $("#formats").hide();
                //      $("#institutionsCode").val("");
                //      $("#formatsCode").val("");
                //  }else if(selectedRawData.id == 'formats'){
                //      $("#institutions").hide();
                //      $("#storeGroup").hide();
                //      $("#formats").show();
                //      $("#institutionsCode").val("");
                //      $("#storeGroupCode").val("");
                //  }
                //  else{
                //      $("#institutions").show();
                //      $("#storeGroup").hide();
                //      $("#formats").hide();
                //      $("#storeGroupCode").val("");
                //      $("#formatsCode").val("");
                //  }
                //}
            //}
        })
        
        $('.ztreeDefault').css("height",Public.setGrid(50, 0).h+63);
        $(window).bind('resize', function(){
            $('.ztreeDefault').css('height', Public.setGrid(50, 0).h+63);
        });
    });
})(jQuery)