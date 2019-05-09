const app = getApp()

Page({
    data: {
        timeInterval: ["一周", "一月", "半年", "一年"],
        currentId: '0',
        tripItems: [],
        addItems: [],
        noRecord: '',
        isUser: false,
        defaultUrl: 'https://github.com/ShyGodB/Pictures/blob/master/%E9%98%B4%E9%98%B3%E5%B8%88/shantu.png?raw=true',

        // 移植 
        items: [{
            name: '出行次数',
            value: 123,
            color: 'orange'
        }, {
            name: '总花费',
            value: 123,
            color: 'blue'
        }, {
            name: '总路程',
            value: 123,
            color: 'green'
        }, {
            name: '加油次数',
            value: 123,
            color: 'orange'
        }, {
            name: '总花费',
            value: 123,
            color: 'blue'
        }, {
            name: '总加油量',
            value: 123,
            color: 'green'
        }],
        gridCol: 3,
        skin: false
    },
    goToWarrant() {
        wx.navigateTo({
            url: '../authorization/authorization',
        })
    },
    onLoad() {
        
        if (Object.keys(app.globalData.userInfo).length !== 0) {
            // 获取用户出行记录
            wx.request({
                url: 'https://www.tripspend.com:8888/getUserTripRecord',
                method: "post",
                data: {
                    userId: app.globalData.userInfo.id
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => {
                    console.log(res.data)
                    const tripNum = res.data.length;
                    let sumCost = 0;
                    let sumGaso = 0;
                    let sumTrip = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        sumCost += res.data[i].cost;
                        sumGaso += res.data[i].cost / res.data[i].price;
                        sumTrip += res.data[i].trip;
                    }
                    this.setData({
                        tripItems: [
                            { name: '总次数', value: tripNum, unit: '次' },
                            { name: '总花费', value: sumCost.toFixed(2), unit: '元' },
                            { name: '总油耗', value: sumGaso.toFixed(2), unit: '升' },
                            { name: '总路程', value: sumTrip.toFixed(2), unit: '公里' },
                            { name: '平均花费', value: (sumCost / tripNum).toFixed(2), unit: '元/次' },
                            { name: '平均油耗', value: (sumGaso / tripNum).toFixed(2), unit: '升/次' },
                            { name: '平均路程', value: (sumTrip / tripNum).toFixed(2), unit: '公里/次' }
                        ]
                    })
                },
                fail(err) {
                    console.log(err);
                },
                complete() {
                    // console.log("完成");
                }
            });

            // 获取用户加油记录
            wx.request({
                url: 'https://www.tripspend.com:8888/listGasolineRecord',
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
                            { name: '总次数', value: addNum, unit: '次' },
                            { name: '总花费', value: addCost.toFixed(2), unit: '元' },
                            { name: '总加油量', value: addGaso.toFixed(2), unit: '升' },
                            { name: '平均花费', value: (addCost / addNum).toFixed(2), unit: '元/次' },
                            { name: '平均加油量', value: (addGaso / addNum).toFixed(2), unit: '升/次' },
                        ]
                    })
                },
                fail(err) {
                    console.log(err);
                },
                complete() {
                    // console.log("完成");
                }
            });
        } 

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

})


