//jqGrid扩展
(function($,Public){
    if($.jgrid){
        //修改edit表格createEl的实现，主要是修改编辑框样式
        
        /*
        **
         * 编辑自定义，覆盖默认配置
        **/ 
        /**
         * all events and options here are aded anonynous and not in the base grid
         * since the array is to big. Here is the order of execution.
         * From this point we use jQuery isFunction
         * formatCell
         * beforeEditCell,
         * onSelectCell (used only for noneditable cels)
         * afterEditCell,
         * beforeSaveCell, (called before validation of values if any)
         * beforeSubmitCell (if cellsubmit remote (ajax))
         * afterSubmitCell(if cellsubmit remote (ajax)),
         * afterSaveCell,
         * errorCell,
         * serializeCellData - new
         * Options
         * cellsubmit (remote,clientArray) (added in grid options)
         * cellurl
         * ajaxCellOptions
        * */
        "use strict";
        $.jgrid.extend({
            editCell: function(iRow, iCol, ed) {
                return this.each(function() {
                    var nm, tmp, cc, cm, $t = this;
                    if ($t.grid && $t.p.cellEdit === !0) {
                        iCol = parseInt(iCol, 10);
                        $t.p.selrow = $t.rows[iRow].id;
                        $t.p.knv || $($t).jqGrid("GridNav");
                        if ($t.p.savedRow.length > 0) {
                            if (ed === !0 && iRow == $t.p.iRow && iCol == $t.p.iCol) return;
                            $($t).jqGrid("saveCell", $t.p.savedRow[0].id, $t.p.savedRow[0].ic)
                        } else window.setTimeout(function() {
                            $("#" + $.jgrid.jqID($t.p.knv)).attr("tabindex", "-1").focus()
                        },
                        0);
                        cm = $t.p.colModel[iCol];
                        nm = cm.name;
                        if ("subgrid" !== nm && "cb" !== nm && "rn" !== nm) {
                            cc = $("td:eq(" + iCol + ")", $t.rows[iRow]);
                            if (cm.editable !== !0 || ed !== !0 || cc.hasClass("not-editable-cell")) {
                                if (parseInt($t.p.iCol, 10) >= 0 && parseInt($t.p.iRow, 10) >= 0) {
                                    $("td:eq(" + $t.p.iCol + ")", $t.rows[$t.p.iRow]).removeClass("edit-cell ui-state-highlight");
                                    $($t.rows[$t.p.iRow]).removeClass("selected-row ui-state-hover ui-state-highlight")
                                }
                                cc.addClass("edit-cell ui-state-highlight");
                                $($t.rows[iRow]).addClass("selected-row ui-state-hover ui-state-highlight");
                                tmp = cc.html().replace(/\&#160\;/gi, "");
                                $($t).triggerHandler("jqGridSelectCell", [$t.rows[iRow].id, nm, tmp, iRow, iCol]);
                                $.isFunction($t.p.onSelectCell) && $t.p.onSelectCell.call($t, $t.rows[iRow].id, nm, tmp, iRow, iCol)
                            } else {
                                if (parseInt($t.p.iCol, 10) >= 0 && parseInt($t.p.iRow, 10) >= 0) {
                                    $("td:eq(" + $t.p.iCol + ")", $t.rows[$t.p.iRow]).removeClass("edit-cell ui-state-highlight");
                                    $($t.rows[$t.p.iRow]).removeClass("selected-row ui-state-hover ui-state-highlight")
                                }
                                $(cc).addClass("edit-cell ui-state-highlight");
                                $($t.rows[iRow]).addClass("selected-row ui-state-hover ui-state-highlight");
                                try {
                                    tmp = $.unformat.call($t, cc, {
                                        rowId: $t.rows[iRow].id,
                                        colModel: cm
                                    },
                                    iCol)
                                } catch(d) {
                                    tmp = cm.edittype && "textarea" === cm.edittype ? $(cc).text() : $(cc).html()
                                }
                                $t.p.autoencode && (tmp = $.jgrid.htmlDecode(tmp));
                                cm.edittype || (cm.edittype = "text");
                                $t.p.savedRow.push({
                                    id: iRow,
                                    ic: iCol,
                                    name: nm,
                                    v: tmp
                                }); ("&nbsp;" === tmp || "&#160;" === tmp || 1 === tmp.length && 160 === tmp.charCodeAt(0)) && (tmp = "");
                                if ($.isFunction($t.p.formatCell)) {
                                    var c = $t.p.formatCell.call($t, $t.rows[iRow].id, nm, tmp, iRow, iCol);
                                    void 0 !== c && (tmp = c)
                                }
                                var u = $.extend({},
                                cm.editoptions || {},
                                {
                                    id: iRow + "_" + nm,
                                    iRow:iRow,
                                    rowid:$t.rows[iRow].id,
                                    name: nm
                                }),
                                p = $.jgrid.createEl.call($t, cm.edittype, u, tmp, !0, $.extend({},
                                $.jgrid.ajaxOptions, $t.p.ajaxSelectOptions || {}));
                                $($t).triggerHandler("jqGridBeforeEditCell", [$t.rows[iRow].id, nm, tmp, iRow, iCol]);
                                $.isFunction($t.p.beforeEditCell) && $t.p.beforeEditCell.call($t, $t.rows[iRow].id, nm, tmp, iRow, iCol);
                                $(cc).html("").append(p).attr("tabindex", "0");
                                $.jgrid.bindEv.call($t, p, u);
                                window.setTimeout(function() {
                                        if(cm.edittype=="enterDialog"){
                                            $(":input", p).select().focus();
                                        }else{
                                            $.isFunction(u.custom_element) ? $(":input", p).select().focus() : $(p).select().focus();
                                        }
                                },
                                20);
                                $("input, select, textarea", cc).unbind("keydown.once").bind("keydown.once",
                                function(r) {
                                    27 === r.keyCode && ($("input.hasDatepicker", cc).length > 0 ? $(".ui-datepicker").is(":hidden") ? $($t).jqGrid("restoreCell", iRow, iCol) : $("input.hasDatepicker", cc).datepicker("hide") : $($t).jqGrid("restoreCell", iRow, iCol));//ESC键
                                    if (13 === r.keyCode) {//enter键
                                        if ($t.grid.hDiv.loading) return ! 1;
                                        var curModel = $t.p.colModel[iCol];
                                        if(curModel.editable === !0 && curModel.edittype==="custom"){
                                            if (!cm.editoptions || !$.isFunction(cm.editoptions.custom_element)) throw "e1";
                                            var comEle = cm.editoptions.custom_element.call($t,tmp,cm.editoptions);
                                            var combo = comEle.getCombo();

                                            if (combo.queryFireByEnterOnly) {
                                                combo.afterQuery = function(data) {
                                                    if(data instanceof Array==false){
                                                        //Public.tips({type: 2, content : data});
                                                        Public.alert(data);
                                                    }
                                                    if (!data || data.length == 0) {
                                                        Public.tips({type: 2, content : "未找到数据"}); 
                                                    }
                                                }
                                            };
                                            
                                            if (combo.queryFireByEnterOnly) {
                                                combo.afterSelection = function() {
                                                    $($t).jqGrid("nextCell", iRow, iCol);    
                                                };
                                            }
                                            if (!combo.queryFireByEnterOnly) {
                                                if(!combo.remoteQueryEnd){
                                                    Public.tips({type: 2, content : "正在查询请稍等。。。"});
                                                }else{
                                                    if(combo.formattedData.length==0){
                                                        if (combo.input.val()) {
                                                            Public.tips({type: 2, content : "未找到数据"});
                                                        }

                                                    }else{
                                                        $($t).jqGrid("nextCell", iRow, iCol);
                                                    }
                                                }
                                            }
                                        }else if(curModel.editable === !0 && curModel.edittype==="enterDialog"){
                                            if (!cm.editoptions || !$.isFunction(cm.editoptions.dialog_element)) throw "e1";
                                            var val = $("#" + iRow + "_" + $.jgrid.jqID(nm), $t.rows[iRow]).val();
                                            cm.editoptions.dialog_element.call($t,val,$t.rows[iRow].id);
                                        }else{
                                            $($t).jqGrid("nextCell", iRow, iCol);
                                        }
                                    }
                                    if (9 === r.keyCode) {//Tab键
                                        if ($t.grid.hDiv.loading) return ! 1;
                                        r.shiftKey ? $($t).jqGrid("prevCell", iRow, iCol) : $($t).jqGrid("nextCell", iRow, iCol)
                                    }
                                    if(37 === r.keyCode){//左方向键
                                        $($t).jqGrid("prevCell", iRow, iCol);
                                    }else if(39 === r.keyCode){//右方向键
                                        $($t).jqGrid("nextCell", iRow, iCol);
                                    }else if(38 === r.keyCode){//上方向键
                                        var curModel = $t.p.colModel[iCol];
                                        if(curModel.editable === !0 && curModel.edittype==="custom"){
                                            //如果编辑的是下拉框，不移动
                                        }else{
                                            $($t).jqGrid("saveCell", iRow, iCol);
                                            iRow -= 1;
                                            if(iRow !==0 && 0 !== $($t).find("tbody tr").eq(iRow).length){
                                                $($t).jqGrid("editCell", iRow, iCol, !0);
                                            }
                                        }
                                    }else if(40 === r.keyCode){//下方向键
                                        var curModel = $t.p.colModel[iCol];
                                        if(curModel.editable === !0 && curModel.edittype==="custom"){
                                            //如果编辑的是下拉框，不移动
                                        }else{
                                            $($t).jqGrid("saveCell", iRow, iCol);
                                            var nCol;
                                            for (var i = 0; i < $t.p.colModel.length; i++){//获取选择商品编辑列号
                                                var icolModel = $t.p.colModel[i];
                                                if (icolModel.editable === !0 && icolModel.edittype==="custom"
                                                    && (icolModel.name==="skuCode" || icolModel.editoptions["comboType"]==="gridCombo")) {
                                                    nCol = i;
                                                    break
                                                }
                                            }
                                            iRow += 1;//下一行索引号
                                            if(0 !== $($t).find("tbody tr").eq(iRow).length){
                                                if(nCol){
                                                    var id = $t.rows[iRow].id;//下一行id
                                                    var cellVal = $($t).jqGrid("getCell", id, nCol);
                                                    if(cellVal==""){//未添加商品设置商品行可编辑
                                                        iCol = nCol;
                                                    }
                                                }
                                                $($t).jqGrid("editCell", iRow, iCol, !0);
                                            }
                                        }

                                    }

                                    r.stopPropagation()
                                }).bind("focus.once",
                                function() {
                                    curRow = iRow;
                                    curCol = iCol
                                });
                                $($t).triggerHandler("jqGridAfterEditCell", [$t.rows[iRow].id, nm, tmp, iRow, iCol]);
                                $.isFunction($t.p.afterEditCell) && $t.p.afterEditCell.call($t, $t.rows[iRow].id, nm, tmp, iRow, iCol)
                            }
                            $t.p.iCol = iCol;
                            $t.p.iRow = iRow
                        }
                    }
                })
            },
            saveCell: function(iRow, iCol) {
                return this.each(function() {
                    var fr, $t = this;
                    if ($t.grid && $t.p.cellEdit === !0) {
                        fr = $t.p.savedRow.length >= 1 ? 0 : null;
                        if (null !== fr) {
                            var v, v2, cc = $("td:eq(" + iCol + ")", $t.rows[iRow]),
                            cm = $t.p.colModel[iCol],
                            nm = cm.name,
                            nmjq = $.jgrid.jqID(nm);
                            switch (cm.edittype) {
                            case "select":
                                if (cm.editoptions.multiple) {
                                    var sel = $("#" + iRow + "_" + nmjq, $t.rows[iRow]),
                                        selectedText = [];
                                    v = $(sel).val();
                                    v ? v.join(",") : v = "";
                                    $("option:selected", sel).each(function(t, i) {
                                        selectedText[t] = $(i).text()
                                    });
                                    v2 = selectedText.join(",")
                                } else {
                                    v = $("#" + iRow + "_" + nmjq + " option:selected", $t.rows[iRow]).val();
                                    v2 = $("#" + iRow + "_" + nmjq + " option:selected", $t.rows[iRow]).text()
                                }
                                cm.formatter && (v2 = v);
                                break;
                            case "checkbox":
                                var h = ["Yes", "No"];
                                cm.editoptions && (h = cm.editoptions.value.split(":"));
                                v = $("#" + iRow + "_" + nmjq, $t.rows[iRow]).is(":checked") ? h[0] : h[1];
                                v2 = v;
                                break;
                            case "password":
                            case "text":
                            case "textarea":
                            case "enterDialog":
                            case "button":
                                v = $("#" + iRow + "_" + nmjq, $t.rows[iRow]).val();
                                v2 = v;
                                break;
                            case "custom":
                                try {
                                    if (!cm.editoptions || !$.isFunction(cm.editoptions.custom_value)) throw "e1";
                                    v = cm.editoptions.custom_value.call($t, $(".customelement", cc), "get");
                                    if (void 0 === v) throw "e2";
                                    v2 = v
                                } catch(f) {
                                    "e1" === f && $.jgrid.info_dialog($.jgrid.errors.errcap, "function 'custom_value' " + $.jgrid.edit.msg.nodefined, $.jgrid.edit.bClose);
                                    "e2" === f ? $.jgrid.info_dialog($.jgrid.errors.errcap, "function 'custom_value' " + $.jgrid.edit.msg.novalue, $.jgrid.edit.bClose) : $.jgrid.info_dialog($.jgrid.errors.errcap, f.message, $.jgrid.edit.bClose)
                                }
                            case "date":
                                v = $("#" + iRow + "_" + nmjq, $t.rows[iRow]).val();
                                v2 = v;
                                break;
                            }
                            if (v2 !== $t.p.savedRow[fr].v) {
                                var vvv = $($t).triggerHandler("jqGridBeforeSaveCell", [$t.rows[iRow].id, nm, v, iRow, iCol]);
                                if (vvv) {
                                    v = vvv;
                                    v2 = vvv
                                }
                                if ($.isFunction($t.p.beforeSaveCell)) {
                                    var vv = $t.p.beforeSaveCell.call($t, $t.rows[iRow].id, nm, v, iRow, iCol);
                                    if (vv) {
                                        v = vv;
                                        v2 = vv
                                    }
                                }
                                var cv = $.jgrid.checkValues.call($t, v, iCol);
                                if (cv[0] === !0) {
                                    var b = $($t).triggerHandler("jqGridBeforeSubmitCell", [$t.rows[iRow].id, nm, cv, iRow, iCol]) || {};
                                    if ($.isFunction($t.p.beforeSubmitCell)) {
                                        b = $t.p.beforeSubmitCell.call($t, $t.rows[iRow].id, nm, cv, iRow, iCol);
                                        b || (b = {})
                                    }
                                    $("input.hasDatepicker", cc).length > 0 && $("input.hasDatepicker", cc).datepicker("hide");
                                    if ("remote" === $t.p.cellsubmit) if ($t.p.cellurl) {
                                        var w = {};
                                        $t.p.autoencode && (cv = $.jgrid.htmlEncode(cv));
                                        w[nm] = cv;
                                        var y, C, j;
                                        j = $t.p.prmNames;
                                        y = j.id;
                                        C = j.oper;
                                        w[y] = $.jgrid.stripPref($t.p.idPrefix, $t.rows[iRow].id);
                                        w[C] = j.editoper;
                                        w = $.extend(b, w);
                                        $("#lui_" + $.jgrid.jqID($t.p.id)).show();
                                        $t.grid.hDiv.loading = !0;
                                        $.ajax($.extend({
                                            url: $t.p.cellurl,
                                            data: $.isFunction($t.p.serializeCellData) ? $t.p.serializeCellData.call($t, w) : w,
                                            type: "POST",
                                            complete: function(r, l) {
                                                $("#lui_" + $t.p.id).hide();
                                                $t.grid.hDiv.loading = !1;
                                                if ("success" === l) {
                                                    var c = $($t).triggerHandler("jqGridAfterSubmitCell", [$t, r, w.id, nm, cv, iRow, iCol]) || [!0, ""];
                                                    c[0] === !0 && $.isFunction($t.p.afterSubmitCell) && (c = $t.p.afterSubmitCell.call($t, r, w.id, nm, cv, iRow, iCol));
                                                    if (c[0] === !0) {
                                                        $(cc).empty();
                                                        $($t).jqGrid("setCell", $t.rows[iRow].id, iCol, v2, !1, !1, !0);
                                                        $(cc).addClass("dirty-cell");
                                                        $($t.rows[iRow]).addClass("edited");
                                                        $($t).triggerHandler("jqGridAfterSaveCell", [$t.rows[iRow].id, nm, cv, iRow, iCol]);
                                                        $.isFunction($t.p.afterSaveCell) && $t.p.afterSaveCell.call($t, $t.rows[iRow].id, nm, cv, iRow, iCol);
                                                        $t.p.savedRow.splice(0, 1)
                                                    } else {
                                                        $.jgrid.info_dialog($.jgrid.errors.errcap, c[1], $.jgrid.edit.bClose);
                                                        $($t).jqGrid("restoreCell", iRow, iCol)
                                                    }
                                                }
                                            },
                                            error: function(r, s, o) {
                                                $("#lui_" + $.jgrid.jqID($t.p.id)).hide();
                                                $t.grid.hDiv.loading = !1;
                                                $($t).triggerHandler("jqGridErrorCell", [r, s, o]);
                                                if ($.isFunction($t.p.errorCell)) {
                                                    $t.p.errorCell.call($t, r, s, o);
                                                    $($t).jqGrid("restoreCell", iRow, iCol)
                                                } else {
                                                    $.jgrid.info_dialog($.jgrid.errors.errcap, r.status + " : " + r.statusText + "<br/>" + s, $.jgrid.edit.bClose);
                                                    $($t).jqGrid("restoreCell", iRow, iCol)
                                                }
                                            }
                                        },
                                        $.jgrid.ajaxOptions, $t.p.ajaxCellOptions || {}))
                                    } else try {
                                        $.jgrid.info_dialog($.jgrid.errors.errcap, $.jgrid.errors.nourl, $.jgrid.edit.bClose);
                                        $($t).jqGrid("restoreCell", iRow, iCol)
                                    } catch(f) {}
                                    if ("clientArray" === $t.p.cellsubmit) {
                                        "custom" === cm.edittype && $.isFunction(cm.editoptions.handle) && cm.editoptions.handle();
                                        $(cc).empty();
                                        $($t).jqGrid("setCell", $t.rows[iRow].id, iCol, v2, !1, !1, !0);
                                        $(cc).addClass("dirty-cell");
                                        $($t.rows[iRow]).addClass("edited");
                                        $($t).triggerHandler("jqGridAfterSaveCell", [$t.rows[iRow].id, nm, cv, iRow, iCol]);
                                        $.isFunction($t.p.afterSaveCell) && $t.p.afterSaveCell.call($t, $t.rows[iRow].id, nm, cv, iRow, iCol);
                                        $t.p.savedRow.splice(0, 1)
                                    }
                                } else try {
                                    window.setTimeout(function() {
                                        $.jgrid.info_dialog($.jgrid.errors.errcap, cv + " " + cv[1], $.jgrid.edit.bClose)
                                    },
                                    100);
                                    $($t).jqGrid("restoreCell", iRow, iCol)
                                } catch(f) {}
                            } else $($t).jqGrid("restoreCell", iRow, iCol)
                        }
                        window.setTimeout(function() {
                            $("#" + $.jgrid.jqID($t.p.knv)).attr("tabindex", "-1");
                            $("td:eq(" + $t.p.iCol + ")", $t.rows[$t.p.iRow]).removeClass("edit-cell ui-state-highlight")
                        },
                        0)
                    }
                })
            },
            restoreCell: function(iRow, iCol) {
                return this.each(function() {
                    var fr, $t = this,
                    s = $t.p.colModel[iCol];
                    if ($t.grid && $t.p.cellEdit === !0) {
                        fr = $t.p.savedRow.length >= 1 ? 0 : null;
                        if (null !== fr) {
                            var o = $("td:eq(" + iCol + ")", $t.rows[iRow]);
                            if ($.isFunction($.fn.datepicker)) try {
                                $("input.hasDatepicker", o).datepicker("hide")
                            } catch(n) {}
                            "custom" === s.edittype && $.isFunction(s.editoptions.handle) && s.editoptions.handle();
                            $(o).empty().attr("tabindex", "-1");
                            $($t).jqGrid("setCell", $t.rows[iRow].id, iCol, $t.p.savedRow[fr].v, !1, !1, !0);
                            $($t).triggerHandler("jqGridAfterRestoreCell", [$t.rows[iRow].id, $t.p.savedRow[fr].v, iRow, iCol]);
                            $.isFunction($t.p.afterRestoreCell) && $t.p.afterRestoreCell.call($t, $t.rows[iRow].id, $t.p.savedRow[fr].v, iRow, iCol);
                            $t.p.savedRow.splice(0, 1)
                        }
                        window.setTimeout(function() {
                            $("#" + $t.p.knv).attr("tabindex", "-1");
                            $("td:eq(" + $t.p.iCol + ")", $t.rows[$t.p.iRow]).removeClass("edit-cell ui-state-highlight")
                        },
                        0)
                    }
                })
            },
            nextCell: function(iRow, iCol) {
                iRow = parseInt(iRow);
                return this.each(function() {
                    var i, $t = this,
                    nCol = false;
                    if ($t.grid && $t.p.cellEdit === !0) {
                        for (i = iCol + 1; i < $t.p.colModel.length; i++)
                            if ($t.p.colModel[i].editable === !0) {
                            nCol = i;
                            break
                        }
                        if (i === $t.p.colModel.length) {
                            iRow += 1;
                            if (0 === $($t).find("tbody tr").eq(iRow).length) {
                                //if ($t.p.triggerAdd === !1) {
                                    iRow -= 1;
                                    $($t).jqGrid("saveCell", iRow, iCol);
                                    return
                                //}
//                              if ("fixedGrid" !== $($t).attr("id")) if (THISPAGE.newId) {
//                                  $($t).jqGrid("addRowData", THISPAGE.newId, {
//                                      id: THISPAGE.newId
//                                  },
//                                  "last");
//                                  THISPAGE.newId++
//                              } else $($t).jqGrid("addRowData", iRow, {},
//                              "last")
                            }
                            for (i = 0; i < $t.p.colModel.length; i++) if ($t.p.colModel[i].editable === !0) {
                                nCol = i;
                                break
                            }
                        }
                        nCol !== !1 ? $($t).jqGrid("editCell", iRow, nCol, !0) : $t.p.savedRow.length > 0 && $($t).jqGrid("saveCell", iRow, iCol)
                    }
                })
            },
            prevCell: function(iRow, iCol) {
                return this.each(function() {
                    var i, $t = this,
                    nCol = false;
                    if ($t.grid && $t.p.cellEdit === !0) {
                        for (i = iCol - 1; i >= 0; i--) if ($t.p.colModel[i].editable === !0) {
                            nCol = i;
                            break
                        }
                        nCol !== !1 ? $($t).jqGrid("editCell", iRow, nCol, !0) : $t.p.savedRow.length > 0 && $($t).jqGrid("saveCell", iRow, iCol)
                    }
                })
            },
            GridNav: function() {
                return this.each(function() {
                    function scrollGrid(iRow, iCol, tp) {
                        if ("v" === tp.substr(0, 1)) {
                            var ch = $(r.grid.bDiv)[0].clientHeight,
                            st = $(r.grid.bDiv)[0].scrollTop,
                            nROT = r.rows[iRow].offsetTop + r.rows[iRow].clientHeight,
                            pROT = r.rows[iRow].offsetTop;
                            "vd" === tp && nROT >= ch && ($(r.grid.bDiv)[0].scrollTop = $(r.grid.bDiv)[0].scrollTop + r.rows[iRow].clientHeight);
                            "vu" === tp && st > pROT && ($(r.grid.bDiv)[0].scrollTop = $(r.grid.bDiv)[0].scrollTop - r.rows[iRow].clientHeight)
                        }
                        if ("h" === tp) {
                            var d = $(r.grid.bDiv)[0].clientWidth,
                            c = $(r.grid.bDiv)[0].scrollLeft,
                            u = r.rows[iRow].cells[iCol].offsetLeft + r.rows[iRow].cells[iCol].clientWidth,
                            p = r.rows[iRow].cells[iCol].offsetLeft;
                            u >= d + parseInt(c, 10) ? $(r.grid.bDiv)[0].scrollLeft = $(r.grid.bDiv)[0].scrollLeft + r.rows[iRow].cells[iCol].clientWidth: c > p && ($(r.grid.bDiv)[0].scrollLeft = $(r.grid.bDiv)[0].scrollLeft - r.rows[iRow].cells[iCol].clientWidth)
                        }
                    }
                    function findNextVisible(iC, act) {
                        var ind, i;
                        if ("lft" === act) {
                            ind = iC + 1;
                            for (i = iC; i >= 0; i--) if (r.p.colModel[i].hidden !== !0) {
                                ind = i;
                                break
                            }
                        }
                        if ("rgt" === act) {
                            ind = iC - 1;
                            for (i = iC; i < r.p.colModel.length; i++) if (r.p.colModel[i].hidden !== !0) {
                                ind = i;
                                break
                            }
                        }
                        return ind
                    }
                    var r = this;
                    if (r.grid && r.p.cellEdit === !0) {
                        r.p.knv = r.p.id + "_kn";
                        var a, s, o = $("<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='" + r.p.knv + "'></div></div>");
                        $(o).insertBefore(r.grid.cDiv);
                        $("#" + r.p.knv).focus().keydown(function(o) {
                            s = o.keyCode;
                            "rtl" === r.p.direction && (37 === s ? s = 39 : 39 === s && (s = 37));
                            switch (s) {
                            case 38:
                                if (r.p.iRow - 1 > 0) {
                                    scrollGrid(r.p.iRow - 1, r.p.iCol, "vu");
                                    $(r).jqGrid("editCell", r.p.iRow - 1, r.p.iCol, !1)
                                }
                                break;
                            case 40:
                                if (r.p.iRow + 1 <= r.rows.length - 1) {
                                    scrollGrid(r.p.iRow + 1, r.p.iCol, "vd");
                                    $(r).jqGrid("editCell", r.p.iRow + 1, r.p.iCol, !1)
                                }
                                break;
                            case 37:
                                if (r.p.iCol - 1 >= 0) {
                                    a = findNextVisible(r.p.iCol - 1, "lft");
                                    scrollGrid(r.p.iRow, a, "h");
                                    $(r).jqGrid("editCell", r.p.iRow, a, !1)
                                }
                                break;
                            case 39:
                                if (r.p.iCol + 1 <= r.p.colModel.length - 1) {
                                    a = findNextVisible(r.p.iCol + 1, "rgt");
                                    scrollGrid(r.p.iRow, a, "h");
                                    $(r).jqGrid("editCell", r.p.iRow, a, !1)
                                }
                                break;
                            case 13:
                                parseInt(r.p.iCol, 10) >= 0 && parseInt(r.p.iRow, 10) >= 0 && $(r).jqGrid("editCell", r.p.iRow, r.p.iCol, !0);
                                break;
                            default:
                                return ! 0
                            }
                            return ! 1
                        })
                    }
                })
            },
            getChangedCells: function(mthd) {
                var ret = [];
                mthd || (mthd = "all");
                this.each(function() {
                    var nm, $t = this;
                    $t.grid && $t.p.cellEdit === !0 && $($t.rows).each(function(s) {
                        var res = {};
                        if ($(this).hasClass("edited")) {
                            $("td", this).each(function(i) {
                                nm = $t.p.colModel[i].name;
                                if ("cb" !== nm && "subgrid" !== nm) if ("dirty" === mthd) {
                                    if ($(this).hasClass("dirty-cell")) try {
                                        res[nm] = $.unformat.call($t, this, {
                                            rowId: $t.rows[s].id,
                                            colModel: $t.p.colModel[i]
                                        },
                                        i)
                                    } catch(n) {
                                        res[nm] = $.jgrid.htmlDecode($(this).html())
                                    }
                                } else try {
                                    res[nm] = $.unformat.call($t, this, {
                                        rowId: $t.rows[s].id,
                                        colModel: $t.p.colModel[i]
                                    },
                                    i)
                                } catch(n) {
                                    res[nm] = $.jgrid.htmlDecode($(this).html())
                                }
                            });
                            res.id = this.id;
                            ret.push(res)
                        }
                    })
                });
                return ret
            }
        });
        $.extend($.jgrid, {
            formatter: {
                integer: {
                    thousandsSeparator: ",",
                    defaultValue: "&#160;"
                },
                number: {
                    decimalSeparator: ".",
                    thousandsSeparator: ",",
                    decimalPlaces: 2,
                    defaultValue: "&#160;"
                },
                currency: {
                    decimalSeparator: ".",
                    thousandsSeparator: ",",
                    decimalPlaces: 2,
                    prefix: "",
                    suffix: "",
                    defaultValue: "&#160;"
                },
                date: {
                    dayNames: ["日", "一", "二", "三", "四", "五", "六", "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                    monthNames: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    AmPm: ["am", "pm", "上午", "下午"],
                    S: function(e) {
                        return 11 > e || e > 13 ? ["st", "nd", "rd", "th"][Math.min((e - 1) % 10, 3)] : "th"
                    },
                    srcformat: "Y-m-d",
                    newformat: "Y-m-d",
                    parseRe: /[Tt\\\/:_;.,\t\s-]/,
                    masks: {
                        ISO8601Long: "Y-m-d H:i:s",
                        ISO8601Short: "Y-m-d",
                        ShortDate: "n/j/Y",
                        LongDate: "l, F d, Y",
                        FullDateTime: "l, F d, Y g:i:s A",
                        MonthDay: "F d",
                        ShortTime: "g:i A",
                        LongTime: "g:i:s A",
                        SortableDateTime: "Y-m-d\\TH:i:s",
                        UniversalSortableDateTime: "Y-m-d H:i:sO",
                        YearMonth: "F, Y"
                    },
                    reformatAfterEdit: !1
                },
                baseLinkUrl: "",
                showAction: "",
                target: "",
                checkbox: {
                    disabled: !0
                },
                idName: "id"
            }
        })

    }
})(jQuery,window.Public);

