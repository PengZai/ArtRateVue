<template lang="">
  <div class="Bar">
    
  </div>
</template>
<script setup lang="ts">
  import * as echarts from 'echarts';
  import {ref, reactive, onBeforeMount, onMounted, getCurrentInstance, watch, computed} from 'vue'

  type EChartsOption = echarts.EChartsOption
  const app = getCurrentInstance()
  var chartDom;
  var myChart;

  
  
  let option: EChartsOption;
  
  option = {
    color:['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
    xAxis: {
      type: 'value',
      boundaryGap:[0, 0.01],
      max: 100,
    },
    
    grid:{
      left:'3%',
      right: '4%',
      bottom: '3%',
      containLabel:true,
    },
    legend: {
      
      textStyle:{
        color:'#fff',
      }
    },

    yAxis: {
      type: 'category',
      data: ['total', 'design', 'technology', 'market', 'investment', 'media'],
      position: 'left',
      axisLabel: {
        fontSize: 20
      }
    },
    tooltip:{
      trigger: 'axis',
      axisPointer:{
        type: 'shadow'
      }
    },
    series: [
      // {
      //   data: [50, 50, 50, 50, 50, 100],
      //   type: 'bar',
      //   name: 'prediction',
      //   showBackground: true,
      //   backgroundStyle: {
      //     color: 'rgba(180, 180, 180, 0.2)'
      //   }
      // }
    ]
  };

  const props = defineProps<{
    PredictArtScoreArr:Array<any>[]
    avgRatingArtScoreArr:Array<any>[]
  }>()

  

  

  onMounted(()=>{
    chartDom = document.getElementById(app.attrs.id);
    myChart = echarts.init(chartDom);
    myChart.setOption(option);


  })

  watch(props.PredictArtScoreArr, (newValue, oldValue)=>{

    let bar_data = {
      data: [],
      type: 'bar',
      name: 'prediction',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(2, 172, 98, 0.3)'
      }
    }

    // 总分
    bar_data.data.push(totalPredictionArt.value)
    for(let i=0; i<newValue.length;i++){
      let ArtScore = newValue[i]
      bar_data.data.push(ArtScore)
    }

    if(option.series.length >= 1){
      
      option.series[0] = bar_data 
    }

    else{
      option.series.push(bar_data)
    }

    myChart.setOption(option);


  })

  watch(props.avgRatingArtScoreArr, (newValue, oldValue)=>{

    let bar_data = {
      data: [],
      type: 'bar',
      name: 'average rating',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(255, 228, 52, 0.3)'
      }
    }

    // 总分
    bar_data.data.push(totalAvgRatingArtScoreArr.value)
    for(let i=0; i<newValue.length;i++){
      let ArtScore = newValue[i]
      console.log('ArtScore', ArtScore)
      bar_data.data.push(ArtScore)
    }

    if(option.series.length >= 2){
      
      option.series[1] = bar_data 
    }

    else{
      option.series.push(bar_data)
    }

    myChart.setOption(option);

  })

  const totalPredictionArt = computed(()=>{
    return props.PredictArtScoreArr.reduce((a, b) => a+b.value, 0) / props.PredictArtScoreArr.length
  })

  const totalAvgRatingArtScoreArr = computed(()=>{
    return props.avgRatingArtScoreArr.reduce((a, b) => a+b.value, 0) / props.avgRatingArtScoreArr.length
  })

  
  
</script>
<style scoped lang="scss">
  
  .Bar{

    height: 350px;
    width: 600px;
  }

</style>