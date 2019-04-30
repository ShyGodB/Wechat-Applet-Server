//app.js
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
            }
        })

        // 从服务器获取已有用户信息
        const url2 = 'https://www.tripspend.com:8888/getAllUser';
        // wx.request({
        //     url: url2,
        //     method: "get",
        //     header: {
        //         "Content-Type": "application/json"
        //     },
        //     success: (res) => {
        //         // console.log(res.data);
        //         this.globalData.existUser = res.data;
        //         // this.globalData.userInfo = res.data[0];
        //         this.globalData.isUser = true;
        //         // console.log(this.globalData.userInfo)
        //     },
        //     fail: (err) => {
        //         console.log(err);
        //     },
        //     complete: () => {
        //         // console.log("完成");
        //     }
        // });
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: (res) => {
                            // 可以将 res 发送给后台解码出 unionId
                            // console.log(res.userInfo);
                            // this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                            // console.log(res.userInfo);
                            // console.log(this.globalData.userInfo)
                            if(res.userInfo.nickName !== this.globalData.userInfo.nickname) {
                                // console.log("执行了这一段代码")
                                // 添加用户 
                                wx.request({
                                    url: 'https://www.tripspend.com:8888/addUser',
                                    method: "post",
                                    data: {
                                        userInfo: this.globalData.userInfo
                                    },
                                    header: {
                                        "Content-Type": "application/json"
                                    },
                                    success(res) {
                                        console.log(res.data);
                                        // that.setData({
                                        //     result: result
                                        // })
                                        // console.log(this)
                                    },
                                    fail(err) {
                                        console.log(err);
                                    },
                                    complete() {
                                        // console.log("完成");
                                    }
                                });
                            }
                        }
                    })
                }
            }
        });
        const url3 = 'https://www.tripspend.com:8888/getUser';
        wx.request({
            url: url3,
            method: "get",
            header: {
                "Content-Type": "application/json"
            },
            success:(res) => {
                // console.log(res.data);
                // console.log(this)
                this.globalData.userInfo = res.data;
                this.globalData.isUser = true;
                // console.log(this.globalData.userInfo)
            },
            fail: (err) => {
                console.log(err);
            },
            complete: () => {
                // console.log("完成");
            }
        });
        
    },
    globalData: {
        userInfo: null,
        existUser: null,
        isUser: false
    }
})