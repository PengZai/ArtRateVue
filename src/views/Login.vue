<template>
  <div class="Login">
    <el-row align="middle">
      <el-col :offset="9" :span="6">
        <div class="login-widnows">
          <el-row>
            <el-col>
              <div class="title">{{LoginStatus}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <div class="title">艺术评价系统</div>
            </el-col>
          </el-row>
          <el-row>
            <!-- 登录 -->
            <el-col :span=20 :offset="2">
              <el-form v-show="LoginStatus==='Login'"
              ref="LoginRuleFormRef"
              :model="LoginRuleForm"
              status-icon
              :rules="LoginRules"
              label-position="right"
            >
                <el-form-item prop="username">
                  <el-input 
                  placeholder="username"
                  v-model="LoginRuleForm.username" 
                  type="text" autocomplete="off" 
                  :prefix-icon="User"
                />
                </el-form-item>
                <el-form-item prop="password">

                  <el-input
                    v-model="LoginRuleForm.password"
                    placeholder="password"
                    type="password"
                    autocomplete="off"
                    :prefix-icon="Lock"
                  />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="submitForm(LoginRuleFormRef)" class="row-btn"
                    >Login
                  </el-button>
                </el-form-item>
              </el-form>

              <!-- 注册 -->
              <el-form v-show="LoginStatus==='Register'||LoginStatus==='ModfiyPassword'"
              ref="RegisterRuleFormRef"
              :model="LoginRuleForm"
              status-icon
              :rules="RegisterRules"
              label-position="right"
            >
                <el-form-item prop="username">
                  <el-input 
                  placeholder="username"
                  v-model="LoginRuleForm.username" 
                  type="text" autocomplete="off" 
                  :prefix-icon="User"
                />
                </el-form-item>

                <el-form-item prop="email">

                  <el-input
                    v-model="LoginRuleForm.email"
                    placeholder="email"
                    type="text"
                    autocomplete="off"
                    :prefix-icon="ChatLineSquare"
                  />
                </el-form-item>

                <el-form-item prop="password">

                  <el-input
                    v-model="LoginRuleForm.password"
                    placeholder="password"
                    type="password"
                    autocomplete="off"
                    :prefix-icon="Lock"
                  />
                </el-form-item>
                
                <el-form-item prop="checkPassword">

                  <el-input
                    v-model="LoginRuleForm.checkPassword"
                    placeholder="confirm"
                    type="password"
                    autocomplete="off"
                    :prefix-icon="Lock"
                  />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitForm(RegisterRuleFormRef)" class="row-btn"
                    >{{LoginStatus}}
                  </el-button>
                </el-form-item>
              </el-form>


            </el-col>
          </el-row>

          <el-row>
            <el-col :offset="1" :span="4" v-show="LoginStatus==='Login'">
              <el-button type="text" class="row-text-btn" @click="handleModifyStatus('ModfiyPassword', $event)"
                >Forgot password?
              </el-button>
            </el-col>

            <el-col :offset="11" :span="4" v-show="LoginStatus==='Login'">
              <el-button  type="text" class="row-text-btn" @click="handleModifyStatus('Register', $event)"
                >create new account
              </el-button>
            </el-col>

            <el-col :offset="1" :span="4" v-show="LoginStatus==='Register'|LoginStatus==='ModfiyPassword'">
              <el-button type="text" class="row-text-btn" @click="handleModifyStatus('Login', $event)"
                >has account?
              </el-button>
            </el-col>


          </el-row>

        </div>
        
      </el-col>
    </el-row>
    

  </div>
  
</template>

<script lang="ts" setup>
  import { reactive, ref, getCurrentInstance, onBeforeMount, onMounted } from 'vue'
  import type { FormInstance } from 'element-plus'
  import {ElMessage} from 'element-plus'
  import { Bell, Lock, User, RefreshLeft, ChatLineSquare } from '@element-plus/icons-vue'
  import axios from 'axios'
  import { useRoute, useRouter } from 'vue-router'
  import { useStore } from 'vuex'


  const store = useStore()
  
  const app = getCurrentInstance()

  const router = useRouter()

  // Login, Register, ModfiyPassword
  const LoginStatus = ref('Login')

  const LoginRuleFormRef = ref<FormInstance>()
  const RegisterRuleFormRef = ref<FormInstance>()


  const validateUsername = (rule: any, value: any, callback: any) => {

      console.log('validateUsername', value, rule)

      if (value === '') {
        callback(new Error('Please input the username'))
      }
      else{
        callback()
      }
    
  }

  const validatePassword = (rule: any, value: any, callback: any) => {
      
      console.log('validatePassword', value, rule)
      
      if (value === '') {
        callback(new Error('Please input the password'))
      } 
      else{
        callback()
      }
      
  }

  const validateEmail = (rule: any, value: any, callback: any) => {
      
      console.log('validateEmail', value, rule)
     
      if (value === '') {
        callback(new Error('Please input the email'))
      } 
      else{
        callback()
      }
  }

  const validateCheckPassword = (rule: any, value: any, callback: any) => {
      
      console.log('validateCheckPassword', value, rule)
      
      if (value === '') {
        callback(new Error('Please input the comfirm'))
      } else if (value !== LoginRuleForm.password) {
        callback(new Error("Two inputs don't match!"))
      } else {
        callback()
      }
      
  }

  const LoginRuleForm = reactive({
    username:'',
    password:'',
    email:'',
    checkPassword:'',
  })

  const LoginRules = reactive({
    username: [{ validator: validateUsername, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
  })

  const RegisterRules = reactive({
    username: [{ validator: validateUsername, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    email: [{ validator: validateEmail, trigger: 'blur' }],
    checkPassword: [{ validator: validateCheckPassword, trigger: 'blur' }],

  })

  const submitForm = async (formEl: FormInstance | undefined) => {

    if (!formEl) return
    await formEl.validate((valid) => {

      console.log('valid', valid)

      if (valid) {
        let url;
        if(LoginStatus.value === 'Login'){
          url = app.appContext.config.globalProperties.$server_url + 'art/signin'
        }
        else if(LoginStatus.value === 'Register'){
          url = app.appContext.config.globalProperties.$server_url + 'art/signup'
        }
        else if(LoginStatus.value === 'ModfiyPassword'){
          url = app.appContext.config.globalProperties.$server_url + 'art/modifyPassword'
        }

        axios({
          url:url,
          data:{
            user:LoginRuleForm,
          },
          method:'post',
          // headers: { "Content-Type": "multipart/form-data" },
          headers:{'Content-Type': 'text/json'}
        }).then((resp)=>{
          if(resp.data.ref===0){

            if (LoginStatus.value === 'Login'){
              console.log(resp.data)
              let user = resp.data.data
              store.commit({
                  type: 'login',
                  user:user,
                  session_key:resp.data.session_key,
              })
              sessionStorage.setItem('store', JSON.stringify(store.state))
              ElMessage({
                type: 'success',
                message: resp.data.msg,
              })
              router.push({
                name:'Home'
              })
            }

            // 注册或者修改密码
            else{
              LoginStatus.value = 'Login'
              ElMessage({
                type: 'success',
                message: resp.data.msg,
              })
            }
            
           
          }
          

        }).catch((error)=>{

        })


      } else {
        console.log('error submit!')
        return false
      }
    })
  }

  const handleModifyStatus = (status, event) => {
    LoginStatus.value = status
    // 清空状态
    LoginRuleForm.username = ''
    LoginRuleForm.password = ''
    LoginRuleForm.email = ''
    LoginRuleForm.checkPassword = ''
  }

  

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
</script>


<style scoped lang="scss">
  .Login{
    width: 100vw;
    height: 100vh;



    &>.el-row{
      height: 100%;
      margin-top: 20px;
    }

    .login-widnows{
      border: 1px solid rgb(178, 178, 178);
      border-radius: 10px;
      height: 500px;
      display: flex;
      flex-direction: column;

      .row-btn{
        width: 100%;
      }

      .row-text-btn{
        color: rgb(187, 216, 232);
      }
      .row-text-btn:hover{
        color: rgb(49, 171, 237);
      }

      .el-row{
        margin-top: 20px;
      }
      .title{
        width: 100%;
        text-align: center;
      }
    }
    
  }
</style>