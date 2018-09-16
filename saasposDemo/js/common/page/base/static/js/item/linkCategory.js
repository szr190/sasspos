(function($){
     window.selectedTreeNode = [];
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
                    var arr = [];
                    for(var i = 0;i<window.selectedTreeNode.length;i++){
                        if(window.selectedTreeNode[i].checked == true){
                            arr.push(window.selectedTreeNode[i])
                        }
                    }
                    // 数组去重
                    function unique(arr){
                        var res=[];
                        for(var i=0,len=arr.length;i<len;i++){
                            var obj = arr[i];
                            for(var j=0,jlen = res.length;j<jlen;j++){
                                if(res[j]===obj) break;            
                            }
                            if(jlen===j)res.push(obj);
                        }
                        //数组去除选中的父节点，只让返回选中的 子节点
                        // for(var k = res.length -1;k >=0; k--){
                        //     if(res[k].isParent == true){
                        //         res.splice(k,1);
                        //     }
                        // }
                        return res;
                    }
	                var selectRowListArray = unique(arr);
	                if(selectRowListArray.length == 0){
                        Public.tips({
                            type: 2,
                            content: "请"+window.api.data.title+"!"
                        });
	                    return false;
	                }
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
            myfun();
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
                // rootTxt:'全部'
            },
            setting: {
                check: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "", "N": "" }//Y 属性定义 checkbox 被勾选后的情况； N 属性定义 checkbox 取消勾选后的情况； 
                                                      // "p" 表示操作会影响父级节点； 
                                                      //"s" 表示操作会影响子级节点。
                },
                view: {
                    fontCss: getFontCss,
                    dblClickExpand: true,
                    showLine: true,
                    // showIcon:true,
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
                callback: {
                    //beforeClick: function(treeId, treeNode) {}
                    onCheck:onCheck,
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
                Public.ajaxPost(setting.url, {}, function(res) {
                    var data = res.dataValue.rows;
                    // if(data.length){
                    //     for(var i=0;i<data.length;i++){
                    //         data[i].name = '['+data[i].id+']'+data[i].name;
                    //     }
                    // }
                    self._callback(data);
                    //if (data.status === 1 && data.dataValue) {
                    //    self._callback(data.dataValue.rows);
                    //} else {
                    //    Public.tips({
                    //        type: 2,
                    //        content: "加载信息失败！"
                    //    });
                    //}
                });
                
                return self;
            },
            _callback: function(data){
                var self = this;
                var callback = self.opts.callback;
                // if(self.opts.showRoot){
                //     data.unshift({name:self.opts.rootTxt,id:0,open:true});
                //     self.obj.addClass('showRoot');
                // }
                if(!data.length) return;
                self.zTree = $.fn.zTree.init(self.obj, self.setting, data);
                // self.zTree.selectNode(self.zTree.getNodeByParam("id", 10));
                // 删除全部这一个节点
                // var removeTreeNode = self.zTree.getNodeByParam("id",'0');
                // self.zTree.removeNode(removeTreeNode, false);
                // 传入上次的选中
                var defaultArr = window.api.data.checkedArr;
                // console.log(defaultArr)
                //默认选中  --->上次的选中情况
                for(var i = 0;i<defaultArr.length ;i++){
                    var treeNode =  self.zTree.getNodeByParam("id", defaultArr[i]);
                    if(treeNode){
                         treeNode.checked = true;
                        // treeNode.getParentNode().checked = true;//子节点的父节点显示选中
                        self.zTree.updateNode(treeNode);//设置checked属性之后，一定要更新该节点，否则会出现只有鼠标滑过的时候节点才被选中的情况
                        // self.zTree.updateNode(treeNode.getParentNode());
                        self.zTree.expandNode(treeNode,true,false);//展开选中节点
                        self.zTree.expandNode(treeNode.getParentNode(),true,false);//展开选中节点的父节点
                    }
                   
                    
                }
                //初始化选中值
                window.selectedTreeNode = self.zTree.getCheckedNodes(true);
                //self.zTree.expandAll(!self.opts.disExpandAll);
                if(callback && typeof callback === 'function'){
                    callback(self, data);
                }
            }
        };
        function onCheck(treeId, treeNode){
            var zTree = $.fn.zTree.getZTreeObj("institutions");
            // console.log(zTree)
            // console.log(zTree.getCheckedNodes(true))
            window.selectedTreeNode = zTree.getCheckedNodes(true);
            
        }
        function zTreeBeforeCheck(treeId, treeNode) {
            // console.log(treeNode)
            // if(treeNode.isParent == true){
            //     return false; //不让选择父节点
            // }
            // window.selectedTreeNode.push(treeNode);
        };
        //递归查找某节点的父节点
        // function checkAllParents(treeNode){
        //     if (treeNode==null || treeNode.pId=="0") {
        //         return;
        //     }else{
        //         treeNode.checked=true;
        //         checkAllParents(treeNode.getParentNode());
        //     }
        // }
        window.queryConditions = {};
        var institutions = Business.institutions.init($('.ztreeDefault'), {showRoot:true}, {
            // url:"/base/api/common/brandTree",
            url:window.api.data.dataUrl,
            callback:{
                beforeClick: function(treeId, treeNode) {
                    //alert(treeNode.id+'_'+treeNode.name);
                    //queryConditions.catId = treeNode.id;
                    
                    // console.log(window.selectedTreeNode)
                	if(treeNode.id == '0'){
                		$("#pCode").val("");
                	}else{
                		$("#pCode").val(treeNode.id);
                	}
                    $('#queryBtn').trigger('click');
                }
            }
        });
        
        
        $('.ztreeDefault').css("height",Public.setGrid(50, 0).h+63);
        $(window).bind('resize', function(){
        	$('.ztreeDefault').css('height', Public.setGrid(50, 0).h+63);
        });
    });
})(jQuery)