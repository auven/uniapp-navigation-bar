<template>
  <view class="main-wraper">
    <nav-bar
      title="有返回和home"
      background="#fff"
      back
      home
      backFn
      @back="handlerGobackClick"
      @home="handlerGohomeClick"
    />
    <view class="main">
      <view class="p">有返回和home的页面</view>
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
