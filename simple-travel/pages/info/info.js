const app = getApp()

Page({
    data: {
        userInfo: app.globalData.userInfo,
        beEdit: true,
        canEditGender: true,
        birthday: '2019-2-1',
        items: [
            { name: '男', checked: 'true' },
            { name: '女' },
        ],

        nickname: '',
        gender: '男',
        country: '',
        amount: '',
        gasoline: '',
        price: '',
        mobile: '',
        birthday: '',
        address: ''
    },
    goToData() {
        wx.navigateTo({
            url: '/pages/data/data',
        })
    },
    changeTime(ev) {
        const id = app.globalData.userInfo.id;
        const name = '生日';
        const value = ev.detail.value;
        this.setData({
            birthday: value
        });
        app.globalData.userInfo.birthday = value;
        const data = [id, name, value];
        wx.request({
            url: 'https://www.tripspend.com/user/updateUser',
            method: "post",
            data: data,
            header: {
                "Content-Type": "application/json"
            }
        });
    },
    changeAddress(ev) {
        const id = app.globalData.userInfo.id;
        const name = '地址';
        const addressArray = ev.detail.value;
        const value = addressArray[0] + '，' + addressArray[1] + '，' + addressArray[2];
        this.setData({
            address: value
        });
        app.globalData.userInfo.address = value;
        app.globalData.userInfo.province = addressArray[0];
        app.globalData.userInfo.city = addressArray[1];
        const data = [id, name, value];
        wx.request({
            url: 'https://www.tripspend.com/user/updateUser',
            method: "post",
            data: data,
            header: {
                "Content-Type": "application/json"
            }
        });
    },
    prompt() {
        wx.showModal({
            title: '⚠️！提示！',
            content: '暂不支持修改国籍，若真想修改请联系管理员：18682210201',
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        beEdit: !this.data.beEdit
                    })
                }
            }
        })
    },
    onLoad() {
        const userInfo = app.globalData.userInfo;
        this.setData({
            userInfo: userInfo,
            nickname: userInfo.nickname,
            gender: userInfo.gender,
            country: userInfo.country,
            amount: userInfo.amount,
            gasoline: userInfo.gasoline,
            price: userInfo.price,
            mobile: userInfo.mobile,
            birthday: userInfo.birthday,
            address: userInfo.address
        });
    },
    changeBeEdit() {
        wx.showModal({
            title: '确认编辑信息？',
            content: '信息自动保存',
            success:(res) => {
                if (res.confirm) {
                    this.setData({
                        beEdit: !this.data.beEdit
                    })
                } 
            }
        })
    },
    radioChange(ev) {
        const id = app.globalData.userInfo.id;
        const name = '性别';
        const value = ev.detail.value;
        const data = [id, name, value];

        this.setData({
            gender: ev.detail.value
        })
        app.globalData.userInfo.gender = value;

        wx.request({
            url: 'https://www.tripspend.com/user/updateUser',
            method: "post",
            data: data,
            header: {
                "Content-Type": "application/json"
            }
        })
    },
    changeInfo(ev) {
        const name = ev.currentTarget.dataset.name;
        const value = ev.detail.value;
        // 已登录用户
        if (app.globalData.isUser === true && value !== undefined) {
            if(name === '手机') {
                if(value.length === 11) {
                    this.setData({
                        mobile: value
                    })
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
                            this.setData({
                                nickname: value
                            })
                            app.globalData.userInfo.nickname = value;
                            break;
                        case '油耗':
                            this.setData({
                                amount: value
                            })
                            app.globalData.userInfo.amount = value;
                            break;
                        case '油型':
                            this.setData({
                                gasoline: value
                            })
                            app.globalData.userInfo.gasoline = value;
                            break;
                        case '价格':
                            this.setData({
                                price: value
                            })
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
    onShow() {
        this.onLoad();
    },
    onPullDownRefresh: function () {
        this.onLoad();
    }

})


