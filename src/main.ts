import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus, { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import store from './store/index.js'
import router from './router/index.js'
import axios from 'axios'


const app = createApp(App)
// app.config.globalProperties.$server_url = 'http://127.0.0.1:8000/'
app.config.globalProperties.$server_url = 'http://118.195.135.213:8001/'

app.use(store)
app.use(ElementPlus)
app.use(router)

const whileList = []
router.beforeEach((to, from, next)=>{
  

  if(to.path == '/Login'){
    next()
  }

  else{
    // 未登录, 跳转至登录页面
    if(store.state.session_key===''){
      ElMessage({
        message:'请先登录',
        type:'warning',
      })
      next({ name: 'Login' })
    }
    // 已登录, 允许跳转
    else{
      
      console.log('router', to.path)
      if(to.path === '/ProductReview' && store.state.user.is_staff === false){
        
        ElMessage({
          message:'权限不足',
          type:'warning',
        })

        next(from.path)

      }
      next()
    }
  }

})


// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  
  config.headers.Authorization = store.state.session_key
  console.log('interceptors', config)

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  if (response.data.ref !== 0){
    ElMessage({
      type:'error',
      message:response.data.msg
    })
  }
  
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


app.mount('#app')



