<template>
  <div class="main">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="app-container user-container">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12">
              <div class="user-wrapper">
                <div class="user-header">
                  <img alt="avatar" :src="avatar">
                </div>
                <div class="user-info">
                  <div class="random-message">
                    {{ welcomeMessage }}
                  </div>
                  <div class="user-dept">
                    <span>{{ user.deptName ? user.deptName : $t('common.noDept') }}</span> | <span>{{ user.roleName ? user.roleName : $t('common.noRole') }}</span>
                  </div>
                  <div class="user-login-info">
                    {{ $t('common.lastLoginTime') }}：<span id="last-login-time">{{ user.lastLoginTime ? user.lastLoginTime : $t('common.firstLogin') }}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12">
              <div class="user-visits">
                <el-row style="margin-bottom: .7rem">
                  <el-col :span="4" :offset="4">{{ $t('common.todayIp') }}</el-col>
                  <el-col :span="4" :offset="4">{{ $t('common.todayVisit') }}</el-col>
                  <el-col :span="4" :offset="4">{{ $t('common.TotalVisit') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="4" :offset="4" class="num">
                    <el-link type="primary">
                      <countTo :start-val="0" :end-val="todayIp" :duration="3000" />
                    </el-link>
                  </el-col>
                  <el-col :span="4" :offset="4" class="num">
                    <el-link type="primary">
                      <countTo :start-val="0" :end-val="todayVisit" :duration="3000" />
                    </el-link>
                  </el-col>
                  <el-col :span="4" :offset="4" class="num">
                    <el-link type="primary">
                      <countTo :start-val="0" :end-val="totalVisit" :duration="3000" />
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
      <el-col :xs="24" :sm="12">
        <div class="app-container">
          <div id="visit-count-chart" style="width: 100%;height: 20rem" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="app-container project-wrapper">
          <div class="project-header">
            <el-link type="primary" href="https://github.com/wuyouzhuguli?tab=repositories" target="_blank" style="float: right;">{{ $t('common.allProject') }}</el-link>
          </div>
          <table>
            <tr>
              <td>
                <div class="project-avatar-wrapper">
                  <el-avatar class="project-avatar">{{ projects[0].avatar }}</el-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[0].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[0].des }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="project-avatar-wrapper">
                  <el-avatar class="project-avatar">{{ projects[1].avatar }}</el-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[1].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[1].des }}</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="project-avatar-wrapper">
                  <el-avatar class="project-avatar">{{ projects[2].avatar }}</el-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[2].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[2].des }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="project-avatar-wrapper">
                  <el-avatar class="project-avatar">{{ projects[3].avatar }}</el-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[3].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[3].des }}</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="project-avatar-wrapper">
                  <el-avatar class="project-avatar">{{ projects[4].avatar }}</el-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[4].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[4].des }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class="project-avatar-wrapper">
                  <el-avatar class="project-avatar">{{ projects[5].avatar }}</el-avatar>
                </div>
                <div class="project-detail">
                  <div class="project-name">
                    {{ projects[5].name }}
                  </div>
                  <div class="project-desc">
                    <p>{{ projects[5].des }}</p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
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

