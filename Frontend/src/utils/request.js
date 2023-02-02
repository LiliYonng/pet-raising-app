import api form '../config.js'

function request(param){
	  var url = param.url,
	    method = param.method,
	    header = {},
	    data = {
	      // token: uni.getStorageSync('token') || '',
	      ...param.data
	    } || {},
	    // token = param.token || "",
	    hideLoading = param.hideLoading || false;
	
	  //拼接完整请求地址
	  var requestUrl = api + url;
	return new Promise(reject,resolve){
		
	}
}