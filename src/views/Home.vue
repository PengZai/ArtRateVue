<template lang="">
  <div class="Home">

    <div class="main">
      <div v-for="(box, index) in boxList" class="box" @click="tapBox(box.url, $event)">
        <div class="cover">
          <img :src="box.cover_url" alt="">
        </div>
        <div class="title">
          <div>{{box.zh_title}}</div>
          <div>{{box.en_title}}</div>
        </div>
      </div>
         
    </div>
    
  </div>
</template>
<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router';
  import {ref, reactive, onBeforeMount, onMounted} from 'vue'
  import { useStore } from 'vuex'

  const store = useStore()

  const router = useRouter()

  const boxList = reactive([
    {
      cover_url:'user.png',
      url:'UserUpload',
      zh_title:'用户上传',
      en_title:'User Upload'
    },

    {
      cover_url:'teacher3.png',
      url:'Gallery',
      zh_title:'画廊',
      en_title:'Gallery'
    },
  ])

  const tapBox = (url, event) => {
    router.push(url)
  }

  onBeforeMount(()=>{
    store.commit({
      type:'setPageStatus', 
      id:0,
    })
  })

</script>
<style scoped lang="scss">
  
  .Home{
    width: 100vw;
    background: #000;

    .main{
      display: flex;
      width: 100%;
      height: 700px;
      align-items: center;
      justify-content: space-around;

      .box{
        width: 300px;
        height: 400px;
        border: 2px solid white;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background:#1f1f1f;
        border-radius: 10px;
        cursor: pointer;

        .cover{
          width: 70%;
          height: 200px;
          border: #B0C4DE 4px solid;
          border-radius: 100%;

          img{
            height: 100%;
            width: 100%;
            background: #fff;
            border-radius: 100%
            
          }

        }

        .title{
          margin-top: 20px;
          width: 70%;
          height: 100px;
          border: 1px solid rgb(156, 155, 155);
          border-radius: 10px;

          div{
            text-align: center;
            color: #fff;
            margin-top: 20px;
            
          }
        }
      }
    }
    
    

  }

</style>