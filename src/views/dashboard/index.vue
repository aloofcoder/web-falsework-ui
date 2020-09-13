<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in cards" :key="index">
        <el-card class="dashboard-card" shadow="never">
          <div class="dashboard-card-box" :style="{backgroundColor: item.bg}">
            <h1>{{ item.value }}</h1>
            <h6>{{ item.name }}</h6>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="dashboard-info">
      <el-col :span="8">
        <el-card shadow="never" class="dashboard-info-card">
          <div class="dashboard-info-card-header">
            <h3>您好， {{name}}</h3>
            <span>you have 4 new messages</span>
          </div>
          <div>
            <h6>Pavan Kumpar</h6>
            <span>Just see the my adminl</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="never" class="dashboard-info-card">
          <div id="myChart" style="width: 100%; height: 450px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import echarts from "echarts";
export default {
  name: "Dashboard",
  data() {
    return {
      cards: [
        {
          name: "在线数",
          value: "1,738",
          bg: "#009EFB"
        },
        {
          name: "用户数",
          value: "2,064",
          bg: "#7460EE"
        },
        {
          name: "网页数",
          value: "5963",
          bg: "#39C449"
        },
        {
          name: "跳出率",
          value: "10%",
          bg: "#FFBC34"
        }
      ]
    };
  },
  mounted() {
    var myChart = echarts.init(document.getElementById("myChart"));
    // 绘制图表
    myChart.setOption({
      title: {
        text: "产品销量"
      },
      color: ["#009EFB", "#39C449"],
      legend: {
        right: 80,
        icon: "circle",
        selectedMode: false,
        align: "left",
        data: ["2019", "2020"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["0", "4", "8", "12", "16", "20", "24", "30"]
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value}k"
        },
        boundaryGap: false
      },
      series: [
        {
          name: "2019",
          data: [0, 2, 3, 0, 11, 1, 4, 1],
          type: "line",
          lineStyle: {
            width: 1
          },
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          areaStyle: {
            color: "rgba(0, 158, 251, 0.5)"
          }
        },
        {
          name: "2020",
          data: [0, 4, 0, 4, 0, 4, 0, 4],
          type: "line",
          lineStyle: {
            width: 1
          },
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          areaStyle: {
            color: "rgba(57, 196, 73, 0.5)"
          }
        }
      ]
    });
  },
  computed: {
    ...mapGetters(["name"])
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
  }

  &-card {
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid transparent;
    border-radius: 0.25rem;

    &-box {
      margin: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      padding: 0.5rem !important;
      border-radius: 4px !important;
      h1,
      h6 {
        margin: 0;
        margin-bottom: 0.5rem;
        line-height: 1.2;
        color: #fff !important;
      }

      h1 {
        font-weight: 300 !important;
        font-size: 2.25rem;
      }

      h6 {
        font-size: 0.875rem;
      }
    }
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }

  &-info {
    margin-top: 25px;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h6 {
      margin: 0;
      margin-bottom: 0.5rem;
      line-height: 1.2;
    }

    &-card {
      padding: 20px;
      &-header {
        margin-bottom: 15px;
      }
    }
  }
}

::v-deep .el-card__body {
  padding: 0 !important;
}
</style>
