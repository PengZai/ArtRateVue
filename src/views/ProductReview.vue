<template lang="">
  <div class="ProductReview">
  
  
  <!-- 预览图片 -->
  <el-image-viewer
          v-if="photo_status.isPreview"
          :url-list="imgSrcList"
          :initial-index="photo_status.index"
          :hide-on-click-modal="true"
          @close="handleClosePreview"
          :z-index="99"
  /> 

  <!-- 修改评论对话框 -->
  <el-dialog v-model="EditRatingDialogVisible" :title="EditRating.title" width="800px">
    <el-form ref="EditRuleFormRef" :model="EditRating" label-width="100px" :inline="true" :rules = EditRules>
      <el-form-item label="design" prop="design">
        <el-input v-model.number="EditRating.design"/>
      </el-form-item>
      <el-form-item label="investment" prop="investment">
        <el-input v-model.number="EditRating.investment"/>
      </el-form-item>
      <el-form-item label="market" prop="market">
        <el-input v-model.number="EditRating.market"/>
      </el-form-item>
      <el-form-item label="media" prop="media">
        <el-input v-model.number="EditRating.media"/>
      </el-form-item>
      <el-form-item label="technology" prop="technology">
        <el-input v-model.number="EditRating.technology"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="EditRatingDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleEditConfirm(EditRuleFormRef)"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 按钮区域 -->
  <el-row>
    <el-col :span="2" class="btnArea" :offset="18">
      <el-button type="info" :icon="Back" @click="handleBack" size="large">Back</el-button>
      <el-button type="warning" :icon="Upload" @click="handleRate" size="large">sumbmit</el-button>

    </el-col>
  </el-row>

  <!-- 轮播图 -->
  <el-row>
    <el-col :span="8" :offset="4">
      <el-carousel 
        style="width: 400px; cursor:pointer;"
        height="400px"
        :autoplay="!photo_status.isPreview"
        :arrow="photo_status.isPreview ? 'never' : 'hover'"
        indicator-position="outside"
        :hide-on-click-modal="true"
        >
          <el-carousel-item v-for="(item, index) in imgSrcList" :key="item">
                <el-image
                  style="width: 100%; height:100%;"
                  :src="item"
                  fit="cover"
                  @click="handleClickImage(index, $event)"
                >
                  <template #placeholder>
                    <el-icon><icon-picture /></el-icon>
                  </template>
                </el-image>
          </el-carousel-item>
        </el-carousel>
    </el-col>

    <!-- 图片描述 -->
    <el-col :span="8">
      <el-descriptions :title="product.data.title" :column="3" border>
        <el-descriptions-item label="author" label-align="right" align="center" :span="1"
          >{{product.data.author_name}}</el-descriptions-item
        >
        <el-descriptions-item label="email" :span="2" label-align="right" align="center"
          >{{product.data.email}}</el-descriptions-item
        >
        <!-- <el-descriptions-item label="Industry" :span="1" label-align="right" align="center"
          >{{product.data.industry}}</el-descriptions-item
        > -->
        <el-descriptions-item label="Category" :span="2" label-align="right" align="center"
          >{{product.data.category}}</el-descriptions-item
        >
        <el-descriptions-item label="Nationality" :span="1" label-align="right" align="center">
          {{product.data.nationality}}
        </el-descriptions-item>
    </el-descriptions>
    </el-col>
  </el-row>

  <el-row>
    <el-col :offset="4" :span="16">
      <el-collapse v-model="collapseActiveName" @change="handleChange">
        <el-collapse-item title="Descriptions" name="descriptions">
          <div>
            {{product.data.description}}
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-col>
  </el-row>

  
  <el-row>
    <!-- 雷达图 -->
    <el-col :span="8" :offset="4">
      <echarts-radar id="ArtRadar" :avgRatingArtScoreArr="ArtScoreArr" title="Rating" ></echarts-radar>
    </el-col>

    <!-- 滑动条 -->
    <el-col :span="8">
      <div class="table-title">Rating Area</div>
      <div class="slider-block" v-for="(ArtScore, index) in ArtScoreArr">
        <div class="demonstration">{{ArtScore.name}}</div>
        <el-slider v-model="ArtScore.value" show-input size="large" />
      </div>  
    </el-col>
  </el-row>

  <el-row v-if="store.state.user.is_superuser">
    <el-col :span="16" :offset="4">
        <div class="table-title">Rating Record</div>
    </el-col>
  </el-row>
  <el-row v-if="store.state.user.is_superuser">
    <el-col :span="16" :offset="4">
      <el-table :data="filterTableData" style="width: 100%" max-height="500px" size="large" highlight-current-row>
        <el-table-column type="index" width="50" />
        <el-table-column label="username" prop="username" />
        <el-table-column label="design" prop="design" />
        <el-table-column label="investment" prop="investment" />
        <el-table-column label="market" prop="market" />
        <el-table-column label="media" prop="media" />
        <el-table-column label="technology" prop="technology" />
        <el-table-column align="right">
          <template #header>
            <el-input v-model="search" size="small" placeholder="Type to search" />
          </template>
          <template #default="scope">
            <el-button 
            :disabled="store.state.user.is_superuser===false"
            size="small" @click="handleEdit(scope.$index, scope.row)"
              >Edit</el-button
          >
            <el-button
              :disabled="store.state.user.is_superuser===false"
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >Delete</el-button
          >
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <div class="bottom"></div>
  
        
  </div>
