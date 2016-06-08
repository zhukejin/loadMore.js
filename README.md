# loadMore.js


> 一个适用于 PC 端的无限下拉 Jquery插件  
> 在线例子请看 [PC 无限加载 / 懒加载实例](http://demo.zhukejin.com/21-loadMore/)

#### Init

	$('#wrap').loadMore(ConfigObject)

#####  配置 ConfigObject

	var configObject = {
		url: 'getjson.php', //请求地址 必填
		totalPageNum： 5, //总页码 必填
		currentPage： 1， //初始页码 选填
		dataType： 'json', //返回值类型 选填， 默认 json
		type： 'get'， //选填， 默认 get
		loadingTag： '#loading' // 选填 加载中元素 应为有效的Jquery 选择器

		success: function () {} // ajax 执行成功后的回调， append等dom 操作方法应在此处
	}

### destroy

销毁实例的请调用

	$('#wrap').loadMore('destroy')

### 具体文件Demo 请看Demo 目录