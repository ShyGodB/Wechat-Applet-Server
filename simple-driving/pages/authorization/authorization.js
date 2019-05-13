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
                        },
                        fail: (err) => {
                            console.log('新增用户失败' + err);
                        },
                        complete: () => {
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })

    },
    onPullDownRefresh: function () {
        this.onLoad();
    }
})