</template>
<script setup lang="ts">

  import {ref, reactive, onBeforeMount, onMounted, getCurrentInstance, computed} from 'vue'
  import EchartsRadar from '../components/EchartsRadar.vue'
  import { Back, Upload } from '@element-plus/icons-vue'
  import {useRoute, useRouter} from 'vue-router'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import {useStore} from 'vuex'
  const EditRuleFormRef = ref<FormInstance>()

  const store = useStore()

  const collapseActiveName= ref("descriptions")

  const handleChange = (val: string[]) => {
    console.log('handleChange', val)
  }


  const EditRatingDialogVisible = ref(false)

  interface Rating {
    id: Number,
    username:String,
    design: Number,
    investment: Number,
    market: Number,
    media: Number,
    technology: Number,
    create_at: String,
    product_id: Number,
    user_id: Number,
  }

  
  const EditRating = reactive({
    title:'',
    username:'',
    id: 0,
    index:0,
    design: 0,
    investment: 0,
    market:0,
    media: 0,
    technology: 0,
  })

  const validateNumber = (rule: any, value: any, callback: any) => {
    if (value<0 || value>100) {
      callback(new Error('Value should be 0 to 100'))
    } else {
      callback()
    }
  }

  const RulesList = [
      { required: true, message: 'Please input value', trigger: 'change',},
      { type: 'number', message: 'Value must be a number',trigger: 'change', },
      { validator: validateNumber, trigger: 'change',},
    ]

  const EditRules = reactive<FormRules>({
    design: RulesList,
    investment: RulesList,
    market: RulesList,
    media: RulesList,
    technology: RulesList,
  })

  
 
  const search = ref('')
  const filterTableData = computed(() =>
    {
      return tableData.filter(
        (data) => {
          
          return !search.value || parseInt(search.value) === data.id
        }
      )
    }
  )


  const handleEdit = (index: number, row: Rating) => {
    console.log(index, row)
    EditRatingDialogVisible.value = true

    EditRating.index = index
    EditRating.title = `Editing Rating id:${row.id} username:${row.username}`
    EditRating.id = row.id
    EditRating.design = row.design
    EditRating.investment = row.investment
    EditRating.market = row.market
    EditRating.media = row.media
    EditRating.technology = row.technology

  }

  const handleEditConfirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      EditRatingDialogVisible.value = false
      let index = EditRating.index

      let url = app.appContext.config.globalProperties.$server_url + 'art/modifyRatingRecord'
      axios({
        url:url,
        data:{
          EditRating:EditRating
        },
        method:'post',
        // headers: { "Content-Type": "multipart/form-data" },
        headers:{'Content-Type': 'text/json'}
      }).then((resp)=>{
        if(resp.data.ref === 0){
          ElMessage({
          type:'success',
          message:resp.data.msg,
          })
    
          // EditRating.id
          tableData[index].design = EditRating.design
          tableData[index].investment = EditRating.investment
          tableData[index].market = EditRating.market
          tableData[index].media = EditRating.media
          tableData[index].technology = EditRating.technology
        }

      }).catch((error)=>{

      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

 

  const handleDelete = (index: number, row: Rating) => {
    console.log(index, row)
    let url = app.appContext.config.globalProperties.$server_url + 'art/deleteRatingRecord'

    axios({
      url:url,
      data:{
        rating_id:row.id
      },
      method:'post',
      // headers: { "Content-Type": "multipart/form-data" },
      headers:{'Content-Type': 'text/json'}
    }).then((resp)=>{
      if(resp.data.ref === 0){
        ElMessage({
        type:'success',
        message:resp.data.msg,
        })
        // 从tableData中移除
        tableData.splice(index, 1);
      }
      

    }).catch((error)=>{

    })


  }

  const tableData = reactive<Rating[]>([])


  const route = useRoute()
  const router = useRouter()
  const app = getCurrentInstance()
  const photo_status = reactive({
    isPreview:false,
    index:0
  })

  const ArtScoreArr = reactive([
    { name: 'design', value: 0,},
    { name: 'technology', value: 0,},
    { name: 'market', value: 0,},
    { name: 'investment', value: 0,},
    { name: 'media', value: 0,}
  ])


  const product = reactive({
    data:{
      title:"艺术作品",
      category:"c1",
      industry:"i1",
      nationality:"n1",
      description:"这是一个耗时50天的艺术作品, 这是一个耗时50天的艺术作品, 这是一个耗时50天的艺术作品,这是一个耗时50天的艺术作品",
      author_name:"pengzai",
      email:"649365461@qq.com"}
    })
  
  const imgSrcList = reactive([
    'empty.png',
    'empty.png',
    'empty.png',
    'empty.png',
    'empty.png',
    'empty.png',
  ])

  const handleBack = ()=> {
    router.go(-1)
  }

  const handleRate = () => {

    let url = app.appContext.config.globalProperties.$server_url + 'art/addRatingRecord'

    axios({
      url:url,
      data:{
        product_id:route.query.product_id,
        ArtScoreArr:ArtScoreArr,
      },
      method:'post',
      // headers: { "Content-Type": "multipart/form-data" },
      headers:{'Content-Type': 'text/json'}
    }).then((resp)=>{
      console.log(resp.data)
      ElMessage({
        type:'success',
        message:'评分成功',
      })
      router.push({
        name:'Gallery'
      })

    }).catch((error)=>{

    })
  }

  onBeforeMount(()=>{

    let url = app.appContext.config.globalProperties.$server_url + 'art/artReview'
    // axios.post(url, {
    //   product_id:route.query.product_id,
    // },
    // headers: { "Content-Type": "multipart/form-data" },
    axios({
      url:url,
      data:{product_id:route.query.product_id},
      method:'post',
      headers: { "Content-Type": "multipart/form-data" },
    }
    ).then((resp)=>{

      product.data = resp.data.data.product

      imgSrcList.length = 0
      imgSrcList.push(...resp.data.data.imgSrcList)


      tableData.length = 0
      tableData.push(...resp.data.data.ratingList)
      console.log(resp.data.data)

      
      console.log('a', filterTableData)

    }).catch((error)=>{

    })
  })

  onMounted(()=>{})

  const handleClickImage = (index, event)=>{
    photo_status.isPreview = true
    photo_status.index = index

  }

  const handleClosePreview = ()=>{
    photo_status.isPreview = false

  }

</script>
<style scoped lang="scss">
  .ProductReview{
    width: 100vw;
    background: #000;

    .btnArea{
      display: flex;
      justify-content: space-between;
    }

    .el-row {
      margin-top: 40px;
    }

    .table-title{
      color:#fff;
      font-size: 25px;
    }


    .el-collapse-item{
      
      :deep(.el-collapse-item__header){
        background: #000;
        color: #fff;
        font-size: 16px;
        border: #000 2px solid;
        
      }

      :deep(.el-collapse-item__content){
        background: #000;
        color: #fff;
      }
    }

    .el-descriptions{
      
      // table-layout:fixed;

      :deep(.el-descriptions__title){
        color: #fff;
      }

      :deep(.el-descriptions__cell){
        background: #000;
        color: #fff;
      }
      

    }

    .slider-block{
      display: flex;
      align-items: center;
      
      .el-slide{
        margin-left: 12px;
        margin-top: 0;
      }
      .demonstration{
        font-size: 14px;
        // color: var(--el-text-color-secondary);
        color: #fff;
        line-height: 44px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 0;
      }

      .demonstration + .el-slider {
        flex: 0 0 80%;
      }

    }

    .bottom{
      height: 100px;
    }

  }
</style>