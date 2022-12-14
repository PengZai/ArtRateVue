<template>
  <div class="UserUpload">

      <el-row>
          <el-form 
            ref="productRulesFormRef" 
            :model="product" 
            :rules="productRules" 
            label-width="120px"
            size="large" 
            status-icon
          >
            
            <el-form-item label="Title" prop="title">
              <el-col :span="12">
                <el-input v-model="product.title" />
              </el-col>
            </el-form-item>
            
            
            <el-form :inline="true" label-width="120px">
              <el-form-item label="Category">
              <el-select v-model="product.category" placeholder="please select your category">
                <el-option v-for="(item, index) in category_optionArr" :key="index" :label="item.name" :value="item.name"  />
              </el-select>
              </el-form-item>
              <!-- <el-form-item label="Industry">
                <el-select v-model="product.industry" placeholder="please select your industry">
                  <el-option v-for="(item, index) in industry_optionArr" :key="index" :label="item.name" :value="item.name"  />
                </el-select>
              </el-form-item> -->
              <el-form-item label="Nationality">
                <el-select v-model="product.nationality" placeholder="please select your nationality">
                  <el-option v-for="(item, index) in nationality_optionArr" :key="index" :label="item.name" :value="item.name"  />
                </el-select>
              </el-form-item>
            </el-form>

            <el-form-item label="Author" prop="author">
              <el-col :span="10">
                <el-input v-model="product.author" />
              </el-col>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-col :span="10">
                <el-input v-model="product.email" />
              </el-col>
            </el-form-item>
       

            <el-form-item label="Description(EN)" prop="description">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="请输入英文描述, 不要填写中文描述"
                placement="bottom"
              >
                <el-input v-model="product.description" type="textarea" />
              </el-tooltip>
            </el-form-item>

            <el-form-item label="Gallery">
              <el-upload
                action="#"
                list-type="picture-card"
                :multiple="true"
                :auto-upload="false"
                :on-success="handleSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :file-list="fileList"
                :limit="8"
                :on-exceed="handleExceed"
               
                accept="image/jpg, image/jpeg, image/png"
              >
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="只支持jpg/png"
                  placement="bottom"
                >
                  <el-icon><Plus /></el-icon>
                </el-tooltip>
              </el-upload>

              <el-dialog  :center="true" width="400px"  :title="dialogTitle" v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
              </el-dialog>
            </el-form-item>
            
            <el-form-item>
              <el-row> 
                <el-col :span="2">
                  <el-button type="primary" @click="handleSubmit(productRulesFormRef)">Create</el-button>
                </el-col>
                <el-col :offset="20" :span="2">
                  <el-button @click="handleCancel">Cancel</el-button>
                </el-col>
              </el-row>
              
            </el-form-item>
          </el-form>
      </el-row>
      
  </div>
  
</template>

