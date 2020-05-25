<template>
  <view class="main-wraper">
    <nav-bar
      background="#000000"
      color="#fff"
      iconTheme="white"
      backFn
      autoSetNbc
      @back="handlerGobackClick"
      @home="handlerGohomeClick"
    >
      <view slot="left" class="location">
        <view class="con">上海</view>
        <view class="icon" />
      </view>
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
      <view class="p active" @click="onClick">
        点击跳转自定义左侧栏目带自定义搜索框
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
    },
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
