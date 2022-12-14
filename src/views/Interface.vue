<template lang="">
  <div class="Interface">
    <top-nav></top-nav>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  import TopNav from '/src/components/TopNav.vue'

</script>
<style scoped lang="scss">
  .Interface{
    height: 100vh;
    width: 100vw;
    background: #000;
  }
</style>