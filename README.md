# uniapp-navigation-bar

> [lingxiaoyi/navigation-bar](https://github.com/lingxiaoyi/navigation-bar) 的 [uniapp](https://uniapp.dcloud.io/) 版本。

`uniapp-navigation-bar` 是小程序的顶部导航组件，当页面配置 `navigationStyle` 设置为 `custom` 的时候可以使用此组件替代原生导航栏。

## 不同平台小程序自定义导航栏设置

### 微信小程序、头条小程序、百度小程序、QQ小程序

第一步，隐藏导航栏 `navigationStyle: custom`。

第二步，导航栏标题颜色及状态栏前景颜色 `navigationBarTextStyle: black/white` ，或者是调用 `uni.setNavigationBarColor({ frontColor: 'xxx', backgroundColor: 'xxx' })`。

**注意**
- QQ小程序 `setNavigationBarColor` 设置 `backgroundColor` 会导致状态栏有颜色，遮罩了自定义状态栏，所以需要将 `backgroundColor` 设置为 `rgba(0,0,0,0)` ，即透明颜色。当然直接配置 `navigationBarTextStyle: black/white` 是最好的。
- 头条小程序下， `setNavigationBarColor` 没办法改变胶囊的颜色。直接配置 `navigationBarTextStyle: black/white` 是可以的。
- 百度小程序由于缺少 appid ，没办法在真机跑测，目前在开发者工具发现 svg 背景图按钮没办法显示出来。

### 支付宝小程序

第一步，隐藏导航栏 `"transparentTitle": "always", "titlePenetrate": "YES"`。

第二步，导航栏标题颜色及状态栏前景颜色 `titleBarColor: '#ffffff'` 。当 `titleBarColor` 为 `#ffffff` 时，按钮是蓝色的，文字是黑色的；当 `titleBarColor` 非 `#ffffff` 时，按钮是白色的，文字是白色的。同样的也可以调用 `uni.setNavigationBarColor({ frontColor: 'xxx', backgroundColor: 'xxx' })` 进行设置。

**注意**
- 支付宝小程序是没办法去除左边返回按钮的
- 没有 `getMenuButtonBoundingClientRect` 这个方法，获取不到胶囊的位置
- `uni.hideAllFavoriteMenu()` 可以隐藏所有页面右上角的收藏按钮

## 使用说明

### 在项目中使用

#### 安装

```sh
npm i uniapp-navigation-bar -S
# 组件中使用到了 `scss` ，所以需要安装 `node-sass` 和 `sass-loader`，已安装可跳过
npm i node-sass sass-loader -D
```

#### 引用

```vue
<template>
  <div>
    <nav-bar title="自定义导航栏" ref="navBar" />
  </div>
</template>

<script>
import NavBar from 'uniapp-navigation-bar/src/navigation-bar'
export default {
  components: {
    NavBar
  }
}
</script>
```

### 属性列表

| 属性               | 类型         | 默认值     | 必填 | 说明                                                                                                                       |
| ------------------ | ------------ | ---------- | ---- | -------------------------------------------------------------------------------------------------------------------------- |
| ext-class          | string       |            | 否   | 添加在组件内部结构的 class，可用于修改组件内部的样式                                                                       |
| title              | string       |            | 否   | 导航标题，如果不提供，则名为 renderCenter 的 slot 有效                                                                     |
| background         | string       | #ffffff    | 否   | 导航背景色                                                                                                                 |
| backgroundColorTop | string       | background | 否   | 导航下拉背景色,默认取 background 的颜色,不理解[见 issue 问题](https://github.com/lingxiaoyi/Taro-navigation-bar/issues/15) |
| color              | string       | #000000    | 否   | 导航字体颜色                                                                                                               |
| iconTheme          | string       | black      | 否   | 主题图标和字体颜色,当背景色为深色时,可以设置'white'                                                                        |
| back               | boolean      | false      | 否   | 是否显示返回按钮，默认点击按钮会执行 @back 事件，如果为 false，则名为 left 的 slot 有效                            |
| home               | boolean      | false      | 否   | 是否显示 home 按钮，执行方法自定义,或者看例子                                                                              |
| searchBar          | boolean      | false      | 否   | 是否显示搜索框，默认点击按钮会执行 @search 事件，如果为 false，则名为 center 的 slot 有效                                |
| searchText         | string       | 点我搜索   | 否   | 搜索框文字                                                                                                                 |
| backFn             | boolean      | false     | 否   | 是否自定义返回按钮事件，即是否执行 @back 事件                    |
| autoSetNbc         | boolean      | false     | 否   | 是否根据 `iconTheme` 自动设置导航栏标题颜色及状态栏前景颜色，当为 `true` 的时候，则会调用 `setNavigationBarColor` 进行设置       |

### Slot

| 名称         | 描述                                                                  |
| ------------ | --------------------------------------------------------------------- |
| left   | 左侧 slot，在 back 按钮位置显示，当 back 为 false 的时候有效          |
| center | 标题 slot，在标题位置显示，当 searchBar 为 false title 为空的时候有效 |
| right  | 在导航的右侧显示                                                      |

### 事件

| 事件               | 说明                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| @home             | 在 home 为 true 时，点击 home 按钮触发此事件                                                                               |
| @back             | 在 back 为 true 时，点击 back 按钮触发此事件，detail 包含 delta                                                            |
| @search           | 在 searchBar 为 true 时，点击 search 按钮触发此事件                                                                        |

### iPhone 手机打电话和开热点导致导航栏样式错乱

由于 `uni-app` 组件里不支持 `onShow` 事件，所以要解决**iPhone 手机打电话和开热点导致导航栏样式错乱**的问题，需要在组件使用的页面的 `onShow` 方法里去调用 `NavBar` 组件的 `refreshSystemInfo` 方法。

pageA.vue
```vue
<template>
  <div>
    <nav-bar ref="navBar" />
  </div>
</template>

<script>
export default {
  ...
  onShow() {
    if (this.$refs.navBar) {
      this.$refs.navBar.refreshSystemInfo && this.$refs.navBar.refreshSystemInfo()
    }
  },
  ...
}
</script>
```
