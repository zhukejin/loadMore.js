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
        init: function (options) {
            var config = $.extend({
                currentPage: 1
            }, options);

            if (!config.url) {
                $.error('param type error: url is undefined')
                return
            }

            var win = $(window), _this = this;
            win.on("scroll.loadMore", function() {
                var  offset =  document.body.scrollTop + document.documentElement.scrollTop
                if( offset + win.height() > _this.height() && methods.loading === false && config.currentPage < config.totalPageNum ){
                    methods.loading = true;
                    $(config.loadingTag).show();
                    
                    $.ajax({
                        url: config.url,
                        dataType: config.dataType || 'json',
                        type: config.type || 'get',
                        data: $.extend( {page: parseInt(config.currentPage) + 1}, config.data),
                        success: config.success || function () {}
                    }).done(function () {
                        config.currentPage ++;
                        methods.loading = false;
                        $(config.loadingTag).hide();
                    });
                }
            })

        },

        destroy : function () {
            $(window).off('scroll.loadMore')
        }
    };

    $.fn.loadMore = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));

        } else if ( typeof method === 'object' ) {

            return methods.init.apply( this, arguments );

        } else {
            $.error( 'Method ' +  method + ' does not exist' );
        }
    };
})(jQuery, window);