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
          <div id="myChart1" style="width: 100%; height: 450px"></div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="never" class="dashboard-info-card">
          <div id="myChart" style="width: 100%; height: 450px"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="dashboard-info">
      <el-col :span="24">
        <el-card shadow="never" class="dashboard-info-card">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="date" label="日期"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="province" label="省份"></el-table-column>
            <el-table-column prop="city" label="市区"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="zip" label="邮编"></el-table-column>
          </el-table>
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
          bg: "#009EFB",
        },
        {
          name: "用户数",
          value: "2,064",
          bg: "#7460EE",
        },
        {
          name: "网页数",
          value: "5963",
          bg: "#39C449",
        },
        {
          name: "跳出率",
          value: "10%",
          bg: "#FFBC34",
        },
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333,
        },
      ],
    };
  },
  mounted() {
    var myChart = echarts.init(document.getElementById("myChart"));
    // 绘制图表
    myChart.setOption({
      title: {
        text: "产品销量",
      },
      color: ["#009EFB", "#39C449"],
      legend: {
        right: 80,
        icon: "circle",
        selectedMode: false,
        align: "left",
        data: ["2019", "2020"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["0", "4", "8", "12", "16", "20", "24", "30"],
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value}k",
        },
        boundaryGap: false,
      },
      series: [
        {
          name: "2019",
          data: [0, 2, 3, 0, 11, 1, 4, 1],
          type: "line",
          lineStyle: {
            width: 1,
          },
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          areaStyle: {
            color: "rgba(0, 158, 251, 0.5)",
          },
        },
        {
          name: "2020",
          data: [0, 4, 0, 4, 0, 4, 0, 4],
          type: "line",
          lineStyle: {
            width: 1,
          },
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          areaStyle: {
            color: "rgba(57, 196, 73, 0.5)",
          },
        },
      ],
    });
    var myChart1 = echarts.init(document.getElementById("myChart1"));
    myChart1.setOption({
      title: {
        text: "访问统计",
      },
      color: ["#009EFB", "#39C449", "#7460EE", "#FFBC34"],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      legend: {
        orient: "vertical",
        selectedMode: false,
        right: 10,
        data: ["直接访问", "邮件营销", "联盟广告", "视频广告"],
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1335, name: "直接访问" },
            { value: 310, name: "邮件营销" },
            { value: 234, name: "联盟广告" },
            { value: 135, name: "视频广告" },
          ],
        },
      ],
    });
  },
  computed: {
    ...mapGetters(["name"]),
  },
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
