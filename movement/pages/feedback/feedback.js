const app = getApp();

Page({
    data: {
        qq: '',
        msg: '',
        type: 'UI设计',
        email: '',
        mobile: '',

        checkEmail: 0,
        checkMobile: 0,

        mobileData: ["+86", "+80", "+84", "+87"],
        mobileIndex: 0,

        typeData: ['UI设计', '程序Bug', '数据有误', '网络差', '开发建议', '其它'],
        typeIndex: 0
    },
    changeInfo(ev) {
        const name = ev.currentTarget.dataset.name;
        switch(name) {
            case '类型':
                const n = Number(ev.detail.value);
                this.setData({
                    type: this.data.typeData[n]
                })
                break;
            case 'msg':
                this.setData({
                    msg: ev.detail.value
                })
                break;
            case 'qq':
                this.setData({
                    qq: ev.detail.value
                })
                break;
            case 'email':
                const value = ev.detail.value
                this.setData({
                    email: value
                })
                this.checkEmail(value)
                break;
            case '手机':
                const value2 = ev.detail.value
                this.setData({
                    mobile: value2
                })
                this.checkMobile(value2)
                break;   
        }
        
    },
    submit() {
        let user_id;
        if(app.globalData.isUser === true) {
            user_id = app.globalData.userInfo.id;
        } else {
            user_id = '-1';
        }
        const type = this.data.type;
        const msg = this.data.msg;
        const time = new Date().toLocaleDateString();
        const qq = this.data.qq;
        const email = this.data.email;
        const mobile = this.data.mobile;

        const feedback = [user_id, type, msg, time, qq, email, mobile];

        if (mobile.length !== 11 || type.length === 0 || msg.length === 0) {
            wx.showModal({
                title: '⚠️ 提示！',
                content: '亲，请输入完整信息！',
            })
        } else {
            wx.request({
                url: 'https://www.tripspend.com/movement/addFeedback',
                method: "post",
                data: feedback,
                header: {
                    "Content-Type": "application/json"
                },
                success:() => {
                    wx.showToast({
                        title: '反馈成功提交',
                        icon: 'success',
                        duration: 1000,
                    });
                    this.setData({
                        type: 'UI设计',
                        msg: '',
                        mobile: '',
                        email: '',
                        qq: '',
                    })
                },
            })
        }   
    },
    checkMobile(value) {
        const reg = /^1[3|4|5|7|8][0-9]{9}$/g;
        if (!(reg.test(value))) {
            this.setData({
                checkMobile: 1
            })
        } else {
            this.setData({
                checkMobile: 2
            })
        }
    },
    checkEmail(value) {
        const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g;
        if (!(reg.test(value))) {
            this.setData({
                checkEmail: 1
            })
        } else {
            this.setData({
                checkEmail: 2
            })
        }
    },
})