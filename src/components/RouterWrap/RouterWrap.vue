<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive>
      <router-view :key="key" />
    </keep-alive>
  </transition>
</template>

<script>
    export default {
        name: "router-wrap"
    }
</script>

<style scoped>

</style>
