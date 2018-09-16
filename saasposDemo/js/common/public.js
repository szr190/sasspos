//公共操作
(function($, Public) {
	// 获取url参数
	Public.GetQueryString = function (key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
  }
	//设置表格宽高
	Public.setGrid = function(adjustH, adjustW) {
		var adjustH = adjustH || 70;
		var adjustW = adjustW || 30;
		var gridW = $(window).width() - adjustW,
			gridH = $(window).height() - $(".grid-wrap").offset().top - adjustH;
		return {
			w: gridW,
			h: gridH
		}
	};

	/**
	 * 自动重设表格宽高
	 */
	Public.setAutoResizeGrid = function(adjustH, adjustW, gridObj) {
		$(window).bind('resize', function() {
			Public.resizeGrid(adjustH, adjustW, gridObj);
		});
	}

	//重设表格宽高
	Public.resizeGrid = function(adjustH, adjustW, gridObj) {
		var grid = gridObj || $("#grid");
		var gridWH = Public.setGrid(adjustH, adjustW);
		//console.log("gridWH.w:"+gridWH.w+",gridWH.h:"+gridWH.h);
		grid.jqGrid('setGridHeight', gridWH.h);
		grid.jqGrid('setGridWidth', gridWH.w);
	};

	/**
	 * 节点赋100%高度
	 *
	 * @param {object} obj 赋高的对象
	 */
	Public.setAutoHeight = function(obj) {
		if(!obj || obj.length < 1) {
			return;
		}

		Public._setAutoHeight(obj);
		$(window).bind('resize', function() {
			Public._setAutoHeight(obj);
		});
	}

	Public._setAutoHeight = function(obj) {
		obj = $(obj);
		//parent = parent || window;
		var winH = $(window).height();
		var h = winH - obj.offset().top - (obj.outerHeight() - obj.height());
		obj.height(h);
	}

	//操作项格式化，适用于有“修改、删除”操作的表格
	Public.operFmatter = function(val, opt, row) {
		var html_con = '<div class="operating" data-id="' + row.id + '"><span class="ui-icon ui-icon-pencil" title="修改"></span><span class="ui-icon ui-icon-trash" title="删除"></span></div>';
		return html_con;
	};

	Public.billsOper = function(val, opt, row) {
		var html_con = '<div class="operating" data-id="' + opt.rowId + '"><span class="ui-icon ui-icon-plus" title="新增行"></span><span class="ui-icon ui-icon-trash" title="删除行"></span></div>';
		return html_con;
	};

	//绑定日期校验，错误则tips提示
	Public.dateCheck = function() {
		$('.ui-datepicker-input').bind('focus', function(e) {
			$(this).data('original', $(this).val());
		}).bind('blur', function(e) {
			var reg = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;
			var _self = $(this);
			setTimeout(function() {
				if(!reg.test(_self.val())) {
					Public.tips({
						type: 1,
						content: '日期格式有误！如：2013-08-08。'
					});
					_self.val(_self.data('original'));
				};
			}, 10)

		});
	}

	//根据之前的编码生成下一个编码
	Public.getSuggestNum = function(prevNum) {
		if(prevNum == '' || !prevNum) {
			return '';
		}
		var reg = /^([a-zA-Z0-9\-_]*[a-zA-Z\-_]+)?(\d+)$/;
		var match = prevNum.match(reg);
		if(match) {
			var prefix = match[1] || '';
			var prevNum = match[2];
			var num = parseInt(prevNum, 10) + 1;
			var delta = prevNum.toString().length - num.toString().length;
			if(delta > 0) {
				for(var i = 0; i < delta; i++) {
					num = '0' + num;
				}
			}
			return prefix + num;
		} else {
			return '';
		}
	};

	Public.bindEnterSkip = function(obj, func) {
		var args = arguments;
		$(obj).on('keydown', 'input:visible:not(:disabled)', function(e) {
			if(e.keyCode == '13') {
				var inputs = $(obj).find('input:visible:not(:disabled)');
				var idx = inputs.index($(this));
				idx = idx + 1;
				if(idx >= inputs.length) {
					if(typeof func == 'function') {
						var _args = Array.prototype.slice.call(args, 2);
						func.apply(null, _args);
					}
				} else {
					inputs.eq(idx).focus();
				}
			}
		});
	};

	/*获取URL参数值*/
	Public.getRequest = Public.urlParam = function() {
		var param, url = location.search,
			theRequest = {};
		if(url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0, len = strs.length; i < len; i++) {
				param = strs[i].split("=");
				theRequest[param[0]] = decodeURIComponent(param[1]);
			}
		}
		return theRequest;
	};

	/*
	 通用post请求，返回json
	 url:请求地址， params：传递的参数{...}， callback：请求成功回调
	 */
	Public.ajaxPost = function(url, params, callback, errCallback) {
		$.ajax({
			type: "POST",
			url: url,
			data: params,
			dataType: "json",
			success: function(data, status) {
				if(callback) {
					callback(data);
				}
			},
			error: function(xhr, status, error) {
				if(xhr.status == 401) { //没有权限
					Public.tips({
						type: 1,
						content: '登录已过期或没有访问权限！'
					});
				} else {
					Public.tips({
						type: 1,
						content: '操作失败了哦，请检查您的网络链接！'
					});
				}
				if(errCallback) {
					errCallback();
				}
			}
		});
	};
	Public.ajaxGet = function(url, params, callback, errCallback) {
		$.ajax({
			type: "GET",
			url: url,
			dataType: "json",
			data: params,
			success: function(data, status) {
				if(callback) {
					callback(data);
				}
			},
			error: function(xhr, status, error) {
				if(xhr.status == 401) { //没有权限
					Public.tips({
						type: 1,
						content: '登录已过期或没有访问权限！'
					});
				} else {
					Public.tips({
						type: 1,
						content: '操作失败了哦，请检查您的网络链接！'
					});
				}
				if(errCallback) {
					errCallback();
				}
			}
		});
	};

	Public.ajaxDeferPost = function(url, params) {
		var deferred = $.Deferred();
		$.ajax({
			type: "POST",
			url: url,
			dataType: "json",
			data: params
		}).done(function(data, status) {
			if(Public.handleCommonAjaxResult(data)) {
				deferred.resolve(data);
			} else {
				deferred.reject(data);
			}
		}).fail(function() {
			Public.tips({
				type: 1,
				content: '操作失败了哦，请检查您的网络链接！'
			});
			deferred.reject();
		});
		return deferred.promise();
	};

	/*处理通用ajax请求返回*/
	Public.ajaxDeferGet = function(url, params) {
		var deferred = $.Deferred();
		$.ajax({
			type: "GET",
			url: url,
			dataType: "json",
			data: params
		}).done(function(data, status) {
			if(Public.handleCommonAjaxResult(data)) {
				deferred.resolve(data);
			} else {
				deferred.reject(data);
			}
		}).fail(function() {
			Public.tips({
				type: 1,
				content: '操作失败了哦，请检查您的网络链接！'
			});
			deferred.reject();
		});
		return deferred.promise();
	};

	/*处理通用ajax请求返回*/
	Public.handleCommonAjaxResult = function(result) {

		result.handle = false;
		if(result.status === 0) {
			Public.tips({
				type: 2,
				content: result.message
			});
			result.handle = true;
			return false;
		}
		if(result.message !== undefined) {
			//Public.tips({ content: result.message });
		}
		return true;
	};
	/*延迟n毫秒触发回调*/
	Public.delay = function(n) {
		var deferred = $.Deferred(),
			t = new Date();
		var id = setTimeout(function() {
			deferred.resolve((new Date()).getTime() - t.getTime());
		}, n);

		return deferred.promise({
			canceller: function() {
				clearTimeout(id)
			}
		});
	};
	/*操作提示*/
	Public.tips = function(options) {
		return new Public.Tips(options);
	}
	Public.Tips = function(options) {
		var defaults = {
			renderTo: 'body',
			type: 0,
			autoClose: true,
			removeOthers: true,
			time: undefined,
			top: 10,
			onClose: null,
			onShow: null
		}
		this.options = $.extend({}, defaults, options);
		this._init();

		!Public.Tips._collection ? Public.Tips._collection = [this] : Public.Tips._collection.push(this);

	}

	Public.Tips.removeAll = function() {
		try {
			for(var i = Public.Tips._collection.length - 1; i >= 0; i--) {
				Public.Tips._collection[i].remove();
			}
		} catch(e) {}
	}

	Public.Tips.prototype = {
		_init: function() {
			var self = this,
				opts = this.options,
				time;
			if(opts.removeOthers) {
				Public.Tips.removeAll();
			}

			this._create();

			if(opts.autoClose) {
				if(typeof(opts.time) == 'undefined') {
					time = opts.type == 1 ? 5000 : 2000;
				} else {
					time = opts.time
				}
				window.setTimeout(function() {
					self.remove();
				}, time);
			}

		},

		_create: function() {
			var opts = this.options,
				self = this;
			if(opts.autoClose) {
				this.obj = $('<div class="ui-tips"><i></i></div>').append(opts.content);
			} else {
				this.obj = $('<div class="ui-tips"><i></i><span class="close"></span></div>').append(opts.content);
				this.closeBtn = this.obj.find('.close');
				this.closeBtn.bind('click', function() {
					self.remove();
				});
			};

			switch(opts.type) {
				case 0:
					this.obj.addClass('ui-tips-success');
					break;
				case 1:
					this.obj.addClass('ui-tips-error');
					break;
				case 2:
					this.obj.addClass('ui-tips-warning');
					break;
				default:
					this.obj.addClass('ui-tips-success');
					break;
			}

			this.obj.appendTo('body').hide();
			this._setPos();
			if(opts.onShow) {
				opts.onShow();
			}

		},

		_setPos: function() {
			var self = this,
				opts = this.options;
			if(opts.width) {
				this.obj.css('width', opts.width);
			}
			var h = this.obj.outerHeight(),
				winH = $(window).height(),
				scrollTop = $(window).scrollTop();
			//var top = parseInt(opts.top) ? (parseInt(opts.top) + scrollTop) : (winH > h ? scrollTop+(winH - h)/2 : scrollTop);
			var top = parseInt(opts.top);
			this.obj.css({
				position: Public.isIE6 ? 'absolute' : 'fixed',
				left: '50%',
				top: top,
				zIndex: '9999',
				marginLeft: -self.obj.outerWidth() / 2
			});

			window.setTimeout(function() {
				self.obj.show().css({
					marginLeft: -self.obj.outerWidth() / 2
				});
			}, 150);

			if(Public.isIE6) {
				$(window).bind('resize scroll', function() {
					var top = $(window).scrollTop() + parseInt(opts.top);
					self.obj.css('top', top);
				})
			}
		},

		remove: function() {
			var opts = this.options;
			this.obj.fadeOut(200, function() {
				$(this).remove();
				if(opts.onClose) {
					opts.onClose();
				}
			});
		}
	};
	//数值显示格式转化
	Public.numToCurrency = function(val, dec) {
		val = parseFloat(val);
		dec = dec || 2; //小数位
		if(val === 0 || isNaN(val)) {
			return '';
		}
		val = val.toFixed(dec).split('.');
		var reg = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
		return val[0].replace(reg, "$1,") + '.' + val[1];
	};
	//数值显示
	Public.currencyToNum = function(val) {
		var val = String(val);
		if($.trim(val) == '') {
			return '';
		}
		val = val.replace(/,/g, '');
		val = parseFloat(val);
		return isNaN(val) ? 0 : val;
	};
	//只允许输入数字
	Public.numerical = function(e) {
		var allowed = '0123456789.-',
			allowedReg;
		allowed = allowed.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		allowedReg = new RegExp('[' + allowed + ']');
		var charCode = typeof e.charCode != 'undefined' ? e.charCode : e.keyCode;
		var keyChar = String.fromCharCode(charCode);
		if(!e.ctrlKey && charCode != 0 && !allowedReg.test(keyChar)) {
			e.preventDefault();
		};
	};

	//限制只能输入允许的字符，不支持中文的控制
	Public.limitInput = function(obj, allowedReg) {
		var ctrlKey = null;
		obj.css('ime-mode', 'disabled').on('keydown', function(e) {
			ctrlKey = e.ctrlKey;
		}).on('keypress', function(e) {
			allowedReg = typeof allowedReg == 'string' ? new RegExp(allowedReg) : allowedReg;
			var charCode = typeof e.charCode != 'undefined' ? e.charCode : e.keyCode;
			var keyChar = $.trim(String.fromCharCode(charCode));
			if(!ctrlKey && charCode != 0 && charCode != 13 && !allowedReg.test(keyChar)) {
				e.preventDefault();
			}
		});
	};
	//限制输入的字符长度
	Public.limitLength = function(obj, count) {
		obj.on('keyup', function(e) {
			if(count < obj.val().length) {
				e.preventDefault();
				obj.val(obj.val().substr(0, count));
			}
		});
	};
	/*批量绑定页签打开*/
	Public.pageTab = function() {
		$(document).on('click', '[rel=pageTab]', function(e) {
			e.preventDefault();
			var right = $(this).data('right');
			if(right && !Business.verifyRight(right)) {
				return false;
			};
			var tabid = $(this).attr('tabid'),
				url = $(this).attr('href'),
				showClose = $(this).attr('showClose') || true,
				text = $(this).attr('tabTxt') || $(this).text(),
				parentOpen = $(this).attr('parentOpen');
			if(parentOpen) {
				parent.tab.addTabItem({
					tabid: tabid,
					text: text,
					url: url,
					showClose: showClose
				});
			} else {
				tab.addTabItem({
					tabid: tabid,
					text: text,
					url: url,
					showClose: showClose
				});
			}
		});
	};

	$.fn.artTab = function(options) {
		var defaults = {};
		var opts = $.extend({}, defaults, options);
		var callback = opts.callback || function() {};
		this.each(function() {
			var $tab_a = $("dt>a", this);
			var $this = $(this);
			$tab_a.bind("click", function() {
				var target = $(this);
				target.siblings().removeClass("cur").end().addClass("cur");
				var index = $tab_a.index(this);
				var showContent = $("dd>div", $this).eq(index);
				showContent.siblings().hide().end().show();
				callback(target, showContent, opts);
			});
			if(opts.tab)
				$tab_a.eq(opts.tab).trigger("click");
			if(location.hash) {
				var tabs = location.hash.substr(1);
				$tab_a.eq(tabs).trigger("click");
			}
		});
	};

	//文本列表滚动
	Public.txtSlide = function(opt) {
		var def = {
			notice: '#notices > ul',
			size: 1, //显示出来的条数
			pause_time: 3000, //每次滚动后停留的时间
			speed: 'fast', //滚动动画执行的时间
			stop: true //鼠标移到列表时停止动画
		};
		opt = opt || {};
		opt = $.extend({}, def, opt);

		var $list = $(opt.notice),
			$lis = $list.children(),
			height = $lis.eq(0).outerHeight() * opt.size,
			interval_id;
		if($lis.length <= opt.size) return;
		interval_id = setInterval(begin, opt.pause_time);

		opt.stop && $list.on({
			'mouseover': function() {
				clearInterval(interval_id);
				$list.stop(true, true);
			},
			'mouseleave': function() {
				interval_id = setInterval(begin, opt.pause_time);
			}
		});

		function begin() {
			$list.stop(true, true).animate({
				marginTop: -height
			}, opt.speed, function() {
				for(var i = 0; i < opt.size; i++) {
					$list.append($list.find('li:first'));
				}
				$list.css('margin-top', 0);
			});
		}
	};

	//日期格式化
	Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1, //month
			"d+": this.getDate(), //day
			"h+": this.getHours(), //hour
			"m+": this.getMinutes(), //minute
			"s+": this.getSeconds(), //second
			"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
			"S": this.getMilliseconds() //millisecond
		}

		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}

	/**
	 * form获取Object格式数据
	 */
	$.fn.serializeObject = function() {
		var obj = new Object();
		$.each(this.serializeArray(), function(index, param) {
			if(!(param.name in obj)) {
				obj[param.name] = param.value;
			} else {
				var val = obj[param.name];
				obj[param.name] = val + "," + param.value;
			}
		});
		return obj;
	};

	$.fn.enterKey = function() {
		this.each(function() {
			$(this).keydown(function(e) {
				if(e.which == 13) {
					var ref = $(this).data("ref");
					if(ref) {
						$('#' + ref).select().focus().click();
					} else {
						eval($(this).data("enterKeyHandler"));
					}
				}
			});
		});
	};

	//input占位符
	$.fn.placeholder = function() {
		this.each(function() {
			$(this).focus(function() {
				if($.trim(this.value) == this.defaultValue) {
					this.value = '';
				}
				$(this).removeClass('ui-input-ph');
			}).blur(function() {
				var val = $.trim(this.value);
				if(val == '' || val == this.defaultValue) {
					$(this).addClass('ui-input-ph');
				}
				val == '' && $(this).val(this.defaultValue);
			});
		});
	};

	//单选框插件
	$.fn.cssRadio = function(opts) {
		var opts = $.extend({}, opts);
		var $_radio = $('label.radio', this),
			$_this = this;
		$_radio.each(function() {
			var self = $(this);
			if(self.find("input")[0].checked) {
				self.addClass("checked");
			};

		}).hover(function() {
			$(this).addClass("over");
		}, function() {
			$(this).removeClass("over");
		}).click(function(event) {
			$_radio.find("input").removeAttr("checked");
			$_radio.removeClass("checked");
			$(this).find("input").attr("checked", "checked");
			$(this).addClass("checked");
			opts.callback($(this));
		});
		return {
			getValue: function() {
				return $_radio.find("input[checked]").val();
			},
			setValue: function(index) {
				return $_radio.eq(index).click();
			}
		}
	};
	//复选框插件
	$.fn.cssCheckbox = function() {
		var $_chk = $(".chk", this);
		$_chk.each(function() {
			if($(this).find("input")[0].checked) {
				$(this).addClass("checked");
			};
			if($(this).find("input")[0].disabled) {
				$(this).addClass("dis_check");
			};
		}).hover(function() {
			$(this).addClass("over")
		}, function() {
			$(this).removeClass("over")
		}).click(function(event) {
			if($(this).find("input")[0].disabled) {
				return;
			};
			$(this).toggleClass("checked");
			$(this).find("input")[0].checked = !$(this).find("input")[0].checked;
			event.preventDefault();
		});

		return {
			chkAll: function() {
				$_chk.addClass("checked");
				$_chk.find("input").attr("checked", "checked");
			},
			chkNot: function() {
				$_chk.removeClass("checked");
				$_chk.find("input").removeAttr("checked");
			},
			chkVal: function() {
				var val = [];
				$_chk.find("input:checked").each(function() {
					val.push($(this).val());
				});
				return val;
			}
		}
	};

	Public.getDefaultPage = function() {
		var win = window.self;
		return win;
		//注意这个死循环
		/*do{
		    if (win.Config) {
		        return win;
		    }
		    win = win.parent;
		} while(true);*/
	};

	//判断:当前元素是否是被筛选元素的子元素
	$.fn.isChildOf = function(b) {
		return(this.parents(b).length > 0);
	};

	//判断:当前元素是否是被筛选元素的子元素或者本身
	$.fn.isChildAndSelfOf = function(b) {
		return(this.closest(b).length > 0);
	};

	//数字输入框
	$.fn.digital = function() {
		this.each(function() {
			$(this).keyup(function() {
				this.value = this.value.replace(/\D/g, '');
			})
		});
	};

	/**
	 1. 设置cookie的值，把name变量的值设为value
	 example $.cookie(’name’, ‘value’);
	 2.新建一个cookie 包括有效期 路径 域名等
	 example $.cookie(’name’, ‘value’, {expires: 7, path: ‘/’, domain: ‘jquery.com’, secure: true});
	 3.新建cookie
	 example $.cookie(’name’, ‘value’);
	 4.删除一个cookie
	 example $.cookie(’name’, null);
	 5.取一个cookie(name)值给myvar
	 var account= $.cookie('name');
	 **/
	$.cookie = function(name, value, options) {
		if(typeof value != 'undefined') { // name and value given, set cookie
			options = options || {};
			if(value === null) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if(options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
				var date;
				if(typeof options.expires == 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
			}
			var path = options.path ? '; path=' + options.path : '';
			var domain = options.domain ? '; domain=' + options.domain : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else { // only name given, get cookie
			var cookieValue = null;
			if(document.cookie && document.cookie != '') {
				var cookies = document.cookie.split(';');
				for(var i = 0; i < cookies.length; i++) {
					var cookie = jQuery.trim(cookies[i]);
					// Does this cookie string begin with the name we want?
					if(cookie.substring(0, name.length + 1) == (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	};

	/*
	 * 兼容IE8 数组对象不支持indexOf()
	 */
	if(!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(elt /*, from*/ ) {
			var len = this.length >>> 0;
			var from = Number(arguments[1]) || 0;
			from = (from < 0) ?
				Math.ceil(from) :
				Math.floor(from);
			if(from < 0)
				from += len;
			for(; from < len; from++) {
				if(from in this &&
					this[from] === elt)
					return from;
			}
			return -1;
		};
	}

	//向数组中push一条数据如果已存在就替换
	Array.prototype.replacePush = function(obj, replaceKey) {
		if(!obj) {
			return;
		}
		if(!replaceKey || typeof replaceKey != 'string') {
			this.push(obj);
			return;
		}
		var repalceIndex = null;
		for(var i = 0; i < this.length; i++) {
			var target = this[i];
			if(target[replaceKey] && obj[replaceKey] && (target[replaceKey] == obj[replaceKey])) { //相同则替换
				repalceIndex = i;
				break;
			}
		}
		if(repalceIndex !== null) { //已经有数据
			this[repalceIndex] = obj;
		} else {
			this.push(obj);
		}
	};

	//向数组中push一组数据如果已存在就替换
	Array.prototype.replacePushAll = function(objArr, replaceKey) {
		if(!objArr || objArr.length < 1) {
			return;
		}
		if(!replaceKey || typeof replaceKey != 'string') {
			return;
		}

		for(var i = 0; i < objArr.length; i++) {
			this.replacePush(objArr[i], replaceKey);
		}
	};

	//向数组中push一组数据如果已存在就合并
	Array.prototype.mergePushAll = function(objArr, replaceKey) {
		if(!objArr || objArr.length < 1) {
			return;
		}
		if(!replaceKey || typeof replaceKey != 'string') {
			return;
		}

		for(var i = 0; i < objArr.length; i++) {
			this.mergePush(objArr[i], replaceKey);
		}
	};

	//向数组中push一条数据如果已存在就合并
	Array.prototype.mergePush = function(obj, replaceKey) {
		if(!obj) {
			return;
		}
		if(!replaceKey || typeof replaceKey != 'string') {
			this.push(obj);
			return;
		}
		var repalceIndex = null;
		for(var i = 0; i < this.length; i++) {
			var target = this[i];
			if(target[replaceKey] && obj[replaceKey] && (target[replaceKey] == obj[replaceKey])) { //相同则替换
				repalceIndex = i;
				break;
			}
		}
		if(repalceIndex !== null) { //已经有数据
			var col = $.extend(target, obj);
			if(col.hidden && col.editable) { //如果列是隐藏的，并且可编辑，将其改为不可编辑
				col.editable = false;
			}
			this[repalceIndex] = col;
		} else {
			this.push(obj);
		}
	};

	/**
	 * json对象转字符串形式
	 */
	Public.json2str = function(o) {
		var arr = [];
		var fmt = function(s) {
			if(typeof s == 'object' && s != null) return json2str(s);
			return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
		}
		for(var i in o) arr.push("'" + i + "':" + fmt(o[i]));
		return '{' + arr.join(',') + '}';
	}

	//jqGrid默认参数
	Public.defaultGridOption = {
		operateCol: true, //使用默认操作列，默认使用，如不需要使用则设置false
		colUrl: null, //列设置url，默认不使用，设置url后则使用
		autoHeight: true, //自适应高度，默认自适应
		autowidth: true, //自适应宽度，默认自适应
		layoutH: 70, //自动高度的边距
		layoutW: 30, //自动宽度的边距
		datatype: 'json',
		mtype: 'POST', //默认使用POST提交，防止中文乱码
		altRows: true,
		gridview: true,
		onselectrow: false,
		multiselect: true, //多选
		sortable: false, //是否支持排序
		multiSort: false, //是否支持多级排序
		pager: '#page',
		viewrecords: true,
		cmTemplate: {
			sortable: false
		},
		rownumbers: true, //行号
		rowNum: 15,
		rowList: [10, 15, 25, 50, 100, 200, 500],
		shrinkToFit: false,
		forceFit: true,
		//scroll: 1,
		prmNames: {
			page: "currentPage",
			rows: "length",
			sort: "sortBy",
			order: "sortType"
		},
		jsonReader: {
			root: "dataValue.rows", //数据
			records: "dataValue.total", //总记录数
			total: "dataValue.totalPages", //总页数
			userdata: "dataValue.userdata",
			repeatitems: false,
			id: "id"
		},
		onSelectRow: function(rowid, status) {
			var thisGrid = $(this);
			var selectRowList = thisGrid.data("selectRowList");
			if(!selectRowList) {
				selectRowList = {};
			}
			if(status) {
				var rowData = thisGrid.jqGrid('getRowData', rowid);
				rowData.id = rowid;
				selectRowList[rowid] = rowData;
			} else {
				delete selectRowList[rowid];
			}
			thisGrid.data("selectRowList", selectRowList);
		},
		onSelectAll: function(aRowids, status) {
			var thisGrid = $(this);
			var selectRowList = thisGrid.data("selectRowList");
			if(!selectRowList) {
				selectRowList = {};
			}
			for(var i = 0, len = aRowids.length; i < len; i++) {
				var rowid = aRowids[i];
				if(status) {
					var rowData = $(this).jqGrid('getRowData', rowid);
					rowData.id = rowid;
					selectRowList[rowid] = rowData;
				} else {
					var selectRowList = $(this).data("selectRowList");
					delete selectRowList[rowid];
				}
			}
			thisGrid.data("selectRowList", selectRowList);
		},
		//加载完成后的回调
		loadComplete: function(data) {
			if(data) {
				if(data.status === 1 && data.dataValue && data.dataValue.rows && data.dataValue.rows.length > 0) {
					var gridData = {};
					data = data.dataValue;
					for(var i = 0; i < data.rows.length; i++) {
						var item = data.rows[i];
						gridData[item.id] = item;
					}
					$("#grid").data('gridData', gridData);
					return;
				}
				//              var msg = data.status === 1 ? '没有数据哦！':data.message;
				//              Public.tips({ type : 2, content : msg,time:1000 });

			}
		},
		loadError: function(xhr, status, error) {
			if(xhr.status == 401) { //没有权限
				Public.tips({
					type: 2,
					content: '登录已过期或没有访问权限！'
				});
			} else {
				Public.tips({
					type: 1,
					content: '操作失败了哦，请检查您的网络链接！'
				});
			}
		}
	};

	/**
	 * jGrid简化使用,只支持实例化一个jqGrid
	 */
	Public.jqGrid = function(jqElement, opts) {
		if(!jqElement || $(jqElement).size() != 1) {
			alert("jqElement有误，可能不存在，或者有多个！如有多个请使用原生写法！");
			return false;
		}

		//设置高度，如果opts里没有设置则自动适应高度
		var gridHeight = 0; //grid高度
		var layoutH = Public.defaultGridOption.layoutH; //grid高度边距
		var layoutW = Public.defaultGridOption.layoutW; //grid宽度边距
		if(opts.layoutH && opts.layoutH >= 0) {
			layoutH = opts.layoutH;
		}
		if(opts.layoutW && opts.layoutW >= 0) {
			layoutW = opts.layoutW;
		}
		var gridWH = Public.setGrid(layoutH, layoutW);

		if(opts && opts.height) {
			gridHeight = opts.height;
		} else {
			gridHeight = gridWH.h;
		}
		//设置高度
		Public.defaultGridOption.height = opts.height = gridHeight;

		if(opts && opts.autowidth === false && opts.width && opts.width >= 0) {
			//不自动宽度，且设置了width，无需处理，直接使用opts.width
		} else { //自动宽度，则根据layoutW计算宽度
			Public.defaultGridOption.width = opts.width = gridWH.w;
			Public.defaultGridOption.autowidth = opts.autowidth = false;
		}

		//列模型数据
		var colModel = [{
			index: 'operate',
			name: 'operate',
			label: '操作',
			width: 60,
			fixed: true,
			formatter: Public.operFmatter,
			title: false
		}];
		if(opts && opts.operateCol == false) {
			//如果设置不使用则删除
			colModel.pop();
		}

		//支持列设置数据
		if(opts.colUrl) {
			//ajax数据
			$.ajax({
				type: "POST",
				url: opts.colUrl,
				//data: params,
				dataType: "json",
				timeout: 5000, //连接超时时间5秒
				success: function(data, status) {
					if(data.status == 1) {
						var colSettings = data.dataValue;
						initGrid(colSettings);
					} else {
						Public.tips({
							type: 2,
							content: "读取列设置失败，" + data.message
						});
					}
				},
				error: function(err) {
					Public.tips({
						type: 1,
						content: '读取列设置失败，请检查您的网络链接！'
					});
				}
			});
		} else {
			//没有配置列设置url则直接初始化
			initGrid();
		}
		//初始化jqGrid
		function initGrid(colSettings) {
			//如果有列设置数据
			if(colSettings) {
				$.each(colSettings, function(i, sCol) {
					var isHide = sCol.hidden == 1 ? false : true;
					var align = 'left';
					switch(sCol.align) {
						case 0:
							align = 'center';
							break;
						case 2:
							align = 'right';
							break;
						default:
							align = 'left';
					}
					var sortable = false;
					switch(sCol.sortable) {
						case 'true':
							sortable = true;
							break;
						case 'false':
							sortable = false;
							break;
						default:
							sortable = false;
					}
					var col = {
						index: sCol.colName,
						name: sCol.colName,
						label: sCol.viewName,
						width: sCol.width,
						align: align,
						title: false,
						hidden: isHide,
						sortable: sortable
					};
					if(sCol.numType) { //如果为非数字
						var decimalPlaces = 2;
						if(sCol.numType == 1) { //数量
							col["cellattr"] = Public.addNegativeNoCellRedAttr;
							decimalPlaces = sCol.quantityPrecision;
						} else if(sCol.numType == 2) { //金额
							col["cellattr"] = Public.addNegativeNoCellRedAttr;
							decimalPlaces = sCol.amountPrecision;
						} else if(sCol.numType == 3) { //价格
							decimalPlaces = sCol.pricePrecision;
						} else if(sCol.numType == 4) { //折扣
							decimalPlaces = sCol.pricePrecision;
						} else if(sCol.numType == 5) { //税率
							decimalPlaces = sCol.taxPrecision;
						}
						if(decimalPlaces == null || isNaN(decimalPlaces)) {
							decimalPlaces = 2;
						}
						col["formatter"] = "number";
						var formatoptions = {};
						formatoptions["decimalPlaces"] = decimalPlaces;
						formatoptions["defaultValue"] = "";
						col["formatoptions"] = formatoptions;
					}
					colModel.replacePush(col, "name");
				});
			}
			//合并传入的参数，传入的opts为级别最高的配置，他会覆盖默认配置和列设置
			colModel.mergePushAll(opts.colModel, "name");
			opts = $.extend({}, Public.defaultGridOption, opts);
			opts.colModel = colModel;
			//当前grid实例
			var thisGrid = $(jqElement).jqGrid(opts).jqGrid('setFrozenColumns');

			//绑定窗口改变自动改变grid宽高
			if(opts.autoHeight === true) {
				Public.setAutoResizeGrid(opts.layoutH, opts.layoutW, thisGrid);
			}

			// 当tab键导航进入第一个colum head,触发focus查找第一个可编辑cell让其获得焦点
			var head0 = $("thead:first tr th", thisGrid.grid)[0];
			if(head0) {
				$(head0).attr("tabIndex", 0);
				$(head0).focus(function() {
					thisGrid.nextCell(1, 0);
				});
			}
		}
		return $(jqElement);
	};

	//以数组方式获取jqGrid选择的数据
	Public.getSelectRowListArray = function(jqGridElement) {
		var selectRowList = $(jqGridElement).data("selectRowList");
		var arr = [];
		for(var item in selectRowList) {
			arr.push(selectRowList[item]);
		}
		return arr;
	};
	//绑定jqGrid内的编辑
	Public.bindGridEdit = function(jqElement, callbak) {
		$(jqElement).on('click', '.operating .ui-icon-pencil', function(e) {
			var id = $(this).parent().data('id');

			callbak.call(this, id);

			//阻止事件冒泡传递给父
			e.preventDefault();
			return false;
		});
	};
	//绑定jqGrid内的删除
	Public.bindGridDelete = function(jqElement, callbak) {
		$(jqElement).on('click', '.operating .ui-icon-trash', function(e) {
			var id = $(this).parent().data('id');

			callbak.call(this, id);

			//阻止事件冒泡传递给父
			e.preventDefault();
			return false;
		});
	};

	//绑定jqGrid可编辑表格，在点击页面其他区域时自动保存
	Public.bindGridCellSaveEvent = function(jqElement) {
		//取消分录编辑状态
		$(document).bind('click.cancel', function(e) {
			if(typeof(curRow) != "undefined" && typeof(curCol) != "undefined") {
				if(!$(e.target).closest(".ui-jqgrid-btable").length > 0 && curRow !== null && curCol !== null) {
					$(jqElement || "#grid").jqGrid("saveCell", curRow, curCol);
					//curRow = null;
					//curCol = null;
				}
			}
		});
	};

	/**
	 * 提示框
	 * @param message，可以是一个string:'您输入的有误！'
	 * 也可以是一个json object：
	 * {
	 *      title: "提示",
	 *      message: "您输入的有误！",
	 *      voice:true,
	 *      icon: "alert",
	 *      okValue:'确定',
	 *      ok: function (){},//确定按钮的回调函数
	 *      cancelVal:'取消',
	 *      cancel: function (){}//取消按钮的回调函数
	 *  }
	 */
	Public.alert = function(message) {
		var options = {
			width: 280,
			title: '提示',
			icon: 'alert', //这里可以使用alert、success、error，也可以填写图片的url
			fixed: true,
			lock: true,
			resize: false,
			ok: true,
			cancel: false
		};

		function getContent(msg) {
			return [
				'<div class="ui-dialog-tips">',
				'<p>' + msg + '</p>',
				'</div>'
			].join('');
		}
		if(arguments.length > 0) {
			if(typeof arguments[0] == 'string') {
				options.content = getContent(arguments[0])
			} else if(typeof arguments[0] == 'object') {
				options = $.extend({}, options, arguments[0]);
				options.content = getContent(options.message)
			}
		}
		$.dialog(options);
		if(options.voice) {
			Public.playSystemVoice(options.icon);
		}
	}
	/**
	 * 提示框
	 * @param message，可以是一个string:'您输入的有误！'
	 * 也可以是一个json object：
	 *
	 *      title: "提示",
	 *      message: "您输入的有误！",
	 *      voice:true,
	 *      icon: "alert",
	 *      okValue:'确定',
	 *      ok: function (){},//确定按钮的回调函数
	 *      cancelVal:'取消',
	 *      cancel: function (){}//取消按钮的回调函数
	 *  }
	 */
	Public.confirm = function(message) {
		var callback = {
			ok: function() {},
			cancel: function() {}
		};
		var myDefer = {
			ok: function(func) {
				if($.isFunction(arguments[0])) {
					callback.ok = arguments[0];
				}
				return this;
			},
			cancel: function(func) {
				if($.isFunction(arguments[0])) {
					callback.cancel = arguments[0];
				}
				return this;
			}
		};
		var options = {
			width: 280,
			title: '提示',
			icon: 'alert', //这里可以使用alert、success、error，也可以填写图片的url
			fixed: true,
			lock: true,
			resize: false,
			ok: function(here) {
				return callback.ok(this, here);
			},
			cancel: function(here) {
				return callback.cancel(this, here);
			}
		};

		function getContent(msg) {
			return [
				'<div class="ui-dialog-tips">',
				'<p>' + msg + '</p>',
				'</div>'
			].join('');
		}
		if(arguments.length > 0) {
			if(typeof arguments[0] == 'string') {
				options.content = getContent(arguments[0]);
			} else if(typeof arguments[0] == 'object') {
				options = $.extend({}, options, arguments[0]);
				options.content = getContent(options.message);
			}
		}
		$.dialog(options);

		if(options.voice) {
			Public.playSystemVoice(options.icon);
		}
		return myDefer;
	}
	/**
	 * 系统提示音
	 */
	Public.playSystemVoice = function(voice_type) {
		var frontPath = "http://static.saaspos.cn/front/";
		if(window.Config && window.Config.frontPath) {
			frontPath = Config.frontPath;
		}
		var $body = $('body'),
			audio = "";
		$body.find('audio').remove();
		if(voice_type) {
			audio = '<audio autoplay="autoplay"><source src="' + frontPath + '/images/voice/' + voice_type + '.mp3" type="audio/mpeg"/></audio>';
		} else {
			audio = '<audio autoplay="autoplay"><source src="' + frontPath + '/images/voice/success.mp3" type="audio/mpeg"/></audio>';
		}
		$body.append(audio);
	}

	Public.preventEvent = function(e) {
		if(e.stopPropagation) e.stopPropagation();
		if(e.preventDefault) e.preventDefault();
		return false;
	}

	Public.tab = function(jqEle, opts) {
		var defaultTabOpts = {
			tabConentClass: 'manage-wrapper', //
			callback: null
		};

		opts = $.extend({}, defaultTabOpts, opts);

		$(jqEle).find('li').each(function(i) {
			var $this = $(this);
			var wrapperList = $("." + opts.tabConentClass);
			$this.click(function(e) {
				$this.addClass('cur').siblings().removeClass('cur');
				$(wrapperList[i]).show().siblings("." + opts.tabConentClass).hide();
				if(opts.callback != null && typeof opts.callback == 'function') {
					opts.callback.call(this, i);
				}
			});
		});

	}

	//pluploadQueue默认参数
	Public.defaultPluploadQueueOption = {
		// General settings
		runtimes: 'gears,html5,flash,silverlight,browserplus',
		url: null, //上传文件url '../api/purchaseOrder/upload'
		max_file_size: '20mb', //最大文件大小 100b, 10kb, 10mb, 1gb
		chunk_size: '1mb', //分块大小，小于这个大小的不分块
		unique_names: true, //随机生成唯一文件名
		multi_selection: false, //是否可以在文件浏览对话框中选择多个文件，true为可以，false为不可以
		filters: null, // 限制上传的文件类型 [{title : "xls files", extensions : "xls,xlsx"}]
		// Flash settings
		flash_swf_url: '/front/v3/js/common/plugins/plupload/js/Moxie.swf',
		// Silverlight settings
		silverlight_xap_url: '/front/v3/js/common/plugins/plupload/js/Moxie.xap'
	};
	//上传组件
	Public.pluploadQueue = function(jqElement, opts) {
		opts = $.extend({}, Public.defaultPluploadQueueOption, opts);
		var uploader = $(jqElement).pluploadQueue(opts);
		$(".plupload_header", $(jqElement)).hide();
		return uploader;
	};

	Public.changeComboEdit = function($obj, edit) {
		if(edit) {
			$obj.removeClass("readOnly");
			$obj.children(".readyz").remove();
		} else {
			$obj.addClass("readOnly");
			$obj.append('<i class="readyz" 				style="position:absolute;width:100%;z-index: 1000;	height:100%;top:0;left:0">' +
				'</i>');
		}
	};

	//绑定列设置事件
	Public.bindColumnSet = function(element) {
		if(element.length == 0) {
			return
		};
		var ele = element || "#columnSet";
		var tableName = $(ele).attr("tableName");
		if(!tableName) {
			return;
		}
		//绑定列设置事件
		$(document).on('click', ele, function(e) {
			$.dialog({
				width: 800,
				height: 400,
				title: '列设置',
				content: 'url:/front/v3/js/common/page/common/column/columnSet.html',
				lock: true,
				resize: false,
				data: {
					tableName: tableName,
					callback: function(win) {
						win.api.close();
					}
				},
				cancel: true,
				cancelVal: '关闭'
			});
		});

	};

	/**
	 * 按钮权限校验
	 * @param element 要进行权限校验的jquery对象
	 * @param menuCodes 菜单编码多个以逗号隔开(为空时取element元素的menuCode值)
	 * @param needTip 没有权限时是否需要提示 1是 0否 默认1
	 * @returns {boolean} true 有权限，false 没有权限
	 */
	Public.buttonPremisCheck = function (element, menuCodes, needTip) {
		if (!element) {
			Public.tips({ type: 2, content: "亲~您没有操作权限哟！" });
			return false;
		}
		if (!menuCodes) {
			menuCodes = element.attr("menuCode");
		}
		var menuCodeArr = menuCodes.split(",");
		var system = window.parent.SYSTEM;
		var buttonRights = system.buttonRights;
		var flag = false;//用来标记是有权限，没有是false;
		$.each(menuCodeArr, function (i, menuCode) {
			var menuCode2 = menuCode.substring(0, 3) + '6' + menuCode.substring(4);
			var menuName = buttonRights[menuCode] || buttonRights[menuCode2];
			if (!menuName) {
				flag = false;
			} else {
				flag = true;
				return false;
			}
		});
		if (!flag) {
			if (typeof needTip == "undefined" || needTip !== 0) {
				Public.tips({ type: 2, content: "亲~您没有操作权限哟！" });
			}
		}
		return flag;
	};
	/**
	 * 表格表头固定
	 * @param tables 表格外层div(grid-wrap)的id值
	 */
	Public.tablescrolls = function(tables) {

		$(window).scroll(function() {
			var tablescrolltop = Math.abs($(tables).offset().top);
			var tableheight = Math.abs($(tables).height());
			var windowscrolltop = Math.abs($(document).scrollTop());
			var tablescroheight = tablescrolltop + tableheight;
			//			console.log("表格高度+顶部空白高度："+tablescroheight);
			//			console.log("滚动条高度"+windowscrolltop);
			//			console.log("顶部空白高度"+tablescrolltop);
			$(tables).find(".ui-abcde-fixds").removeClass("ui-abcde-fixd");
			if(windowscrolltop < tablescrolltop) {
				$(tables).find(".ui-abcde-fixds").removeClass("ui-abcde-fixd");
			} else if(windowscrolltop > tablescroheight) {
				$(tables).find(".ui-abcde-fixds").removeClass("ui-abcde-fixd");
			} else {
				$(tables).find(".ui-abcde-fixds").addClass("ui-abcde-fixd");
			}
		})
	}

	/**
	 * 系统提交期间锁屏
	 */
	Public.Lockscreen = function() {
		var Lock_html = '<div class="zz-jiazai">' +
			'<p>' +
			'<img src="/front/v3/css/img/ligerui/bigloading.gif"/><br /><br />' +
			'请稍等，系统正在处理...' +
			'</p>' +
			'</div>';
		$('body').append(Lock_html);
	}

	Public.Lockscreendown = function() {
		$(".zz-jiazai").remove();
	}
	/**
	 * 系统提交期间锁屏
	 */
	Public.ajaxLockscreen = function(url, params, callback, errCallback) {
		$.ajax({
			type: "POST",
			url: url,
			dataType: "json",
			data: params,
			beforeSend: beforeSend, //发送请求
			timeout:120000,
			success: function(data, status) {
				$(".zz-jiazai").remove();
				if(callback) {
					callback(data);
				}
			},
			error: function(xhr, status, error) {
				if(xhr.status != 504) {
					$(".zz-jiazai").remove();
				}
				if(xhr.status == 401) { //没有权限
					Public.tips({
						type: 1,
						content: '登录已过期或没有访问权限！'
					});
				}
				if(errCallback) {
					errCallback(xhr);
				} else {
					Public.tips({
						type: 1,
						content: '操作失败了哦，请检查您的网络链接！'
					});
				}
			}
			//complete:complete//请求完成
		});

		function beforeSend(XMLHttpRequest) {
			var Lock_html = '<div class="zz-jiazai">' +
				'<p>' +
				'<img src="/front/v3/css/img/ligerui/bigloading.gif"/><br /><br />' +
				'请稍等，系统正在处理...' +
				'</p>' +
				'</div>';
			$('body').append(Lock_html);
		}

		function complete(XMLHttpRequest, textStatus) {
			$(".zz-jiazai").remove();
		}
	};

	Public.addCellRedAttr = function(rowId, val, rawObject, cm, rdata) {
		//if(!isNaN(val) && val<0){
		return "style='color:red'";
		//}
	}

	Public.addNegativeNoCellRedAttr = function(rowId, val, rawObject, cm, rdata) {
		if(!isNaN(val) && new Number(val) < 0) {
			return "style='color:red'";
		}
	}

	//右侧浮动帮助按钮
	Public.addhelpbtn = function() {
		var html_help = '<div class="helpfunction">' +
			'<div class="helpbtn">' +
			'<p><i class="icon iconfont"></i></p>' +
			'<p class="helppart">？</p>' +
			'<p class="helpparts">帮助</p>' +
			'</div>' +
			'<div class="helpnav">' +
			'<ul class="helpnavrow">' +
			'<li class="navli"><a href="javascript:void(0)" id="help-illustrate" target="navtab"  menuCode=""><i class="icon iconfont">&#xe60d;</i> 帮助说明</a></li>' +
			'<li class="navli bord0"><a href="javascript:void(0);" id="help-feedbacks" target="navtab"><i class="icon iconfont">&#xe6f9;</i> 意见反馈</a></li>' +
			'</ul>' +
			'</div>' +
			'</div>';
		$('body').append(html_help);
		//右侧浮动效果
		var thisBox = $('.helpfunction');
		var defaultTop = thisBox.offset().top;
		var slide_min = $('.helpfunction .helpbtn');
		var slide_box = $('.helpfunction .helpnav');
		slide_min.on('click', function() {
			if(slide_box.css("display") == "block") {
				slide_box.hide();
			} else {
				slide_box.show();
			}
		});
		// 页面滚动的同时，悬浮框也跟着滚动
		$(window).on('scroll', function() {
			scro();
		});
		$(window).onload = scro();

		function scro() {
			var offsetTop = defaultTop + $(window).scrollTop() + 'px';
			thisBox.animate({
				top: offsetTop
			}, {
				duration: 600, //滑动速度
				queue: false //此动画将不进入动画队列
			});
		}

	}

	//右侧浮动帮助按钮
	Public.newtabopenforhelp = function(name, url, tabid, txt) {
		$(name).click(function() {
			if(window.parent.tab.isTabItemExist(tabid)) {
				window.parent.tab.removeTabItem(tabid);
			};;
			var menuNameForHelp = $("#menuNameForHelp").val();
			if(menuNameForHelp == undefined || menuNameForHelp == '') {
				menuNameForHelp = name;
			}
			var menuCodeForHelp = $("#menuCodeForHelp").val();
			if(menuCodeForHelp == undefined || menuCodeForHelp == '') {
				menuCodeForHelp = '';
			}
			window.parent.tab.addTabItem({
				tabid: tabid,
				text: "帮助文档-" + menuNameForHelp,
				url: url + "?menuCode=" + menuCodeForHelp + "&menuName=" + menuNameForHelp,
				showClose: true
			});
		});
	}
	Public.newtabopen = function(name, url, tabid, txt) {
		$(name).click(function() {
			if(window.parent.tab.isTabItemExist(tabid)) {
				window.parent.tab.removeTabItem(tabid);
			};
			window.parent.tab.addTabItem({
				tabid: tabid,
				text: txt,
				url: url,
				showClose: true
			});
		});
	}

	Public.printPdf = function(url) {
		var id = "printIframe";
		var src = "/front/v3/js/common/pdfjs/web/viewer.html";
		var style = "width:0;height:0;border:0;margin:0;padding:0;";
		$("#" + id).remove();
		var iframe = document.createElement("iframe");
		iframe.id = id;
		iframe.src = src;
		iframe.style = style;
		iframe.onload = iframe.onreadystatechange = function() {
			if(!iframe.readyState || /loaded|complete/.test(iframe.readyState)) {
				iframe.contentWindow.loadPdf(url);
			}
		};
		document.body.appendChild(iframe);
	};

	Public.alertFlow = function(message) {
		$.dialog({
			width: 370,
			title: '系统提示',
			icon: 'alert', //这里可以使用alert、success、error，也可以填写图片的url
			fixed: true,
			lock: true,
			resize: false,
			ok: true,
			cancel: true,
			content: "<div style='height: 180px;width:350px;overflow-y: scroll;padding: 0px!important;'>" + message + "</div>"
		});
	};

})(jQuery, window.Public = {});

(function($) {

	// $(window).scroll(function() {
	// 	var tablescrolltop = Math.abs($(".grid-wrap").offset().top);
	// 	var tableheight = Math.abs($(".grid-wrap").height());
	// 	var windowscrolltop = Math.abs($(document).scrollTop());
	// 	var tablescroheight = tablescrolltop + tableheight;
	// 	$(".ui-abcde-fixds").removeClass("ui-abcde-fixd");
	// 	if(windowscrolltop < tablescrolltop) {
	// 		$(".ui-abcde-fixds").removeClass("ui-abcde-fixd");
	// 		$(".ui-jqgrid-bdiv").css({marginTop:'0px'})
	// 	} else if(windowscrolltop > tablescroheight) {
	// 		$(".ui-jqgrid-bdiv").css({marginTop:'0px'})
	// 	} else {
	// 		$(".ui-abcde-fixds").addClass("ui-abcde-fixd");
	// 		$(".ui-jqgrid-bdiv").css({marginTop:'36px'})
	// 	}
	// })
	$(".ui-abcde-fixds").removeClass("ui-abcde-fixd");

	$(function() {
		//明细页面下边的按钮，多的情况下添加更多
		var htmlmore = '<li class="ui-listnavb-more">' +
			'<a href="#" class="cf"><i class="icon iconfont">&#xe662;</i>更多' +
			'</a>' +
			'<ul class="ui-listnavb-morexx">' +
			'</ul>' +
			'</li>';
		if($(".list-navb ul li:visible").length > 5) {
			$(".list-navb ul").prepend(htmlmore);
			$(".list-navb ul li:visible:gt(4)").appendTo(".ui-listnavb-morexx");
		}

	})

	//高级搜索位置页面中心显示
	$(function() {
		var gjsswidth = $(".gjss").width();
		var gjssheight = $(".gjss").height() + 48;
		//				alert(gjsswidth+" "+gjssheight);
		$('.gjss').css({
			"margin-left": "-" + gjsswidth / 2 + "px",
			"margin-top": "-" + gjssheight / 2 + 'px',
			"top": "50%",
			"left": "50%"
		});
		var titlestop = '<div class="gjsstop">' +
			'<div class="gjsstop-title">' +
			'高级搜索' +
			'</div>' +
			'<div class="gjsstop-title-button">' +
			'<a href="javascript:void(0);">x</a>' +
			'</div>' +
			'</div>';
		$(".gjss").prepend(titlestop);
		var gjssmark = '<div class="gjssmarks" style="display:none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,.3);z-index: 1000;cursor: auto;"></div>';
		$(".gjss").before(gjssmark);
		$(".btn_search").click(function() {
			$(".gjssmarks").css("display", "block");
		});
		$(".btn-gjr").click(function() {
			$(".gjssmarks").css("display", "none");
		});
		$(".btn-gjq").click(function() {
			$(".gjssmarks").css("display", "none");
		});
		$(".gjsstop-title-button a").click(function() {
			$('.gjss').css("display", "none");
			$(".gjssmarks").css("display", "none");
		});
		//				$("body").click(function(){
		//					$('.gjss').css("display","none");
		//					$(".gjssmarks").css("display","none");
		//				});
		$(".btn_search").click(function(event) {
			event.stopPropagation();
		});
		//				$('.gjss').click(function(event){
		//					event.stopPropagation();
		//				});
		//				$(".base-form").click(function(event){
		//					event.stopPropagation();
		//				});
	})
})(jQuery);
window.onload = function(){
	var SYSTEM = window.parent.SYSTEM;
	if(SYSTEM){
		var pagesize = SYSTEM.pageSize;
		Public.defaultGridOption.rowNum = pagesize;
	}
}
