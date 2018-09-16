//元素绑定，通过元素标记简化开发
(function($,Public){
	$(function(){
		//绑定回车事件
		$("[enterKeySearch]").each(function(i){
			var $this = $(this);
			$this.keydown(function(event){
				if(event.keyCode == "13"){
	        		$($this.attr("enterKeySearch")||"#queryBtn").click();
	        		return Public.preventEvent(event);
	        	}
			});
		});
		//绑定focus默认焦点
		$("input.focus").focus();
		//绑定switchery类ios开关组件
		$("input:checkbox.js-switch").each(function(i){
			var $this = $(this);
			var opts = {};
			if($.fn.metadata){
				opts = $this.metadata();
			}
			$this.switchery(opts);
		});
	});
})(jQuery,window.Public);