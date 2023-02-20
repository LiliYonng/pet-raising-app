<template>
    <view class="page-content">
        <!-- 筛选弹层 START -->
        <view :class="'popup-container' + (filterShow ? ' show' : '')">
            <view class="mask" @click="closeFilter"></view>
            <view class="popup">
                <image
                    class="link close-btn"
                    src="/static/icon/popup-close.svg"
                    mode="aspectFit"
                    @click="closeFilter"
                ></image>
                <view class="popup-header">筛选条件</view>
                <view class="spec-row" v-for="(item,index) in specAry" v-if="index !=3">
                    <view class="spec-title">{{item.title}}</view>
                    <view class="spec-list">
                        <view v-for="(sub,subInd) in item.data" 
                        :class="sub.checked ||item.checkInd == subInd  ? 'active' : ''"
                        @click='chooseTap(index,subInd)'
                        >{{sub.name}}</view>
                    </view>
                </view>
                <view class="spec-row">
                    <view class="spec-title">价格区间</view>
                    <view class="pricing-row">
                        <view class="title">日租金</view>
                        <input placeholder="最低价" type="digit" maxlength="8" v-model="rentRange.min"/>
                        <view class="separator">~</view>
                        <input placeholder="最高价" type="digit" v-model="rentRange.max" maxlength="8" />
                    </view>
                    <view class="pricing-row">
                        <view class="title">押金</view>
                        <input placeholder="最低价" type="digit" maxlength="8" v-model="depositRange.min" />
                        <view class="separator">~</view>
                        <input placeholder="最高价" type="digit" maxlength="8" v-model="depositRange.max" />
                    </view>
                </view>
                <view class="action-btns flex">
                    <view class="link reset-btn" @click="filterReset">重置</view>
                    <view class="link confirm-btn" @click="filterConfirm">确定</view>
                </view>
            </view>
        </view>
        <!-- 筛选弹层 END -->

        <view class="header" :style="'padding-top: ' + safeTop + 'px'">
            <view class="filter-list flex">
                <view @click="isOrder = true" :class="[{ active:specAry[3].checkInd}, 'filter-item link']" >
                    <view>综合</view>
                    <image src="/static/icon/filter-arrow.svg"></image>
                </view>
                <view @click="isQuality = true" :class="[{ active: activeQuality}, 'filter-item link']">
                    <view>成新度</view>
                    <image src="/static/icon/filter-arrow.svg"></image>
                </view>
                <view @click="isDays = true" :class="[{ active:specAry[2].checkInd}, 'filter-item link']">
                    <view>租期</view>
                    <image src="/static/icon/filter-arrow.svg"></image>
                </view>
                <view class="filter-item link" @click="showFilter">
                    <view>筛选</view>
                    <image src="/static/icon/filter-icon.svg"></image>
                </view>
            </view>
        </view>
        <view calss="filter-action">
            <u-popup :show="isOrder">
                <view class="filter-data-list">
                    <li :class="[{ active:specAry[3].checkInd == index }, 'list-item']" 
                        v-for="(item,index) in specAry[3].data"
                        @click="chooseTap(3,index)"
                        >{{item.name}}</li>
                </view>
            </u-popup>
            <u-popup :show="isQuality">
                <view class="filter-data-list">
                    <li :class="[{ active:item.checked }, 'list-item']" 
                        v-for="(item,index) in specAry[1].data"
                        @click="chooseTap(1,index)"
                        >{{item.name}}</li>
                    <view class="action-btns flex">
                        <u-button @click="filterConfirm()">确定</u-button>
                        <u-button @click="closeAction()">取消</u-button>
                    </view>
                </view>
            </u-popup>
            <u-popup :show="isDays">
                <view class="filter-data-list">
                    <li :class="[{ active:specAry[2].checkInd == index }, 'list-item']" 
                        v-for="(item,index) in specAry[2].data"
                        @click="chooseTap(2,index)"
                        >{{item.name}}</li>
                </view>
            </u-popup>
        </view>
        <view class="goods-list">
            <view class="goods-item" v-for="item in goodsList" :key="item.gid"
                @click="handleClickToDetail(item.gid)">
                <image :src="item.cover" mode="aspectFit" class="cover"></image>
                <view class="goods-info">
                    <view class="name">{{ item.name }}</view>
                    <view class="badge">
                        <view v-for="(tag, index) in item.tags" :key="index">{{ tag }}</view>
                    </view>
                    <view class="price">
                        ¥<text>{{ item.price }}</text>
                    </view>
                    <view class="goods-bottom">
                        <view class="tags">
                            <view class="green" v-if="item.safe === '1'">放心买</view>
                            <view class="blue" v-if="item.canBuy === '1'">运费险</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            safeTop: 0,
            filterShow: false,
            cityName: '定位中',
            goodsList: [
                {
                    gid:123,
                    cover:'https://g-search2.alicdn.com/img/bao/uploaded/i4/i1/2215425659358/O1CN01MD8wky2J01C8JEOO7_!!2215425659358.jpg_580x580Q90.jpg_.webp',
                    name:'小狗窝',
                    price:'18',
                    tags:['99新','性价比'],
                    safe:1,
                    canBuy:1,
                },
                {
                    gid:123,
                    cover:'https://g-search2.alicdn.com/img/bao/uploaded/i4/i1/2215425659358/O1CN01MD8wky2J01C8JEOO7_!!2215425659358.jpg_580x580Q90.jpg_.webp',
                    name:'小狗窝',
                    price:'18',
                    tags:['99新','性价比'],
                    safe:1,
                    canBuy:1,
                },

            ],
            filters: '',
            keyWord:'',
            inputStyle:{
                background:'#E8E8E8',
                border:'none',
                padding:0,
                borderRadius: '33px',
            },
            isOrder:false,
            isQuality:false,
            activeQuality:false,
            isDays:false,
            specAry:[
                {
                    title:'折扣与服务',
                    type:'services',
                    mult:1, //是否多选 
                    data:[
                        {name:'官方质检',value:'certified',checked:false},
                        {name:'安心租',value:'safe',checked:false},
                        {name:'寄出包邮',value:'freeSend',checked:false},
                        {name:'包邮',value:'freeReturn',checked:false},
                        {name:'可买断',value:'canBuy',checked:false},
                        {name:'顺丰发货',value:'sfSend',checked:false},
                        ],
                },
                {
                    title:'成新度',
                    type:'quality',
                    mult:1,
                    data:[
                    {name:'80新',
                    value:'1',checked:false
                    },{
                    name:'90新',
                    value:'2',checked:false
                    },{
                    name:'95新',
                    value:'3',checked:false
                    },
                    {
                    name:'99新',
                    value:'4',checked:false
                    },
                    {
                    name:'准新',
                    value:'5',checked:false
                    },                    
                    {
                    name:'全新',
                    value:'6',checked:false
                    },
                    ],
                },
                {
                    title:'起租期',
                    type:'days',
                    checkInd:null,
                    data:[
                    {name:'3天内',value:'<=3'},
                    {name:'7天',value:'7'},
                    {name:'30天',value:'30'},
                    {name:'90天',value:'90'},
                    {name:'180天',value:'180'},
                    {name:'365天',value:'365'},
                    ],
                },
                {
                    title:'综合排序',
                    type:'orderBy',
                    checkInd:null,
                    data:[
                        {value:'',name:'默认排序'},
                        {value:'priceAsc',name:'价格升序'},
                        {value:'priceDesc',name:'价格降序'},
                        {value:'salesAsc',name:'销量升序'},
                        {value:'salesDesc',name:'销量降序'},
                    ]
                }
            ],
            rentRange:{
                min:null,
                max:null
            },
            depositRange:{
                min:null,
                max:null
            },
        }
    },
    onLoad(options) {
        this.keyWord = options.query
        // this.queryGoodsList({ query: options.query })

        // this.$data.safeTop = app.globalData.sysInfo.statusBarHeight + app.globalData.sysInfo.titleBarHeight;
    },
    onShow() {
    },
    methods: {
        // 查询商品列表数据
        queryGoodsList(data) {
            this.$api.getGoodsList(data).then(resp => {
                this.goodsList = resp.data
            })
        },
        // 跳转到商品详情
        handleClickToDetail(gid) {
            uni.navigateTo({
                url: `/pages/shop/goodsDetail?gid=${gid}`
            })
        },
        closeFilter() {
            this.$data.filterShow = false;
        },
        showFilter() {
            this.$data.filterShow = true;
        },
        pickCity() {
            // #ifdef MP-ALIPAY
            my.chooseCity({
                showLocatedCity: true,
                showHotCities: true,
                success: (res) => {
                    this.$data.cityName = res.city;
                    app.globalData.cityName = res.city;
                },
            })
            // #endif
            // #ifndef MP-ALIPAY
            uni.navigateTo({
                url: '/pages/index/region'
            })
            // #endif
        },
        change(option){
            if(option.detail.value){
                this.queryGoodsList({query:option.detail.value})
            }
        },
        chooseTap(row,index){
            const item = this.specAry[row].data[index]
            const specRow = this.specAry[row]
            if(specRow.mult) //多选
            {
                item.checked = !item.checked
            }
            else{ //单选
                specRow.checkInd = specRow.checkInd == index ? null : index
                if(this.isOrder || this.isDays) {
                    this.filterConfirm()
                }
            }
        },
        filterReset(){
            this.rentRange.min = null
            this.rentRange.max = null
            this.depositRange.min = null
            this.depositRange.max = null
            this.specAry.forEach(row=>{
                if(row.mult){
                    row.data.forEach(it=>{
                    it.checked = false
                })}
                else{
                    row.checkInd = null
                }
                
            })
        },
        filterConfirm(){
            this.isDays = false
            this.isOrder = false
            this.isQuality = false
            const chooseObj={
                orderBy:'',
                days:'',
                services :{},
                rentRange: {},
                depositRange: {}            
            }
            this.specAry.forEach((item,index)=>{
                if (item.type == 'orderBy'){
                    chooseObj.orderBy = item.data[item.checkInd]?.value
                }
                else if(item.type == 'days'){
                    chooseObj.days = item.data[item.checkInd]?.value
                }
                else if(item.type =='services'){
                    item.data.forEach((it,ind)=>{
                        if(it.checked){
                            chooseObj.services[it.value] = '1'
                        }
                    })
                }
                else if(item.type =='quality'){
                    item.data.forEach((it,ind)=>{
                        if(it.checked){
                            if(!chooseObj.quality)
                                chooseObj.quality =[]
                            chooseObj.quality.push(Number(it.value))
                        }
                    })
                }
            })
            if(chooseObj.quality && chooseObj.quality.length) //设置筛选高亮
                this.activeQuality = true
            else
                this.activeQuality = false
             chooseObj.rentRange = {...this.rentRange}
             chooseObj.depositRange ={...this.depositRange}
            this.queryGoodsList({ query: this.keyWord,filters:JSON.stringify(chooseObj) })
            this.closeFilter()
        },
        closeAction(){
            this.isQuality=false
            this.specAry[1].data.forEach((item,index)=>{
                item.checked = false
            })
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep .u-input__content__field-wrapper__field{
    background-color: #E8E8E8;
}
.current-location image {
    width: 3.2vw;
    height: 3.2vw;
    margin-right: 0.5333vw;
}

.current-location .relocate-btn {
    border: 0 !important;
    color: #999999;
}

.current-location {
    font-size: 20rpx;
    display: flex;
    align-items: center;
}

.action-btns .reset-btn,
.action-btns .confirm-btn {
    width: 62.9333vw;
    height: 10.66667vw;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1.0666667vw;
    font-weight: bold;
}

.action-btns .reset-btn {
    width: 25.0666vw !important;
    background: #eee;
    color: #999999;
}

.action-btns .confirm-btn {
    background: #222;
    color: #FFD23D;
}

.action-btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3vw;
}

.pricing-row .title {
    font-size: 24rpx;
    width: 3em;
}

.pricing-row input {
    border: 1px solid #eee;
    width: 33.0667vw;
    height: 9.06667vw;
    border-radius: 1.066667vw;
}

.pricing-row .separator,
.pricing-row input {
    text-align: center;
    font-size: 25rpx;
    color: #999;
}

.pricing-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2.66667vw;
}

