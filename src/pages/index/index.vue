<template>
  <view class="main-wrapper">
    <nav-bar ref="navBar" background='#fff' searchBar @search="onSearch" />
    <view class="main">
      <navigator url="/pages/demo/demo1">
        <view class="p active">例子1: 点击跳转搜索页</view>
      </navigator>
      <navigator url="/pages/demo/demo2">
        <view class="p active">例子2: 点击跳转左侧有返回 home的详情页面</view>
      </navigator>
      <navigator url="/pages/demo/demo3">
        <view class="p active">例子3: 点击跳转详情页</view>
      </navigator>
      <navigator url="/pages/demo/demo4">
        <view class="p active">例子4: 点击跳转详情页,深背景色,白色主题</view>
      </navigator>
      <navigator url="/pages/demo/demo5">
        <view class="p active">例子5: 点击跳转,深背景色,白色主题有home</view>
      </navigator>
      <navigator url="/pages/demo/demo6">
        <view class="p active">例子6: 点击跳转自定义左侧栏目带自定义搜索框</view>
      </navigator>
      <navigator url="/pages/demo/demo7">
        <view class="p active">例子7: 点击跳转自定义左侧栏目带标题</view>
      </navigator>
      <navigator url="/pages/demo/demo8">
        <view class="p active">例子8: 自定义样式和修改默认图标</view>
      </navigator>
      <navigator url="/pages/demo/demo9">
        <view class="p active">例子9: 导航头部透明,不占据位置显示</view>
      </navigator>
      <navigator url="/pages/demo/demo10">
        <view class="p active">例子10: 导航头部透明,不占据位置显示</view>
      </navigator>
    </view>
  </view>
</template>

<script>
import NavBar from '@/components/navigation-bar/navigation-bar'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      title: 'Hello'
    }
  },
  onLoad() {
  },
  onShow() {
    if (this.$refs.navBar) {
      this.$refs.navBar.refreshSystemInfo && this.$refs.navBar.refreshSystemInfo()
    }
  },
  methods: {
    onSearch() {
      uni.navigateTo({ url: '/pages/demo/demo1' })
    }
  }
}
</script>

<style>
.content {
  text-align: center;
  height: 400upx;
}

.logo {
  height: 200upx;
  width: 200upx;
  margin-top: 200upx;
}

.title {
  font-size: 36upx;
  color: #8f8f94;
}
</style>
