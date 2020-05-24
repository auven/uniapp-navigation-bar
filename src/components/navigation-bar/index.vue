<template>
  <view class="lxy-nav-bar" :class="[extClass]" :style="navBarContainerStyle">
    <view
      class="lxy-nav-bar__placeholder"
      style="visibility: hidden;"
      :style="{ 'height': navBarFullHeight }"
    ></view>
    <view
      class="lxy-nav-bar__inner"
      :class="[systemInfo.ios ? 'ios' : 'android']"
      :style="navBarInnerStyle"
    >
      <view class="lxy-nav-bar__left" :style="navBarLeftStyle">
        <!-- 支付宝小程序 -->
        <!-- #ifdef MP-ALIPAY -->
        <slot v-if="!back && !home" name="left"></slot>
        <view
          v-else
          class="lxy-nav-bar__buttons mp-alipay"
        >
          <view
            @tap="handleGoHomeClick"
            class="lxy-nav-bar__button lxy-nav-bar__btn_gohome"
            :class="[iconTheme]"
          ></view>
        </view>
        <!-- #endif -->
        <!-- #ifndef MP-ALIPAY -->
        <view
          v-if="back && !home"
          @tap="handleBackClick"
          class="lxy-nav-bar__button lxy-nav-bar__btn_goback"
          :class="[iconTheme]"
        ></view>
        <view
          v-if="!back && home"
          @tap="handleGoHomeClick"
          class="lxy-nav-bar__button lxy-nav-bar__btn_gohome"
          :class="[iconTheme]"
        ></view>
        <view
          v-else-if="back && home"
          class="lxy-nav-bar__buttons"
          :class="[systemInfo.ios ? 'ios' : 'android']"
        >
          <view
            @tap="handleBackClick"
            class="lxy-nav-bar__button lxy-nav-bar__btn_goback"
            :class="[iconTheme]"
          ></view>
          <view
            @tap="handleGoHomeClick"
            class="lxy-nav-bar__button lxy-nav-bar__btn_gohome"
            :class="[iconTheme]"
          ></view>
        </view>
        <slot v-else name="left"></slot>
        <!-- #endif -->
      </view>
      <view class="lxy-nav-bar__center">
        <text v-if="title" class="lxy-nav-bar__center-title">{{ title }}</text>
        <view
          v-else-if="searchBar"
          class="lxy-nav-bar-search"
          :style="{ height: systemInfo.capsulePosition.height + 'px' }"
          @tap="handleSearchClick"
        >
          <view class="lxy-nav-bar-search__icon" />
          <view class="lxy-nav-bar-search__input">{{ searchText }}</view>
        </view>
        <slot v-else name="center"></slot>
      </view>
      <view class="lxy-nav-bar__right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
