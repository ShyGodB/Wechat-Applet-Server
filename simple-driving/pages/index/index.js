const app = getApp()
Page({
    data: {
        // 页面加载时的预设数据
        location: {},
        userInfo: {},
        gasoline: [],
        isNewUser: true,
        isUser: false,

        // 系统默认数据
        car: "Car",

        price: "",
        amount: "",
        trip: "",
        cost: "",

        index: '',
        cars:['hat'],
        updateTime: '',
        isDefaultPrice: false,
        isDefaultAmount: false
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
        if(this.data.isUser === true && ev.detail.value !== undefined) {
            const data = [app.globalData.userInfo.id, 'amount', ev.detail.value];
            wx.request({
                url: 'https://www.tripspend.com:8888/updateUser',
                method: "post",
                data: data,
                header: {
                    "Content-Type": "application/json"
                }
            }); 
        }   
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
        const amount = Number(this.data.amount);
        const amount1 = amount / 100;
        const trip = Number(this.data.trip);
        const cost = price * amount1 * trip;
        this.setData({
            cost: cost.toFixed(2)
        });
        const key = 'key';
        const obj = {
            price: price,
            amount: amount,
            trip: trip,
            cost: cost.toFixed(2)
        }
        const data = [obj]
        if (this.data.isUser === true) {
            wx.request({
                url: "https://www.tripspend.com:8888/addTripRecord",
                method: "post",
                data: {
                    userId: app.globalData.userInfo.id,
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
                }
            });
        } else {
            wx.setStorage({
                key: 'trip',
                data: data,
            }) 
        }
        
    },

    // 监听页面加载，可做一些事情
    onLoad() {
        this.setData({
            isUser: app.globalData.isUser,
            isNewUser: app.globalData.isNewUser,

            isDefaultPrice: true,
            price: app.globalData.gasoline[1].value,

            updateTime: app.globalData.updateTime,
            gasoline: app.globalData.gasoline,
            location: app.globalData.location,
        })
        wx.getStorage({
            key: 'trip',
            success: function(res) {
                console.log(res.data)
            },
        })
    },
    onShow() {
        // 存在用户  用户已经登录
        if (Object.keys(app.globalData.userInfo).length !== 0 && app.globalData.isUser === true) {
            this.setData({
                isDefaultAmount: true,
                amount: app.globalData.userInfo.amount,
                userInfo: app.globalData.userInfo
            })
        }
    }
});
