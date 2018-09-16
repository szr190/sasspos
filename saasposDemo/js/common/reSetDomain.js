/**
 * Created by dev1 on 2016/6/24.
 */
/* 引入这个js就可以打开页签 */
(function($){
var hostArr = document.domain.split(".");
var domainLength = 2;
if (typeof String.prototype.endsWith != 'function'){
    String.prototype.endsWith = function(str){
        return (this.match(str+"$")==str)
    }
}

if(document.domain.endsWith(".com.cn")){
    domainLength = 3;
}
var topDomain = hostArr.length>domainLength ? document.domain.substring(document.domain.indexOf(".")+1,document.domain.length):document.domain;
//hostArr.length>1 && (topDomain = hostArr[hostArr.length-2] + '.' + hostArr[hostArr.length-1]);
//设置document.domain为主域名
document.domain = topDomain;
if(window.parent && window.parent.tab){
    var orderNewBtns = $("[target=order_new]");
    orderNewBtns.click(function(){
        var btn = $(this);
        //设置document.domain为主域名
        document.domain = topDomain;
        //打开页签
        window.parent.tab.addTabItem({tabid: btn.attr("tabid"), text: btn.attr("title"), url: btn.attr("href")||btn.attr("url"), showClose: true});
        //设置为原域名
        //document.domain = window.location.host;
        e.preventDefault();
        return false;
    });
}
})(jQuery);
//设置为原域名
//document.domain = window.location.host;


//打开一个标签页
/*Migr.openParentTab = function(tabid,tabTitle,url,showClose){
    var hostArr = document.domain.split(".");
    var domainLength = 2;
    if(document.domain.endsWith(".com.cn")){
        domainLength = 3;
    }
    var topDomain = hostArr.length>domainLength ? document.domain.substring(document.domain.indexOf(".")+1,document.domain.length):document.domain;
    //hostArr.length>1 && (topDomain = hostArr[hostArr.length-2] + '.' + hostArr[hostArr.length-1]);
    //设置document.domain为主域名
    document.domain = topDomain;
    if(window.parent && window.parent.tab){
        //打开页签
        window.parent.tab.addTabItem({tabid: tabid, text:tabTitle , url: url, showClose: showClose});
    }
    //设置为原域名
    //document.domain = window.location.host;
}
//关闭当前标签页
Migr.closeCurrentTab = function(){
    var hostArr = document.domain.split(".");
    var domainLength = 2;
    if(document.domain.endsWith(".com.cn")){
        domainLength = 3;
    }
    var topDomain = hostArr.length>domainLength ? document.domain.substring(document.domain.indexOf(".")+1,document.domain.length):document.domain;
    //hostArr.length>1 && (topDomain = hostArr[hostArr.length-2] + '.' + hostArr[hostArr.length-1]);
    //设置document.domain为主域名
    document.domain = topDomain;
    if(window.parent && window.parent.tab){
        //打开页签
        window.parent.tab.removeSelectedTabItem();
    }
    //设置为原域名
    //document.domain = window.location.host;
}
//重新加载当前标签页
Migr.reloadCurrentTab = function(){
    var hostArr = document.domain.split(".");
    var domainLength = 2;
    if(document.domain.endsWith(".com.cn")){
        domainLength = 3;
    }
    var topDomain = hostArr.length>domainLength ? document.domain.substring(document.domain.indexOf(".")+1,document.domain.length):document.domain;
    //hostArr.length>1 && (topDomain = hostArr[hostArr.length-2] + '.' + hostArr[hostArr.length-1]);
    //设置document.domain为主域名
    document.domain = topDomain;
    if(window.parent && window.parent.tab){
        //重新加载页签
        window.parent.tab.reload(window.parent.tab.getSelectedTabItemID());
    }
}
//刷新当前标签页
Migr.reloadTab = function(tabId){
    var hostArr = document.domain.split(".");
    var domainLength = 2;
    if(document.domain.endsWith(".com.cn")){
        domainLength = 3;
    }
    var topDomain = hostArr.length>domainLength ? document.domain.substring(document.domain.indexOf(".")+1,document.domain.length):document.domain;
    //hostArr.length>1 && (topDomain = hostArr[hostArr.length-2] + '.' + hostArr[hostArr.length-1]);
    //设置document.domain为主域名
    document.domain = topDomain;
    if(window.parent && window.parent.tab){
        //重新加载
        window.parent.tab.reload(tabId);
    }
}*/
