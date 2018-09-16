(function($,window){
    window.api = frameElement.api;
    window.tableName = window.api.data.tableName;
    var parentCallback = api.data.callback;
    if(true){
      api.button({
          id: 'cancel',
          callback:function(){
            parent.location.reload();
          }
      });
    }
$(function(){

	//显示
    function show(val, opt, row){
        if(val==0){
            var html_con = '<input type="checkbox" class="editCol" name="hidden" />';
        }else{
            var html_con = '<input type="checkbox" class="editCol" name="hidden" checked />';
        }
    	return html_con;
    }
	//对齐方式
    function textalign(val, opt, row){
    	var html_con = '<select class="ui-input lh30 h30 editCol" style="height: 30px;" name="align">';
    	if(val==1){
            html_con +='<option value="1" selected>居左</option><option value="0">居中</option><option value="2">居右</option></select>';
        }else if(val==2){
            html_con +='<option value="2" selected>居右</option><option value="0">居中</option><option value="1">居左</option></select>';
        }else{
            html_con +='<option value="0" selected>居中</option><option value="2">居右</option><option value="1">居左</option></select>';
        }
        return html_con;
    }
    //展示宽度
    function showwidth(val, opt, row){
    	var html_con = '<input type="text" class="ui-input w70 editCol" value="'+val+'" name="width"/>';
    	return html_con;
    }
    //展示顺序
    function showorder(val, opt, row){
    	/*var html_con = '<span><i class="icon iconfont poi trupward"  name="viewOrder">&#xe622;</i></span> ' +
            '<span><i class="icon iconfont poi trdown"  name="viewOrder">&#xe621;</i></span>';*/
        var html_con = '<input type="text" class="ui-input w70 editViewOrder" value="'+val+'" name="viewOrder"/>';
    	return html_con;
    }
    //是否打印
    function branchcode(val, opt, row){
        if(val==0){
            var html_con = '<input type="checkbox" class="editCol" name="printable"/>';
        }else{
            var html_con = '<input type="checkbox" class="editCol" name="printable" checked/>';
        }
    	return html_con;
    }

    var colModel = [
        {name: "tableName",hidden:true},
        {name: "colName",hidden:true},
    	{name: 'hidden', label:'显示', index: 'hidden', width: 80, fixed:true, align: 'center',formatter: show},
        {name: 'viewName', label:'列名称', index: 'viewName', width: 100, fixed:true, title: false},
        {name: 'align', label:'对齐方式', index: 'align', width: 100, title: false,formatter: textalign},
        {name: 'width', label:'展示宽度', index: 'width', width: 90, align: 'center',formatter: showwidth},
        {name: 'viewOrder',label:'展示顺序', index: 'viewOrder', width: 80, align: 'center', fixed:true ,formatter: showorder},
        {name: 'printable',label:'是否打印', index: 'printable', width: 80,align: 'center',formatter: branchcode}
    ];

    var thisGrid =  Public.jqGrid("#grid",{
        url: '/vm/common/getAllColumns',
        colUrl: "/vm/common/getColumns?tableName=tabledetail",//获取列设置的url
        colModel:colModel,
        postData:{tableName:tableName},
        datatype: 'json',
        operateCol:false,
        autowidth:false,
        autoHeight:false,
        width:770,
        height:335,
        //layoutH:0,
        //layoutW:0,
        rowNum:1000,
        multiselect: false,//多选，默认为true
        /*pager: '#page',*/
        jsonReader: {
            root: "dataValue",
           /* records: "dataValue.total",*/
            repeatitems : false,
            id: "id"
        },
        loadComplete: function(data){
            if(data && data.status == 1){
                var grid = data.dataValue;
                if(grid.length<1){
                    $("#grid").prev().html("<div style='text-align: center;'>没有满足条件的结果哦！</div>");
                }else{
                    $("#grid").prev().html('');
                    //设置每行data的itemInfo值
                    var rows = grid;
                    var len = rows.length;
                    for(var i = 0; i < len; i++) {
                        var tempId = i + 1, row = rows[i];
                        if($.isEmptyObject(rows[i])){
                            break;
                        };
                        delete row['parentPager'];
                        delete row['rows'];
                        delete row['rowsJSON'];
                        delete row['length'];
                        delete row['target'];
                        delete row['total'];
                        delete row['end'];
                        delete row['start'];
                        delete row['currentPage'];
                        delete row['totalPages'];
                        $('#' + row.id).data('rowData',row);
                    };
                }
            }else{
                $("#grid").prev().html("<div style='text-align: center;'>抱歉！查询失败了。</div>");
            }
        }
    });
    Public.resizeGrid(0,0,$("#grid"));

    //表格排序向上
		$('#grid,#grid_frozen').on('click', '.trupward', function(e){
            e.preventDefault();
            var $tr = $(this).parents("tr");
            var $prev = $tr.prev();
            var rowData = $tr.data('rowData');

            if ($tr.index() != 0) {
                $tr.fadeOut().fadeIn();
                $tr.prev().before($tr);
                var target = $prev.data('rowData').colName;
                rowData.target = target;
                Public.ajaxPost('/vm/common/updateColumn',rowData,function(op){
                    if(op=="false"){
                        Public.tips({type: 1, content : "修改失败！"});
                    }else{
                        Public.tips({type: 0, content : "修改成功！"});
                    }
                });
            }
        });
        var len = $("#trdown").parents("tr").length;
        //表格排序向下
		$('#grid,#grid_frozen').on('click', '.trdown', function(e){
            e.preventDefault();
            var $tr = $(this).parents("tr");
            var rowData = $tr.data('rowData');
            var $next = $tr.next();
            if ($tr.index() != len - 1) {
                $tr.fadeOut().fadeIn();
                $tr.next().after($tr);

                var target = $next.data('rowData').colName;
                rowData.target = target;
                Public.ajaxPost('/vm/common/updateColumn',rowData,function(op){
                    if(op=="false"){
                        Public.tips({type: 1, content : "修改失败！"});
                    }else{
                        Public.tips({type: 0, content : "修改成功！"});
                    }
                });
            }
        });

    //修改事件
    $('#grid').on('change', '.editCol', function(e){
        var $this = $(e.target);
        var name = $this.attr("name");
        var rowData = $(this).parents("tr").data('rowData');
        var nodeName = this.nodeName.toUpperCase();
        var val="";
        if(nodeName=="INPUT"){
            if(this.type=="text"){
                val = $this.val();
            }else{
                if($this.is(':checked')){
                    val = 1;
                }else{
                    val = 0;
                }
            }
        }else if(nodeName=="SELECT"){
            val = $this.val();
        }
        rowData[name] = val;
        Public.ajaxPost('/vm/common/updateColumn',rowData,function(op){
            if(op=="false"){
                Public.tips({type: 1, content : "修改失败！"});
            }else{
                Public.tips({type: 0, content : "修改成功！"});
            }
        });
    });

    $('#grid').on('change', '.editViewOrder', function(e){
        var $this = $(e.target);
        var name = $this.attr("name");
        var rowData = $(this).parents("tr").data('rowData');
        var val=$this.val();;
        rowData[name] = val;
        rowData.target = "viewOrderChange";
        Public.ajaxPost('/vm/common/updateColumn',rowData,function(op){
            if(op=="false"){
                Public.tips({type: 1, content : "修改失败！"});
            }else{
                $("#grid").jqGrid('setGridParam',{}).trigger("reloadGrid");
                Public.tips({type: 0, content : "修改成功！"});
            }
        });
    });

});

})(jQuery,window)
