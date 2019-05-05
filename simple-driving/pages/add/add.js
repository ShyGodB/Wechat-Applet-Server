const app = getApp()

Page({
    data: {
        updateTime: '',
        gasoline: [],
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

    // 允许用户手动输入汽油单价及汽车的油耗
    beEditedPrice() {
        this.setData({
            editPrice: false
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
        const price = Number(this.data.price);
        const num = Number(this.data.num);
        const cost = (price * num).toFixed(2);
        console.log(price, num, cost)
        this.setData({
            cost: cost
        });
        wx.request({
            url: "https://www.tripspend.com:8888/addGasolineRecord",
            method: "post",
            data: {
                userId: app.globalData.userInfo.id,
                price: price,
                num: num,
                cost: cost
            },
            header: {
                "Content-Type": "application/json"
            },
            success: (res) => {
                // console.log(res.data);
            },
            fail: (err) => {
                console.log(err);
            },
            complete: () => {
                console.log("完成");
            }
        });
    },
    onLoad() {
        this.setData({
            gasoline: app.globalData.gasoline,
            updateTime: app.globalData.updateTime,
            price: app.globalData.gasoline[1].value
        })
    }
   

});