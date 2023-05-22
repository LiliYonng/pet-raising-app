import request from "@/utils/request";

export default{
    getGoodsList: (data) =>request("goods/getGoodsList","get",data),
    getGoodsDetail:(data)=>request('goods/getGoodsDetail','get',data),
    getStore:data=>request('goods/getStore','post',data),
    order:data=>request('goods/order','post',data),
    getOrderDetail:data=>request('goods/getOrderDetail','post',data)
}