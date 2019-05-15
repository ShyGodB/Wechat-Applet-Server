const app = getApp()

Page({
    data: {
        updateTime: '',
        gasoline: [],
        location: {},
        isUser: false,
        isNewUser: true,
        
        userInfo: {},
        true: true,
        gaso: '92#',
        index: '',
        price: '',
        num: '',
        cost: '',

        editPrice: true,
        isDefaultPrice: true
    },
    
    radioChange(ev) {
        this.setData({
            price: ev.detail.value
        });
    },

    changeGaso(ev) {
        this.setData({
            gaso: ev.target.dataset.name
        })
    },

    // 实时更新单价
    changePrice(ev) {
        this.setData({
            price: ev.detail.value
        });
    },

    changeNum(ev) {
        this.setData({
            num: ev.detail.value
        })
    },

    // 计算最终的花费，将数据传输到后端，记录并更新数据表，返回结果
    uploadData() {
        const gaso = this.data.gaso;
        const price = Number(this.data.price);
        const num = Number(this.data.num);
        const cost = (price * num).toFixed(2);
        this.setData({
            cost: cost
        });
        const date = new Date();
        const time = date.toLocaleString();
        const ms = Date.parse(new Date());
        const obj = {
            gaso: gaso,
            price: price,
            num: num,
            cost: cost,
            time: time,
            ms: ms
        }
        const data = [obj]
        if(this.data.isUser === true) {
            wx.request({
                url: "https://www.tripspend.com/addGasolineRecord",
                method: "post",
                data: {
                    userId: app.globalData.userInfo.id,
                    gaso: gaso,
                    price: price,
                    num: num,
                    cost: cost,
                    time: time,
                    ms: ms
                },
                header: {
                    "Content-Type": "application/json"
                },
            });
        } else {
            wx.getStorage({
                key: 'add',
                success: (res) => {
                    const newData = res.data;
                    if (obj.num !== 0) {
                        newData.push(obj);
                        wx.setStorage({
                            key: 'add',
                            data: newData
                        })
                    }
                },
                fail: () => {
                    if (obj.num !== 0) {
                        wx.setStorage({
                            key: 'add',
                            data: data
                        })
                    }
                }
            })
        }
    },
    onLoad() {
        const that = this;
        const timer = setInterval(function testNetwork() {
            if (app.globalData.hasLocation === false || app.globalData.hasGasoline === false) {
                wx.showLoading({
                    title: '等待网络请求'
                });
            } else {
                wx.hideLoading();
                clearInterval(timer);
                that.setData({
                    isUser: app.globalData.isUser,
                    isNewUser: app.globalData.isNewUser,

                    isDefaultPrice: true,
                    price: app.globalData.gasoline[1].value,

                    updateTime: app.globalData.updateTime,
                    gasoline: app.globalData.gasoline,
                    location: app.globalData.location
                })
                if (Object.keys(app.globalData.userInfo).length !== 0 && app.globalData.isUser === true) {
                    that.setData({
                        amount: app.globalData.userInfo.amount,
                        userInfo: app.globalData.userInfo
                    })
                    if (app.globalData.userInfo.price !== 0) {
                        that.setData({
                            price: app.globalData.userInfo.price
                        })
                    }
                }
            }
        }, 500);
    },
    onShow() {
        this.onLoad();
    },
    onPullDownRefresh: function () {
        this.onLoad();
    }
   

});