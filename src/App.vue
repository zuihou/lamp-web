<template>
  <div id='app'>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    //TODO 每次刷新页面会加载这个方法？是否能在这里判断 必须要缓存的Token ，用户信息等
  }
}
</script>
