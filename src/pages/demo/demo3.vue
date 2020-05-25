<template>
  <view class='main-wraper'>
    <nav-bar
      title='详情页详情页详情页详情页详情页详情页详情页详情页详情页详情页'
      background='#fff'
      back
      backFn
      @back="handlerGobackClick"
    />
    <view class='main'>
      <view class='p'>详情页</view>
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
  mixins: [mixin]
}
</script>

<style lang="scss">
@import './index.scss';
</style>
