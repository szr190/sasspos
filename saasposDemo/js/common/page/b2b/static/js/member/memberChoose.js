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
                            content: "请选择客户！"
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
        function formatMemAudit(val, opt, row){
            var text;var cls;
            var value = row.memAuditStatus;
            if(value=="0") {
                text='未申请';
                cls = 'ui-label-save'
            }else if(value=="1"){
                text="待审核";
                cls = 'ui-label-save'
            }else if(value=="2"){
                text="已审核";
                cls = 'ui-label-save'
            }else if(value=="3"){
                text='已分配主账号';
                cls = 'ui-label-save'
            }
            return '<span  class="set-status ui-label ' + cls + '" data-delete="' + val + '" data-id="' + row.id + '">' + text + '</span>';
        }
        //使用列设置数据的方式初始化jqGrid
        Public.jqGrid("#grid",{
            //url: '/tbwd/api/member/searchVendorList',//获取数据的url
            url: window.api.data.dataUrl,//获取数据的url
            mtype:'POST',
            operateCol:false,
            colModel:[
                {name: 'memName', label:'客户姓名', index: 'memName', align: 'center',width: 100, title: false},
                {name: 'shopName', label:'客户店铺', index: 'shopName', align: 'center',width: 100, title: false},
                {name: 'mobileNo', label:'联系方式', index: 'mobileNo', align: 'center', width: 100, title: false},
                //{name: 'memAuditStatus', label:'审核状态', index: 'memAuditStatus', width: 100, align: 'center', fixed:true, title: false,formatter:formatMemAudit},
                {name: 'memVendorId', label:'客户主账号商家id', index: 'memVendorId',align:'center', width: 100, fixed:true, title: false,hidden:true},
                {name: 'memPin', label:'客户登录名', index: 'memPin',align:'center', width: 100, fixed:true, title: false,hidden:true},
                {name: 'memNo', label:'客户编号', index: 'memNo',align:'center', width: 100, fixed:true, title: false,hidden:true}
            ],
            autowidth:true,
            autoHeight:true,
//            multiselect: false,//多选,默认为true
            layoutH:80,
            layoutW:10,
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

    });
})(jQuery)