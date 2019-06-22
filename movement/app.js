//app.js
App({
    onLaunch: function () {
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)


        wx.login({
            success: (res) => {
                if (res.code) {
                    wx.request({
                        url: 'https://www.tripspend.com/movement/onLogin',
                        method: "post",
                        data: {
                            code: res.code
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: (res) => {
                            const code = res.data.code;
                            const msg = res.data.msg;
                            if (code === '失败') {
                                console.log(msg);
                            } else {
                                if (msg === '新用户') {
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


        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
            
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
                    }
                });
            }
        });
    },
    globalData: {
        hasLocation: false,
        isNewUser: false,
        isUser: false,
        location: {},
        userInfo: {},
        target: 0
    }
})