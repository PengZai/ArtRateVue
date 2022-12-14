<template lang="">
  <div class="Radar">
    
  </div>
</template>
<script setup lang="ts">
  import * as echarts from 'echarts';
  import {ref, reactive, onBeforeMount, onMounted, getCurrentInstance, watch} from 'vue'

  type EChartsOption = echarts.EChartsOption
  const app = getCurrentInstance()
  var chartDom;
  var myChart;
  
  let option: EChartsOption;
  
  const props = defineProps<{
    PredictArtScoreArr:Array<any>[]
    avgRatingArtScoreArr:Array<any>[]
    title:String,
  }>()


  option = {
   
    color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
    title: {
      text: props.title,
      textStyle:{
        fontSize: '20px',
        color:'#fff'
      }
    },
    tooltip:{
      trigger:'item'
    },
    legend: {
      bottom: 0,
      rigth: 0,
      textStyle:{
        color:'#fff'
      }
    },

    radar: [
      {
        indicator: [
          { text: 'design', max: 100, color:'#fff'},
          { text: 'technology', max: 100, color:'#fff'},
          { text: 'market', max: 100, color:'#fff'},
          { text: 'investment', max: 100, color:'#fff'},
          { text: 'media', max: 100, color:'#fff'}
        ],
        center: ['50%', '50%'],
        radius: '80%',
        startAngle: 90,
        splitNumber: 4,
        shape: 'circle',
        axisName: {
          formatter: '{value}',
          color: '#428BD4'
        },
        splitArea: {
          areaStyle: {
            color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)'
          }
        }
      },
    ],
    series: [
      {
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 4
          }
        },
        data: [
          // {
          //   value: [0, 0, 0, 0, 0],
          //   name: 'prediction',
          //   areaStyle: {
          //     color: 'rgba(255, 228, 52, 0.6)'
          //   }
          // },
          // {
          //   value: [],
          //   name: 'averageRating',
          //   areaStyle: {
          //     color: 'rgba(255, 228, 52, 0.6)'
          //   }
          // },
        ]
      },
    ]
  };

  onMounted(()=>{
    chartDom = document.getElementById(app.attrs.id);
    myChart = echarts.init(chartDom);
    myChart.setOption(option);

  })

  // 预测结果
  watch(props.PredictArtScoreArr, (newValue, oldValue)=>{
    // 清空原有数组

    let radar_data = {
      value: [],
      name: 'prediction',
      areaStyle: {
        color: 'rgba(255, 228, 52, 0.6)'
      }
    }

    let indicator = option.radar[0].indicator
    for(let i=0; i<newValue.length;i++){
        let ArtScore = newValue[i]
        radar_data.value.push(ArtScore.value)
    }

    if(option.series[0].data.length >= 1){
      option.series[0].data[0] = radar_data
    }
    else{
      option.series[0].data.push(radar_data)
    }

    myChart.setOption(option);
    
  })

  // 专家打分平均结果
  watch(props.avgRatingArtScoreArr, (newValue, oldValue)=>{
    // 清空原有数组

    let radar_data = {
      value: [],
      name: 'rating',
      areaStyle: {
        color: 'rgba(255, 228, 52, 0.6)'
      }
    }

    let indicator = option.radar[0].indicator
    for(let i=0; i<newValue.length;i++){
        
        let ArtScore = newValue[i]
        radar_data.value.push(ArtScore.value)
    }

    
    if(option.series[0].data.length >= 2){
      option.series[0].data[1] = radar_data
    }
    else{
      option.series[0].data.push(radar_data)
    }

    myChart.setOption(option);

  })
  
  
</script>
<style scoped lang="scss">
  
  .Radar{

    height: 350px;
    width: 400px;
  }

</style>