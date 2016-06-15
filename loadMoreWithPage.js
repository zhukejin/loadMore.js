/**
 * [无限下拉插件]
 * @param  {[Number]}  currentPage    [页码 | 默认为1]
 * @param  {[Number]}  totalPageNum   [总页码]
 * @param {[String]}  url             [后端请求URL]
 * @param {[String]}  dataType        [请求类型 | 默认为 json]
 * @param {[String]}  success         [请求成功后的回调函数]
 * @param {[String]}  loadingTag      [loading 元素的选择器]
 */
(function($, window){
    var methods = {
        loading: false,
        config:{
            currentPage: 1,
            step: 2
        },

        container: '',

        globalPageNum: 1,

        init: function (options) {
            $.extend(true , methods.config, options);

            if (!methods.config.url) {
                $.error('param type error: url is undefined')
                return
            }

            var win = $(window), _this = methods.container;

            //赋值容器
            
            win.on("scroll.loadMore", function() {
                var  offset =  document.body.scrollTop + document.documentElement.scrollTop;
                if( offset + win.height() > _this.height() && methods.loading === false && methods.config.currentPage < methods.config.totalPageNum ){
                    //需要分页
                    if ((methods.config.currentPage) % methods.config.step != 0) {
                        methods.loading = true;
                        $(methods.config.loadingTag).show();
                        methods.fetch();
                    } else {
                        methods.fetch(function () {
                            methods.pagination();
                            methods.destroy();
                        });
                    }
                }
            })
        },

        //分页器
        pagination: function () {
            //创建分页容器
            methods.container.append("<div class='clearfix'><div pagination></div></div>");

            //计算页码
            this.setPages($('[pagination]'), Math.ceil(methods.config.totalPageNum / methods.config.step), methods.globalPageNum);
        },

        fetch: function (success) {
            var dft = $.ajax({
                url: methods.config.url,
                dataType: methods.config.dataType || 'json',
                type: methods.config.type || 'get',
                data: $.extend( {page: parseInt(methods.config.currentPage)}, methods.config.data),
                success: function (data) {
                    methods.config.success(data, methods.config.currentPage)
                }
            }).done(function () {
                methods.config.currentPage ++;
                methods.loading = false;
                $(methods.config.loadingTag).hide();
            });

            if (success) {
                dft.done(function () {
                  success();  
                })
            }
        },

        destroy : function () {
            $(window).off('scroll.loadMore')
        },

        onEvent: function (pageIndex) {
            methods.globalPageNum = pageIndex;

            methods.container.html("");

            //重新绑定滚轮 事件
            var config = $.extend(methods.config, {
                currentPage: (pageIndex - 1) * methods.config.step ,
            });

            methods.init(config);

            // this.fetch(pageIndex);
        },

        setPages: function (container, count, pageIndex) {

            var str = [];
            container.addClass('zq-page__pagination');

            //总页数少于10 全部显示,大于10 显示前3 后3 中间3 其余....
            if (pageIndex == 1) {
                str[str.length] = "<div class='pageItem pageItem--clickable disabled pageItem--prev'>&lt;</div>";
            } else {
                str[str.length] = "<div class='pageItem pageItem--clickable pageItem--prev'>&lt;</div>";
            }
            
            function setPageList() {
                if (pageIndex == i) {
                    str[str.length] = "<div class='pageItem pageItem--current'>"+ i +"</div>";
                } else {
                    str[str.length] = "<div class='pageItem pageItem--clickable pageItem--default'>"+ i + "</div>";
                }
            }
            //总页数小于10
            if (count <= 10) {
                for (var i = 1; i <= count; i++) {
                    setPageList();
                }
            } else {
                if (pageIndex <= 4) {
                    for (var i = 1; i <= 5; i++) {
                        setPageList();
                    }
                    str[str.length] = "<div class='pageItem pageItem--ellipsis'>...</div><div class='pageItem pageItem--clickable pageItem--default'>"+ count + "</div>";
                } else if (pageIndex >= count - 3) {
                    str[str.length] = "<div class='pageItem pageItem--clickable pageItem--default'>1</div><div class='pageItem pageItem--ellipsis'>...</div>";
                    for (var i = count - 4; i <= count; i++) {
                        setPageList();
                    }
                } else { //当前页在中间部分
                    str[str.length] = "<div class='pageItem pageItem--clickable pageItem--default'>1</div><div class='pageItem pageItem--ellipsis'>...</div>";
                    for (var i = pageIndex - 2; i <= pageIndex + 2; i++) {
                        setPageList();
                    }
                    str[str.length] = "<div class='pageItem pageItem--ellipsis'>...</div><div class='pageItem pageItem--clickable pageItem--default'>"+ count + "</div>";
                }
            }

            if (pageIndex == count) {
                str[str.length] = "<div class='pageItem disabled pageItem--clickable pageItem--next'>&gt;</div>";
            } else {
                str[str.length] = "<div class='pageItem pageItem--clickable pageItem--next'>&gt;</div>";
            }

            container.html(str.join(""));
            
            var pageClick = function() {
                var oAlink = container.children("div:not(.pageItem--ellipsis)");
                var inx = pageIndex; //初始的页码

                oAlink[0].onclick = function() { //点击上一页
                  if (inx == 1) {
                    return false;
                  }
                  inx--;
                  methods.onEvent(inx);
                  // methods.setPages(container, count, inx);
                  return false;
                }

                for (var i = 1; i < oAlink.length - 1; i++) { //点击页码
                  oAlink[i].onclick = function() {
                    inx = parseInt($(this).text());
                    methods.onEvent(inx);
                    // methods.setPages(container, count, inx);
                    return false;
                  }
                }

                oAlink[oAlink.length - 1].onclick = function() { //点击下一页
                    if (inx == count) {
                        return false;
                    }

                    inx++;
                    methods.onEvent(inx);
                    // methods.setPages(container, count, inx);

                    return false;
                }
            };

            pageClick();
        }

    };

    $.fn.loadMore = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));

        } else if ( typeof method === 'object' ) {
            methods.container = this;
            return methods.init.apply( this, arguments );

        } else {
            $.error( 'Method ' +  method + ' does not exist' );
        }
    };

})(jQuery, window);