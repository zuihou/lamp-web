<template>
  <div class="main">
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="24"
      >
        <div class="app-container user-container">
          <el-row :gutter="10">
            <el-col
              :xs="24"
              :sm="12"
            >
              <div class="user-wrapper">
                <div class="user-header">
                  <el-avatar
                    :size="60"
                    fit="fill"
                    :src="avatar"
                  >
                    <el-avatar :size="60">
                      {{ user.name | userAvatarFilter }}
                    </el-avatar>
                  </el-avatar>
                </div>
                <div class="user-info">
                  <div class="random-message">
                    {{ welcomeMessage }}
                    <span style="color:red">演示环境维护不易，请勿乱删乱改数据！</span>
                  </div>
                  <div class="user-dept">
                    <span>{{ user.workDescribe ? user.workDescribe : $t('common.noWorkDescribe') }}</span>
                  </div>
                  <div class="user-login-info">
                    {{ $t('common.lastLoginTime') }}：
                    <span
                      id="last-login-time"
                    >{{ user.lastLoginTime ? user.lastLoginTime : $t('common.firstLogin') }}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
            >
              <div class="user-visits">
                <el-row style="margin-bottom: .7rem">
                  <el-col
                    :span="4"
                    :offset="4"
                  >
                    {{ $t('common.todayIp') }}
                  </el-col>
                  <el-col
                    :span="4"
                    :offset="4"
                  >
                    {{ $t('common.todayVisit') }}
                  </el-col>
                  <el-col
                    :span="4"
                    :offset="4"
                  >
                    {{ $t('common.TotalVisit') }}
                  </el-col>
                </el-row>
                <el-row>
                  <el-col
                    :span="4"
                    :offset="4"
                    class="num"
                  >
                    <el-link type="primary">
                      <countTo
                        :start-val="0"
                        :end-val="todayIp"
                        :duration="3000"
                      />
                    </el-link>
                  </el-col>
                  <el-col
                    :span="4"
                    :offset="4"
                    class="num"
                  >
                    <el-link type="primary">
                      <countTo
                        :start-val="0"
                        :end-val="todayVisit"
                        :duration="3000"
                      />
                    </el-link>
                  </el-col>
                  <el-col
                    :span="4"
                    :offset="4"
                    class="num"
                  >
                    <el-link type="primary">
                      <countTo
                        :start-val="0"
                        :end-val="totalVisit"
                        :duration="3000"
                      />
                    </el-link>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="12"
      >
        <div class="app-container">
          <div
            id="visit-count-chart"
            style="width: 100%;height: 20rem"
          />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="12"
      >
        <div class="app-container project-wrapper">
          <div class="project-header">
            <el-link
              type="primary"
              href="https://www.kancloud.cn/zuihou/zuihou-admin-cloud"
              target="_blank"
              style="float: right;"
            >
              {{ $t('common.docDetails') }}
            </el-link>
          </div>
          <table>
            <template v-for="(project, index) in projects">
              <tr
                v-if="index % 2 == 0"
                :key="index"
              >
                <td>
                  <div class="project-avatar-wrapper">
                    <el-avatar class="project-avatar">
                      {{ projects[index].avatar }}
                    </el-avatar>
                  </div>
                  <div class="project-detail">
                    <div class="project-name">
                      {{ projects[index].name }}
                    </div>
                    <div class="project-desc">
                      <p>{{ projects[index].des }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="project-avatar-wrapper">
                    <el-avatar class="project-avatar">
                      {{ projects[index + 1].avatar }}
                    </el-avatar>
                  </div>
                  <div class="project-detail">
                    <div class="project-name">
                      {{ projects[index + 1].name }}
                    </div>
                    <div class="project-desc">
                      <p>{{ projects[index + 1].des }}</p>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="12"
      >
        <div class="app-container">
          <div
            id="browser-count-chart"
            style="width: 100%;height: 20rem"
          />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="12"
      >
        <div class="app-container">
          <div
            id="operating-system-count-chart"
            style="width: 100%;height: 20rem"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from 'echarts'
import { parseTime } from '@/utils'
import countTo from 'vue-count-to'
import resize from '@/components/Charts/mixins/resize'
import { simplePie, simpleBar } from '@/utils/chartsOption'
import dashboardApi from '@/api/Dashboard.js'

export default {
  name: 'Dashboard',
  components: { countTo },
  filters: {
    userAvatarFilter (name) {
      return name.charAt(0)
    }
  },
  mixins: [resize],
  data () {
    return {
      welcomeMessage: '',
      todayIp: 0,
      todayVisit: 0,
      totalVisit: 0,
      chart: null,
      chartOption: simpleBar(this.$t('common.visitTitle') + '\n'),
      browserCountOption: simplePie("访问用户浏览器"),
      operatingSystemCountOption: simplePie("访问用户操作系统"),
      browserCountChart: null,
      operatingSystemCountChart: null,
      projects: [
        {
          name: 'SpringBoot',
          des: 'Spring Boot 2.1.2',
          avatar: 'SB'
        },
        {
          name: 'SpringCloud',
          des: 'Spring Cloud Greenwich.RELEASE',
          avatar: 'SC'
        },
        {
          name: 'Spring Cloud alibaba',
          des: 'SpringCloudAlibaba2.1.0.RELEASE & nacos & seata & Sentinel',
          avatar: 'SCA'
        },
        {
          name: 'Mybatis-Plus',
          des: 'Mybatis-plus 3.2.0：Mybatis 增强组件',
          avatar: 'MP'
        },
        {
          name: 'J2cache',
          des: 'J2cache2.7.8: 二级缓存框架',
          avatar: 'J'
        },
        {
          name: '文件存储API',
          des: '封装文件接口，实现本地存储、阿里云、FastDFS存储的配置化',
          avatar: 'F'
        },
        {
          name: '监控',
          des: '集成SpringBootAdmin、Zipkin、Redis、Mysql、定时任务等监控，对系统进行全方位监控护航',
          avatar: 'M'
        },
        {
          name: '容器技术',
          des: '虚拟化容器技术，让迁移、部署更加方便快捷',
          avatar: 'C'
        }
      ]
    }
  },
  computed: {
    user () {
      return this.$store.state.account.user
    },
    avatar () {
      return this.$store.state.account.user.avatar
    }
  },
  mounted () {
    this.welcomeMessage = this.welcome()
    this.initIndexData()
  },
  methods: {
    welcome () {
      const date = new Date()
      const hour = date.getHours()
      const time = hour < 6 ? this.$t('common.goodMorning') : (hour <= 11 ? this.$t('common.goodMorning') : (hour <= 13 ? this.$t('common.goodAfternoon') : (hour <= 18 ? this.$t('common.goodAfternoon') : this.$t('common.goodEvening'))))
      const welcomeArr = [
        this.$t('common.randomMessage.a'),
        this.$t('common.randomMessage.b'),
        this.$t('common.randomMessage.c'),
        this.$t('common.randomMessage.d'),
        this.$t('common.randomMessage.e'),
        this.$t('common.randomMessage.f'),
        this.$t('common.randomMessage.g'),
        this.$t('common.randomMessage.h'),
        this.$t('common.randomMessage.i')
      ]
      const index = Math.floor((Math.random() * welcomeArr.length))
      return `${time}, ${this.user.name}, ${welcomeArr[index]}`
    },
    initIndexData: function () {
      dashboardApi.getVisitList({}).then((r) => {
        if (r.isError) {
          return
        }
        const data = r.data
        this.todayIp = Number(data.todayIp)
        this.totalVisit = Number(data.totalVisitCount)
        this.todayVisit = Number(data.todayVisitCount)

        this.tenDaysData(data)
        this.browserCount(data.browserCount)
        this.operatingSystemCount(data.operatingSystemCount)
      })
    },
    tenDaysData (data) {
      const tenVisitCount = []
      const dateArr = []
      const tenUserVisitCount = []

      for (let i = 9;i >= 0;i--) {
        const time = parseTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * i), '{y}-{m}-{d}')
        let contain = false
        for (const o of data.lastTenVisitCount) {
          if (o.login_date === time) {
            contain = true
            tenVisitCount.push(o.count)
            break
          }
        }
        if (!contain) {
          tenVisitCount.push(0)
        }

        let userContain = false
        for (const o of data.lastTenUserVisitCount) {
          if (o.login_date === time) {
            userContain = true
            tenUserVisitCount.push(o.count)
            break
          }
        }
        if (!userContain) {
          tenUserVisitCount.push(0)
        }
        dateArr.push(time)
      }

      this.chart = echarts.init(document.getElementById('visit-count-chart'))
      this.chartOption.legend.data = [this.$t('common.you'), this.$t('common.total')]
      this.chartOption.xAxis.data = dateArr
      this.chartOption.series.push({
        name: this.$t('common.you'),
        type: 'bar',
        barWidth: '25%',
        color: 'rgb(0, 227, 150)',
        data: tenUserVisitCount
      })
      this.chartOption.series.push({
        name: this.$t('common.total'),
        type: 'bar',
        barWidth: '25%',
        color: 'rgb(0, 143, 251)',
        data: tenVisitCount
      })
      this.chart.setOption(this.chartOption)
    },
    browserCount (data) {
      if (!data) {
        return
      }
      const legend_data = []
      const series_data = []
      data.forEach(item => {
        const browser = item.browser || '未知'
        series_data.push({ value: item.count, name: browser })
        legend_data.push(browser)
      })

      this.browserCountOption.series[0].data = series_data
      this.browserCountOption.legend.data = legend_data

      this.browserCountChart = echarts.init(document.getElementById('browser-count-chart'), 'westeros')
      this.browserCountChart.setOption(this.browserCountOption)
    },
    operatingSystemCount (data) {
      if (!data) {
        return
      }
      const legend_data = []
      const series_data = []
      data.forEach(item => {
        const browser = item.operating_system || '未知'
        series_data.push({ value: item.count, name: browser })
        legend_data.push(browser)
      })

      this.operatingSystemCountOption.series[0].data = series_data
      this.operatingSystemCountOption.legend.data = legend_data

      this.browserCountChart = echarts.init(document.getElementById('operating-system-count-chart'), 'westeros')
      this.browserCountChart.setOption(this.operatingSystemCountOption)
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding: 10px;
  .app-container {
    margin: 0 0 10px 0;
  }
  .user-container {
    padding: 15px;
  }
  .user-wrapper {
    width: 100%;
    display: inline-block;
    .user-header {
      display: inline-block;
      vertical-align: middle;
    }
    .user-info {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
      .random-message {
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }
      .user-dept,
      .user-login-info {
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 0.5rem;
        font-size: 0.8rem;
        line-height: 1.1rem;
      }
    }
  }
  .user-visits {
    text-align: center;
    padding-right: 2rem;
    margin-top: 1rem;
    vertical-align: middle;
    .num {
      font-weight: 600;
    }
  }
  .project-wrapper {
    padding: 0;
    .project-header {
      padding: 18px;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      td {
        width: 50%;
        border-top: 1px solid #f1f1f1;
        border-bottom: 1px solid #f1f1f1;
        padding: 0.6rem;
        .project-avatar-wrapper {
          display: inline-block;
          float: left;
          margin-right: 0.7rem;
          .project-avatar {
            color: #42b983;
            background-color: #d6f8b8;
          }
        }
        &:nth-child(odd) {
          border-right: 1px solid #f1f1f1;
        }
      }
    }
    .project-detail {
      display: inline-block;
      float: left;
      text-align: left;
      width: 75%;
      .project-name {
        font-size: 0.9rem;
        margin-top: -2px;
        font-weight: 600;
      }
      .project-desc {
        color: rgba(0, 0, 0, 0.45);
        p {
          margin: 5px 0 0 0;
          font-size: 0.7rem;
          line-height: 1.3rem;
          white-space: normal;
        }
      }
    }
  }
  @media screen and (max-width: 1366px) {
    .user-info {
      max-width: 25rem;
    }
  }
  @media screen and (max-width: 1300px) {
    .user-info {
      max-width: 19rem;
    }
  }

  @media screen and (max-width: 1120px) {
    .user-info {
      max-width: 17rem;
    }
  }
}
</style>
