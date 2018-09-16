(function($){
	//支持在弹出框中选择
	if(frameElement && frameElement.api){
		window.api = frameElement.api;

//	    $(function(){
//	        //var operName =  ["选择", "关闭"];
//          var operName =  ["关闭"];
//	        api.button(
//              {
//	            id: 'cancel',
//	            name: operName[0]
//	        });
//	    });
	    
	    $(function(){
	        var operName =  ["选择", "关闭"];
	        api.button({
	            id: 'confirm',
	            name: operName[0],
	            focus: true,
	            callback: function() {
	                //var selectRowListArray = Public.getSelectRowListArray("#grid");
	                //if(selectRowListArray.length == 0){
	                //    Public.tips({type:2,content:"请选择一个！"});
	                //    return false;
	                //}
                    //获取所有选中行
                    var ids = $("#grid").jqGrid('getGridParam','selarrrow');
                    if(ids.length <= 0){
                        Public.tips({type:2,content:"请选择一个类别！"});
                        return false;
                    }
                    //循环遍历获取行数据
                    var arr = [];
                    for(var i=0;i<ids.length;i++){
                        var rowData = $("#grid").jqGrid('getRowData',ids[i]);
                        arr.push(rowData);
                    }
	                window.api.data.callback(arr,window);
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

        //使用列设置数据的方式初始化jqGrid
        Public.jqGrid("#grid",{
            url: window.api.data.dataUrl,//获取数据的url
            operateCol:false,
            colModel:[
                {name: 'catCode', label:'类别编码', index: 'catCode', align: 'center',width: 100, title: false},
                {name: 'catName', label:'类别名称', index: 'catName', align: 'center',width: 100, title: false},
                {name: 'parentCode', label:'上级类别编码', index: 'parentCode', align: 'center', width: 100, title: false},
                  {name: 'parentName', label:'上级类别名称', index: 'parentName', width: 100, align: 'center', fixed:true, title: false}
            ],
            autowidth:true,
            autoHeight:true,
            multiselect: true,//多选,默认为true
            layoutH:80,
            layoutW:210,
            ondblClickRow:function(rowid, iRow,iCol, e){
            	var thisGrid = $(this);
                var selectRowList = {};
                var rowData = thisGrid.jqGrid('getRowData', rowid);
                rowData.id = rowid;
                selectRowList[rowid] = rowData;
                thisGrid.data("selectRowList",selectRowList);
                selectRowListArray = Public.getSelectRowListArray("#grid");
                window.api.data.callback(selectRowListArray,window);
            }
        });


        //搜索
        $("#queryBtn").click(function(){
            //var data = $("#queryForm").serializeArray();
            //encodeURI(encodeURI());
            //encodeURI(encodeURI($("#searchValue").val()))
            var data = $("#queryForm").serializeObject();
            $("#grid").jqGrid('setGridParam',{page:1,postData: data}).trigger("reloadGrid");
        });

        //生成类别树
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
                callback: {
                    //beforeClick: function(treeId, treeNode) {}
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
                    if(data.length){
                        for(var i=0;i<data.length;i++){
                            data[i].name = '['+data[i].id+']'+data[i].name;
                        }
                    }
                    self._callback(data);
                    //if (data.status === 1 && data.dataValue) {
                    //    self._callback(data.dataValue.rows);
                    //} else {
                    //    Public.tips({
                    //        type: 2,
                    //        content: "加载类别信息失败！"
                    //    });
                    //}
                });
                return self;
            },
            _callback: function(data){
                var self = this;
                var callback = self.opts.callback;
                if(self.opts.showRoot){
                    data.unshift({name:self.opts.rootTxt,id:0});
                    self.obj.addClass('showRoot');
                }
                if(!data.length) return;
                self.zTree = $.fn.zTree.init(self.obj, self.setting, data);
                //self.zTree.selectNode(self.zTree.getNodeByParam("id", 101));
                self.zTree.expandAll(!self.opts.disExpandAll);
                if(callback && typeof callback === 'function'){
                    callback(self, data);
                }
            }
        };
        window.queryConditions = {};
        var institutions = Business.institutions.init($('.ztreeDefault'), {showRoot:true}, {
            url:"/base/api/common/vendorSecondCatTree",
            callback:{
                beforeClick: function(treeId, treeNode) {
                    //alert(treeNode.id+'_'+treeNode.name);
                    //queryConditions.catId = treeNode.id;
                	if(treeNode.id == '0'){
                		$("#parentCode").val("");
                	}else{
                		$("#parentCode").val(treeNode.id);
                	}
                    $('#queryBtn').trigger('click');
                }
            }
        });
        $("#treeType").combo({
			data: function(){
				return [{id:'institutions',name:'类别'}];
			},
			text: 'name',
			value: 'id',
			width:202,
	        trigger:true,
	        triggerCls:'ui-icon-triangle-1-s'
            //callback:{
        		//onChange:function(selectedRawData){
        		//	if(selectedRawData.id == 'storeGroup'){
        		//		$("#institutions").hide();
        		//		$("#storeGroup").show();
        		//		$("#formats").hide();
        		//		$("#institutionsCode").val("");
        		//		$("#formatsCode").val("");
        		//	}else if(selectedRawData.id == 'formats'){
        		//		$("#institutions").hide();
        		//		$("#storeGroup").hide();
        		//		$("#formats").show();
        		//		$("#institutionsCode").val("");
        		//		$("#storeGroupCode").val("");
        		//	}
        		//	else{
        		//		$("#institutions").show();
        		//		$("#storeGroup").hide();
        		//		$("#formats").hide();
        		//		$("#storeGroupCode").val("");
        		//		$("#formatsCode").val("");
        		//	}
        		//}
    		//}
		})
        
        $('.ztreeDefault').css("height",Public.setGrid(50, 0).h+63);
        $(window).bind('resize', function(){
        	$('.ztreeDefault').css('height', Public.setGrid(50, 0).h+63);
        });
    });
})(jQuery)