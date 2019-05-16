const app = getApp();

Page({
    data: {
        selected: 'UI设计',
        title: '',
        msg: '',
        mobile: '',
        email: '',
        qq: '',

        show: false,
        selectData: ['UI设计', '程序Bug', '数据', '网络', '开发建议', '其它'],
    },
    showModal(ev) {
        wx.navigateTo({
            url: '/pages/modal/modal',
        })
    },
    changeTitle(ev) {
        this.setData({
            title: ev.detail.value
        });
    },
    changeMsg(ev) {
        this.setData({
            msg: ev.detail.value
        });
    },
    changeMobile(ev) {
        this.setData({
            mobile: ev.detail.value
        });
    },
    changeEmail(ev) {
        this.setData({
            email: ev.detail.value
        });
    },
    changeQQ(ev) {
        this.setData({
            qq: ev.detail.value
        });
    },
    submit() {
        let userId, userName;
        if(app.globalData.isUser === true) {
            userId = app.globalData.userInfo.id;
            userName = app.globalData.userInfo.nickname;
        } else {
            userId = '-1';
            userName = '用户***';
        }
        const type = this.data.selected,
              title = this.data.title,
              msg = this.data.msg,
              mobile = this.data.mobile,
              email = this.data.email,
              qq = this.data.qq;
        const feedback = [userId, userName, type, title, msg, mobile, email, qq];
        if (mobile.length !== 11 || type.length === 0 || msg.length === 0) {
            wx.showModal({
                title: '⚠️ 提示！',
                content: '亲，请输入正确的信息！',
            })
        } else {
            wx.request({
                url: 'https://www.tripspend.com/user/feedback',
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
                        selected: 'UI设计',
                        title: '',
                        msg: '',
                        mobile: '',
                        email: '',
                        qq: '',
                    })
                },
            })
        }   
    },
    selectTap() {
        this.setData({
            show: !this.data.show
        });
    },
    optionTap(ev) {
        this.setData({
            selected: ev.currentTarget.dataset.name,
            show: !this.data.show
        });
    },
    goIndex() {
        wx.switchTab({
            url: '/pages/index/index',
        });
    }
})