const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    // 回到主页
    goIndex() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    onLoad() {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo(ev) {
        const userInfo = ev.detail.userInfo;
        this.setData({
            userInfo: userInfo,
        });
        wx.login({
            success: res => {
                if (res.code) {
                    wx.request({
                        url: 'https://www.tripspend.com:8888/addUser',
                        method: "post",
                        data: {
                            code: res.code,
                            userInfo: userInfo
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: (res) => {
                            const secretSessionKey = res.data.session_key;
                            const userInfo = res.data.userData[0];
                            app.globalData.userInfo = userInfo;
                            this.setData({
                                userInfo: userInfo
                            });
                            wx.setStorage({
                                key: userInfo.openid,
                                data: secretSessionKey,
                            })
                        },
                        fail: (err) => {
                            console.log('新增用户失败' + err);
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })

    }
})
