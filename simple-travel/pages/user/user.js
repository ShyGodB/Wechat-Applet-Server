const app = getApp()

Page({
    data: {
        userInfo: {},
        isUser: false,
        isNewUser: true,

        tripItems: [],
        addItems: [],
        hasUserData: true,

        isUser: false,
        defaultUrl: 'https://github.com/ShyGodB/Pictures/blob/master/%E9%98%B4%E9%98%B3%E5%B8%88/shantu.png?raw=true',

        gridCol: 3,
    },
    goToWarrant() {
        if(app.globalData.isUser !== true) {
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
        if (Object.keys(app.globalData.userInfo).length !== 0 || app.globalData.isUser === true) {
            // 获取用户出行记录
            wx.request({
                url: 'https://www.tripspend.com/getUserTripRecord',
                method: "post",
                data: {
                    userId: app.globalData.userInfo.id
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => {
                    const tripNum = res.data.length,
                          len = res.data.length;
                    let sumCost = 0,
                        sumGaso = 0,
                        sumTrip = 0;
                    for (let i = 0; i < len; i++) {
                        sumCost += Number(res.data[i].cost);
                        sumGaso += Number(res.data[i].cost) / res.data[i].price;
                        sumTrip += res.data[i].trip;
                    }
                    this.setData({
                        tripItems: [
                            { name: '总花费', value: sumCost.toFixed(2), color: 'orange' },
                            { name: '出行次数', value: tripNum, color: 'red' },
                            { name: '总路程', value: sumTrip.toFixed(2), color: 'yellow' }
                        ]
                    })
                }
            });

            // 获取用户加油记录
            wx.request({
                url: 'https://www.tripspend.com/listGasolineRecord',
                method: "post",
                data: {
                    userId: app.globalData.userInfo.id
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => {
                    const addNum = res.data.length
                          len = res.data.length;
                    let addCost = 0,
                        addGaso = 0;
                    for (let i = 0; i < len; i++) {
                        addCost += res.data[i].cost;
                        addGaso += res.data[i].cost / res.data[i].price;
                    }
                    this.setData({
                        addItems: [
                            { name: '总花费', value: addCost.toFixed(2), color: 'olive', icon: 'redpacket' },
                            { name: '加油次数', value: addNum, color: 'green' },
                            { name: '总加油量', value: addGaso.toFixed(2), color: 'cyan' },
                        ]
                    })
                }
            });

            this.setData({
                isUser: app.globalData.isUser,
                isNewUser: app.globalData.isNewUser,
                userInfo: app.globalData.userInfo
            })
        } else {
            wx.getStorage({
                key: 'trip',
                success: (res) => {
                    const tripNum = res.data.length,
                          len = res.data.length;
                    let sumCost = 0,
                        sumGaso = 0,
                        sumTrip = 0;
                    for (let i = 0; i < len; i++) {
                        sumCost += Number(res.data[i].cost);
                        sumGaso += Number(res.data[i].cost) / res.data[i].price;
                        sumTrip += res.data[i].trip;
                    }
                    this.setData({
                        tripItems: [
                            { name: '总花费', value: sumCost.toFixed(2), color: 'orange', icon: 'redpacket' },
                            { name: '出行次数', value: tripNum, color: 'red' },
                            { name: '总路程', value: sumTrip.toFixed(2), color: 'yellow' }
                        ]
                    })
                }
            })

            wx.getStorage({
                key: 'add',
                success: (res) => {
                    const addNum = res.data.length,
                          len = res.data.length;
                    let addCost = 0,
                        addGaso = 0;
                    for (let i = 0; i < len; i++) {
                        addCost += Number(res.data[i].cost);
                        addGaso += Number(res.data[i].cost) / res.data[i].price;
                    }
                    this.setData({
                        addItems: [
                            { name: '总花费', value: addCost.toFixed(2), color: 'olive', icon: 'redpacket' },
                            { name: '加油次数', value: addNum, color: 'green' },
                            { name: '总加油量', value: addGaso.toFixed(2), color: 'cyan' },
                        ]
                    })
                }
            })
        }
    },
    onPullDownRefresh () {
        this.onLoad();
    }

})


