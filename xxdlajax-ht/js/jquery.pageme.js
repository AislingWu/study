;(function($){
	//sfresh -> scroll fresh
	$.fn.scrollfresh = function(options){
		var defaults = {
			url: '',
			moreid: '',
			statusfade : 1000,
            statuspause: 1000,
            nextfade   : 500,
			num: 10, //默认每次加载条数
			page: 1,
			maxPage: 1, //总页数
			cfunc: null
		};
		options = $.extend(defaults, options);

		// replace false with 0 fade speed
        if (options.nextfade===false){
            options.nextfade = 0;
        }
        if (options.statusfade===false){
            options.statusfade = 0;
        }

		$.fn.scrollfresh.loadData(options);
		$.fn.scrollfresh.doscroll(options);

	}
	$.fn.scrollfresh.doscroll = function(options){

		//监听窗口滚动
		$(window).scroll(function(){

			if ($(window).scrollTop() + getWinHeight() > $(document).height() - 10) {
				$(window).unbind('scroll');

				//显示加载效果
				$(options.moreid).fadeIn(options.statusfade);

				$.fn.scrollfresh.loadData(options);

				if(options.page < options.maxPage){
					$.fn.scrollfresh.doscroll(options);
				}else{

				}
			}

		});

	}

	$.fn.scrollfresh.loadData = function(options){
		var page = options.page;
		var num = options.num;
		
		getData(options.url+'&MaxCount='+num, '', function(data){
			//移除加载效果
			$(options.moreid).fadeOut(options.statusfade);

			options.maxPage = Math.ceil(data.MAXCOUNT/num);
			options.page++;
            options.cfunc(data, page, num); //执行回调函数
		});

	}

})(jQuery);
