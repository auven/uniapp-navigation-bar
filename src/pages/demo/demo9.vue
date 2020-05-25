<template>
  <view class='main-wraper'>
    <view class='nav'>
      <nav-bar
        title='自定义样式'
        background='rgba(0,0,0,0)'
        color='#fff'
        iconTheme='white'
        back
        backFn
        home
        @back="handlerGobackClick"
        @home="handlerGohomeClick"
        extClass='lxy-navbar-extclass'
      />
    </view>
    <view class='main22'>
      <view class='img'>此处为图片背景</view>
      <view class='btn'>按钮</view>
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
