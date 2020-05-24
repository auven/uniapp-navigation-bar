<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    // #ifdef MP-ALIPAY
    uni.hideAllFavoriteMenu()
    // #endif
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
/*每个页面公共css */
</style>

<style lang="scss">
.main {
  /* prettier-ignore */
  height: 800PX;
  background: #eeeeee;
  padding-top: 100rpx;
  font-size: 30rpx;
  line-height: 60rpx;
  /* prettier-ignore */
  padding: 30px;
  text-align: center;
  .p.active {
    color: rgb(8, 122, 216);
    text-align: left;
  }
  .p.active:active {
    color: rgb(3, 151, 250);
  }
}
</style>
