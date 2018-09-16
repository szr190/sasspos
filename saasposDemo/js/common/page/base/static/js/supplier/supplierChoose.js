(function($){
    //支持在弹出框中选择
    if(frameElement && frameElement.api){
        window.api = frameElement.api;
        window.bizType = api.data.bizType;
        $(function(){
            var operName =  ["选择", "关闭"];
            api.button({
                id: 'confirm',
                name: operName[0],
                focus: true,
                callback: function() {
                    var selectRowListArray = Public.getSelectRowListArray("#grid");
                    if(selectRowListArray.length == 0){
                        Public.tips({type:2,content:"请选择一个供应商！"});
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
            url: '/finance/api/common/getSupplierListForCombo',
            operateCol:false,
            colModel:[
                {name: 'id', label:'ID', index: '0',align:'center', width: 100, fixed:true, title: false,hidden:true},
                {name: 'relatedCode', label:'单位编码',align:'center', index: 'relatedCode', width: 100, fixed:true, title: false},
                {name: 'relatedName', label:'单位名称',align:'center', index: 'relatedName', width: 100, title: false},
                {name: 'bizTypeName', label:'经营方式',align:'center', index: 'bizTypeName', width: 100, title: false,hidden:false},
                {name: 'supplierStateName', label:'供应商状态',align:'center', index: 'supplierStateName', width: 100, title: false,hidden:false},
            ],
            postData:{
              bizType:bizType||''
            },
            autowidth:true,
            autoHeight:true,
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
            if(window.bizType){
              $("#bizType").val(window.bizType);
            }
            var data = $("#queryForm").serializeObject();
            $("#grid").jqGrid('setGridParam',{page:1,postData: data}).trigger("reloadGrid");
        });



        //生成供应商状态树
        Business.supplierStateTree = {
            zTree: {},
            opts:{
                showRoot:true,
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
                this.id = 'supplierStateTree'
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
                        self._callback(data.dataValue.rows);
                    } else {
                        Public.tips({
                            type: 2,
                            content: "加载供应商状态信息失败！"
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
                $(self.obj).css("height",Public.setGrid(15, 0).h);

                $(window).bind('resize', function(){
                    var cateTree = $(self.obj);
                    var cateTreeWH = Public.setGrid(15, 0);
                    cateTree.css('height', cateTreeWH.h);
                });
            }
        };


        //生成供应商经营方式树
        Business.supplierBizTypeTree = {
            zTree: {},
            opts:{
                showRoot:true,
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
                this.id = 'supplierBizTypeTree';
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
                        self._callback(data.dataValue.rows);
                    } else {
                        Public.tips({
                            type: 2,
                            content: "加载供应商经营方式信息失败！"
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
                $(self.obj).css("height",Public.setGrid(15, 0).h);

                $(window).bind('resize', function(){
                    var cateTree = $(self.obj);
                    var cateTreeWH = Public.setGrid(15, 0);
                    cateTree.css('height', cateTreeWH.h);
                });
            }
        };

        window.queryConditions = {};

        var supplierStateTree = Business.supplierStateTree.init($('.ztreeDefault'), {showRoot:true}, {
            url:"/finance/api/common/stateList",
            callback:{
                beforeClick: function(treeId, treeNode) {

                    queryConditions.supplierState = treeNode.id;
                    if(treeNode.id == '0'){
                        $("#supplierState").val("");
                    }else{
                        $("#supplierState").val(treeNode.id);
                    }
                    $('#queryBtn').trigger('click');
                }
            }
        });

        var supplierBizTypeTree = Business.supplierBizTypeTree.init($('.ztreeDefault'), {showRoot:true}, {
            url:"/finance/api/common/bizTypeList",
            callback:{
                beforeClick: function(treeId, treeNode) {

                    queryConditions.supplierState = treeNode.id;
                    if(treeNode.id == '0'){
                        $("#bizType").val("");
                    }else{
                        $("#bizType").val(treeNode.id);
                    }
                    $('#queryBtn').trigger('click');
                }
            }
        });




        $("#treeType").combo({
            data: function(){
                return [{id:'supplierStateTree',name:'供应商状态'},{id:'supplierBizTypeTree',name:'供应商经营方式'}];
            },
            text: 'name',
            value: 'id',
            width:202,
            trigger:true,
            triggerCls:'ui-icon-triangle-1-s',
            callback:{
                onChange:function(selectedRawData){
                    if(selectedRawData.id == 'supplierStateTree'){
                        $("#supplierBizTypeTree").hide();
                        $("#supplierStateTree").show();
                        $("#bizType").val("");


                    }else{
                        $("#supplierBizTypeTree").show();
                        $("#supplierStateTree").hide();
                        $("#supplierState").val("");


                    }
                }
            }
        })

        if(window.bizType){
           Public.changeComboEdit($("#treeType"),false)
        }else{
           Public.changeComboEdit($("#treeType"),true);
        }

        $('.ztreeDefault').css("height",Public.setGrid(50, 0).h);
        $(window).bind('resize', function(){
            $('.ztreeDefault').css('height', Public.setGrid(50, 0).h);
        });

        //高级搜索
        $(".btn_search").click(function(){
            $(".gjss").css("display","block");
        });

        function btnes(){
            $(".gjss").css("display","none")
        }

        $(".btn-gjr").click(btnes);
        $(".btn-gjq").click(btnes);


        $(".d_xzdel").click(function(){
            $(this).parent("p").remove();
            var plength=$(".d_xz p").length;
            if(plength==''){
                $(".d_xz").parent("div").css("display","none");

            };
        });

    });
})(jQuery)
