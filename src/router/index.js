import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'

const routes = [
  {
    path:'/',
    name:'Interface',
    component: () => import('../views/Interface.vue'),
    redirect: to => {return { path: '/Home', query: { q: to.params.searchText } }},
    children:[
      {
        path:'/Home',
        name:'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path:'/UserUpload',
        name:'UserUpload',
        component: () => import('../views/UserUpload.vue'),
      },
      {
        path:'/ProductReview',
        name:'ProductReview',
        component: () => import('../views/ProductReview.vue'),
      },
      {
        path:'/Gallery',
        name:'Gallery',
        component: () => import('../views/Gallery.vue'),
      },
      {
        path:'/Product',
        name:'Product',
        component: () => import('../views/Product.vue'),
      },
      {
        path:'/ArtPrediction',
        name:'ArtPrediction',
        component: () => import('../views/ArtPrediction.vue'),
      },
    ]
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/Test',
    name: 'Test',
    component: () => import('../views/Test.vue')
  },

]

const router = createRouter({
  // history:createWebHistory('./'),
  history:createWebHashHistory(),
  routes
})



export default router