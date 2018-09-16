//公共业务
(function($,windows,Business){
    //选择供应商
    Business.supplierSelectCombo = function($_obj,$_grid,url,selectCallback){
        $_grid.on('click', $_obj, function(){
            $.dialog({
                title : '选择供应商',
                content: 'url:/front/v3/js/common/page/base/supplier/supplierChoose.html',
                data: {
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    Business.b2bMemberCombo = function($_obj,url,selectCallback){
        $_obj.click( function(){
            $.dialog({
                title : '选择客户',
                content: 'url:/front/v3/js/common/page/b2b/member/memberChoose.html',
                data: {
                    dataUrl:url,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 500,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择品牌
    Business.brandSelectCombo = function($_obj,$_grid,url,selectCallback){
        $_grid.on('click', $_obj, function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opBrandData';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择品牌',
                content: 'url:/front/v3/js/common/page/base/item/brandChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择商品简易
    Business.goodSelectCombo = function($_obj,$_grid,url,selectCallback){
        $_grid.on('click', $_obj, function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opGetSkuForAdjust';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title: '选择商品',
                content: 'url:/front/v3/js/common/page/base/item/skuChooseForAdjust.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择关联类别
    Business.selectLinkCategory = function(url,selectCallback,title,checkedArr){
        // $_grid.on('click', $_obj, function(){
            // var dataUrl = '';
            // if(url==''){
            //     dataUrl = '/base/api/common/opBrandData';
            // }else{
            //     dataUrl=url;
            // }
            if(checkedArr == ""){
                checkedArr = []
            }
            $.dialog({
                title : title,
                content: 'url:/front/v3/js/common/page/base/item/linkCategory.html',
                data: {
                    dataUrl:url,
                    title:title,
                    checkedArr:checkedArr,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 300,
                height : 300,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        // });
    };
    //选择默认货位
     Business.selectDefaultPos = function($_obj,$_grid,url,selectCallback,title){
        $_grid.on('click', $_obj, function(){
            // var dataUrl = '';
            // if(url==''){
            //     dataUrl = '/base/api/common/opBrandData';
            // }else{
            //     dataUrl=url;
            // }
            $.dialog({
                title : title,
                content: 'url:/front/v3/js/common/page/base/item/positionChoose.html',
                data: {
                    dataUrl:url,
                    title:title,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 300,
                height : 300,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
     //选择默认货位 可选定展开默认值
     Business.selectDefaultPos2 = function(url,selectCallback,title,checkedPos){

        $.dialog({
            title : title,
            content: 'url:/front/v3/js/common/page/base/item/positionChoose.html',
            data: {
                dataUrl:url,
                title:title,
                checkedPos:checkedPos,
                callback : function(selectRowListArray,win){
                    selectCallback && selectCallback.call(this,selectRowListArray);
                    win.api.close();
                }
            },
            width : 300,
            height : 300,
            max : false,
            min : false,
            cache : false,
            lock: true
        });
    };
    //选择类别，有数据权限(只显示2级到5级的类别)
    Business.secondIcatSelectCombo = function($_obj, url,selectCallback){
        $_obj.click(function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opSecondIcatData';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择类别',
                content: 'url:/front/v3/js/common/page/base/item/secondIcatChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 700,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择大类，有数据权限---分页获取，可多选
    Business.bigIcatSelectCombos = function($_obj, url,selectCallback){
        $_obj.click(function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/getBigIcatData';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择大类',
                content: 'url:/front/v3/js/common/page/base/item/bigIcatChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
//              data: {
//                  dataUrl: dataUrl,
//                  callback: function (selectRowListArray, win) {
//                      secondIcatSelectCombos.loadData(selectRowListArray);
//                      $input.val(selectRowListArray[0].skuCode + " " + selectRowListArray[0].itemName + " " + selectRowListArray[0].specifications);
//                  }
//              },
                width : 750,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择类别，有数据权限(只显示2级到5级的类别)-------多选
    Business.secondIcatSelectCombos = function($_obj, url,selectCallback){
        $_obj.click(function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opSecondIcatData';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择类别',
                content: 'url:/front/v3/js/common/page/base/item/secondIcatChooses.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
//              data: {
//                  dataUrl: dataUrl,
//                  callback: function (selectRowListArray, win) {
//                      secondIcatSelectCombos.loadData(selectRowListArray);
//                      $input.val(selectRowListArray[0].skuCode + " " + selectRowListArray[0].itemName + " " + selectRowListArray[0].specifications);
//                  }
//              },
                width : 700,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择类别，有数据权限
    Business.icatSelectCombo = function($_obj,$_grid,url,selectCallback){
        $_grid.on('click', $_obj, function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opIcatData';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择类别',
                content: 'url:/front/v3/js/common/page/base/item/icatChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择部门，有数据权限
    Business.firstIcatSelectCombo = function($_obj,url,selectCallback){
        $_obj.click(function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opGetFirstIcat';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择部门',
                content: 'url:/front/v3/js/common/page/base/item/firstIcatChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 600,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择供应商
    Business.supSelectCombo = function($_obj,url,selectCallback){
        $_obj.click(function(){
            $.dialog({
                title : '供应商选择',
                content: 'url:/front/v3/js/common/page/base/supplier/supplierChoose.html',
                data: {
                    dataUrl:"/finance/api/common/stateList",
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择购销供应商
    Business.purSupSelectCombo = function($_obj,url,selectCallback){
        $_obj.click(function(){
            $.dialog({
                title : '购销供应商选择',
                content: 'url:/front/v3/js/common/page/base/supplier/supplierChoose.html',
                data: {
                    dataUrl:"/finance/api/common/stateList",
                    bizType:'210001',
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择联营供应商
    Business.assSupSelectCombo = function($_obj,url,selectCallback){
        $_obj.click(function(){
            $.dialog({
                title : '联营供应商选择',
                content: 'url:/front/v3/js/common/page/base/supplier/supplierChoose.html',
                data: {
                    dataUrl:"/finance/api/common/stateList",
                    bizType:'210002',
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择人员，有数据权限
    Business.vendorUserSelectCombo = function($_obj,url,selectCallback){
        $_obj.click(function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/vm/common/getVendorUser';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '人员选择',
                content: 'url:/front/v3/js/common/page/common/vendorUser/vendorUserChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择全部门店，没有数据权限
    Business.storeAllSelectCombo = function($_obj, url,selectCallback){
        $_obj.click(function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opAllStoreData';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择门店',
                content: 'url:/front/v3/js/common/page/base/item/allStoreChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择全部门店，没有数据权限,用于调价单
    Business.storeAllSelectComboForAdjust = function($_obj, url,selectCallback){
        $_obj.click(function(){
            if($("#scopeFlag").val()==""){
                Public.tips({type: 1, content : '请选择调价范围！'});
                return false;
            }else if($("#scopeFlag").val()=="0"){
                Public.tips({type: 1, content : '全网调价，无需选择门店！'});
                return false;
            }
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opStoreData';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择门店',
                content: 'url:/front/v3/js/common/page/base/item/storeChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择全部门店，没有数据权限,用于商品状态调整单
    Business.storeAllSelectComboForAdjustSkuState = function($_obj, url,selectCallback){
        $_obj.click(function(){
            if($("#scopeFlag").val()==""){
                Public.tips({type: 1, content : '请选择调整范围！'});
                return false;
            }else if($("#scopeFlag").val()=="0"){
                Public.tips({type: 1, content : '调整全网，无需选择门店！'});
                return false;
            }
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opAllStoreData';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择门店',
                content: 'url:/front/v3/js/common/page/base/item/allStoreChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //选择门店，有数据权限
    Business.storeSelectCombo = function($_obj, url,selectCallback){
        $_obj.click(function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opStoreData';
            }else{
                dataUrl=url;
            }
            $.dialog({
                title : '选择门店',
                content: 'url:/front/v3/js/common/page/base/item/storeChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                width : 800,
                height : 400,
                max : false,
                min : false,
                cache : false,
                lock: true
            });
        });
    };
    //报表选择商品
    Business.skuReportSelectCombo = function($_obj, url,selectCallback){
        $_obj.click(function(){
            var dataUrl = '';
            if(url==''){
                dataUrl = '/base/api/common/opGetAllItemData';
            }else{
                dataUrl=url;
            }
            var customerDialog = $.dialog({
                width: 800,
                height: 400,
                title: '选择商品',
                content: 'url:/front/v3/js/common/page/base/item/skuChoose.html',
                data: {
                    dataUrl:dataUrl,
                    callback : function(selectRowListArray,win){
                        selectCallback && selectCallback.call(this,selectRowListArray);
                        win.api.close();
                    }
                },
                lock: true
            });
        });
    };

    /**
     * 商品combo控件
     * @param $_obj
     * @param opts
     */
    Business.skuCombo = function($_obj, opts,$_grid){
        if ($_obj.length == 0) { return };
        $_grid = $_grid || $("#grid");

        opts = $.extend(true, {
            data: '/base/api/common/opGetStoreSkuBySearch',
            ajaxOptions: {
                queryParam:'searchValue',
                formatData: function(data){
                    if(data && data.dataValue){
                        return data.dataValue.rows;
                    }else{
                        return data.message;
                    }

                }
            },
            text: 'skuCode',
            value: 'skuCode',
            formatText:function(row){
                return row.skuCode;
            },
            customMatch:function(item,query){
                var allText = item.rawData.skuCode+" "+item.rawData.itemName+"_"+item.rawData.barcode;//搜索匹配项
                var reg = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
                if(allText.search(reg) == -1){
                    return false;
                }
                return true;
            },
            autoSelect: false,
            defaultSelected:-1,
            editable: true,
            //extraListHtml: '<a href="javascript:void(0);" id="quickAddOrgan" class="quick-add-link"><i class="ui-icon-add"></i>新增类别</a>',
            maxListWidth: 610,
            cache: false,
            forceSelection: false,
            noDataText:false,
            extraListHtmlCls:false,
            loadOnce:false,
            maxFilter: 10,
            trigger: false,
            gridCombo:true,
            gridColModel:[
                {name: 'skuCode', label:'SKU编码', width: 100, align: 'left'},
                {name: 'barcode', label:'国际条码', width: 100, align: 'left'},
                {name: 'itemName', label:'商品名', width: 200, align: 'left'},
                {name: 'specMemo', label:'规格', width: 100, align: 'left'},
                {name: 'salePrice', label:'零售价', width: 60, align: 'left'}
            ],
            callback: {
                onChange: function(data){
                    var parentTr = this.input.parents('span');
                    if(data) {
                        parentTr.data('skuInfo', data);
                    }
                },
                onInputChange: function(keyword){
                    if(this.mode == 'local'){
                        this.loadData(opts.data,-1);
                    }
                }
            },
            queryDelay: 300
        }, opts);

        var skuCombo = $_obj.combo(opts).getCombo();
        return skuCombo;
    };

    /**
     * grid中的sku combo控件
     * @param $_obj
     * @param opts
     */
    Business.skuGridCombo = Business.goodsGridCombo = function($_obj, opts,$_grid,selectCallback){
        if ($_obj.length == 0) { return };
        $_grid = $_grid || $("#grid");

        opts = $.extend(true, {
            data: '/base/api/common/opGetStoreSkuBySearch',
            ajaxOptions: {
                queryParam:'searchValue',
                formatData: function(data){
                    if(data && data.dataValue){
                        return data.dataValue.rows;
                    }else{
                        return data.message;
                    }
                }
            },
            text: 'skuCode',
            value: 'skuCode',
            formatText:function(row){
                return row.skuCode;
            },
            customMatch:function(item,query){
            	var allText = item.rawData.skuCode+" "+item.rawData.itemName+"_"+item.rawData.barcode;//搜索匹配项
            	var reg = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
				if(allText.search(reg) == -1){
					return false;
				}
				return true;
            },
            autoSelect: false,
            defaultSelected:-1,
            editable: true,
            //extraListHtml: '<a href="javascript:void(0);" id="quickAddOrgan" class="quick-add-link"><i class="ui-icon-add"></i>新增类别</a>',
            maxListWidth: 610,
            cache: false,
            forceSelection: false,
            noDataText:false,
            extraListHtmlCls:false,
            loadOnce:false,
            maxFilter: 10,
            trigger: false,
            gridCombo:true,
    		gridColModel:[
    	        {name: 'skuCode', label:'SKU编码', width: 100, align: 'left'},
                {name: 'barcode', label:'国际条码', width: 100, align: 'left'},
    	        {name: 'itemName', label:'商品名', width: 200, align: 'left'},
    	        {name: 'specMemo', label:'规格', width: 100, align: 'left'},
    	        {name: 'salePrice', label:'零售价', width: 60, align: 'left'}
            ],
            callback: {
                onChange: function(data){
                    var parentTr = this.input.parents('span');
                    if(data) {
                        parentTr.data('skuInfo', data);
                    }
                },
                onInputChange: function(keyword){
                    if(this.mode == 'local'){
                        this.loadData(opts.data,-1);
                    }
                }
            },
            queryDelay: 300
        }, opts);

        var skuCombo = $_obj.combo(opts).getCombo();
        skuCombo.bindDialog = function(dataUrl){
        	$_grid.off('click', '.ui-icon-ellipsis');
        	//商品选择
        	$_grid.on('click', '.ui-icon-ellipsis', function(e){
                var $input = $(this).parent().find('input');
                var customerDialog = $.dialog({
                    width: 800,
                    height: 400,
                    title: '选择商品',
                    content: 'url:/front/v3/js/common/page/base/item/skuChoose.html',
                    data: {
                        dataUrl:dataUrl,
                        callback : function(selectRowListArray,win){
                            selectCallback && selectCallback.call(this,selectRowListArray);
                            win.api.close();
                        }
                    },
                    lock: true
                });
            });
        };
        skuCombo.bindDialog(opts.data);
        return skuCombo;
    };

    Business.skuGridComboForAdjust = function($_obj, opts,$_grid,selectCallback){
        if ($_obj.length == 0) { return };
        $_grid = $_grid || $("#grid");

        opts = $.extend(true, {
            data: '/base/api/common/opGetSkuForAdjust',
            ajaxOptions: {
                queryParam:'searchValue',
                formatData: function(data){
//                  return data.dataValue.rows;
										if(data && data.dataValue){
                        return data.dataValue.rows;
                    }else{
                        return data.message;
                    }
                }
            },
            text: 'skuCode',
            value: 'id',
            formatText:function(row){
                return row.skuCode;
            },
            customMatch:function(item,query){
                var allText = item.rawData.skuCode+" "+item.rawData.itemName+"_"+item.rawData.barcode;//搜索匹配项
                var reg = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
                if(allText.search(reg) == -1){
                    return false;
                }
                return true;
            },
            autoSelect: false,
            defaultSelected:-1,
            editable: true,
            //extraListHtml: '<a href="javascript:void(0);" id="quickAddOrgan" class="quick-add-link"><i class="ui-icon-add"></i>新增类别</a>',
            maxListWidth: 610,
            cache: false,
            forceSelection: false,
            noDataText:false,
            extraListHtmlCls:false,
            maxFilter: 10,
            trigger: false,
            loadOnce:false,
            gridCombo:true,
            gridColModel:[
                {name: 'skuCode', label:'SKU编码', width: 100, align: 'left'},
                {name: 'barcode', label:'国际条码', width: 100, align: 'left'},
                {name: 'skuName', label:'商品名称', width: 200, align: 'left'},
                {name: 'specMemo', label:'规格', width: 60, align: 'left'},
                {name: 'unit', label:'单位', width: 60, align: 'left'}
            ],
            callback: {
                onChange: function(data){
                    var parentTr = this.input.parents('span');
                    if(data) {
                        parentTr.data('skuInfo', data);
                    }
                },
                onInputChange: function(keyword){
                    if(this.mode == 'local'){
                        this.loadData(opts.data,-1);
                    }
                }
            },
            queryDelay: 300
        }, opts);

        var skuCombo = $_obj.combo(opts).getCombo();
        skuCombo.bindDialog = function(dataUrl){
            $_grid.off('click', '.ui-icon-ellipsis');
            //商品选择
            $_grid.on('click', '.ui-icon-ellipsis', function(e){
                var $input = $(this).parent().find('input');
                var customerDialog = $.dialog({
                    width: 900,
                    height: 400,
                    title: '选择商品',
                    content: 'url:/front/v3/js/common/page/base/item/skuChooseForAdjust.html',
                    data: {
                        dataUrl:dataUrl,
                        callback : function(selectRowListArray,win){
                            selectCallback && selectCallback.call(this,selectRowListArray);
                            win.api.close();
                        }
                    },
                    lock: true
                });
            });
        };
        skuCombo.bindDialog(opts.data);
        return skuCombo;
    };
    /**
     * grid中的门店 combo控件
     * @param $_obj
     * @param opts
     */
    //Business.storeGridCombo = Business.getStoreGridCombo = function($_obj, opts,$_grid,selectCallback){
    //    if ($_obj.length == 0) { return };
    //    $_grid = $_grid || $("#grid");
    //
    //    opts = $.extend(true, {
    //        data: '/base/api/common/opStoreData',
    //        ajaxOptions: {
    //            //queryParam:'searchValue',
    //            formatData: function(data){
    //                return data.dataValue.rows;
    //            }
    //        },
    //        text: 'storeName',
    //        value: 'storeCode',
    //        formatText:function(row){
    //            return row.storeCode + " " + row.storeName;
    //        },
    //        defaultSelected: -1,
    //        editable: true,
    //        //extraListHtml: '<a href="javascript:void(0);" id="quickAddOrgan" class="quick-add-link"><i class="ui-icon-add"></i>新增类别</a>',
    //        maxListWidth: 500,
    //        cache: false,
    //        forceSelection: true,
    //        maxFilter: 10,
    //        trigger: false,
    //        callback: {
    //            onChange: function(data){
    //                var parentTr = this.input.parents('span');
    //                if(data) {
    //                    parentTr.data('skuInfo', data);
    //                }
    //            },
    //            onInputChange: function(keyword){
    //                if(this.mode == 'local'){
    //                    this.loadData(opts.data,-1);
    //                }
    //            }
    //        },
    //        queryDelay: 300
    //    }, opts);
    //
    //    var storeCombo = $_obj.combo(opts).getCombo();
    //    storeCombo.bindDialog = function(dataUrl){
    //        $_grid.off('click', '#testStore');
    //        //门店选择
    //        $_grid.on('click', '#testStore', function(e){
    //            alert(33333);
    //            var $input = $(this).parent().find('input');
    //            var customerDialog = $.dialog({
    //                width: 800,
    //                height: 400,
    //                title: '选择门店',
    //                content: 'url:/front/v3/js/common/page/base/item/storeChoose.html',
    //                data: {
    //                    dataUrl:dataUrl,
    //                    callback : function(selectRowListArray,win){
    //                        selectCallback && selectCallback.call(this,selectRowListArray);
    //                        win.api.close();
    //                    }
    //                },
    //                lock: true
    //            });
    //        });
    //    };
    //    storeCombo.bindDialog(opts.data);
    //    return storeCombo;
    //};

    /**
     * 供应商combo控件
     * @param $_obj
     * @param opts
     */
    Business.supCombo = function($_obj, opts){

        if ($_obj.length == 0) { return };

        opts = $.extend(true, {
            data: function(){
                if(typeof opts.businessType != "undefined"){
                    return '/finance/api/common/opAllSupplierList?businessType='+opts.businessType;
                }else{
                    return '/finance/api/common/opAllSupplierList';
                }
            },
            ajaxOptions: {
                formatData: function(data){
                    return data.dataValue.rows;
                }
            },
            text: 'supName',
            value: 'supCode',
            formatText:function(row){
                if(row.supCode!=''){
                    return "["+row.supCode + "] " + row.supName;
                }else{
                    return row.supName;
                }
                //return row.supCode + " " + row.supName;
            },
            //defaultSelected: -1,
            editable: true,
            //extraListHtml: '<a href="javascript:void(0);" id="quickAddOrgan" class="quick-add-link"><i class="ui-icon-add"></i>新增类别</a>',
            maxListWidth: 500,
            cache: false,
            forceSelection: true,
            maxFilter: 10,
            loadOnce:true,
            trigger:true,
            triggerCls:'ui-icon-triangle-1-s',
            callback: {
                onChange: function(data){
                    var parentTr = this.input.parents('span');
                    if(data) {
                        parentTr.data('supInfo', data);
                    }
                },
                onListClick: function(){

                }
            },
            queryDelay: 0
        }, opts);

        var supCombo = $_obj.combo(opts).getCombo();

        return supCombo;
    };

    /**
     * 组织机构combo控件
     * @param $_obj
     * @param opts
     */
    Business.organCombo = function($_obj, opts){
        //模拟新增后的缓存数据
        window.oraganInfo = [];

        if ($_obj.length == 0) { return };

        opts = $.extend(true, {
            data: function(){
                return '/base/api/common/getOrganByUser';
            },
            ajaxOptions: {
                formatData: function(data){
                    return data;
                }
            },
            text: 'organName',
            value: 'organCode',
            formatText:function(row){
                if(row){
                    if(row.organCode!=''){
                        return "["+row.organCode + "] " + row.organName;
                    }else{
                        return row.organName;
                    }
                }
            },
            defaultSelected: -1,
            editable: true,
            //extraListHtml: '<a href="javascript:void(0);" id="quickAddOrgan" class="quick-add-link"><i class="ui-icon-add"></i>新增类别</a>',
            maxListWidth: 500,
            cache: false,
            forceSelection: true,
            maxFilter: 10,
            loadOnce:true,
            trigger:true,
            triggerCls:'ui-icon-triangle-1-s',
            callback: {
                onChange: function(data){
                    var parentTr = this.input.parents('span');
                    if(data) {
                        parentTr.data('organInfo', data);
                    }
                },
                onListClick: function(){

                }
            },
            queryDelay: 0
        }, opts);

        var organCombo = $_obj.combo(opts).getCombo();
        //新增机构
        $('#quickAddOrgan').on('click', function(e){
            e.preventDefault();
            var callback=function(data,dialogWin){
                organCombo.loadData(function(){return window.categoryInfo}, '-1', false);
                dialogWin.close();
                setTimeout( function() {
                    organCombo.selectByValue(data.id, true);
                    $_obj.focus();
                }, 10);
            };
            Business.organComboAdd('1',window,callback);
        });
        return organCombo;
    };

    /*
     * 机构新增弹窗
     * 不支持多级结构（树）
     * parentWin object 父窗口对象,决定弹窗的覆盖范围，默认当前窗口的parent
     */
    Business.organComboAdd = function(targetWin,callback){
        var self = {
            init:function(){
                var showParentCategory = false;
                var content = $(['<form id="manage-form" action="" style="width: 320px;">',
                    '<ul class="mod-form-rows manage-wrap" id="manager">',
                    '<li class="row-item">',
                    '<div class="label-wrap"><label for="category">类别:</label></div>',
                    '<div class="ctn-wrap"><input type="text" value="" class="ui-input" name="category" id="category" style="width:190px;"></div>',
                    '</li>',
                    '</ul>',
                    '</form>'].join(''));
                var height = 90;
                var dialog = $.dialog({
                    title : '新增类别',
                    content : content,
                    //data: data,
                    width : 300,
                    height : height,
                    max : false,
                    min : false,
                    cache : false,
                    lock: true,
                    okVal:'确定',
                    ok:function(){
                        var category = content.find('#category');
                        var	categoryValue = $.trim(content.find('#category').val());
                        if(!categoryValue){
                            Public.tips({content : '请输入类别名称！'});
                            category.focus();
                            return false;
                        }
                        var oper = 'add';
                        var params = { name: category};
                        var msg = '新增类别';
                        Public.ajaxPost('../basedata/assist.do.json?action=' + oper, params, function(data){
                            if (data.status == 200) {
                                Public.tips({content : msg + '成功！'});
                                window.categoryInfo.push(data.data);
                                if(typeof callback ==='function'){
                                    callback(data.data,dialog);
                                }
                            } else {
                                Public.tips({type:1, content : msg + '失败！' + data.msg});
                            }
                        });
                        return false;
                    },
                    cancelVal:'取消',
                    cancel:function(){
                        return true;
                    }
                });
            }
        };
        self.init();
    };

    /**
     * 组织机构combo控件
     * @param $_obj
     * @param opts
     */
    Business.storeCombo = function($_obj, opts){

        if ($_obj.length == 0) { return };

        opts = $.extend(true, {
            data: '/base/api/common/getAllStoreByOrgan',
            ajaxOptions: {
                formatData: function(data){
                    return data;
                }
            },
            text: 'storeName',
            value: 'storeCode',
            formatText:function(row){
                if(row.storeCode!=''){
                    return "["+row.storeCode + "] " + row.storeName;
                }else{
                    return row.storeName;
                }
                //return row.storeCode + " " + row.storeName;
            },
            defaultSelected: -1,
            editable: true,
            //extraListHtml: '<a href="javascript:void(0);" id="quickAddOrgan" class="quick-add-link"><i class="ui-icon-add"></i>新增类别</a>',
            maxListWidth: 500,
            cache: false,
            forceSelection: true,
            maxFilter: 10,
            loadOnce:true,
            trigger:true,
            triggerCls:'ui-icon-triangle-1-s',
            callback: {
                onChange: function(data){
                    var parentTr = this.input.parents('span');
                    if(data) {
                        parentTr.data('storeInfo', data);
                    }
                },
                onListClick: function(){

                }
            },
            queryDelay: 0
        }, opts);

        var storeCombo = $_obj.combo(opts).getCombo();
        return storeCombo;
    };

    //order增加grid行
    Business.billsEvent = function(obj, type, flag){
        var _self = obj;
        //新增分录
        $('.grid-wrap').on('click', '.ui-icon-plus', function(e){
            var rowId = $(this).parent().data('id');
            var newId = $('#grid tbody tr').length;
            var datarow = { id: _self.newId };
            var su = $("#grid").jqGrid('addRowData', _self.newId, datarow, 'before', rowId);
            if(su) {
                $(this).parents('td').removeAttr('class');
                $(this).parents('tr').removeClass('selected-row ui-state-hover');
                $("#grid").jqGrid('resetSelection');
                _self.newId++;
            }
        });
        //删除分录
        $('.grid-wrap').on('click', '.ui-icon-trash', function(e){
            if($('#grid tbody tr').length === 2) {
                Public.tips({type: 2, content: '至少保留一条分录！'});
                return false;
            }
            var rowId = $(this).parent().data('id');
            var su = $("#grid").jqGrid('delRowData', rowId);
            if(su) {
                //_self.calTotal();
            };
        });
    };

    //获取文件
    Business.getFile = function(url, args, isNewWinOpen){
        if (typeof url != 'string') {
            return ;
        }
        var url = url.indexOf('?') == -1 ? url += '?' : url;
        if(args.id) {
            url += '&id=' + args.id + '&random=' + new Date().getTime();
        } else {
            url += '&random=' + new Date().getTime();
        };

        var downloadForm = $('form#downloadForm');
        if (downloadForm.length == 0) {
            downloadForm = $('<form method="post" />').attr('id', 'downloadForm').hide().appendTo('body');
        } else {
            downloadForm.empty();
        }
        downloadForm.attr('action', url);
        for( k in args){
            $('<input type="hidden" />').attr({name: k, value: args[k]}).appendTo(downloadForm);
        }
        if (isNewWinOpen) {
            downloadForm.attr('target', '_blank');
        } else{
            var downloadIframe = $('iframe#downloadIframe');
            if (downloadIframe.length == 0) {
                downloadIframe = $('<iframe />').attr('id', 'downloadIframe').hide().appendTo('body');
            }
            downloadForm.attr('target', 'downloadIframe');
        }
        downloadForm.trigger('submit');
    };

    //品牌下拉树树
    Business.brandTreeCombo = function($obj, opts) {
        if ($obj.length === 0) {
            return;
        }
        opts = opts ? opts : opts = {};
        opts = $.extend(true, {
            inputWidth:'200',
            width:'190',//'auto' or int
            height:'240',//'auto' or int
            trigger:true,
            defaultClass:'ztreeCombo',
            disExpandAll:false,//展开全部
            defaultSelectValue:0,
            showRoot:true,//显示root选择
            rootTxt:'全部',
            treeSettings : {
                url:'/base/api/common/opBrandTree',
                callback:{
                    beforeClick: function(treeId, treeNode) {
                        if(_Combo.obj){
                            _Combo.obj.val(treeNode.name);
                            _Combo.obj.data('id', treeNode.id);
                            _Combo.hideTree();
                        }
                    }
                }
            }
        }, opts);
        var _Combo = {
            container:$('<span class="ui-tree-wrap" style="width:'+opts.inputWidth+'px"></span>'),
            obj : $('<input type="text" class="input-txt" style="width:'+(opts.inputWidth-26)+'px" id="'+$obj.attr('id')+'" autocomplete="off" readonly value="'+($obj.val()||$obj.text())+'">'),
            trigger : $('<span class="trigger"></span>'),
            data:{},
            init : function(){
                var _parent = $obj.parent();
                var _this = this;
                $obj.remove();
                this.obj.appendTo(this.container);
                if(opts.trigger){
                    this.container.append(this.trigger);
                }
                this.container.appendTo(_parent);
                opts.callback = function(publicTree ,data){
                    _this.zTree = publicTree;
                    //_this.data = data;
                    if(publicTree){
                        publicTree.obj.css({
                            'max-height' : opts.height
                        });
                        for ( var i = 0, len = data.length; i < len; i++){
                            _this.data[data[i].id] = data[i];
                        };
                        if(opts.defaultSelectValue !== ''){
                            _this.selectByValue(opts.defaultSelectValue);
                        };
                        _this._eventInit();
                    }
                };
                this.zTree = Business.brandTree.init($('#initTree'), opts , opts.treeSettings);
                return this;
            },
            showTree:function(){
                if(!this.zTree)return;
                if(this.zTree){
                    var offset = this.obj.offset();
                    var topDiff = this.obj.outerHeight();
                    var w = opts.width? opts.width : this.obj.width();
                    var _o = this.zTree.obj.hide();
                    _o.css({width:w, top:offset.top + topDiff,left:offset.left-1});
                }
                var _o = this.zTree.obj.show();
                this.isShow = true;
                this.container.addClass('ui-tree-active');
            },
            hideTree:function(){
                if(!this.zTree)return;
                var _o = this.zTree.obj.hide();
                this.isShow = false;
                this.container.removeClass('ui-tree-active');
            },
            _eventInit: function(){
                var _this = this;
                if(opts.trigger){
                    _this.trigger.on('click',function(e){
                        e.stopPropagation();
                        if(_this.zTree && !_this.isShow){
                            _this.showTree();
                        }else{
                            _this.hideTree();
                        }
                    });
                };
                _this.obj.on('click',function(e){
                    e.stopPropagation();
                    if(_this.zTree && !_this.isShow){
                        _this.showTree();
                    }else{
                        _this.hideTree();
                    }
                });
                if(_this.zTree){
                    _this.zTree.obj.on('click',function(e){
                        e.stopPropagation();
                    });
                }
                $(document).click(function(){
                    _this.hideTree();
                });
            },
            getValue:function(){
                var id = this.obj.data('id') || '';
                if(!id){
                    var text = this.obj.val();
                    if(this.data){
                        for(var item in this.data){
                            if(this.data[item].name === text){
                                id = this.data[item].id;
                            }
                        }
                    }
                }
                return id;
            },
            getText:function(){
                if(this.obj.data('id'))
                    return this.obj.val();
                return '';
            },
            selectByValue:function(value){
                if(value !== ''){
                    if(this.data){
                        this.obj.data('id', value);
                        this.obj.val(this.data[value].name);
                    }
                }
                return this;
            }
        };
        return _Combo.init();
    };

    //分类下拉树树
    Business.categoryTreeCombo = function($obj, opts) {
        if ($obj.length === 0) {
            return;
        }
        opts = opts ? opts : opts = {};
        opts = $.extend(true, {
            inputWidth:'200',
            width:'190',//'auto' or int
            height:'240',//'auto' or int
            trigger:true,
            defaultClass:'ztreeCombo',
            disExpandAll:false,//展开全部
            defaultSelectValue:0,
            showRoot:true,//显示root选择
            rootTxt:'全部',
            treeSettings : {
                url:'/base/api/common/opICatTree',
                callback:{
                    beforeClick: function(treeId, treeNode) {
                        if(_Combo.obj){
                            _Combo.obj.val(treeNode.name);
                            _Combo.obj.data('id', treeNode.id);
                            _Combo.hideTree();
                        }
                    }
                }
            }
        }, opts);
        var _Combo = {
            container:$('<span class="ui-tree-wrap" style="width:'+opts.inputWidth+'px"></span>'),
            obj : $('<input type="text" class="input-txt" style="width:'+(opts.inputWidth-26)+'px" id="'+$obj.attr('id')+'" autocomplete="off" readonly value="'+($obj.val()||$obj.text())+'">'),
            trigger : $('<span class="trigger"></span>'),
            data:{},
            init : function(){
                var _parent = $obj.parent();
                var _this = this;
                $obj.remove();
                this.obj.appendTo(this.container);
                if(opts.trigger){
                    this.container.append(this.trigger);
                }
                this.container.appendTo(_parent);
                opts.callback = function(publicTree ,data){
                    _this.zTree = publicTree;
                    //_this.data = data;
                    if(publicTree){
                        publicTree.obj.css({
                            'max-height' : opts.height
                        });
                        for ( var i = 0, len = data.length; i < len; i++){
                            _this.data[data[i].id] = data[i];
                        };
                        if(opts.defaultSelectValue !== ''){
                            _this.selectByValue(opts.defaultSelectValue);
                        };
                        _this._eventInit();
                    }
                };
                this.zTree = Business.categoryTree.init($('body'), opts , opts.treeSettings);
                return this;
            },
            showTree:function(){
                if(!this.zTree)return;
                if(this.zTree){
                    var offset = this.obj.offset();
                    var topDiff = this.obj.outerHeight();
                    var w = opts.width? opts.width : this.obj.width();
                    var _o = this.zTree.obj.hide();
                    _o.css({width:w, top:offset.top + topDiff,left:offset.left-1});
                }
                var _o = this.zTree.obj.show();
                this.isShow = true;
                this.container.addClass('ui-tree-active');
            },
            hideTree:function(){
                if(!this.zTree)return;
                var _o = this.zTree.obj.hide();
                this.isShow = false;
                this.container.removeClass('ui-tree-active');
            },
            _eventInit: function(){
                var _this = this;
                if(opts.trigger){
                    _this.trigger.on('click',function(e){
                        e.stopPropagation();
                        if(_this.zTree && !_this.isShow){
                            _this.showTree();
                        }else{
                            _this.hideTree();
                        }
                    });
                };
                _this.obj.on('click',function(e){
                    e.stopPropagation();
                    if(_this.zTree && !_this.isShow){
                        _this.showTree();
                    }else{
                        _this.hideTree();
                    }
                });
                if(_this.zTree){
                    _this.zTree.obj.on('click',function(e){
                        e.stopPropagation();
                    });
                }
                $(document).click(function(){
                    _this.hideTree();
                });
            },
            getValue:function(){
                var id = this.obj.data('id') || '';
                if(!id){
                    var text = this.obj.val();
                    if(this.data){
                        for(var item in this.data){
                            if(this.data[item].name === text){
                                id = this.data[item].id;
                            }
                        }
                    }
                }
                return id;
            },
            getText:function(){
                if(this.obj.data('id'))
                    return this.obj.val();
                return '';
            },
            selectByValue:function(value){
                if(value !== ''){
                    if(this.data){
                        this.obj.data('id', value);
                        this.obj.val(this.data[value].name);
                    }
                }
                return this;
            }
        };
        return _Combo.init();
    };

    //生成品类树
    Business.categoryTree = {
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
            this.id = 'tree'+parseInt(Math.random()*10000);
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
            $(self.obj).css("height",Public.setGrid(15, 0).h);

            $(window).bind('resize', function(){
                var cateTree = $(self.obj);
                var cateTreeWH = Public.setGrid(15, 0);
                cateTree.css('height', cateTreeWH.h);
            });
        }
    };

    //生成品牌树
    Business.brandTree = {
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
            this.id = 'tree'+parseInt(Math.random()*10000);
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
            $(self.obj).css("height",Public.setGrid(15, 0).h);

            $(window).bind('resize', function(){
                var cateTree = $(self.obj);
                var cateTreeWH = Public.setGrid(15, 0);
                cateTree.css('height', cateTreeWH.h);
            });
        }
    };


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
            this.id = 'tree'+parseInt(Math.random()*10000);
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



})(jQuery,window,window.Business={})
