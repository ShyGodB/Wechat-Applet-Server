const app = getApp();

Page({
    data: {
        time: '',
        run: '',
        put: '',
        sit: '',
        hasLocation: false,
        isNewUser: true,
        isUser: false,
        location: {},
        userInfo: {}

    },
    goAuthorization() {
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
    runChange(ev) {
        this.setData({
            run: ev.detail.value
        })
    },
    putChange(ev) {
        this.setData({
            put: ev.detail.value
        })
    },
    sitChange(ev) {
        this.setData({
            sit: ev.detail.value
        })
    },
    uploadData() {
        if(app.globalData.isUser === true) {
            const user_id = app.globalData.userInfo.id;
            const run = this.data.run;
            const put = this.data.put;
            const sit = this.data.sit;
            const time = new Date().toLocaleDateString();
            const data = [run, put, sit, time];
            wx.request({
                url: 'https://www.tripspend.com/movement/addData',
                method: "post",
                data: {
                    user_id: user_id,
                    run: run,
                    put: put,
                    sit: sit,
                    time, time
                },
                header: {
                    "Content-Type": "application/json"
                },
                success: (res) => {
                    console.log(res)
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '未登陆',
                showCancel: true
            })
        } 
    },
    getTime() {
        const myDate = new Date();
        const year = myDate.getFullYear();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        let weekDay = myDate.getDay();
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        switch (weekDay) {
            case 0:
                weekDay = '星期天';
                break;
            case 1:
                weekDay = '星期一';
                break;
            case 2:
                weekDay = '星期二';
                break;
            case 3:
                weekDay = '星期三';
                break;
            case 4:
                weekDay = '星期四';
                break;
            case 5:
                weekDay = '星期五';
                break;
            case 6:
                weekDay = '星期六';
                break;
        }
        const time = year + '-' + month + '-' + day + '  ' + weekDay;
        this.setData({
            time: time
        })
    },
    onLoad() {
        this.getTime();
        const that = this;
        const timer = setInterval(function testNetwork() {
            if (app.globalData.userInfo === {}) {
                wx.showLoading({
                    title: '等待网络请求'
                });
            } else {
                wx.hideLoading();
                clearInterval(timer);
                if (Object.keys(app.globalData.userInfo).length !== 0 && app.globalData.isUser === true) {
                    that.setData({
                        hasLocation: app.globalData.hasLocation,
                        isNewUser: app.globalData.isNewUser,
                        isUser: app.globalData.isUser,
                        location: app.globalData.location,
                        userInfo: app.globalData.userInfo
                    })
                }
            }
        }, 500);  
    },
    onPullDownRefresh() {
        this.onLoad();
    }
});
