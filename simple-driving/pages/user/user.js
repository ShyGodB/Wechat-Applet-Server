const app = getApp()

Page({
    data: {
        timeInterval: ["一周", "一月", "半年", "一年"],
        currentId: '0',
        tripItems: [],
        addItems: []
    },
    changeBg(ev) {
        this.setData({
            currentId: ev.target.id
        });
    },
    onLoad() {
        // 获取用户出行记录
        wx.request({
            url: 'https://www.tripspend.com:8888/getUserTripRecord',
            method: "post",
            data: {
                userId: app.globalData.userInfo[0].id
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
                for(let i = 0; i < res.data.length; i++) {
                    sumCost += res.data[i].cost;
                    sumGaso += res.data[i].cost / res.data[i].price;
                    sumTrip += res.data[i].trip;
                }
                this.setData({
                    tripItems: [
                        { name: '总次数', value: tripNum, unit: '次' },
                        { name: '总花费', value: sumCost.toFixed(2), unit: '元'},
                        { name: '总油耗', value: sumGaso.toFixed(2), unit: '升'},
                        { name: '总路程', value: sumTrip.toFixed(2), unit: '公里'},
                        { name: '平均花费', value: (sumCost / tripNum).toFixed(2), unit: '元/次'},
                        { name: '平均油耗', value: (sumGaso / tripNum).toFixed(2), unit: '升/次' },
                        { name: '平均路程', value: (sumTrip / tripNum).toFixed(2), unit: '公里/次'}
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
                userId: app.globalData.userInfo[0].id
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
                        { name: '总次数', value: addNum, unit: '次'},
                        { name: '总花费', value: addCost.toFixed(2), unit: '元'},
                        { name: '总加油量', value: addGaso.toFixed(2), unit: '升'},
                        { name: '平均花费', value: (addCost / addNum).toFixed(2), unit: '元/次'},
                        { name: '平均加油量', value: (addGaso / addNum).toFixed(2), unit: '升/次'},
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
    },
})


