const app = getApp();
const sliderWidth = 108; // 需要设置slider的宽度，用于计算中间位置

Page({
    data: {
        tabs: ["图表", "列表"],
        activeIndex: 1,
        sliderOffset: 1,
        sliderLeft: 1,
        data: [],
    },
    mainTabSelect(ev) {
        this.setData({
            mainTabCur: ev.currentTarget.dataset.id,
            mainScrollLeft: (ev.currentTarget.dataset.id - 1) * 60
        })
    },
    listData(id) {
        wx.request({
            url: 'https://www.tripspend.com/movement/listData',
            method: "post",
            data: {
                id: id
            },
            header: {
                "Content-Type": "application/json"
            },
            success: (res) => {
                this.setData({
                    data: res.data
                })
            }
        })
    },
    onLoad() {
        // const id = app.globalData.userInfo.id;
        const id = 1;
        this.listData(id);
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
                console.log(sliderWidth)
            }
        });
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
})



    