.popup-header {
    font-weight: bold;
    font-size: 40rpx;
    margin-bottom: 8.26667vw;
}

.popup .spec-row .spec-list view.active {
    border: 1px solid #222;
    font-weight: bold;
    background-position: 101.6% 101.2%;
}

.popup .spec-row .spec-list view,
.current-location view {
    height: 9vw;
    padding: 0 2.667vw;
    border: 1rpx solid #e3e3e3;
    border-radius: 1.0667vw;
    font-weight: normal;
    font-size: 26rpx;
    /* margin-right: 2.667vw; */
    margin-bottom: 2.667vw;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22.5333vw;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxNiAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IkZyYW1lIDE0NDkiPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDc3MSIgZD0iTTAgNkMwIDIuNjg2MjkgMi42ODYyOSAwIDYgMEgxNlYxMUgwVjZaIiBmaWxsPSIjMjIyMjIyIi8+CjxwYXRoIGlkPSJVbmlvbiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyAzLjkyOTRMMTEuOTE2IDNMOC4yNTIxOCA2LjE0MTIxTDYuMDg0MDMgNC4yODI0MUw1IDUuMjExODFMNy4xNjgxNSA3LjA3MDZMOC4yNTIxOCA4TDkuMzM2MiA3LjA3MDZMMTMgMy45Mjk0WiIgZmlsbD0iI0ZGRDIzRCIvPgo8L2c+Cjwvc3ZnPgo=);
    background-position: 101.6% 152%;
    background-size: 4.267vw;
    background-repeat: no-repeat;
    transition: all 0.3s 0s ease;
    text-align: center;
}

