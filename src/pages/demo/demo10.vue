<template>
  <view class="main-wraper">
    <nav-bar
      :background="background"
      backgroundColorTop="rgba(0,0,0,0)"
      back
      backFn
      home
      @back="handlerGobackClick"
      @home="handlerGohomeClick"
      ref="ref"
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
    <view class="main" style="height:5001px;" @click="changeBgColor">
      <view class="p">搜索页面</view>
    </view>
  </view>
</template>

<script>
import NavBar from '@/components/navigation-bar/navigation-bar'
import mixin from './mixin'
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle(func, wait = 300, type = 1) {
  let previous = 0
  let timeout
  return function() {
    let context = this
    let args = arguments
    if (type === 1) {
      let now = Date.now()

      if (now - previous > wait) {
        func.apply(context, args)
        previous = now
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
}
export default {
  components: {
    NavBar
  },
  mixins: [mixin],
  data() {
    return {
      background: 'rgba(255,0,0,0)'
    }
  },
  created() {
    this.fngradient = throttle(e => {
      let opciaty = e.scrollTop / 130
      if (opciaty >= 1) {
        opciaty = 1
      } else if (opciaty <= 0) {
        opciaty = 0
      }
      console.log('opciaty', opciaty)
      this.background = `rgba(255,0,0,${opciaty})`
    }, 22)
  },
  mounted() {
    this.$nextTick(() => {
      // 页面里获取导航栏组件的高度
      console.log('this.$refs.ref', this.$refs.ref)
    })
  },
  onPageScroll(e) {
    this.fngradient(e)
  },
  methods: {
    changeBgColor() {
      this.background = 'rgba(255,0,0,0)'
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
