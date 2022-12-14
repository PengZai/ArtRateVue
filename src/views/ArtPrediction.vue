<template lang="">
  <div class="ArtPrediction" v-loading="isloading">
  <el-image-viewer
          v-if="photo_status.isPreview"
          :url-list="imgSrcList"
          :initial-index="photo_status.index"
          :hide-on-click-modal="true"
          @close="handleClosePreview"
          :z-index="99"
  /> 
  <el-row>
    
    <el-col :offset="20" :span="4">
      <el-button type="info" :icon="Back" @click="handleBack" size="large">Back</el-button>
    </el-col>
   
  </el-row>
  <el-row>
    <el-col :span="4"></el-col>
    <el-col :span="8">
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
        <el-descriptions-item label="Category" :span="1" label-align="right" align="center"
          >{{product.data.category}}</el-descriptions-item
        >
        <el-descriptions-item label="Nationality" :span="1" label-align="right" align="center">
          {{product.data.nationality}}
        </el-descriptions-item>
        
    </el-descriptions>
    </el-col>
    <el-col :span="4"></el-col>
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
    <el-col :span="4"></el-col>
    <el-col :span="8">
      
      <echarts-radar v-if="store.state.user.is_staff===true" id="ArtRadar" :PredictArtScoreArr="PredictArtScoreArr" :avgRatingArtScoreArr="avgRatingArtScoreArr" title="Result" ></echarts-radar>
      <echarts-radar v-else id="ArtRadar" :PredictArtScoreArr="PredictArtScoreArr" title="Result" ></echarts-radar>

    </el-col>
    <el-col :span="8">
      <echarts-horizontal-bar v-if="store.state.user.is_staff===true" id="ArtBar" :PredictArtScoreArr="PredictArtScoreArr" :avgRatingArtScoreArr="avgRatingArtScoreArr"></echarts-horizontal-bar>
      <echarts-horizontal-bar v-else id="ArtBar" :PredictArtScoreArr="PredictArtScoreArr"></echarts-horizontal-bar>

    </el-col>
    <el-col :span="4"></el-col>
  </el-row>
  
        
  </div>
</template>
<script setup lang="ts">

  import {ref, reactive, onBeforeMount, onMounted, getCurrentInstance} from 'vue'
  import EchartsRadar from '../components/EchartsRadar.vue'
  import EchartsHorizontalBar from '../components/EchartsHorizontalBar.vue'
  import { Back, Failed } from '@element-plus/icons-vue'
  import {useRoute, useRouter} from 'vue-router'
  import axios from 'axios'
  import { Picture as IconPicture } from '@element-plus/icons-vue'
  import { useStore } from 'vuex'
  const store = useStore()
  const isloading = ref(true)

  const collapseActiveName= ref('descriptions')

  const route = useRoute()
  const router = useRouter()
  const app = getCurrentInstance()
  const photo_status = reactive({
    isPreview:false,
    index:0
  })

  const PredictArtScoreArr = reactive([
    { name: 'design', value: 0,},
    { name: 'technology', value: 0,},
    { name: 'market', value: 0,},
    { name: 'investment', value: 0,},
    { name: 'media', value: 0,}
  ])

  const avgRatingArtScoreArr = reactive([
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
      description:" ",
      author_name:"pengzai",
      email:"649365461@qq.com"}
    })
  
  const imgSrcList = reactive([
    '/src/assets/empty.png',
    '/src/assets/empty.png',
    '/src/assets/empty.png',
    '/src/assets/empty.png',
    '/src/assets/empty.png',
    '/src/assets/empty.png',
  ])

  const handleBack = ()=>{
    router.go(-1)
  }

  onBeforeMount(()=>{

    let url = app.appContext.config.globalProperties.$server_url + 'art/artPrediction'
    // axios.post(url, {
    //   product_id:route.query.product_id,
    // },
    // headers: { "Content-Type": "multipart/form-data" },
    axios({
      url:url,
      data:{product_id:route.query.product_id},
      method:'post',
      headers: { "Content-Type": "multipart/form-data" },
      // headers: {'Content-Type': 'text/json'},

    }
    ).then((resp)=>{
      
      console.log('ArtPrediction', resp.data.data)
      product.data = resp.data.data.product
      PredictArtScoreArr.length = 0
      PredictArtScoreArr.push(...resp.data.data.PredictArtScoreArr)
      
      imgSrcList.length = 0
      imgSrcList.push(...resp.data.data.imgSrcList)
      
      avgRatingArtScoreArr.length = 0
      avgRatingArtScoreArr.push(...resp.data.data.avgRating)
      
      isloading.value = false

    }).catch((error)=>{

    })
  })

  const handleClickImage = (index, event)=>{
    photo_status.isPreview = true
    photo_status.index = index

  }

  const handleClosePreview = ()=>{
    photo_status.isPreview = false

  }

</script>
<style scoped lang="scss">
  .ArtPrediction{
    width: 100vw;
    background: #000;

    .el-row {
      margin-top: 20px;
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

      :deep(.el-descriptions__title){
        color: #fff;
      }

      :deep(.el-descriptions__cell){
        background: #000;
        color: #fff;
      }

    }

  }
</style>