.popup .spec-row .spec-list view:last-child {
    margin-right: 0;
}

.popup .spec-row .spec-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

.popup .spec-row .spec-title {
    font-weight: bold;
    font-size: 30rpx;
    margin-bottom: 2.667vw;
}

.popup .spec-row {
    margin-bottom: 4.333vw;
}

.popup .close-btn {
    width: 4.2667vw;
    height: 4.2667vw;
    position: absolute;
    right: 5.333vw;
    top: 5.333vw;
}

.popup-container .mask {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
}

.popup-container.show .popup {
    top: 32.2667vw;
}

.popup-container .popup {
    top: 100vh;
    border-radius: 4.2667vw 4.2667vw 0 0;
    width: 100%;
    height: calc(100vh - 32.2667vw);
    background-color: #fff;
    position: absolute;
    padding: 6.1333vw 4.5333vw;
    color: #222;
    box-sizing: border-box;
    transition: top 0.3s 0s ease-out;
    overflow-y: scroll;
}

.popup-container {
    width: 100vw;
    height: 100vh;
    z-index: -1;
    position: fixed;
    opacity: 0;
    transition: all 0.3s 0s ease;
}

.popup-container.show {
    z-index: 9999;
    transition: opacity 0.3s 0s ease;
    opacity: 1;
}
.flex{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.filter-list .filter-item image {
    width: 3.7333vw;
    height: 3.7333vw;
    margin-left: .5333vw;
}

.filter-list .filter-item.active {
    color: #F35D1D;
    font-weight: bold;
}

.filter-list .filter-item {
    display: flex;
    align-items: center;
    font-size: 28rpx;
}

.filter-list {
    padding: 0 5.333vw;
    height: 10.66667vw;
}

.header {
    background-color: #fff;
}

.search-bar {
    padding: 1.33333vw 3.2vw;
    width: 100vw;
    border-bottom: 1px solid #F6F6F6;
    justify-content: space-between;
    box-sizing: border-box;
}

.search-bar .city-picker {
    font-weight: bold;
    font-size: 28rpx;
}

.search-bar .city-picker view {
    max-width: 3.5em;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.search-bar .city-picker image {
    width: 3.7333vw;
    height: 3.7333vw;
    margin-left: 0.8vw;
}

.search-bar .search-input {
    width: 72.5vw;
    background-color: #F6F6F6;
    border-radius: 11.73333vw;
    height: 8.5333vw;
    padding: 0 1.0667vw;
}

.search-bar .search-input .keyword {
    height: 7.2vw;
    width: 41.8667vw;
    background-color: #E8E8E8;
    border-radius: 11.73333vw;
    display: inline-flex;
    padding: 0 2.6667vw;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
}
.custom-input{
    background: transparent;
    color: #666;
}
.search-bar .search-input .keyword image {
    width: 20px;
    height: 20px;
    margin-left: .8vw;
}

.page-content {
    color: #222;
}

.filter-data-list .list-item{
    text-align: center;
    padding: 2.667vw;
}
.filter-data-list .list-item.active{
    font-weight: bold;
    color:red;
}
	.goods-list .goods-item .goods-bottom .tags view.blue {
		background: rgba(69,141,255,0.2);
		color: #3A75D3;
	}
	.goods-list .goods-item .goods-bottom .tags view.green {
		background: rgba(57,170,143,0.16);
		color: #39AA8F;
	}
	.goods-list .goods-item .goods-bottom .tags {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.goods-list .goods-item .goods-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #AAAAAA;
		font-size: 20rpx;
	}
	.goods-list .goods-item .price text {
		font-size: 36rpx;
		margin: 0 0.26667vw;
	}
	.goods-list .goods-item .price {
		color: #F35D1D;
		font-size: 24rpx;
		font-weight: bold;
		margin-bottom: 1.06667vw;
	}
	.goods-list .goods-item .goods-bottom .tags view:last-child
	.goods-list .goods-item .badge view:last-child {
		margin-right: 0;
	}
	.goods-list .goods-item .goods-bottom .tags view,
	.goods-list .goods-item .badge view {
		background-color: #F8F8F8;
		font-size: 20rpx;
		color: #999;
		line-height: 1.56667;
		margin-right: 1.6vw;
		display: inline-block;
		text-align: center;
		border-radius: 6.4vw;
		padding: 0 1.6vw;
	}
	.goods-list .goods-item .badge {
		margin-bottom: 1.06667vw;
	}
	.goods-list .goods-item .name {
		font-weight: bold;
		font-size: 28rpx;
		margin-bottom: 1.06667vw;
	}
	.goods-list .goods-item image.cover {
		width: 100%;
		height: 44.8vw;
	}
	.goods-list .goods-item .goods-info {
		padding: 2.66667vw 2.4vw;
	}
	.goods-list .goods-item {
		width: 44.8vw;
		background-color: #fff;
		border-radius: 2.1333vw;
		overflow: hidden;
		margin-bottom: 2.13333vw;
	}
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		padding: 3.2vw 4vw;
	}
</style>
