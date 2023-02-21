import api from "../config";
function request(url,method,data={},hideLoading=false) {
  // 请求参数
    let header = {};
    // data = {
    // //   token: uni.getStorageSync('token') || '',
    //   ...data
    // } || {},
    // token = param.token || "",
    // hideLoading = hideLoading || false;

  //拼接完整请求地址
  var requestUrl = api + url;

  //请求方式:GET或POST(POST需配置
  header = { "content-type": "application/x-www-form-urlencoded" }
  /*
  if (method) {
    method = method.toUpperCase(); //小写改为大写
    if (method === "POST") {
      header = {
        "content-type": "application/x-www-form-urlencoded",
      };
    } else {
      header = {
        "content-type": "application/json",
      };
    }
  }
  */

  //加载圈
  if (!hideLoading) {
    uni.showLoading({
      title: "加载中...",
    });
  }

  // 返回promise
  return new Promise((resolve, reject) => {
    // 请求
    uni.request({
      url: requestUrl,
      data: data,
      method: method,
      header: header,
      success: (res) => {
        // 判断 请求api 格式是否正确
        if (res.statusCode && res.statusCode != 200) {
          uni.showToast({
            title: "api错误" + res.errMsg,
            icon: "none",
          });
          return;
        }
        // 将结果抛出
        resolve(res.data);
      },
      //请求失败
      fail: (e) => {
        uni.showToast({
          title: "" + e.data.msg,
          icon: "none",
        });
        resolve(e.data);
      },
      //请求完成
      complete() {
        //隐藏加载
        if (!hideLoading) {
          uni.hideLoading();
        }
        resolve();
        return;
      },
    });
  });
}

export default request;