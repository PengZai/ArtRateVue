<template lang="">
  <div class="TopNav">
    <div class="left">
      <div class="logo"><img src="../../public/logo.png" alt=""></div>
    </div>
    <div class="center">
      <div class="nav">

        <div v-for="(item, index) in navList" @click="tapNav(index, item.url, $event)" class="item" :class="{active:store.state.pageStatus.id===index}">
          <div class="text">{{item.zh_name}}</div>
          <div class="text">{{item.en_name}}</div>
        </div>

      </div>
    </div>

    <div class="right">
      <div class="userArea">
        <div class="item">
          <div>username:</div>
          <div class="content">{{store.state.user.username}}</div>
        </div>
        <div class="item">
          <div>permission:</div>
          <div class="content">{{userPermission}}</div>
        </div>
        <div class="item">
          <el-button @click="tapQuit" type="info">Quit</el-button>
        </div>
      </div>
      
    </div>
  </div>
</template>


<script setup lang="ts">
  import {useRoute, useRouter} from 'vue-router'
  import {ref, reactive, onMounted, onBeforeMount, getCurrentInstance} from 'vue'
  import { useStore } from 'vuex'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'

  const app = getCurrentInstance()

  const store = useStore()

  const userPermission = ref('user')

  const navList = reactive([
    {
      id:0,
      zh_name:'首页',
      en_name:'Home',
      url:'Home',
    },
    {
      id:1,
      zh_name:'用户上传',
      en_name:'User Upload',
      url:'UserUpload',
    },
    {
      id:2,
      zh_name:'画廊',
      en_name:'Gallery',
      url:'Gallery',
    },
    /*{
      id:3,
      zh_name:'作品详情',
      en_name:'Product',
      url:'Product',
    },*/
  ])

  const router = useRouter()


  const tapNav = (id, url, event)=>{
    //pageStatus.value = id
    console.log('pageStatus', store.state.pageStatus.id)
    router.push(url)
  }


  onBeforeMount(()=>{

    if(store.state.user.is_superuser === true){
      userPermission.value = 'admin'
    }
    else if(store.state.user.is_staff===true){
      userPermission.value = 'expert'
    }
    else{
      userPermission.value = 'user'
    }

  })
  
  const tapQuit = ()=>{

    let url = app.appContext.config.globalProperties.$server_url + 'art/signout'

    axios({
      url:url,
      data:{},
      method:'post',
      // headers: { "Content-Type": "multipart/form-data" },
      headers:{'Content-Type': 'text/json'}
    }).then((resp)=>{
      ElMessage({
        type: 'success',
        message: resp.data.msg,
      })
      store.commit('logout')
      router.push({
        name:"Login"
      })
    }).catch((error)=>{

    })

    
  }

</script>

<style scoped lang="scss">
  .TopNav{
    height: 100px;
    width: 100vw;
    background: #515151;
    
    display: flex;
    justify-content: space-around;

    .left{
      margin-left: 20px;
      width: 250px;
      height: 100%;
      display:flex;
      justify-content:center;
      align-items:center;

      .logo{
        width: 250px;
        height: 200px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }

    .center{
      width: 1200px;
      height: 100%;
      margin-left: 20px;

      .nav{
        display: flex;
        align-items:center;
        

        height: 100%;
        width: 800px;
      
        
        .item{
          height: 100%;
          width: 120px;
          margin-left: 20px;
          
          display: flex;
          flex-direction: column;
          justify-content: center;
          cursor: pointer;

          .text{
            text-align: center;
            height: 30px;
            width: 100%;
            color: #fff;
            font-size: 20px;
          }
        }

        .active{
          box-sizing: border-box;
          border-bottom: #fff 5px solid;
        }
      }

    }

    .right{
      width: 200px;
      height: 100%;
      display: flex;
      align-items: center;

      .userArea{
        height: 60px;
        width: 100%;
        .item{
          display: flex;
          justify-content: left;
          div{
            height: 25px;
            width: 40%;
            font-size: 15px;
            color:#000;
            line-height: 10px;
          }
          .content{
            font-size: 20px;
            color:#f0f0f0;
          }
          
          .el-button{
            height: 30px;
            width: 100%;
            text-align: center;
          }
        }
      }

    }
  }

</style>