<script lang="ts" setup>
  import {ref, reactive, onBeforeMount, onMounted, getCurrentInstance} from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Plus } from '@element-plus/icons-vue'
  import type { UploadProps, UploadUserFile} from 'element-plus'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import axios from 'axios'
  import {useStore} from 'vuex'

  import type { FormInstance, FormRules } from 'element-plus'


  const store = useStore()



  onBeforeMount(()=>{
    store.commit({
      type:'setPageStatus', 
      id:1,
    })
  })

  const app = getCurrentInstance()

  const router = useRouter()

 
  const fileList = ref<UploadUserFile[]>([])

  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)
  const dialogTitle = ref('')

  const category_optionArr = reactive([
    {
      name:'交通工具',
    },
    {
      name:'产品装备',
    },
    {
      name:'信息处理',
    },
    {
      name:'家居生活',
    },
    {
      name:'运动健康',
    },
    {
      name:'公共设施',
    },
    {
      name:'文化创意',
    },
    {
      name:'传播设计',
    },
  ])

  const industry_optionArr = reactive([
    {
      name:'i1',
    },
    {
      name:'i2',
    }
  ])

  const nationality_optionArr = reactive([ 
    {name:'中国'},
    {name:'印度'},
    {name:'美国'},
    {name:'印尼'},
    {name:'巴西'},
    {name:'巴基斯坦'},
    {name:'奈及利亚'},
    {name:'孟加拉国'},
    {name:'俄罗斯'},
    {name:'墨西哥'},
    {name:'日本'},
    {name:'衣索比亚'},
    {name:'菲律宾'},
    {name:'埃及'},
    {name:'越南'},
    {name:'德国'},
    {name:'刚果民主共和国'},
    {name:'伊朗'},
    {name:'土耳其'},
    {name:'泰国'},
    {name:'英国'},
    {name:'法国'},
    {name:'义大利'},
    {name:'坦桑尼亚'},
    {name:'南非'},
    {name:'缅甸'},
    {name:'韩国'},
    {name:'哥伦比亚'},
    {name:'肯尼亚'},
    {name:'西班牙'},
    {name:'阿根廷'},
    {name:'乌克兰'},
    {name:'乌干达'},
    {name:'阿尔及利亚'},
    {name:'苏丹'},
    {name:'伊拉克'},
    {name:'波兰'},
    {name:'加拿大'},
  ])

  const product = reactive<{
    // title:String,
    // category:String,
    // industry:String,
    // nationality:String,
    // description:String,
    // author:String,
    // email:String,
  }>({
    title:"",
    category:"",
    industry:"",
    nationality:"",
    description:"",
    author:"",
    email:"",
  })

  const productRulesFormRef = ref<FormInstance>()
  const productRules = reactive<FormRules>({
    title: [
      { required: true, message: 'Please input title', trigger: 'blur' },
      { min: 1, max: 30, message: 'Length should be 1 to 30', trigger: 'blur' }
    ],
    author: [
      { required: true, message: 'Please input author', trigger: 'blur' },
      { min: 1, max: 30, message: 'Length should be 1 to 30', trigger: 'blur' }
    ],
    email: [
      { required: true, message: 'Please input email', trigger: 'blur' },
      { min: 1, max: 30, message: 'Length should be 1 to 30', trigger: 'blur' }
    ],
    description: [
      { required: true, message: 'Please input description', trigger: 'blur' },
      { min: 1, max: 5000, message: 'Length should be 1 to 5000', trigger: 'blur' }
    ]
  })
  
  let product_fromdata = new FormData()

  const handleSubmit = async (formEl: FormInstance | undefined) => {

    if (!formEl) return
    await formEl.validate((valid, fields) => {

      console.log('valid', valid, formEl)

      if (valid) {
        let url = app.appContext.config.globalProperties.$server_url + 'art/uploadPhoto'
        console.log(JSON.stringify(product))

        if(fileList._value.length === 0){
          ElMessage({
            type:'error',
            message:'请至少上传一张图片',
          })
          return
        }

        product_fromdata.append('product', JSON.stringify(product))
        
        for (let i=0;i<fileList._value.length;i++){
          let raw_file = fileList._value[i].raw
          product_fromdata.append(raw_file.name, raw_file)
        }

        
        axios.post(url, product_fromdata, {
          headers: { 
            "Content-Type": "multipart/form-data" ,
          },
          // headers:{'Content-Type': 'text/json'}

        }).then((resp)=>{
          console.log(resp.data)
          ElMessage({
            type:'success',
            message:'上传成功',
          })
          let product = resp.data.data
          router.push({
            name:'ArtPrediction',
            query:{
              product_id:product.id
            }
          })

        }).catch((error)=>{
          console.log(error)
        })
      }
      else {
        console.log('error submit!', fields)
        return false
      }
    })

  }

  const handleCancel = (event) => {
      router.push('/Home')
  }

  const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    console.log('handleChange', fileList)
  }

  const handleSuccess: UploadProps['onSuccess'] = (uploadFile, uploadFiles) => {
    console.log('handleSuccess', fileList)
    
  }

  const handleExceed: UploadProps['onExceed'] = (files) => {
    console.log('onExceed', fileList)

    return ElMessageBox.alert(
    `文件上传不能超过8个`
    )
  }


  const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log('handleRemove', fileList)
  }

  const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogTitle.value = uploadFile.name
    dialogVisible.value = true
  }

  
</script>


<style scoped lang="scss">

  .UserUpload{
    width: 100vw;
    background: #000;

    .el-row{
      margin-top: 20px;
      width: 100%;
    }
    .el-form{
      
      :deep(.el-form-item__label){
        color: #fff;
      }

      :deep(.el-input__wrapper){
        background: #000;
      }

      :deep(.el-input__inner){
        color:#fff;
      }

      :deep(.el-textarea__inner){
        background: #000;
        color:#fff;
      }

      :deep(.el-upload--picture-card){
        background: #000;
      }
      
      .el-dialog{
        .el-dialog__body{
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  
</style>