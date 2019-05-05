const app = getApp()

Page({
    data: {
        // 页面加载时的预设数据
        isUser: false,
        location: {},
        userInfo: {},
        gasoline: [],

        // 系统默认数据
        car: "Car",
        index: "",

        price: "",
        amount: "",
        trip: "",
        cost: "",

        cars:['hat'],
        updateTime: '',
        key: '',

        editPrice: true,
        editAmount: true,
        showPrice: false,
        showAmount: false,

        isDefaultPrice: false,
        isDefaultAmount: false,

        hasUserInfo: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    /******************************** Top **********************************/
    changeCar(ev) {
        this.setData({
            index: ev.detail.value
        })
    },
    /******************************* Main **********************************/

    // 单项选择： 选择汽油类型  ==>  更新价格
    radioChange(ev) {
        this.setData({
            price: ev.detail.value
        });
    },

    // 允许用户手动输入汽油单价及汽车的油耗
    beEditedPrice() {
        this.setData({
            editPrice: false
        })
    },
    beEditedAmount() {
        this.setData({
            editAmount: false,
            showAmount: true
        })
    },
    setAmount(ev) {
        const name = ev.currentTarget.dataset.name;
        const value = this.data.amount;
        const userId = app.globalData.userInfo[0].id;
        const data = [userId, name, value];
        console.log(data);
        this.setData({
            editAmount: true,
            showAmount: false
        });
        wx.showModal({
            title: '提示',
            content: '是否将当前值更新为默认值',
            success(res) {
                if (res.confirm) {
                    if (value.length !== 0) {
                        wx.request({
                            url: 'https://www.tripspend.com:8888/updateUser',
                            method: "post",
                            data: data,
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: (res) => {
                                console.log(res.data);
                            },
                            fail: (err) => {
                                console.log(err);
                            },
                            complete: () => {
                                // console.log("完成");
                            }
                        });
                    }
                } else {
                    console.log('用户点击取消')
                }
            }
        })
    },


    // 实时更新单价
    changePrice(ev) {
        this.setData({
            price: ev.detail.value
        });
    },
    // 实时更新油耗
    changeAmount(ev) {
        this.setData({
            amount: ev.detail.value
        });
    },
    // 实时更新路程
    changeTrip(ev) {
        this.setData({
            trip: ev.detail.value
        });
    },

    // 计算最终的花费，将数据传输到后端，记录并更新数据表，返回结果
    uploadData() {
        const price = Number(this.data.price);
        const amount = Number(this.data.amount / 100);
        const trip = Number(this.data.trip);
        const cost = price * amount * trip;
        console.log(price, amount, trip)
        this.setData({
            cost: cost.toFixed(2)
        });
        wx.request({
            url: "https://www.tripspend.com:8888/addTripRecord",
            method: "post",
            data: {
                userId: app.globalData.userInfo[0].id,
                price: price,
                amount: amount,
                trip: trip,
                cost: cost
            },
            header: {
                "Content-Type": "application/json"
            },
            success: (res) => {
                this.setData({
                    cost: cost.toFixed(2)
                })
            },
            fail: (err) => {
                console.log(err);
            },
            complete: () => {
                console.log("完成");
            }
        });
    },

    // 监听页面加载，可做一些事情
    onLoad() {
        console.log(app.globalData)

        const data_g = app.globalData;
        this.setData({ 
            price: data_g.gasoline[1].value,
            amount: data_g.userInfo[0].car_spend,

            location: data_g.location,

            isUser: true,
            isDefaultPrice: true,
            isDefaultAmount: true,
            userInfo: data_g.userInfo[0],

            gasoline: data_g.gasoline,
            updateTime: data_g.updateTime
        });

        // if (app.globalData.userInfo) {
        //     this.setData({
        //         userInfo: app.globalData.userInfo,
        //         hasUserInfo: true
        //     })
        // } else if (this.data.canIUse) {
        //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //     // 所以此处加入 callback 以防止这种情况
        //     app.userInfoReadyCallback = res => {
        //         this.setData({
        //             userInfo: res.userInfo,
        //             hasUserInfo: true
        //         })
        //     }
        // } else {
        //     // 在没有 open-type=getUserInfo 版本的兼容处理
        //     wx.getUserInfo({
        //         success: res => {
        //             app.globalData.userInfo = res.userInfo
        //             this.setData({
        //                 userInfo: res.userInfo,
        //                 hasUserInfo: true
        //             })
        //         }
        //     })
        // }
    },






    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
    
});



/*
 * 启动小程序
 * 1、获取用户信息（并上传到服务器端，存储至数据库 -- 第一次）
 * 2、将用户的默认数据展示到指定位置
 * 
 * 
 * 用户默认信息设置
 * 1、无默认数据 => 弹窗提醒用户是否将数据设置为默认，并告知设置默认数值的位置，设置与否都不再进行二次弹窗
 * 2、用户设置默认数据后，上传，存储到对应的用户信息中 
 * 
 * 
 * 需要用户设置的默认数据：
 * 1、油价
 * 2、油耗
 * 3、车辆
 * 4、地区 ---- 也可以在页面加载时自动定位
 * 
 * 
 * 用户数据分析 
 * 1、总值  =>  总次数、总开销、总路程
 * 2、平均  =>  平均路程、开销、油耗
 * 3、数据展示  =>  可以考虑画图 ---- 折线图
 */
