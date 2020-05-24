<template>
  <view class="main-wraper">
    <nav-bar
      background="#fff"
      back
      home
      backFn
      @back="handlerGobackClick"
      @home="handlerGohomeClick"
    >
      <view slot="center" class="lxy-nav-bar-search">
        <view class="lxy-nav-bar-search__icon" />
        <view class="lxy-nav-bar-search__input">
          <input
            autoFocus
            bindconfirm="confirmSearch"
            bindinput="search"
            class="srch-ipt"
            confirmType="search"
            placeholder="搜索内容"
            placeholderclassName="ipt-placeholder"
            type="text"
            value=""
          />
        </view>
      </view>
    </nav-bar>
    <view class="main" style="height:500px;">
      <view class="p">搜索页面</view>
    </view>
  </view>
</template>

<script>
import NavBar from '@/components/navigation-bar'
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
