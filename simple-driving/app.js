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
                        url: 'https://www.tripspend.com:8888/onLogin',
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
                        const url = `https://api.jisuapi.com/oil/query?appkey=62ea23ffe7a3a991&province=${province}`;
                        wx.request({
                            url: url,
                            method: "get",
                            header: {
                                "Content-Type": "application/json"
                            },
                            success:(res) => {
                                const result = res.data.result;
                                this.globalData.updateTime = res.data.result.updatetime;
                                this.globalData.gasoline = [
                                    { name: '89#', value: res.data.result.oil89 },
                                    { name: '92#', value: res.data.result.oil92, checked: 'true' },
                                    { name: '95#', value: res.data.result.oil95 },
                                    { name: '0#', value: res.data.result.oil0 },
                                ];
                                this.globalData.hasGasoline = true;
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
        gasoline: [
            { name: '89#', value: '7.01' },
            { name: '92#', value: '7.20', checked: 'true' },
            { name: '95#', value: '7.49' },
            { name: '0#', value: '6.80' },
        ]
    }
})
