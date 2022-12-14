<script setup lang="ts">
  import {ref, reactive, onBeforeMount, onMounted } from 'vue'
  import {useStore} from 'vuex'
  const store = useStore()
  onMounted(()=>{

    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      store.replaceState(
        Object.assign(
          {},
          store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
    }
    // 在页面刷新时将Vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(store.state))
    })
  })
  

</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  #app {
    
    
    
    
  }
</style>
