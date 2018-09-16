/**
 * Created by dev1 on 2016/8/15.
 */
//按钮权限控制
$(window).load(function(e) {
    $(".buttonPermis").each(function (index, domEle) {
        var menuCodes = $(domEle).attr("menuCode");//允许支持多个值，多个值以逗号隔开
        if(menuCodes){
            var system = window.parent.SYSTEM;
            var buttonRights = system.buttonRights;
            var menuCodeArr = menuCodes.split(",");
            var flag = true;//用来标记是有权限，没有是false;
            $.each(menuCodeArr,function(i,menuCode){
                var menuCode2 = menuCode.substring(0, 3) + '6' + menuCode.substring(4);
                var menuName = buttonRights[menuCode];
                var menuName2 = buttonRights[menuCode2];
                if(!menuName && !menuName2){
                    flag = false;
                }else{
                    flag = true;
                    return;
                }
            });
            if(!flag){//没有权限
                $(domEle).attr('disabled', 'disabled');
                $(domEle).addClass("btn-disabled");
                $(domEle).unbind("click");
                var id = "#"+domEle.id;
                $(document).off("click",id);
            }
        }
    });
});