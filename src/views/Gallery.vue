<template lang="">
  <div class="Gallery">
    <div class="main">
      <el-row>
        <el-col :offset="6" :span="12">
          <el-input
            v-model="queryKeyWord"
            placeholder="put in key word or date"
            :prefix-icon="Search"
            @input="handleQueryBox"
          />
        </el-col>
        <el-col :span="2">
          <el-button :icon="Search" type="primary" @click="getProductsOnPage" />
        </el-col>
      </el-row>
      <el-row v-for="(o, r) in rowNum">
        <el-col
          v-for="(o, index) in N_per_row"
          :key="o"
          :span="N_per_row+2"
          :offset="index > 0? N_per_row : N_per_row-1"
        >
          <el-card shadow="always" :body-style="{ padding: '5px', height:'450px'}" v-if="r*N_per_row+index<productArr.length">
            <img
              :src="productArr[r*3+index].cover"
              class="image"
              @click="handleView(productArr[r*N_per_row+index].id, $event)"
            />
            <div style="padding: 14px">
              <div class="title">{{productArr[r*N_per_row+index].title}}</div>
              <div class="author-name">{{productArr[r*N_per_row+index].author_name}}</div>
              <div class="bottom">

                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="machine rating"
                  placement="bottom-start"
                >
                  <el-button @click="handleView(productArr[r*N_per_row+index].id, $event)" type="primary" :icon="View" circle />
                </el-tooltip>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="expert rating"
                  placement="bottom-start"
                >
                  <el-button :disabled="store.state.user.is_staff===false" @click="handleEdit(productArr[r*N_per_row+index].id, $event)" type="warning" :icon="Edit" circle />
                </el-tooltip>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="delete product"
                  placement="bottom-start"
                >
                  <el-button :disabled="store.state.user.is_superuser===false" @click="handleDelete(r*N_per_row+index, productArr[r*N_per_row+index], $event)" type="danger" :icon="Delete" circle></el-button>
                </el-tooltip>
              </div>

            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="10">
            <el-pagination 
            background layout="prev, pager, next" :page-count="totalPage" 
            v-model:current-page="currentPage"
            @current-change="handlePageChange"
            />
        </el-col>
      </el-row>
    </div>

   
    
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, onBeforeMount, onMounted, getCurrentInstance, computed } from 'vue'
  import { Check, Delete, Edit, Message, Search, View} from '@element-plus/icons-vue'
  import axios from 'axios'
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useStore } from 'vuex';

  const currentPage = ref(1)
  const totalPage = ref(1)
  const store = useStore()
  const router = useRouter()
  const queryKeyWord = ref('')

  const handleQueryBox = ()=>{
    if(queryKeyWord.value === ''){
      getProductsOnPage()
    }
  }

  const app = getCurrentInstance()

  const productArr = reactive([])

  const N_per_row = ref(3)
  const N_per_page = ref(12)
  // 一个页面放12个产品 一行放3个产品
  const rowNum = computed(()=>{
    return Math.ceil(productArr.length/N_per_row.value)
  })

  const handlePageChange = () => {
    console.log('handlePageChange', currentPage.value)
    

    getProductsOnPage()
  }

  const getProductsOnPage = () => {

    let url = app.appContext.config.globalProperties.$server_url + 'art/getProducts'
    axios({
      url:url,
      data:{
        keyword:queryKeyWord.value,
        page:currentPage.value,
        N_per_page:N_per_page.value,
      },
      method:'post',
      headers: { "Content-Type": "multipart/form-data" },
      // headers:{'Content-Type': 'text/json'},

    }
    ).then((resp)=>{
      console.log(resp.data.data)
      console.log('resp.data.totalPage', resp.data.totalPage)
      totalPage.value = resp.data.totalPage
      productArr.length = 0
      productArr.push(...resp.data.data)
      console.log('productArr', productArr)


    }).catch((error)=>{

    })
  }

  onBeforeMount(()=>{
    store.commit({
      type:'setPageStatus', 
      id:2,
    })

    getProductsOnPage()

  })

  const handleView = (product_id, event)=>{
    console.log('handleView', product_id)
    router.push({
      name:'ArtPrediction',
      query:{
          product_id:product_id
      }
    })
  }

  const handleEdit = (product_id, event)=>{
    console.log('handleEdit', product_id)
    router.push({
      name:'ProductReview',
      query:{
          product_id:product_id
      }
    })
  }

  const handleDelete = (index, product, event)=>{
    console.log('handleDelete', product.id)
    ElMessageBox.confirm(
    `delete the product <<${product.title}>> . Continue?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {

      let url = app.appContext.config.globalProperties.$server_url + 'art/deleteProducts'

      axios(
        {
          url:url,
          data:{
            product_id:product.id,
          },
          method:'post',
          headers: { "Content-Type": "multipart/form-data" },
        }
      ).then((resp)=>{
        console.log(resp.data.data)
        productArr.splice(index, 1)

        ElMessage({
          type: 'success',
          message: 'Delete completed',
        })
        
      }).catch((error)=>{
        console.log(error)
      })

      
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
  }

</script>
<style scoped lang="scss">
  

  .Gallery{

    width: 100vw;
    background: #000;

    .main{
        .el-row{
          margin-top: 30px;
          .el-card{

            background: #FAFAFA;
          
            .image {
              width: 100%;
              height: 78%;
              cursor: pointer;
            }
            .title{
              height: 15px;
            }

            .author-name{
              height: 15px;
            }

            .bottom {
              margin-top: 13px;
              line-height: 12px;
              display: flex;
              align-items: center;
            }
          }
        }
        
    }
    
  }
  
  
  
</style>