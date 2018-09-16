//jqGrid扩展
(function($,Public){
    if($.jgrid){
        //修改jqgrid的默认提示框
        $.jgrid.info_dialog = function(caption, content,c_b, modalopt) {
            //Public.tips({type: 1, content : content});
        }

        //修改edit表格createEl的实现，主要是修改编辑框样式
        $.jgrid.createEl = function(eltype,options,vl,autowidth, ajaxso) {
            var elem = "", $t = this;
            function setAttributes(elm, atr, exl ) {
                var exclude = ['dataInit','dataEvents','dataUrl', 'buildSelect','sopt', 'searchhidden', 'defaultValue', 'attr', 'custom_element', 'custom_value','dateClass','dialog_element'];
                if(exl !== undefined && $.isArray(exl)) {
                    $.merge(exclude, exl);
                }
                $.each(atr, function(key, value){
                    if($.inArray(key, exclude) === -1) {
                        $(elm).attr(key,value);
                    }
                });
                if(!atr.hasOwnProperty('id')) {
                    $(elm).attr('id', $.jgrid.randId());
                }
            }
            switch (eltype)
            {
                case "textarea" :
                    elem = document.createElement("textarea");
                    if(autowidth) {
                        if(!options.cols) { $(elem).css({width:"98%"});}
                    } else if (!options.cols) { options.cols = 20; }
                    if(!options.rows) { options.rows = 2; }
                    if(vl==='&nbsp;' || vl==='&#160;' || (vl.length===1 && vl.charCodeAt(0)===160)) {vl="";}
                    elem.value = vl;
                    setAttributes(elem, options);
                    $(elem).attr({"role":"textbox","multiline":"true"});
                    break;
                case "checkbox" : //what code for simple checkbox
                    elem = document.createElement("input");
                    elem.type = "checkbox";
                    if( !options.value ) {
                        var vl1 = (vl+"").toLowerCase();
                        if(vl1.search(/(false|f|0|no|n|off|undefined)/i)<0 && vl1!=="") {
                            elem.checked=true;
                            elem.defaultChecked=true;
                            elem.value = vl;
                        } else {
                            elem.value = "on";
                        }
                        $(elem).attr("offval","off");
                    } else {
                        var cbval = options.value.split(":");
                        if(vl === cbval[0]) {
                            elem.checked=true;
                            elem.defaultChecked=true;
                        }
                        elem.value = cbval[0];
                        $(elem).attr("offval",cbval[1]);
                    }
                    setAttributes(elem, options, ['value']);
                    $(elem).attr("role","checkbox");
                    break;
                case "select" :
                    elem = document.createElement("select");
                    elem.setAttribute("role","select");
                    var msl, ovm = [];
                    if(options.multiple===true) {
                        msl = true;
                        elem.multiple="multiple";
                        $(elem).attr("aria-multiselectable","true");
                    } else { msl = false; }
                    if(options.dataUrl !== undefined) {
                        var rowid = options.name ? String(options.id).substring(0, String(options.id).length - String(options.name).length - 1) : String(options.id),
                            postData = options.postData || ajaxso.postData;

                        if ($t.p && $t.p.idPrefix) {
                            rowid = $.jgrid.stripPref($t.p.idPrefix, rowid);
                        }
                        $.ajax($.extend({
                            url: $.isFunction(options.dataUrl) ? options.dataUrl.call($t, rowid, vl, String(options.name)) : options.dataUrl,
                            type : "GET",
                            dataType: "html",
                            data: $.isFunction(postData) ? postData.call($t, rowid, vl, String(options.name)) : postData,
                            context: {elem:elem, options:options, vl:vl},
                            success: function(data){
                                var ovm = [], elem = this.elem, vl = this.vl,
                                    options = $.extend({},this.options),
                                    msl = options.multiple===true,
                                    a = $.isFunction(options.buildSelect) ? options.buildSelect.call($t,data) : data;
                                if(typeof a === 'string') {
                                    a = $( $.trim( a ) ).html();
                                }
                                if(a) {
                                    $(elem).append(a);
                                    setAttributes(elem, options, postData ? ['postData'] : undefined );
                                    if(options.size === undefined) { options.size =  msl ? 3 : 1;}
                                    if(msl) {
                                        ovm = vl.split(",");
                                        ovm = $.map(ovm,function(n){return $.trim(n);});
                                    } else {
                                        ovm[0] = $.trim(vl);
                                    }
                                    //$(elem).attr(options);
                                    setTimeout(function(){
                                        $("option",elem).each(function(i){
                                            //if(i===0) { this.selected = ""; }
                                            // fix IE8/IE7 problem with selecting of the first item on multiple=true
                                            if (i === 0 && elem.multiple) { this.selected = false; }
                                            $(this).attr("role","option");
                                            if($.inArray($.trim($(this).text()),ovm) > -1 || $.inArray($.trim($(this).val()),ovm) > -1 ) {
                                                this.selected= "selected";
                                            }
                                        });
                                    },0);
                                }
                            }
                        },ajaxso || {}));
                    } else if(options.value) {
                        var i;
                        if(options.size === undefined) {
                            options.size = msl ? 3 : 1;
                        }
                        if(msl) {
                            ovm = vl.split(",");
                            ovm = $.map(ovm,function(n){return $.trim(n);});
                        }
                        if(typeof options.value === 'function') { options.value = options.value(); }
                        var so,sv, ov,
                            sep = options.separator === undefined ? ":" : options.separator,
                            delim = options.delimiter === undefined ? ";" : options.delimiter;
                        if(typeof options.value === 'string') {
                            so = options.value.split(delim);
                            for(i=0; i<so.length;i++){
                                sv = so[i].split(sep);
                                if(sv.length > 2 ) {
                                    sv[1] = $.map(sv,function(n,ii){if(ii>0) { return n;} }).join(sep);
                                }
                                ov = document.createElement("option");
                                ov.setAttribute("role","option");
                                ov.value = sv[0]; ov.innerHTML = sv[1];
                                elem.appendChild(ov);
                                if (!msl &&  ($.trim(sv[0]) === $.trim(vl) || $.trim(sv[1]) === $.trim(vl))) { ov.selected ="selected"; }
                                if (msl && ($.inArray($.trim(sv[1]), ovm)>-1 || $.inArray($.trim(sv[0]), ovm)>-1)) {ov.selected ="selected";}
                            }
                        } else if (typeof options.value === 'object') {
                            var oSv = options.value, key;
                            for (key in oSv) {
                                if (oSv.hasOwnProperty(key ) ){
                                    ov = document.createElement("option");
                                    ov.setAttribute("role","option");
                                    ov.value = key; ov.innerHTML = oSv[key];
                                    elem.appendChild(ov);
                                    if (!msl &&  ( $.trim(key) === $.trim(vl) || $.trim(oSv[key]) === $.trim(vl)) ) { ov.selected ="selected"; }
                                    if (msl && ($.inArray($.trim(oSv[key]),ovm)>-1 || $.inArray($.trim(key),ovm)>-1)) { ov.selected ="selected"; }
                                }
                            }
                        }
                        setAttributes(elem, options, ['value']);
                    }
                    break;
                case "text" :
                case "password" :
                case "button" :
                    var role;
                    if(eltype==="button") { role = "button"; }
                    else { role = "textbox"; }
                    elem = document.createElement("input");
                    elem.type = eltype;
                    elem.value = vl;
                    setAttributes(elem, options);
                    if(eltype !== "button"){
                        if(autowidth) {
                            if(!options.size) { $(elem).css({width:"100%"}); }
                        } else if (!options.size) { options.size = 20; }
                    }
                    $(elem).attr("role",role).addClass(role);
                    break;
                case "image" :
                case "file" :
                    elem = document.createElement("input");
                    elem.type = eltype;
                    setAttributes(elem, options);
                    break;
                case "custom" :
                    elem = document.createElement("div");
                    try {
                        if($.isFunction(options.custom_element)) {
                            var celm = options.custom_element.call($t,vl,options);
                            if(celm) {
                                celm = $(celm).addClass("customelement").attr({id:options.id,name:options.name});

                                $(elem).addClass("pr").empty().append(celm);
                                options.trigger && $(elem).append('<span class="' + options.trigger + '"></span>')
                            } else {
                                throw "e2";
                            }
                        } else {
                            throw "e1";
                        }
                    } catch (e) {
                        if (e==="e1") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_element' "+$.jgrid.edit.msg.nodefined, $.jgrid.edit.bClose);}
                        if (e==="e2") { $.jgrid.info_dialog($.jgrid.errors.errcap,"function 'custom_element' "+$.jgrid.edit.msg.novalue,$.jgrid.edit.bClose);}
                        else { $.jgrid.info_dialog($.jgrid.errors.errcap,typeof e==="string"?e:e.message,$.jgrid.edit.bClose); }
                    }
                    break;
                case "enterDialog" :
                    var role;
                    if(eltype==="button") { role = "button"; }
                    else { role = "textbox"; }
                    elem = document.createElement("input");
                    elem.type = eltype;
                    elem.value = vl;
                    setAttributes(elem, options);
                    if(autowidth) {
                        if(!options.size) { $(elem).css({width:"100%"}); }
                    } else if (!options.size) { options.size = 20; }
                    $(elem).attr("role",role).addClass(role).addClass("customelement itemAuto");
                    var div = document.createElement("div");
                    $(div).addClass("pr");
                    $(div).attr("rowid",options.rowid);
                    $(div).attr("data-id",options.rowid);
                    $(div).append($(elem));
                    options.trigger && $(div).append('<span class="' + options.trigger + '"></span>');
                    elem = div;
                    break;
                case "date" :
                    elem = document.createElement("input");
                    elem.type = "text";
                    elem.value = vl;
                    setAttributes(elem, options);
                    if(autowidth) {
                        if(!options.size) { $(elem).css({width:"100%"}); }
                    } else if (!options.size) { options.size = 20; }
                    $(elem).addClass("textbox");
                    if(options.dateClass){
                        $(elem).addClass(options.dateClass);
                    }else{
                        $(elem).addClass("ui-datepicker-input cellEdit");
                    }
                    if(options.dataInit && $.isFunction(options.dataInit)) {//不为空覆盖实例化方法
                        options.dataInit.call($t,elem,vl,options);
                    }else{
                        //实例化日期控件
                        $(elem).pikaday({});
                    }

                    break;
            }
            return elem;
        }
    }
})(jQuery,window.Public);

