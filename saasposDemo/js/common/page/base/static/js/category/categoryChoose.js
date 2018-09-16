/**
 * 品类选择
 */
(function($,window,Public){
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
	                var selectRowListArray = Public.getSelectRowListArray("#grid");
	                if(selectRowListArray.length == 0){
	                    alert("请选择一个品类！");
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
        var colModel = [
            {name: 'catCode', label:'品类编码', index: 'catCode',align: 'center', width: 200, fixed:true, title: false},
            {name: 'catName', label:'品类名称', index: 'catName',align: 'center', width: 400, classes: 'ui-ellipsis'},
            {name: 'catLevel', label:'品类级别', index: 'catLevel', width: 130, align: 'center', fixed:true },
            {name: 'parentCode', label:'父品类编码', index: 'parentCode', width: 130, align: 'center', fixed:true,hidden:false },
            {name: 'memo', label:'备注', index: 'memo', width: 540, align: 'center', title: false}
        ];
        //使用列设置数据的方式初始化jqGrid
        Public.jqGrid("#grid",{
        	url: '/base/api/category/list?length=10000',//获取数据的url
        	//url: '/front/api/category/categoryList',//获取数据的url
        	operateCol:true,//使用默认操作列，默认使用，如不需要使用则设置false
            colModel:colModel,
            rownumbers:true,
			altRows:false,
			hoverrows:false,
			loadonce:true,
            treeGrid: true,
            treeGridModel: 'adjacency', //treeGrid模式，nested嵌套，adjacency邻接
            ExpandColumn : 'catLevel',
            tree_root_level:1,
			jsonReader: {
				root: "dataValue.rows",//数据
				records: "dataValue.total",//总记录数
				total: "dataValue.totalPages",//总页数
				repeatitems : false,
				id: "catCode"
			},
            treeReader : {
            	level_field: "catLevel",
            	parent_id_field: "parentCode",
            	leaf_field:"isLeaf"
            },
            multiselect:false,
			//加载完成后的回调
			gridComplete: function(){
				var $this = $(this);
				//得到显示到界面的id集合
				var rowIds = $this.getDataIDs();
				//当前显示多少条
				var length = rowIds.length;
				for (var i = 0; i < length; i++) {
					var data = $this.jqGrid('getRowData', rowIds[i]);
					var thisTr = $("tr#" + rowIds[i],$this);
					thisTr.addClass("level"+data["catLevel"]);
				}
			}
        });

        /**
         * 点击查询按钮，根据条件查询数据
         */
        $('#queryBtn').click(search);

        function search(){
            var queryParam = $('#queryParam').val();
            $('#grid').jqGrid('setGridParam',{
                page:1,
                postData:{'keyWord':queryParam}
            }).trigger('reloadGrid');
        }

	});
})(jQuery,window,window.Public);