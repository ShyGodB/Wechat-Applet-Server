const app = getApp();

Page({
    data: {
        userInfo: {},
        isUser: false,

        defaultUrl: 'https://github.com/ShyGodB/Pictures/blob/master/%E9%98%B4%E9%98%B3%E5%B8%88/shantu.png?raw=true',
    },
    goToWarrant() {
        if (app.globalData.isUser !== true) {
            wx.navigateTo({
                url: '../authorization/authorization',
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '您已授权',
                showCancel: false
            })
        }

    },
    goToData() {
        wx.navigateTo({
            url: '/pages/data/data',
        })
    },
    goToInfo() {
        if (app.globalData.isUser === true) {
            wx.navigateTo({
                url: '/pages/info/info',
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '您还没有登录',
                confirmText: '去授权',
                success: (res) => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/authorization/authorization',
                        })
                    }
                }
            })
        }
    },
    goToFeedback() {
        wx.navigateTo({
            url: '/pages/feedback/feedback',
        })
    },
    showAuthor() {
        wx.showModal({
            title: '作者相关',
            content: '手机号：18682210201',
            showCancel: false
        })
    },
    onLoad() {
        this.setData({
            isUser: app.globalData.isUser,
            userInfo: app.globalData.userInfo
        })
    },
    play() {
        const mp3 = wx.createInnerAudioContext();
        mp3.autoplay = true;
        // mp3.src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E061FF02C31F716658E5C81F5594D561F2E88B854E81CAAB7806D5E4F103E55D33C16F3FAC506D1AB172DE8600B37E43FAD&fromtag=46';
        mp3.onPlay(() => {
            console.log('开始播放');
        })
        mp3.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
    onPullDownRefresh() {
        this.onLoad();
    }

})

