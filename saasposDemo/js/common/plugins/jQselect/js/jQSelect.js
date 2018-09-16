;(function($){
	$.fn.jQSelect = function(settings){
	
		var $div = this;
		var $cartes = $div.find(".se_cartes");
		var $lists = $div.find(".se_lists");
		
		var listTxt = $cartes.find(".se_listTxt");
		var listVal = $cartes.find(".se_listVal");

		var items = $lists.find("ul > li");
		
		$div.hover(function(){
			$(this).addClass("se_hover");
		},function(){
			$(this).removeClass("se_hover");	
		});
		
		//绑定点击事件
		items.click(function(){
			listVal.val($(this).attr("id"));
			listTxt.val($(this).text());
			$div.removeClass("se_hover");
		}).mouseover(function(){
			$(this).removeClass("se_cwhite");
			$(this).addClass("se_cgray");
		}).mouseout(function(){
			$(this).removeClass("se_cgray");
			$(this).addClass("se_cwhite");
		});
		
	};
})(jQuery);