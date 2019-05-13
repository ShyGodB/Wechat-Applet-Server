const app = getApp();

Page({
    data: {
        tripItems: [],
        addItems: [],
        hasUserData: true,
        isUser: false,


        mainTabCur: 0,
        mainScrollLeft: 0,

        secondTabCur: 0,
        secondScrollLeft: 0,
    
        gridCol: 3,
        nav: [{name: '出行', icon: 'taxi'}, {name: '加油', icon: 'add'}],
        date:[
            { zh: '天', en: 'day' },
            { zh: '周', en: 'week' },
            { zh: '月', en: 'month' },
            { zh: '半年', en: 'halfYear' },
            { zh: '一年', en: 'year' },
        ],
        data: ['day'],
        navName: '天'
    },
    mainTabSelect(ev) {
        this.setData({
            mainTabCur: ev.currentTarget.dataset.id,
            mainScrollLeft: (ev.currentTarget.dataset.id - 1) * 60
        })
    },
    secondTabSelect(ev) {
        this.setData({
            secondTabCur: ev.currentTarget.dataset.id,
            navName: ev.currentTarget.dataset.name,
            secondScrollLeft: (ev.currentTarget.dataset.id - 1) * 60
        })
    },
    onLoad() {
        if (Object.keys(app.globalData.userInfo).length !== 0 || app.globalData.isUser === true) {
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
                    const date = new Date();
                    const time = date.toLocaleString().substring(0, 8);
                    const msNow = Date.parse(new Date());
                    let listDay = [];
                    let listWeek = [];
                    let listMonth = [];
                    let listHalfYear = [];
                    let listYear = [];
                    let listOverYear = [];

                    const tripNum = res.data.length;
                    let sumCost = 0;
                    let sumGaso = 0;
                    let sumTrip = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        sumCost += Number(res.data[i].cost);
                        sumGaso += Number(res.data[i].cost) / res.data[i].price;
                        sumTrip += res.data[i].trip;
                        const ms = res.data[i].ms;
                        const msDiff = msNow - ms;
                        const result = Math.floor(msDiff / 86400000);
                        if (result <= 1) {
                            listDay.push(res.data[i]);
                            listWeek.push(res.data[i]);
                            listMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 7) {
                            listWeek.push(res.data[i]);
                            istMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 30) {
                            listMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 182) {
                            listHalfYear.push(res.data[i]);
                        } else if (result <= 365) {
                            listYear.push(res.data[i]);
                            istYear.push(res.data[i]);
                        } else {
                            listOverYear.push(res.data[i]);
                        }
                    }
                    const listAll = [
                        { name: '总花费', value: sumCost.toFixed(2), color: 'orange', icon: 'redpacket' },
                        { name: '出行次数', value: tripNum, color: 'orange' },
                        { name: '总油耗', value: sumGaso.toFixed(2), color: 'orange' },
                        { name: '总路程', value: sumTrip.toFixed(2), color: 'orange' },
                    ];
                    const listEqual = [
                        { name: '平均花费', value: (sumCost / tripNum).toFixed(2), color: 'orange' },
                        { name: '平均油耗', value: (sumGaso / tripNum).toFixed(2), color: 'orange' },
                        { name: '平均路程', value: (sumTrip / tripNum).toFixed(2), color: 'orange' }
                    ];
                    this.setData({
                        tripItems: {
                            all: listAll,
                            equal: listEqual,
                            day: listDay,
                            week: listWeek,
                            month: listMonth,
                            halfYear: listHalfYear,
                            year: listYear,
                            length: res.data.length
                        }
                    });
                },
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
                    const date = new Date();
                    const time = date.toLocaleString().substring(0, 8);
                    const msNow = Date.parse(new Date());
                    let listDay = [];
                    let listWeek = [];
                    let listMonth = [];
                    let listHalfYear = [];
                    let listYear = [];
                    let listOverYear = [];

                    const addNum = res.data.length;
                    let addCost = 0;
                    let addGaso = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        addCost += Number(res.data[i].cost);
                        addGaso += Number(res.data[i].cost) / res.data[i].price;
                        const ms = res.data[i].ms;
                        const msDiff = msNow - ms;
                        const result = Math.floor(msDiff / 86400000);
                        if (result <= 1) {
                            listDay.push(res.data[i]);
                            listWeek.push(res.data[i]);
                            listMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 7) {
                            listWeek.push(res.data[i]);
                            istMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 30) {
                            listMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 182) {
                            listHalfYear.push(res.data[i]);
                        } else if (result <= 365) {
                            listYear.push(res.data[i]);
                            istYear.push(res.data[i]);
                        } else {
                            listOverYear.push(res.data[i]);
                        }
                    }
                    const listAll = [
                        { name: '总花费', value: addCost.toFixed(2), color: 'orange', icon: 'redpacket' },
                        { name: '加油次数', value: addNum, color: 'orange' },
                        { name: '总加油量', value: addGaso.toFixed(2), color: 'orange' }
                    ];
                    const listEqual = [
                        { name: '平均花费', value: (addCost / addNum).toFixed(2), color: 'orange' },
                        { name: '平均加油量', value: (addGaso / addNum).toFixed(2), color: 'orange' }
                    ];
                    this.setData({
                        addItems: {
                            all: listAll,
                            equal: listEqual,
                            day: listDay,
                            week: listWeek,
                            month: listMonth,
                            halfYear: listHalfYear,
                            year: listYear,
                            length: res.data.length
                        }
                    })
                },
            });
        } else {
            wx.getStorage({
                key: 'trip',
                success: (res) => {
                    const date = new Date();
                    const time = date.toLocaleString().substring(0,8);
                    const msNow = Date.parse(new Date());
                    let listDay = [];
                    let listWeek = [];
                    let listMonth = [];
                    let listHalfYear = [];
                    let listYear = [];
                    let listOverYear = [];
                    const tripNum = res.data.length;
                    let sumCost = 0;
                    let sumGaso = 0;
                    let sumTrip = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        sumCost += Number(res.data[i].cost);
                        sumGaso += Number(res.data[i].cost) / res.data[i].price;
                        sumTrip += res.data[i].trip;
                        const ms = res.data[i].ms;
                        const msDiff = msNow - ms;
                        const result = Math.floor(msDiff/86400000);
                        if(result <= 1) {
                            listDay.push(res.data[i]);
                            listWeek.push(res.data[i]);
                            listMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 7 ) {
                            listWeek.push(res.data[i]);
                            istMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 30) {
                            listMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 182) {
                            listHalfYear.push(res.data[i]);
                        } else if (result <= 365) {
                            listYear.push(res.data[i]);
                            istYear.push(res.data[i]);
                        } else {
                            listOverYear.push(res.data[i]);
                        }
                    }
                    const listAll = [
                        { name: '总花费', value: sumCost.toFixed(2), color: 'orange', icon: 'redpacket' },
                        { name: '出行次数', value: tripNum, color: 'orange' },
                        { name: '总油耗', value: sumGaso.toFixed(2), color: 'orange' },
                        { name: '总路程', value: sumTrip.toFixed(2), color: 'orange' },
                    ];
                    const listEqual = [
                        { name: '平均花费', value: (sumCost / tripNum).toFixed(2), color: 'orange' },
                        { name: '平均油耗', value: (sumGaso / tripNum).toFixed(2), color: 'orange' },
                        { name: '平均路程', value: (sumTrip / tripNum).toFixed(2), color: 'orange' }
                    ];
                    this.setData({
                        tripItems: {
                            all: listAll,
                            equal: listEqual,
                            day: listDay,
                            week: listWeek,
                            month: listMonth,
                            halfYear: listHalfYear,
                            year: listYear,
                            length: res.data.length
                        }
                    });
                },
                fail: (res) => {
                    console.log(res)
                }
            })

            wx.getStorage({
                key: 'add',
                success: (res) => {
                    const date = new Date();
                    const time = date.toLocaleString().substring(0, 8);
                    const msNow = Date.parse(new Date());
                    let listDay = [];
                    let listWeek = [];
                    let listMonth = [];
                    let listHalfYear = [];
                    let listYear = [];
                    let listOverYear = [];

                    const addNum = res.data.length;
                    let addCost = 0;
                    let addGaso = 0;
                    for (let i = 0; i < res.data.length; i++) {
                        addCost += Number(res.data[i].cost);
                        addGaso += Number(res.data[i].cost) / res.data[i].price;
                        const ms = res.data[i].ms;
                        const msDiff = msNow - ms;
                        const result = Math.floor(msDiff / 86400000);
                        if (result <= 1) {
                            listDay.push(res.data[i]);
                            listWeek.push(res.data[i]);
                            listMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 7) {
                            listWeek.push(res.data[i]);
                            istMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 30) {
                            listMonth.push(res.data[i]);
                            listHalfYear.push(res.data[i]);
                            listYear.push(res.data[i]);
                        } else if (result <= 182) {
                            listHalfYear.push(res.data[i]);
                        } else if (result <= 365) {
                            listYear.push(res.data[i]);
                            istYear.push(res.data[i]);
                        } else {
                            listOverYear.push(res.data[i]);
                        }
                    }
                    const listAll = [
                        { name: '总花费', value: addCost.toFixed(2), color: 'orange', icon: 'redpacket' },
                        { name: '加油次数', value: addNum, color: 'orange' },
                        { name: '总加油量', value: addGaso.toFixed(2), color: 'orange' }
                    ];
                    const listEqual = [
                        { name: '平均花费', value: (addCost / addNum).toFixed(2), color: 'orange' },
                        { name: '平均加油量', value: (addGaso / addNum).toFixed(2), color: 'orange' }
                    ];
                    this.setData({
                        addItems: {
                            all: listAll,
                            equal: listEqual,
                            day: listDay,
                            week: listWeek,
                            month: listMonth,
                            halfYear: listHalfYear,
                            year: listYear,
                            length: res.data.length
                        }
                    })
                },
                fail: (res) => {
                    console.log(res)
                }
            })
        }
    },
    onPullDownRefresh: function () {
        this.onLoad();
    }
})



    