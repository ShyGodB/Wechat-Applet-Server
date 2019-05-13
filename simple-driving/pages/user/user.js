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
        wx.navigateTo({
            url: '../authorization/authorization',
        })
    },
    goToData() {
        wx.navigateTo({
            url: '/pages/data/data',
        })
    },
    goToInfo() {
        wx.navigateTo({
            url: '/pages/info/info',
        })
    },
    goToFeedback() {
        wx.navigateTo({
            url: '/pages/feedback/feedback',
        })
    },
    prompt() {
        wx.showModal({
            title: '提示',
            content: '此页面尚未设置，敬请期待！',
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
                    const tripNum = res.data.length;
                    let sumCost = 0;
                    let sumGaso = 0;
                    let sumTrip = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        sumCost += Number(res.data[i].cost);
                        sumGaso += Number(res.data[i].cost) / res.data[i].price;
                        sumTrip += res.data[i].trip;
                    }
                    this.setData({
                        tripItems: [
                            { name: '总花费', value: sumCost.toFixed(2), color: 'orange', icon: 'redpacket' },
                            { name: '出行次数', value: tripNum, color: 'orange' },
                            { name: '总油耗', value: sumGaso.toFixed(2), color: 'orange' },
                            { name: '总路程', value: sumTrip.toFixed(2), color: 'orange' },
                            { name: '平均花费', value: (sumCost / tripNum).toFixed(2), color: 'orange' },
                            { name: '平均油耗', value: (sumGaso / tripNum).toFixed(2), color: 'orange' },
                            { name: '平均路程', value: (sumTrip / tripNum).toFixed(2), color: 'orange' }
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
                    const addNum = res.data.length;
                    let addCost = 0;
                    let addGaso = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        addCost += res.data[i].cost;
                        addGaso += res.data[i].cost / res.data[i].price;
                    }
                    this.setData({
                        addItems: [
                            { name: '总花费', value: addCost.toFixed(2), color: 'orange', icon: 'redpacket' },
                            { name: '加油次数', value: addNum, color: 'orange' },
                            { name: '总加油量', value: addGaso.toFixed(2), color: 'orange' },
                            { name: '平均花费', value: (addCost / addNum).toFixed(2), color: 'orange' },
                            { name: '平均加油量', value: (addGaso / addNum).toFixed(2), color: 'orange' }
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
                    const tripNum = res.data.length;
                    let sumCost = 0;
                    let sumGaso = 0;
                    let sumTrip = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        sumCost += Number(res.data[i].cost);
                        sumGaso += Number(res.data[i].cost) / res.data[i].price;
                        sumTrip += res.data[i].trip;
                    }
                    this.setData({
                        tripItems: [
                            { name: '总花费', value: sumCost.toFixed(2), color: 'orange', icon: 'redpacket' },
                            { name: '出行次数', value: tripNum, color: 'orange' },
                            { name: '总油耗', value: sumGaso.toFixed(2), color: 'orange' },
                            { name: '总路程', value: sumTrip.toFixed(2), color: 'orange' },
                            { name: '平均花费', value: (sumCost / tripNum).toFixed(2), color: 'orange' },
                            { name: '平均油耗', value: (sumGaso / tripNum).toFixed(2), color: 'orange' },
                            { name: '平均路程', value: (sumTrip / tripNum).toFixed(2), color: 'orange' }
                        ]
                    })
                },
                fail: (res) => {
                    console.log(res)
                }
            })

            wx.getStorage({
                key: 'add',
                success: (res) => {
                    const addNum = res.data.length;
                    let addCost = 0;
                    let addGaso = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        addCost += Number(res.data[i].cost);
                        addGaso += Number(res.data[i].cost) / res.data[i].price;
                    }
                    this.setData({
                        addItems: [
                            { name: '总花费', value: addCost.toFixed(2), color: 'orange', icon: 'redpacket' },
                            { name: '加油次数', value: addNum, color: 'orange' },
                            { name: '总加油量', value: addGaso.toFixed(2), color: 'orange' },
                            { name: '平均花费', value: (addCost / addNum).toFixed(2), color: 'orange' },
                            { name: '平均加油量', value: (addGaso / addNum).toFixed(2), color: 'orange' }
                        ]
                    })
                }
            })
        }
    },
    onShow() {
        // if (app.globalData.isNewUser === true) {
        //     wx.showModal({
        //         title: '是否授权',
        //         confirmText: '去授权',
        //         confirmColor: '#00FF00',
        //         content: '不授权您也可以使用所有功能，但我们不会将您的数据存入数据库',
        //         success(res) {
        //             if (res.confirm) {
        //                 wx.navigateTo({
        //                     url: '/pages/authorization/authorization',
        //                 })
        //             } else {
        //                 wx.switchTab({
        //                     url: '/pages/index/index',
        //                 })
        //             }
        //         }
        //     })
        // } 
    },
    onPullDownRefresh: function () {
        this.onLoad();
    }

})


