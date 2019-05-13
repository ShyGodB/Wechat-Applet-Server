const app = getApp()

Page({
    data: {
        userInfo: {},
        beEdit: true,
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
    changeBeEdit() {
        wx.showModal({
            title: '提示',
            content: '系统自动保存信息',
        })
        this.setData({
            beEdit: !this.data.beEdit
        })
    },
    changeInfo(ev) {
        const name = ev.currentTarget.dataset.name;
        const value = ev.detail.value;
        console.log(name, value);
        // 已登录用户
        if (app.globalData.isUser === true && value !== undefined) {
            if(name === '手机') {
                if(value.length === 11) {
                    app.globalData.userInfo.mobile = value;
                    const data = [app.globalData.userInfo.id, name, value];
                    wx.request({
                        url: 'https://www.tripspend.com/user/updateUser',
                        method: "post",
                        data: data,
                        header: {
                            "Content-Type": "application/json"
                        }
                    });
                }
            } else {
                if(value.length !== 0) {
                    switch (name) {
                        case '昵称':
                            app.globalData.userInfo.nickname = value;
                            break;
                        case '油耗':
                            app.globalData.userInfo.amount = value;
                            break;
                        case '油型':
                            app.globalData.userInfo.gasoline = value;
                            break;
                        case '价格':
                            app.globalData.userInfo.price = value;
                            break;
                    }
                    const data = [app.globalData.userInfo.id, name, value];
                    wx.request({
                        url: 'https://www.tripspend.com/user/updateUser',
                        method: "post",
                        data: data,
                        header: {
                            "Content-Type": "application/json"
                        }
                    });
                }
            }  
        } 
    },
    dateChange() {

    },
    onPullDownRefresh: function () {
        this.onLoad();
    }

})


