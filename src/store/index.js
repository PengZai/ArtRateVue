import { createApp } from 'vue'
import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      is_login: false,
      session_key:'',
      pageStatus:0,
      user:{
        username:'',
        is_staff: false,  
        is_superuser: false,
      },
      
      saveProduct:{

      },

    }
  },
  mutations: {
    login (state, data) {
      state.user.username = data.user.username
      state.user.is_superuser = data.user.is_superuser
      state.user.is_staff = data.user.is_staff
      state.is_login = true
      state.session_key = data.session_key
    },
    logout(state){
      state.user = {
        username:'',
        is_staff: false,  
        is_superuser: false,  
      }
      state.is_login = false
      state.sessionid = ''
    },

    setPageStatus(state, id){
      state.pageStatus = id
    },
    saveProductBeforeUpload(state, product){

    },
  }
})

export default store