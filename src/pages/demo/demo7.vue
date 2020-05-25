<template>
  <view class="main-wraper">
    <nav-bar
      title="深色背景"
      background="#000000"
      color="#fff"
      autoSetNbc
      iconTheme="white"
    >
      <view slot="left" class="location">
        <view class="con">上海</view>
        <view class="icon" />
      </view>
    </nav-bar>
    <view class="main" style="height:500px;">
      <view class="p active" @click="onClick">
        深色背景详情页
      </view>
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
    onClick() {
      uni.navigateTo({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
