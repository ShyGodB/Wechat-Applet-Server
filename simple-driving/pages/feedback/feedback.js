const app = getApp();
Page({
    data: {
        
        title: '',
        msg: '',
        mobile: '',
        email: '',
        qq: '',

        modalName: ''

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
        const title = this.data.title;
        const msg = this.data.msg;
        const mobile = this.data.mobile;
        const email = this.data.email;
        const qq = this.data.qq;
        const feedback = [title, msg, mobile, email, qq];
        wx.request({
            url: 'https://www.tripspend.com:8888/user/feedback',
            method: "post",
            data: feedback,
            header: {
                "Content-Type": "application/json"
            },
        })
    },
    onLoad() {
        
    }
})