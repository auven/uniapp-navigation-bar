<template>
  <view class='main-wraper'>
    <nav-bar
      title='自定义样式'
      background='#fff'
      back
      backFn
      home
      @back="handlerGobackClick"
      @home="handlerGohomeClick"
      extClass='lxy-navbar-extclass'
    />
    <view class='main'>
      <view class='p'>自定义样式和修改默认图标</view>
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