export default {
  name: 'Dashboard',
  components: { countTo },
  mixins: [resize],
  data() {
    return {
      welcomeMessage: '',
      todayIp: 0,
      todayVisit: 0,
      totalVisit: 0,
      chart: null,
      projects: [
        {
          name: 'FEBS-Shiro',
          des: 'Spring Boot 2.0.4 & Shiro1.4.0 权限管理系统。',
          avatar: 'F'
        },
        {
          name: 'FEBS-Security',
          des: 'Spring Boot 2.0.4 & Spring Security 5.0.7 权限管理系统。',
          avatar: 'F'
        },
        {
          name: 'SpringAll',
          des: '循序渐进学习Spring Boot、Spring Cloud与Spring Security。',
          avatar: 'S'
        },
        {
          name: 'FEBS-Shiro-Vue',
          des: 'FEBS-Shiro前后端分离版本，前端架构采用Vue全家桶。',
          avatar: 'F'
        },
        {
          name: 'FEBS-Cloud',
          des: 'Spring Cloud Greenwich.SR1 & Spring Security OAuth2 微服务权限管理系统。',
          avatar: 'F'
        },
        {
          name: 'FEBS-Cloud-Web',
          des: 'FEBS-Cloud前端，使用 vue-element-admin 构建。',
          avatar: 'F'
        }
      ]
    }
  },
  computed: {
    user() {
      return this.$store.state.account.user
    },
    avatar() {
      return require(`@/assets/avatar/${this.user.avatar}`)
    }
  },
  mounted() {
    this.welcomeMessage = this.welcome()
    this.initIndexData()
  },
  methods: {
    welcome() {
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
      return `${time}, ${this.user.username}, ${welcomeArr[index]}`
    },
    initIndexData: function() {
      this.$get(`system/user/index/${this.user.username}`).then((r) => {
        const data = r.data.data
        this.todayIp = data.todayIp
        this.totalVisit = data.totalVisitCount
        this.todayVisit = data.todayVisitCount
        const tenVisitCount = []
        const dateArr = []
        for (let i = 10; i >= 0; i--) {
          const time = parseTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * i), '{m}-{d}')
          let contain = false
          for (const o of data.lastTenVisitCount) {
            if (o.days === time) {
              contain = true
              tenVisitCount.push(o.count)
            }
          }
          if (!contain) {
            tenVisitCount.push(0)
          }
          dateArr.push(time)
        }
        const tenUserVisitCount = []
        for (let i = 10; i >= 0; i--) {
          const time = parseTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * i), '{m}-{d}')
          let contain = false
          for (const o of data.lastTenUserVisitCount) {
            if (o.days === time) {
              contain = true
              tenUserVisitCount.push(o.count)
            }
          }
          if (!contain) {
            tenUserVisitCount.push(0)
          }
        }
        this.chart = echarts.init(document.getElementById('visit-count-chart'))
        const option = {
          backgroundColor: '#FFF',
          title: {
            text: this.$t('common.visitTitle') + '\n',
            textStyle: {
              fontSize: 14
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: [this.$t('common.you'), this.$t('common.total')],
            top: '18'
          },
          grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true,
            show: false
          },
          toolbox: {
            feature: {
              dataView: { show: false, readOnly: false }
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            splitLine: {
              show: false
            },
            data: dateArr,
            axisLine: {
              lineStyle: {
                color: '#333'
              }
            }
          },
          yAxis: [
            {
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#DDD'
                }
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#333'
                }
              },
              nameTextStyle: {
                color: '#999'
              },
              splitArea: {
                show: false
              }
            }],
          series: [
            {
              name: this.$t('common.you'),
              type: 'bar',
              barWidth: '25%',
              color: 'rgb(0, 227, 150)',
              data: tenUserVisitCount
            },
            {
              name: this.$t('common.total'),
              type: 'bar',
              barWidth: '25%',
              color: 'rgb(0, 143, 251)',
              data: tenVisitCount
            }
          ]
        }
        this.chart.setOption(option)
      })
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
        img {
          width: 5rem;
          margin: .5rem 1rem;
          border-radius: 50%
        }
      }
      .user-info {
        display: inline-block;
        vertical-align: middle;
        .random-message {
          font-size: 1rem;
          margin-bottom: .5rem;
        }
        .user-dept, .user-login-info {
          color: rgba(0, 0, 0, 0.45);
          margin-bottom: .5rem;
          font-size: .8rem;
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
          padding: .6rem;
          .project-avatar-wrapper {
            display:inline-block;
            float:left;
            margin-right:.7rem;
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
        display:inline-block;
        float:left;
        text-align:left;
        width: 75%;
        .project-name {
          font-size:.9rem;
          margin-top:-2px;
          font-weight:600;
        }
        .project-desc {
          color:rgba(0, 0, 0, 0.45);
          p {
            margin: 5px 0 0 0;
            font-size: .7rem;
            line-height: 1.3rem;
            white-space:normal;
          }
        }
      }
    }
    @media screen and (max-width: 1366px)
    {
      .user-info {
        max-width: 25rem;
      }
    }
    @media screen and (max-width: 1300px)
    {
      .user-info {
        max-width: 19rem;
      }
    }

    @media screen and (max-width: 1120px)
    {
      .user-info {
        max-width: 17rem;
      }
    }
  }
</style>
