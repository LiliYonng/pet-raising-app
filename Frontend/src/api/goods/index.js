import request from "@/utils/request";

export default{
    getGoodsList: () =>request("goods/getGoodsList","get"),
    getGoodsDetail:(data)=>request('goods/getGoodsDetail','get',data),
    getStore:data=>request('goods/getStore','post',data)
}