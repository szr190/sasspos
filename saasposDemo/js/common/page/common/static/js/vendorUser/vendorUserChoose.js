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
                            content: "请选择人员！"
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
        //机构联动门店
        var organCombo = Business.organCombo($("#organSpan"),{
            callback: {
                onChange: function(data){
                    if(data){
                        $("#orgCode").val(data.organCode);
                        storeCombo.loadData("/base/api/common/getAllStoreByOrgan?organCode="+data.organCode);
                    }
                }
            },
            defaultSelected:0
        });
        //门店选中的callback
        var $store = $("#store");
        var opts = {
            callback: {
                onChange:function(obj){

                    var storeCode =  $store.getCombo().getValue();
                    $("#storeCode").val(storeCode);
                }
            },
            //text: 'storeName',
            formatText:function(row){
                if(row.storeCode!=''){
                    return "["+row.storeCode + "] " + row.storeName;
                }else{//请选择
                    return row.storeName;
                }
            },
            value: 'storeCode',
            trigger:true,
            triggerCls:'ui-icon-triangle-1-s'
        };
        var storeCombo = $store.combo(opts).getCombo();
        //初始化机构
        var $signOrgan = $("#organSpan");
        var opts = {
            data:"/base/api/common/getOrganByUser",
            width: 200,
            height: 400,
            text: 'organName',
            value: 'organCode',
            editable: false,
            defaultSelected:0,
            editable: true,
            trigger:true,
            triggerCls:'ui-icon-triangle-1-s'
        }
        var organCombo = $signOrgan.combo(opts).getCombo();
        $("#grid").organCombo = organCombo;
        //使用列设置数据的方式初始化jqGrid
        Public.jqGrid("#grid",{
            url: '/vm/common/getVendorUser',//获取数据的url
            operateCol:false,
            colModel:[
                {name: 'userName', label:'用户名', index: 'userName', align: 'left',width: 100, title: false},
                {name: 'realName', label:'姓名', index: 'realName', align: 'left',width: 100, title: false},
                {name: 'orgName', label:'机构', index: 'orgName', align: 'left',width: 100, title: false},
                {name: 'storeName', label:'门店', index: 'storeName', align: 'left',width: 100, title: false},
                {name: 'cellPhone', label:'手机号码', index: 'cellPhone', align: 'left',width: 100, title: false},
                {name: 'email', label:'邮箱', index: 'email', align: 'left',width: 150, title: false}
            ],
            autowidth:true,
            autoHeight:true,
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