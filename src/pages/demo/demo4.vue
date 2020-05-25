<template>
  <view class="main-wraper">
    <nav-bar
      title="深色背景详情页"
      background="#000000"
      color="#fff"
      iconTheme="white"
      back
      backFn
      autoSetNbc
      @back="handlerGobackClick"
    />
    <view class="main">
      <view class="p">深色背景详情页</view>
    </view>
  </view>
</template>

<script>
import NavBar from '@/components/navigation-bar/navigation-bar'
import mixin from './mixin'
export default {
  components: {
    NavBar
  },
  mixins: [mixin],
  methods: {
    handlerGobackClick() {
      // eslint-disable-next-line no-undef
      const pages = getCurrentPages()
      if (pages.length >= 2) {
        uni.navigateBack({
          delta: 1
        })
      } else {
        uni.navigateTo({
          url: '/pages/index/index'
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
