const getApi = () => {
    const { envVersion } = uni.getAccountInfoSync().miniProgram;
    switch (envVersion) {
        case "develop": //开发预览版
            return "http://localhost:3001/api/";
        case "trial": //体验版
            return "http://localhost:3001/api/";
        case "release": //正式版
            return "";
        default: //未知,默认调用正式版
            return "";
    }
};
export default getApi()
