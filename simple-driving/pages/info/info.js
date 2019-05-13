const app = getApp()

Page({
    data: {
        userInfo: {},

        date: '2018-12-25',
        region: ['广东省', '广州市', '海珠区'],
    },
    goToData() {
        wx.navigateTo({
            url: '/pages/data/data',
        })
    },
    onLoad() {
        this.setData({
            userInfo: app.globalData.userInfo
        });
    },
    onPullDownRefresh: function () {
        this.onLoad();
    }

})