// rgba 转 16 进制颜色
function hexify(color) {
  color = color.toLowerCase()
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
    // 如果已经是16进制颜色了，则返回
    return color
  }
  var values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',');
  var a = parseFloat(values[3] || 1),
      r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
      g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
      b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
  return "#" +
    ("0" + r.toString(16)).slice(-2) +
    ("0" + g.toString(16)).slice(-2) +
    ("0" + b.toString(16)).slice(-2);
}
function getSystemInfo() {
  if (uni.globalSystemInfo && !uni.globalSystemInfo.ios) {
    return uni.globalSystemInfo
  } else {
    let systemInfo = uni.getSystemInfoSync() || {
      model: '',
      system: ''
    }
    let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1)
    let rect
    try {
      rect = uni.getMenuButtonBoundingClientRect
        ? uni.getMenuButtonBoundingClientRect()
        : null
      if (rect === null) {
        throw 'getMenuButtonBoundingClientRect error'
      }
      // 取值为0的情况  有可能width不为0 top为0的情况
      if (!rect.width || !rect.top || !rect.left || !rect.height) {
        throw 'getMenuButtonBoundingClientRect error'
      }
    } catch (error) {
      let gap = '' //胶囊按钮上下间距 使导航内容居中
      let width = 96 //胶囊的宽度
      if (systemInfo.platform === 'android') {
        gap = 8
        width = 96
      } else if (systemInfo.platform === 'devtools') {
        if (ios) {
          gap = 5.5 //开发工具中ios手机
        } else {
          gap = 7.5 //开发工具中android和其他手机
        }
      } else {
        gap = 4
        width = 88
      }
      if (!systemInfo.statusBarHeight) {
        // 开启wifi的情况下修复statusBarHeight值获取不到
        systemInfo.statusBarHeight =
          systemInfo.screenHeight - systemInfo.windowHeight - 20
      }
      rect = {
        // 获取不到胶囊信息就自定义重置一个
        bottom: systemInfo.statusBarHeight + gap + 32,
        height: 32,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        top: systemInfo.statusBarHeight + gap,
        width: width
      }
      console.log('error', error)
      console.log('rect', rect)
    }

    let navBarHeight = ''
    if (!systemInfo.statusBarHeight) {
      // 开启wifi和打电话下
      systemInfo.statusBarHeight =
        systemInfo.screenHeight - systemInfo.windowHeight - 20
      navBarHeight = (function() {
        let gap = rect.top - systemInfo.statusBarHeight
        return 2 * gap + rect.height
      })()

      systemInfo.statusBarHeight = 0
      systemInfo.navBarExtendHeight = 0 //下方扩展4像素高度 防止下方边距太小
    } else {
      navBarHeight = (function() {
        let gap = rect.top - systemInfo.statusBarHeight
        return 2 * gap + rect.height
      })()
      if (ios) {
        systemInfo.navBarExtendHeight = 4 //下方扩展4像素高度 防止下方边距太小
      } else {
        systemInfo.navBarExtendHeight = 0
      }
    }

    if (systemInfo.titleBarHeight) {
      // 支付宝小程序可以获取到状态栏高度
      systemInfo.navBarHeight = systemInfo.titleBarHeight
    } else if (systemInfo.navigationBarHeight) {
      // 百度小程序
      systemInfo.navBarHeight = systemInfo.navigationBarHeight
    } else {
      systemInfo.navBarHeight = navBarHeight //导航栏高度不包括statusBarHeight
    }
    systemInfo.capsulePosition = rect //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
    systemInfo.ios = ios //是否ios
    uni.globalSystemInfo = systemInfo //将信息保存到全局变量中,后边再用就不用重新异步获取了

    console.log('uni.globalSystemInfo', uni.globalSystemInfo)
    return systemInfo
  }
}
let globalSystemInfo = getSystemInfo()
export default {
  props: {
    extClass: String,
    back: {
      type: Boolean,
      default: false
    },
    home: {
      type: Boolean,
      default: false
    },
    title: String,
    color: {
      type: String,
      default: '#000000'
    },
    background: {
      type: String,
      default: '#ffffff'
    },
    backgroundColorTop: String,
    backFn: {
      type: Boolean,
      default: false
    },
    iconTheme: {
      type: String,
      default: 'black'
    },
    searchBar: {
      type: Boolean,
      default: false
    },
    searchText: {
      type: String,
      default: '点我搜索'
    },
    autoSetNbc: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      systemInfo: {
        capsulePosition: {},
        windowWidth: 0
      },
      delta: 1
    }
  },
  computed: {
    // 导航栏整体高度
    navBarFullHeight() {
      const {
        navBarHeight,
        navBarExtendHeight,
        statusBarHeight
      } = this.systemInfo
      return `${navBarHeight + navBarExtendHeight + statusBarHeight}px`
    },
    // 导航栏容器样式
    navBarContainerStyle() {
      const { background, backgroundColorTop, navBarFullHeight } = this
      const style = [
        `background: ${backgroundColorTop || background}`,
        `height: ${navBarFullHeight}`
      ]
      return style.join(';')
    },
    // 导航栏内容样式
    navBarInnerStyle() {
      const {
        statusBarHeight,
        capsulePosition,
        navBarExtendHeight,
        windowWidth
      } = this.systemInfo
      const { color, background, navBarFullHeight } = this
      const leftWidth = windowWidth - capsulePosition.left //胶囊按钮左侧到屏幕右侧的边距
      const navigationbarinnerStyle = [
        `color:${color}`,
        `background:${background}`,
        `height:${navBarFullHeight}`,
        `padding-top:${statusBarHeight}px`,
        `padding-right:${leftWidth}px`,
        `padding-bottom:${navBarExtendHeight}px`
      ]
      return navigationbarinnerStyle.join(';')
    },
    // 导航栏左边样式
    navBarLeftStyle() {
      const { capsulePosition, windowWidth } = this.systemInfo
      const { back, home, title } = this
      let rightDistance = windowWidth - capsulePosition.right // 胶囊按钮右侧到屏幕右侧的边距
      let style = []
      if ((back && !home) || (!back && home)) {
        // #ifndef MP-ALIPAY
        style = [
          `width:${capsulePosition.width}px`,
          `height:${capsulePosition.height}px`,
          `margin-left:0px`,
          `margin-right:${rightDistance}px`
        ]
        // #endif
        // #ifdef MP-ALIPAY
        style = [
          `width:${capsulePosition.width}px`,
          `height:${capsulePosition.height}px`,
          `margin-left:${rightDistance}px`
        ]
        // #endif
      } else if ((back && home) || title) {
        style = [
          `width:${capsulePosition.width}px`,
          `height:${capsulePosition.height}px`,
          `margin-left:${rightDistance}px`
        ]
      } else {
        style = [`width:auto`, `margin-left:0px`]
      }
      return style.join(';')
    }
  },
  created() {
    this.systemInfo = globalSystemInfo
  },
  mounted() {
    if (this.autoSetNbc) {
      // 自动设置状态栏颜色
      console.log('自动设置状态栏颜色')
      this.setNavigationBarColor()
    }
  },
  methods: {
    // 动态设置导航栏颜色
    setNavigationBarColor() {
      const hexColor = hexify(this.backgroundColorTop || this.background)
      console.log({
        frontColor: this.iconTheme === 'black' ? '#000000' : '#ffffff',
        backgroundColor: this.iconTheme === 'white' ? (hexColor !== '#ffffff' ? hexColor : '#000000') : '#ffffff',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      uni.setNavigationBarColor({
        frontColor: this.iconTheme === 'black' ? '#000000' : '#ffffff',
        // #ifndef MP-QQ
        backgroundColor: this.iconTheme === 'white' ? (hexColor !== '#ffffff' ? hexColor : '#000000') : '#ffffff', // 头条小程序下，安卓机胶囊颜色没办法改变，不管 backgroundColor 设置为什么值，都没办法改变；但是在页面配置那里去设置 "navigationBarTextStyle": "white" 就可以。
        // #endif
        // #ifdef MP-QQ
        // eslint-disable-next-line no-dupe-keys
        backgroundColor: 'rgba(0,0,0,0)', // qq小程序需要这样设置为透明，不然会有一层遮罩颜色盖在自定义导航栏上面。微信小程序采用这种或者上面那种都是可以的，其他小程序则不能采用这种，会提示颜色值不合法
        // #endif
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
    },
    handleBackClick() {
      if (this.backFn) {
        this.$emit('back')
      } else {
        // eslint-disable-next-line no-undef
        const pages = getCurrentPages()
        if (pages.length >= 2) {
          uni.navigateBack({
            delta: this.delta
          })
        }
      }
    },
    handleGoHomeClick() {
      this.$emit('home')
    },
    handleSearchClick() {
      this.$emit('search')
    },
    refreshSystemInfo() {
      if (globalSystemInfo.ios) {
        // ios 下打电话和开热点导致导航栏样式错乱，需要刷新样式
        console.log('ios 下打电话和开热点导致导航栏样式错乱ios，需要刷新样式')
        globalSystemInfo = getSystemInfo()
        this.systemInfo = globalSystemInfo
      }
    }
  }
}
</script>

<style lang="scss">
.lxy-nav-bar {
  view,
  text,
  scroll-view,
  input,
  button,
  image,
  cover-view {
    box-sizing: border-box;
  }
  --nav-bar-right: 97px; /* 10+87 */
  --nav-bar-extend-height: 4px;
  --nav-bar-full-height: 68px;
  --nav-bar-goback-icon: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E  %3Cpath fill-opacity='.9' fill-rule='evenodd' d='M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5 10 4.563 2.682 12 10 19.438z'/%3E%3C/svg%3E");
  --nav-bar-goback-icon-white: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E  %3Cpath fill-opacity='.9' fill-rule='evenodd' d='M10 19.438L8.955 20.5l-7.666-7.79a1.02 1.02 0 0 1 0-1.42L8.955 3.5 10 4.563 2.682 12 10 19.438z' fill='%23ffffff'/%3E%3C/svg%3E");
  /* #ifndef MP-ALIPAY */
  --nav-bar-gohome-icon: url("data:image/svg+xml,%3Csvg t='1565752242401' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='4326' width='48' height='48'%3E%3Cpath d='M931.148 451.25L591.505 97.654c-21.106-21.953-49.313-34.034-79.551-34.034-30.235 0-58.448 12.081-79.554 34.034L92.76 451.25c-35.049 36.498-30.536 68.044-24.742 81.222 4.13 9.35 18.07 35.05 58.231 35.05h49.78v272.016c0 61.756 44.342 119.906 107.357 119.906h144.587v-287.87c0-30.866-4.675-48.062 26.848-48.062h114.268c31.52 0 26.845 17.196 26.845 48.061v287.872h144.588c63.013 0 107.358-58.15 107.358-119.906V567.523h49.782c40.16 0 54.1-25.7 58.229-35.05 5.793-13.18 10.306-44.726-24.743-81.224z m-33.486 60.28h-105.77v328.007c0 30.865-19.877 63.917-51.37 63.917h-88.6V671.572c0-61.761-19.79-104.05-82.832-104.05H454.821c-63.045 0-82.836 42.289-82.836 104.05v231.883h-88.599c-31.495 0-51.37-33.052-51.37-63.917V511.529H126.25c-0.984 0-1.888-3.852-2.708-3.907 1.94-3.388 5.276-11.975 10.825-17.743l339.671-353.35c10.142-10.578 24.467-17.057 38.353-16.924 13.888-0.133 27.342 6.346 37.483 16.923L889.54 489.88c5.549 5.768 8.885 14.355 10.825 17.743-0.818 0.055-1.72 3.907-2.704 3.907z' fill='%23000000' p-id='4327'%3E%3C/path%3E%3C/svg%3E");
  --nav-bar-gohome-icon-white: url("data:image/svg+xml,%3Csvg t='1565752242401' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='4326' width='48' height='48'%3E%3Cpath d='M931.148 451.25L591.505 97.654c-21.106-21.953-49.313-34.034-79.551-34.034-30.235 0-58.448 12.081-79.554 34.034L92.76 451.25c-35.049 36.498-30.536 68.044-24.742 81.222 4.13 9.35 18.07 35.05 58.231 35.05h49.78v272.016c0 61.756 44.342 119.906 107.357 119.906h144.587v-287.87c0-30.866-4.675-48.062 26.848-48.062h114.268c31.52 0 26.845 17.196 26.845 48.061v287.872h144.588c63.013 0 107.358-58.15 107.358-119.906V567.523h49.782c40.16 0 54.1-25.7 58.229-35.05 5.793-13.18 10.306-44.726-24.743-81.224z m-33.486 60.28h-105.77v328.007c0 30.865-19.877 63.917-51.37 63.917h-88.6V671.572c0-61.761-19.79-104.05-82.832-104.05H454.821c-63.045 0-82.836 42.289-82.836 104.05v231.883h-88.599c-31.495 0-51.37-33.052-51.37-63.917V511.529H126.25c-0.984 0-1.888-3.852-2.708-3.907 1.94-3.388 5.276-11.975 10.825-17.743l339.671-353.35c10.142-10.578 24.467-17.057 38.353-16.924 13.888-0.133 27.342 6.346 37.483 16.923L889.54 489.88c5.549 5.768 8.885 14.355 10.825 17.743-0.818 0.055-1.72 3.907-2.704 3.907z' fill='%23ffffff' p-id='4327'%3E%3C/path%3E%3C/svg%3E");
  /* #endif */
  /* #ifdef MP-ALIPAY */
  --nav-bar-gohome-icon: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M513.512 140.75l372.296 340.313c-18.958 2.326-36.753 10.118-50.942 22.563l-.233.233-.232.232c-13.724 12.212-30.007 33.729-30.007 67.574V888.6H668.083V753.917c0-50.593-41.87-91.65-93.394-91.65h-122.82c-51.523 0-93.393 41.173-93.393 91.65v134.566H223.793V570.967c0-46.522-35.473-85.136-81.298-90.951L513.512 140.75m0-75.367c-13.026 0-26.053 4.42-35.357 13.143L49.799 470.13c-15.352 13.142-19.772 32.914-11.514 50.942 8.258 17.562 25.82 27.913 46.057 27.913H130.4c13.143 0 23.61 9.886 23.61 21.866v341.242c0 25.239 22.448 46.057 49.896 46.057h174.46c27.447 0 49.895-20.818 49.895-46.057V753.917c0-12.096 10.467-21.866 23.61-21.866h122.819c13.143 0 23.61 9.886 23.61 21.866V912.21c0 25.238 22.447 46.057 50.477 46.057h174.46c28.03 0 51.058-20.819 51.058-46.057V571.432c0-6.513 1.628-10.932 6.63-15.352 4.419-3.838 10.467-6.048 16.98-6.048h43.266c20.353 0 37.8-10.933 46.057-27.913 9.305-18.028 4.885-38.381-9.304-51.524L548.985 78.527c-9.304-8.723-22.447-13.143-35.473-13.143z' fill='%23108EE9'/%3E%3C/svg%3E");
  --nav-bar-gohome-icon-white: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M513.512 140.75l372.296 340.313c-18.958 2.326-36.753 10.118-50.942 22.563l-.233.233-.232.232c-13.724 12.212-30.007 33.729-30.007 67.574V888.6H668.083V753.917c0-50.593-41.87-91.65-93.394-91.65h-122.82c-51.523 0-93.393 41.173-93.393 91.65v134.566H223.793V570.967c0-46.522-35.473-85.136-81.298-90.951L513.512 140.75m0-75.367c-13.026 0-26.053 4.42-35.357 13.143L49.799 470.13c-15.352 13.142-19.772 32.914-11.514 50.942 8.258 17.562 25.82 27.913 46.057 27.913H130.4c13.143 0 23.61 9.886 23.61 21.866v341.242c0 25.239 22.448 46.057 49.896 46.057h174.46c27.447 0 49.895-20.818 49.895-46.057V753.917c0-12.096 10.467-21.866 23.61-21.866h122.819c13.143 0 23.61 9.886 23.61 21.866V912.21c0 25.238 22.447 46.057 50.477 46.057h174.46c28.03 0 51.058-20.819 51.058-46.057V571.432c0-6.513 1.628-10.932 6.63-15.352 4.419-3.838 10.467-6.048 16.98-6.048h43.266c20.353 0 37.8-10.933 46.057-27.913 9.305-18.028 4.885-38.381-9.304-51.524L548.985 78.527c-9.304-8.723-22.447-13.143-35.473-13.143z' fill='%23fff'/%3E%3C/svg%3E");
  /* #endif */
  .ios {
    --nav-bar-right: 97px; /* 10+87 */
    --nav-bar-extend-height: 4px;
    box-sizing: border-box;
  }
  .android {
    --nav-bar-right: 96px; /* 10+87 */
    --nav-bar-extend-height: 4px;
    box-sizing: border-box;
  }
  .devtools {
    --nav-bar-right: 88px; /* 10+87 */
    --nav-bar-extend-height: 4px;
    box-sizing: border-box;
  }
  .lxy-nav-bar__placeholder {
    height: var(--nav-bar-full-height);
    background: #f8f8f8;
    position: relative;
    z-index: 50;
    visibility: hidden;
  }
  .lxy-nav-bar__inner {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5001;
    height: var(--nav-bar-full-height);
    display: flex;
    align-items: center;
    padding-right: var(--nav-bar-right);
    width: 100%;
    padding-top: 20px;
    padding-bottom: 4px;
    .placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
    .lxy-nav-bar__left {
      position: relative;
      width: var(--nav-bar-right);
      height: 32px;
      /*  padding-left: 10PX; */
      margin-left: 10px;
      display: flex;
      align-items: center;
      .lxy-nav-bar__buttons {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        border-radius: 16px;
        border: 1rpx solid rgba(204, 204, 204, 0.6);
        position: relative;
        box-sizing: border-box;
        &.android {
          border: 1rpx solid rgba(234, 234, 234, 0.6);
          &::after {
            background: rgba(234, 234, 234, 0.6);
          }
        }
        &::after {
          position: absolute;
          content: '';
          width: 1rpx;
          height: 18.4px;
          background: rgba(204, 204, 204, 0.6);
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        &.mp-alipay {
          border: none;
          justify-content: center;
          &::after {
            display: none;
          }
        }
      }
      .lxy-nav-bar__button {
        width: 50%;
        height: 100%;
        display: flex;
        font-size: 12px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 1em 2em;
      }
      .lxy-nav-bar__btn_goback:active,
      .lxy-nav-bar__btn_gohome:active {
        opacity: 0.5;
      }
      .lxy-nav-bar__btn_goback {
        background-image: var(--nav-bar-goback-icon);
        background-size: 22px 22px;
        &.white {
          background-image: var(--nav-bar-goback-icon-white);
        }
      }
      .lxy-nav-bar__btn_gohome {
        background-image: var(--nav-bar-gohome-icon);
        background-size: 22px 22px;
        &.white {
          background-image: var(--nav-bar-gohome-icon-white);
        }
      }
    }
    .lxy-nav-bar__center {
      font-size: 17px;
      text-align: center;
      position: relative;
      flex: 1;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 10px;
      overflow: hidden;
      text {
        // margin-top: -2px;
      }
      .lxy-nav-bar__center-title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .lxy-nav-bar-search {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 32px;
        border-radius: 16px;
        position: relative;
        background: #f6f6f6;
        .lxy-nav-bar-search__icon {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url("data:image/svg+xml,%3Csvg t='1565691512239' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1240' width='48' height='48'%3E%3Cpath d='M819.2 798.254545L674.909091 653.963636c46.545455-48.872727 74.472727-114.036364 74.472727-186.181818 0-151.272727-123.345455-274.618182-274.618182-274.618182-151.272727 0-274.618182 123.345455-274.618181 274.618182 0 151.272727 123.345455 274.618182 274.618181 274.618182 65.163636 0 128-23.272727 174.545455-62.836364l144.290909 144.290909c2.327273 2.327273 6.981818 4.654545 11.636364 4.654546s9.309091-2.327273 11.636363-4.654546c6.981818-6.981818 6.981818-18.618182 2.327273-25.6zM235.054545 467.781818c0-132.654545 107.054545-239.709091 239.709091-239.709091 132.654545 0 239.709091 107.054545 239.709091 239.709091 0 132.654545-107.054545 239.709091-239.709091 239.709091-132.654545 0-239.709091-107.054545-239.709091-239.709091z' fill='%23999999' p-id='1241'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-size: cover;
        }
        .lxy-nav-bar-search__input {
          height: 100%;
          display: flex;
          align-items: center;
          color: #999;
          font-size: 15px;
          line-height: 15px;
          input {
            background: transparent;
          }
        }
      }
    }
    .lxy-nav-bar__loading {
      font-size: 0;
      margin-right: 10px;
      .lxy-loading {
        margin-left: 0;
      }
    }
    .lxy-nav-bar__right {
      margin-right: 10px;
    }
  }
}
</style>
