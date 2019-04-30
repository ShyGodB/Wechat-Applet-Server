const app = getApp()

Page({
    data: {
        // 页面加载时的预设数据
        location: {
            city: '',
            province: '',
        },
        gasoline: [
            {
                type: '0#',
                price: 7
            }, 
            {
                type: '89#',
                price: 7
            }, 
            {
                type: '90#',
                price: 7
            }, 
            {
                type: '92#',
                price: 7
            },
            {
                type: '93#',
                price: 7
            }
            , 
            {
                type: '95#',
                price: 7
            }
            , 
            {
                type: '97#',
                price: 7
            },
            {
                type: '98#',
                price: 7
            }
        ],
        // 用户默认数据
        defaultData:{
            carId: '',
            carName: '',
            carType: '',
            carSpend: '',
            gasolineType: '92#',
            gasolinePrice: '7.01',
            province: '广东',
            place: '深圳'
        },
        // 系统默认数据
        car: "Car",
        user: "true",
        index: "",

        price: "",
        amount: "",
        trip: "",

        cost: "",
        region: ['','深圳',''],
        customItem: '全部',
        cars:['hat'],
        add: '添加',
        updateTime: '',
        // Boolean
        userSet: false,
        onOff: false,
        isType: false,
        isPrice: false,
        isPlace: false,
        editPrice: true,
        editSpend: true,
        showPrice: false,
        showSpend: false
    },
    beEditedPrice() {
        this.setData({
            editPrice: false,
            showPrice: true
        })
    },
    beEditedSpend() {
        this.setData({
            editSpend: false,
            showSpend: true
        })
    },
    setPrice(ev) {
        const name = ev.currentTarget.dataset.name;
        const value = this.data.price;
        const userId = app.globalData.userInfo.id;
        // console.log(userId);
        const data = [userId, name, value];
        console.log(data);
        this.setData({
            editPrice: true,
            showPrice: false
        });
        wx.showModal({
            title: '提示',
            content: '是否将当前值更新为默认值',
            success(res) {
                if (res.confirm) {
                    const url = 'https://www.tripspend.com:8888/updateUser';
                    if(value.length !== 0) {
                        wx.request({
                            url: url,
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
                    } else {
                        console.log("内容不能为空");
                    }
                } else {
                    console.log('用户点击取消')
                }
            }
        })
    },
    setSpend(ev) {
        const name = ev.currentTarget.dataset.name;
        const value = this.data.amount;
        const userId = app.globalData.userInfo.id;
        // console.log(userId);
        const data = [userId, name, value];
        console.log(data);
        this.setData({
            editSpend: true,
            showSpend: false
        });
        wx.showModal({
            title: '提示',
            content: '是否将当前值更新为默认值',
            success(res) {
                if (res.confirm) {
                    const url = 'https://www.tripspend.com:8888/updateUser';
                    if (value.length !== 0) {
                        wx.request({
                            url: url,
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
    changePrice(ev) {
        this.setData({
            price: ev.detail.value
        });
    },
    changeAmount(ev) {
        this.setData({
            amount: ev.detail.value
        });
    },
    changeTrip(ev) {
        this.setData({
            trip: ev.detail.value
        });
    },
    // calculate(ev) {
    //     const price = Number(this.data.price);
    //     console.log(app.globalData.userInfo)
    //     const amount = Number(this.data.amount/100);
    //     const trip = Number(this.data.trip);
    //     const result = price * amount * trip;
    //     console.log(price,amount,trip)
    //     this.setData({
    //         result: result.toFixed(2)
    //     });
    // },
    changeCar(e) {
        this.setData({
            index: e.detail.value
        })
    },
    chooseGasoline(ev) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        const i = Number(ev.detail.value);
        this.setData({
            isType: false,
            isPrice: false,
            index: ev.detail.value,
            price: this.data.gasoline[i].price
        })
    },
    uploadData() {
        const price = Number(this.data.price);
        const amount = Number(this.data.amount / 100);
        const trip = Number(this.data.trip);
        const cost = price * amount * trip;
        console.log(price, amount, trip)
        this.setData({
            result: result.toFixed(2)
        });
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
            success(res) {
                console.log(res.data);
                that.setData({
                    result: result
                })
            },
            fail(err) {
                console.log(err);
            },
            complete() {
                console.log("完成");
            }
        });
    },
    bindRegionChange(e) {
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            isPlace: true,
            region: e.detail.value
        })
    },
    onLoad() {
        // 获取用户位置信息
        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                const latitude = res.latitude; // 纬度
                const longitude = res.longitude; // 经度
                const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=LUVBZ-4AW34-6YIUD-XKC7G-QSZKK-SBFCQ`;
                wx.request({
                    url: url,
                    method: "GET",
                    header: {
                        "Content-Type": "application/json"
                    },
                    success: (res) => {
                        const city = res.data.result.address_component.city;
                        const province1 = res.data.result.address_component.province;
                        const province = province1.substring(0, province1.length - 1)
                        this.setData({
                            location: {
                                city: city.substring(0, city.length - 1),
                                province: province
                            }
                        });

                        // 获取油价信息
                        const url1 = `https://api.jisuapi.com/oil/query?appkey=62ea23ffe7a3a991&province=${province}`;
                        console.log(url1)
                        wx.request({
                            url: url1,
                            method: "get",
                            header: {
                                "Content-Type": "application/json"
                            },
                            success: (res) => {
                                console.log(res.data);
                                this.setData({
                                    updateTime: res.data.result.updatetime,
                                    gasoline: [
                                        {
                                            type: '0#',
                                            price: res.data.result.oil0
                                        },
                                        {
                                            type: '89#',
                                            price: res.data.result.oil89
                                        },
                                        {
                                            type: '90#',
                                            price: res.data.result.oil90
                                        },
                                        {
                                            type: '92#',
                                            price: res.data.result.oil92
                                        },
                                        {
                                            type: '93#',
                                            price: res.data.result.oil93
                                        }
                                        ,
                                        {
                                            type: '95#',
                                            price: res.data.result.oil95
                                        }
                                        ,
                                        {
                                            type: '97#',
                                            price: res.data.result.oil97
                                        },
                                        {
                                            type: '98#',
                                            price: res.data.result.oil98
                                        }
                                    ]
                                });
                            },
                            fail(err) {
                                console.log(err);
                            },
                            complete() {
                                // console.log("完成");
                            }
                        });
                    },
                    fail(err) {
                        console.log(err);
                    },
                    complete() {
                        // getOilInfo();
                        console.log("完成");
                        
                    }

                });
            }
        });
        
        
        const user = app.globalData.userInfo;
        this.setData({
            isType: true,
            isPrice: true,
            price: user.price,
            amount: user.car_spend,
            defaultData: {
                carId: user.car_id,
                carName: user.car_name,
                carType: user.car_type,
                carSpend: user.car_spend,
                gasolineType: user.gasoline,
                gasolinePrice: user.price,
                province: user.province,
                place: user.city  
            }
        });
        console.log(app.globalData.userInfo);
        
        
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
