export default {
  methods: {
    handlerGobackClick() {
      uni.showModal({
        title: '你点击了返回',
        content: '是否确认放回',
        success: e => {
          if (e.confirm) {
            // eslint-disable-next-line no-undef
            const pages = getCurrentPages()
            if (pages.length >= 2) {
              uni.navigateBack({
                delta: 1
              })
            } else {
              uni.reLaunch({
                url: '/pages/index/index'
              })
            }
          }
        }
      })
    },
    handlerGohomeClick() {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }
  }
}
