const app = getApp()

Page({
    data: {
        countryCodeIndex: 0,
        countryCodes: ["+86", "+80", "+84", "+87"],
        userInfo: {},
        isUser: false,
        beEdit: true,
        canEditGender: true,
        birthday: '2019-2-1',
        items: [
            { name: '男', checked: 'true' },
            { name: '女' },
        ],
        nickname: '',
        gender: '',
        country: '',
        email: '',
        mobile: '',
        birthday: '',
        address: ''
    },
    changeBeEdit(ev) {
        const name = ev.currentTarget.dataset.name;
        switch(name) {
            case '编辑':
                wx.showModal({
                    title: '确认编辑信息？',
                    content: '信息自动保存',
                    success: (res) => {
                        if(res.confirm) {
                            this.setData({
                                beEdit: false
                            });
                        }
                    }
                });
                break;
            case '完成':
                this.setData({
                    beEdit: true
                });
                break;
        }
        
    },
    sendRequest(data) {
        wx.request({
            url: 'https://www.tripspend.com/movement/update',
            method: "post",
            data: data,
            header: {
                "Content-Type": "application/json"
            }
        })
    },
    changeInfo(ev) {
        const id = app.globalData.userInfo.id;
        const name = ev.currentTarget.dataset.name;
        const value = ev.detail.value;
        const data = [id, name, value]
        switch(name) {
            case '昵称':
                this.setData({ nickname: value});
                app.globalData.userInfo.nickname = value;
                this.sendRequest(data);
                break;
            case '性别':
                console.log(ev)
                this.setData({ gender: value });
                app.globalData.userInfo.gender = value;
                this.sendRequest(data);
                break;
            case '国籍':
                wx.showModal({
                    title: '⚠️！提示！',
                    content: '暂不支持修改国籍，若真想修改请联系管理员：18682210201'
                })
                break;
            case '邮箱':
                this.setData({ email: value });
                app.globalData.userInfo.email = value;
                this.sendRequest(data);
                break;
            case '手机':
                if (value.length === 11) {
                    this.setData({ mobile: value });
                    app.globalData.userInfo.mobile = value;
                    this.sendRequest(data);
                }
                break;
            case '生日':
                this.setData({ birthday: value });
                app.globalData.userInfo.birthday = value;
                this.sendRequest(data);
                break;
            case '地址':
                const value1 = value[0] + '，' + value[1] + '，' + value[2];
                this.setData({ address: value });
                app.globalData.userInfo.address = value1;
                const data1 = [id, name, value1];
                this.sendRequest(data1);
                break;
        }
    },
    onLoad() { 
        wx.login({
            success: (res) => {
                if (res.code) {
                    wx.request({
                        url: 'https://www.tripspend.com/movement/onLogin',
                        method: "post",
                        data: {
                            code: res.code
                        },
                        header: {
                            "Content-Type": "application/json"
                        },
                        success: (res) => {
                            const userInfo = res.data.userInfo;
                            this.setData({
                                userInfo: userInfo,
                                nickname: userInfo.nickname,
                                gender: userInfo.gender,
                                country: userInfo.country,
                                email: userInfo.email,
                                mobile: userInfo.mobile,
                                birthday: userInfo.birthday,
                                address: userInfo.address
                            });
                            if(userInfo.gender === '女') {
                                this.setData({
                                    items: [
                                        { name: '男' },
                                        { name: '女', checked: 'true' },
                                    ],
                                })
                            } else {
                                this.setData({
                                    items: [
                                        { name: '男', checked: 'true' },
                                        { name: '女' },
                                    ],
                                })
                            }
                        }
                    })
                } else {
                    console.log(res.errMsg);
                }
            }
        })
    },
    onPullDownRefresh() {
        this.onLoad();
    }
})


