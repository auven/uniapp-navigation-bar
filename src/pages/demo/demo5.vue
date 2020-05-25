<template>
  <view class='main-wraper'>
    <nav-bar
      title='深色背景详情页'
      background='#000000'
      color='#fff'
      iconTheme='white'
      back
      backFn
      home
      autoSetNbc
      @back="handlerGobackClick"
      @home="handlerGohomeClick"
    />
    <view class='main'>
      <view class='p'>深色背景详情页包括返回和home按钮</view>
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
