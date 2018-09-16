(function($){
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
	                //var selectRowListArray = Public.getSelectRowListArray("#grid");
	                //if(selectRowListArray.length == 0){
	                //    alert("请选择一个SKU！");
	                //    return false;
	                //}
                    //获取所有选中行
                    var ids = $("#grid").jqGrid('getGridParam','selarrrow');
                    if(ids.length <= 0){
                        Public.tips({type:2,content:"请选择一个商品！"});
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
        function statusFmatter(val, opt, row){//0仓库 1自营店 2加盟店 3虚拟店 4微店
            var text = "";
            var cls = "";
            if(val==0){//
                text = "仓库";
                //var cls = 'ui-label-success';
            }else if(val==1){
                text = "自营店";
                //var cls = 'ui-label-default';
            }else if(val==2){
                text = "加盟店";
                //var cls = 'ui-label-default';
            }else if(val==3){
                text = "虚拟店";
                //var cls = 'ui-label-default';
            }else if(val==4){
                text = "微店";
                //var cls = 'ui-label-default';
            }
            return text;

        };

        function usefulFmatter(val, opt, row){//0不可用 1可用
            var text = "";
            var cls = "";
            if(val==0){//
                text = "不可用";
                var cls = 'ui-label-default';
            }else if(val==1){
                text = "可用";
                var cls = 'ui-label-success';
            }
            return '<span style="corsor:default" class="set-status ui-label ' + cls + '" data-delete="' + val + '" >' + text + '</span>';

        };
        function dataFormatter(val,opt,row){
            if(val!=null && val!=''&& typeof(val)!='undefined'){
                var date = new Date(val);
                return date.format("yyyy-MM-dd");
            }else{
                return "";
            }
        };
        function imgFormatter(val,opt,row){
            if(val!=null && val!=''&& typeof(val)!='undefined'){
                return "<img height='38px' src='"+val+"'/>";
            }else{
                return "";
            }
        }

        //使用列设置数据的方式初始化jqGrid
        Public.jqGrid("#grid",{
            url: '/base/api/common/opItemSkuData',//获取数据的url
            operateCol:false,
            colModel:[
                {name: 'imgPath', label:'图片', index: 'imgPath', formatter:imgFormatter, align: 'center',width: 100, title: false},
                {name: 'itemCodeName', label:'商品', index: 'itemCodeName', align: 'center',width: 150, title: false},
                {name: 'specifications', label:'规格', index: 'itemCode', align: 'center', width: 100, title: false},
                {name: 'skuCode', label:'sku编码', index: 'itemCode', align: 'center', width: 100, title: false},
                {name: 'barcode', label:'国际条码', index: 'itemCode', align: 'center', width: 100, title: false},
                {name: 'salePrice', label:'零售价', index: 'itemCode', align: 'center', width: 100, title: false},
                {name: 'stock', label:'库存', index: 'stock', width: 100, align: 'center', fixed:true, title: false},
                {name: 'brandName', label:'品牌', index: 'brandName', width: 100, align: 'center', fixed:true, title: false},
                {name: 'catName', label:'品类', index: 'catName', width: 100, align: 'center', fixed:true, title: false},
                {name: 'supName', label:'供应商', index: 'supName', width: 100, align: 'center', fixed:true }
            ],
            autowidth:true,
            autoHeight:true,
            layoutH:80,
            layoutW:210,
            //加载完成后的回调
            gridComplete: function(){
            	var $this = $(this);
            	merge("itemCodeName");
                merge("imgPath","itemCodeName");
                //合并单元格
	            function merge(mergeCellName,sourceCellName) {
                    sourceCellName = sourceCellName || mergeCellName;
	                //得到显示到界面的id集合
	                var rowIds = $this.getDataIDs();
	                //当前显示多少条
	                var length = rowIds.length;
	                for (var i = 0; i < length; i++) {
	                    //从上到下获取一条信息
	                    var before = $this.jqGrid('getRowData', rowIds[i]);
	                    //定义合并行数
	                    var rowSpanTaxCount = 1;
	                    for (j = i + 1; j <= length; j++) {
	                        //和上边的信息对比 如果值一样就合并行数+1 然后设置rowspan 让当前单元格隐藏
	                        var end = $this.jqGrid('getRowData', rowIds[j]);
	                        if (before[sourceCellName] == end[sourceCellName]) {
	                            rowSpanTaxCount++;
	                            $this.setCell(rowIds[j], mergeCellName, '', { display: 'none' });
	                        } else {
	                            break;
	                        }
	                    }
	                    if(rowSpanTaxCount > 1){
	                    	var tr = $("tr#"+rowIds[i],$this);
	                    	var rowSpanTd = $("tr#" + rowIds[i] + " " + "td[aria-describedby='grid_"+mergeCellName+"']",$this);
	                    	rowSpanTd.attr("rowspan", rowSpanTaxCount);
	                    	i = i + rowSpanTaxCount - 1;
	                    	rowSpanTaxCount = 1;
	                    }
	                }
	            }
            },
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

        //生成品类树
        Business.catTree = {
            zTree: {},
            opts:{
                showRoot:false,
                defaultClass:'',
                disExpandAll:false,//showRoot为true时无效
                callback:'',
                rootTxt:'全部品类'
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
                this.id = 'catTree';
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
                    if (data.status === 1 && data.dataValue) {
                        if(data.dataValue.rows.length){
                            for(var i=0;i<data.dataValue.rows.length;i++){
                                data.dataValue.rows[i].name = '['+data.dataValue.rows[i].id+']'+data.dataValue.rows[i].name;
                            }
                        }
                        self._callback(data.dataValue.rows);
                    } else {
                        Public.tips({
                            type: 2,
                            content: "加载分类信息失败！"
                        });
                    }
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
        //生成品牌树
        Business.brandTree = {
            zTree: {},
            opts:{
                showRoot:false,
                defaultClass:'',
                disExpandAll:false,//showRoot为true时无效
                callback:'',
                rootTxt:'全部品牌'
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
                this.id = 'brandTree';
                var _defaultClass = "ztree";
                if (opts) {
                    if(opts.defaultClass){
                        _defaultClass += ' ' + opts.defaultClass;
                    }
                }
                return '<ul id="'+this.id+'" class="dn ' + _defaultClass + '"></ul>';
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
                    if (data.status === 1 && data.dataValue) {
                        if(data.dataValue.rows.length){
                            for(var i=0;i<data.dataValue.rows.length;i++){
                                data.dataValue.rows[i].name = '['+data.dataValue.rows[i].id+']'+data.dataValue.rows[i].name;
                            }
                        }
                        self._callback(data.dataValue.rows);
                    } else {
                        Public.tips({
                            type: 2,
                            content: "加载分类信息失败！"
                        });
                    }
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
        var categoryTree = Business.catTree.init($('.ztreeDefault'), {showRoot:true}, {
            url:"/base/api/common/opICatTree",
            callback:{
                beforeClick: function(treeId, treeNode) {
                    //alert(treeNode.id+'_'+treeNode.name);
                    //queryConditions.catId = treeNode.id;
                	if(treeNode.id == '0'){
                		$("#icatCode").val("");
                	}else{
                		$("#icatCode").val(treeNode.id);
                	}
                    $('#queryBtn').trigger('click');
                }
            }
        });
        var brandTree = Business.brandTree.init($('.ztreeDefault'), {showRoot:true}, {
            url:"/base/api/common/opBrandTree",
            callback:{
                beforeClick: function(treeId, treeNode) {
                    //alert(treeNode.id+'_'+treeNode.name);
                    //queryConditions.catId = treeNode.id;
                	if(treeNode.id == '0'){
                		$("#brandCode").val("");
                	}else{
                		$("#brandCode").val(treeNode.id);
                	}
                    $('#queryBtn').trigger('click');
                }
            }
        });
        
        $("#treeType").combo({
			data: function(){
				return [{id:'catTree',name:'品类'},{id:'brandTree',name:'品牌'}];
			},
			text: 'name',
			value: 'id',
			width:202,
	        trigger:true,
	        triggerCls:'ui-icon-triangle-1-s',
        	callback:{
        		onChange:function(selectedRawData){
        			if(selectedRawData.id == 'brandTree'){
        				$("#catTree").hide();
        				$("#brandTree").show();
        				$("#icatCode").val("");
        			}else{
        				$("#catTree").show();
        				$("#brandTree").hide();
        				$("#brandCode").val("");
        			}
        		}
    		}
		})
        
        $('.ztreeDefault').css("height",Public.setGrid(50, 0).h);
        $(window).bind('resize', function(){
        	$('.ztreeDefault').css('height', Public.setGrid(50, 0).h);
        });

    });
})(jQuery)