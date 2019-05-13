/**
 * 自定义modal浮层
 * 使用方法：
 * <modal show="{{showModal}}" height='60%' bindcancel="modalCancel" bindconfirm='modalConfirm'>
     <view>你自己需要展示的内容</view>
  </modal>

  属性说明：
  show： 控制modal显示与隐藏
  height：modal的高度
  bindcancel：点击取消按钮的回调函数
  bindconfirm：点击确定按钮的回调函数

  使用模块：
  场馆 -> 发布 -> 选择使用物品
 */

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        //是否显示modal
        show: {
            type: Boolean,
            value: false
        },
        //modal的高度
        height: {
            type: String,
            value: '80%'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        a: 'a'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        clickMask() {
            // this.setData({show: false})
        },

        cancel() {
            console.log(1111)
            this.setData({ 
                show: false 
            });
            this.triggerEvent('cancel')
        },

        confirm() {
            console.log(2222)
            this.setData({ 
                show: false 
            });
            this.triggerEvent('confirm')
        }
    }
})