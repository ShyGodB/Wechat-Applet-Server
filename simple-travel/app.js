App({
    onLaunch() {
        // 展示本地存储能力 ---- 存储日志
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)


        wx.login({
            success:(res) => {
                if (res.code) {
                    wx.request({
                        url: 'https://www.tripspend.com/onLogin',
                        method: "post",
                        data: {
                            code: res.code
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success:(res) => {
                            const code = res.data.code;
                            const msg = res.data.msg;
                            if(code === '失败') {
                                console.log(msg);
                            } else {
                                if(msg === '新用户') {
                                    this.globalData.isNewUser = true;
                                    this.globalData.isUser = false;
                                } else {
                                    this.globalData.isNewUser = false;
                                    this.globalData.userInfo = res.data.userInfo;
                                    this.globalData.isUser = true;
                                }
                            }
                        }
                    }) 
                } else {
                    console.log(res.errMsg);
                }
            }
        })

    },
    onShow() {
        // 定位 并 获取最新油价信息
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
                        this.globalData.location = ({
                            city: city.substring(0, city.length - 1),
                            province: province,
                        });
                        this.globalData.hasLocation = true;
                    },
                    complete: () => {
                        // 获取实时油价
                        const province = this.globalData.location.province;
                        const url = `https://ali-todayoil.showapi.com/todayoil?prov=${province}`
                        wx.request({ 
                            url: url,
                            method: "get",
                            header: {
                                "Content-Type": "application/json",
                                "Authorization": 'APPCODE f8f25f5a72bb4f4db2627e6978c5f725'
                            },
                            success:(res) => {
                                if(res.data.showapi_res_code === 0) {
                                    const result = res.data.showapi_res_body.list[0];
                                    this.globalData.updateTime = result.ct.substring(0, 16);
                                    this.globalData.gasoline = [
                                        { name: '89#', value: result.p89 },
                                        { name: '92#', value: result.p92, checked: 'true' },
                                        { name: '95#', value: result.p95 },
                                        { name: '98#', value: result.p98 },
                                        { name: '0#', value: result.p0 },
                                    ];
                                    this.globalData.hasGasoline = true;
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    globalData: {
        hasLocation: false,
        hasGasoline: false,
        isNewUser: false,
        isUser: false,
        location: {},
        userInfo: {},
        updateTime: '2019-5-5 12:00:00',
        gasoline: [],
        cars:[
            
        ]
    }
})
