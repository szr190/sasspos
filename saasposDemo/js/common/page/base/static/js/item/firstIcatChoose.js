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
                    var selectRowListArray = Public.getSelectRowListArray("#grid");
                    if(selectRowListArray.length == 0){
                        Public.tips({
                            type: 2,
                            content: "请选择部门！"
                        });
                        //alert("请选择一个门店！");
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
        //使用列设置数据的方式初始化jqGrid
        Public.jqGrid("#grid",{
            url: '/base/api/common/opGetFirstIcat',//获取数据的url
            operateCol:false,
            colModel:[
                {name: 'catCode', label:'部门编码', index: 'catCode', align: 'center',width: 250, title: false},
                {name: 'catName', label:'部门名称', index: 'catName', align: 'center',width: 255, title: false}
            ],
            autowidth:true,
            autoHeight:true,
            rowNum:-1,
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
            var data = $("#queryForm").serializeObject();
            $("#grid").jqGrid('setGridParam',{page:1,postData: data}).trigger("reloadGrid");
        });
        window.queryConditions = {};
    });
})(jQuery)