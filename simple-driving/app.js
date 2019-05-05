App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)


        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    console.log(res.code)
                    wx.request({
                        url: 'https://www.tripspend.com:8888/onLogin',
                        method: "post",
                        data: {
                            code: res.code
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: (res) => {
                            this.globalData.userTicket = res.data;
                            console.log(this.globalData.userTicket);
                            // const userTicket = res.data;
                            // // 如果用户是新用户，则添加该用户信息
                            // const openid = res.data.openid;
                            // const openidArray = this.globalData.openidArray;
                            // if (openidArray.length === 0 || openidArray.indexOf(openid) === -1) {
                            //     // 从TX获取用户信息
                            //     wx.getSetting({
                            //         success: res => {
                            //             if (res.authSetting['scope.userInfo']) {
                            //                 // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                            //                 wx.getUserInfo({
                            //                     success: (res) => {
                            //                         if (this.userInfoReadyCallback) {
                            //                             this.userInfoReadyCallback(res)
                            //                         }
                            //                         wx.request({
                            //                             url: 'https://www.tripspend.com:8888/addUser',
                            //                             method: "post",
                            //                             data: {
                            //                                 userInfo: res.userInfo,
                            //                                 userTicket: userTicket
                            //                             },
                            //                             header: {
                            //                                 "Content-Type": "application/json"
                            //                             },
                            //                             success:(res) => {
                            //                                 this.globalData.userInfo = res.data;
                            //                                 this.globalData.isUesr = true;
                            //                             },
                            //                             fail(err) {
                            //                                 console.log(err);
                            //                             },
                            //                             complete() {
                            //                                 console.log("完成");
                            //                             }
                            //                         });
                            //                     }
                            //                 })
                            //             }
                            //         }
                            //     });
                            // } else {
                            //     // 不是新用户
                            //     // 根据openid获取用户信息，openid从TX提供的api获取
                            //     wx.request({
                            //         url: 'https://www.tripspend.com:8888/getUser',
                            //         method: "post",
                            //         data: {
                            //             openid: openid
                            //         },
                            //         header: {
                            //             "Content-Type": "application/json"
                            //         },
                            //         success: (res) => {
                            //             // 返回的结果为一个数组，数组长度为0，则该用户为新用户
                            //             this.globalData.userInfo = res.data;
                            //             this.globalData.isUesr = true;
                            //         },
                            //         fail: (err) => {
                            //             console.log(err);
                            //         },
                            //         complete: () => {
                            //             // console.log("完成");
                            //         }
                            //     });

                            // }
                            
                        },
                        fail:(err) => {
                            console.log(err);
                        },
                        complete:() => {
                            // console.log("完成");
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })

        

        // 从服务器获取所有老用户的openid，其结果为一个数组 --- openidArray
        // wx.request({
        //     url: 'https://www.tripspend.com:8888/listAllOpenid',
        //     method: "post",
        //     header: {
        //         "Content-Type": "application/json"
        //     },
        //     success: (res) => {
        //         this.globalData.openidArray = res.data;
        //     },
        //     fail: (err) => {
        //         console.log(err);
        //     },
        //     complete: () => {
        //         // console.log("完成");
        //     }
        // });
        

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
                            province: province
                        });
                    },
                    fail: (err) => {
                        console.log(err);
                    },
                    complete: () => {
                        // 获取实时油价
                        // const province = this.globalData.location.province;
                        // const url = `https://api.jisuapi.com/oil/query?appkey=62ea23ffe7a3a991&province=${province}`;
                        // wx.request({
                        //     url: url,
                        //     method: "get",
                        //     header: {
                        //         "Content-Type": "application/json"
                        //     },
                        //     success:(res) => {
                        //         const result = res.data.result;
                        //         this.globalData.updateTime = res.data.result.updatetime;
                        //         this.globalData.gasoline = [
                        //             { name: '89#', value: res.data.result.oil89 },
                        //             { name: '92#', value: res.data.result.oil92, checked: 'true' },
                        //             { name: '95#', value: res.data.result.oil95 },
                        //             { name: '0#', value: res.data.result.oil0 },
                        //         ];
                        //     },
                        //     fail: (err) => {
                        //         console.log(err);
                        //     },
                        //     complete: () => {
                        //         // console.log("完成");
                        //     }
                        // });
                    }
                });
            }
        });
    },
    globalData: {
        isUser: false,
        userTicket: {},
        location: {},
        userInfo: {},
        openidArray: [],
        updateTime: '',
        gasoline: [
            { name: '89#', value: '7.01' },
            { name: '92#', value: '7.20', checked: 'true' },
            { name: '95#', value: '7.51' },
            { name: '0#', value: '6.80' }
        ]
    }
})

