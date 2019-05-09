const app = getApp()

Page({
    data: {
        updateTime: '',
        gasoline: [],
        isUser: false,
        isNewUser: true,
        
        userInfo: {},
        true: true,
       
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
        this.setData({
            cost: cost
        });
        const obj = {
            price: price,
            num: num,
            cost: cost
        }
        const data = [obj]
        if(this.data.isUser === true) {
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
        } else {
            wx.setStorage({
                key: 'add',
                data: data,
            })
        }
        
    },
    onLoad() {
        this.setData({
            isUser: app.globalData.isUser,
            isNewUser: app.globalData.isNewUser,

            gasoline: app.globalData.gasoline,
            updateTime: app.globalData.updateTime,
            
            isDefaultPrice: true,
            price: app.globalData.gasoline[1].value
        })
    },
    onShow() {
        // 存在用户  用户已经登录
        if (Object.keys(app.globalData.userInfo).length !== 0 && app.globalData.isUser === true) {
            this.setData({
                userInfo: app.globalData.userInfo
            })
        }
        wx.getStorage({
            key: 'add',
            success: function(res) {
                console.log(res.data)
            },
        })
    }
   

});