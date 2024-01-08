// 模块方法
function basicLine() {
  return {
    color: ['#487EC1', '#48B9C1', '#A27DE2', '#32C0D6'],
    title: {},
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };
}

// 带有区域阴影的线形图
function areaLine() {
  return {
    color: ['#487EC1', '#48B9C1', '#A27DE2', '#32C0D6'],
    title: {},
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      name: '日期',
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          normal: {
            color: 'rgb(255, 70, 131)',
          },
        },
        areaStyle: {},
        data: [820, 932, 901, 934, 1290, 1330, 1320],
      },
    ],
  };
}

// 环形饼图
function ringPie() {
  return {
    color: ['#487EC1', '#48B9C1', '#A27DE2', '#32C0D6'],
    title: {
      text: '',
      x: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data: [],
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [],
      },
    ],
  };
}

// 一般饼图
function simplePie(text?) {
  return {
    color: ['#487EC1', '#48B9C1', '#A27DE2', '#32C0D6'],
    title: {
      text: text || '',
      x: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 'left',
      data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };
}

// 一般柱形图
function simpleBar(text?) {
  return {
    color: ['#487EC1', '#48B9C1', '#A27DE2', '#32C0D6'],
    title: {
      text: text,
      top: 0,
      left: '0',
      textStyle: {
        color: '#487EC1',
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: false },
        saveAsImage: { show: true },
      },
    },
    legend: {
      data: [] as string[],
      left: 'center',
      top: '0',
    },
    grid: {
      top: '20%',
      left: '0',
      right: '0',
      bottom: '0',
      containLabel: true,
      show: false,
    },
    xAxis: {
      type: 'category',
      axisPointer: {
        type: 'shadow',
      },
      boundaryGap: true,
      splitLine: {
        show: false,
        lineStyle: {
          type: 'dashed',
          color: '#DDD',
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#333',
        },
      },
      data: [] as string[],
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#DDD',
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#333',
        },
      },
      nameTextStyle: {
        color: '#999',
      },
      splitArea: {
        show: false,
      },
    },
    series: [] as any[],
  };
}
export { basicLine, areaLine, ringPie, simplePie, simpleBar };
