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
    getUserInfo(ev) {
        const userInfo = ev.detail.userInfo;
        this.setData({
            userInfo: userInfo,
        });
        wx.login({
            success: res => {
                if (res.code) {
                    wx.request({
                        url: 'https://www.tripspend.com/addUser',
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
                            app.globalData.isUser = true;
                            app.globalData.isNewUser = false;
                            this.setData({
                                userInfo: userInfo
                            });
                        },
                        complete: () => {
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }
                    })
                }
            }
        })

    }
})
