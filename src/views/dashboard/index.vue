<template>
  <div class='main'>
    <el-row :gutter='10'>
      <el-col :xs='24' :sm='24'>
        <div class='app-container user-container'>
          <el-row :gutter='10'>
            <el-col :xs='24' :sm='12'>
              <div class='user-wrapper'>
                <div class='user-header'>
                  <img alt='avatar' :src='avatar' />
                </div>
                <div class='user-info'>
                  <div class='random-message'>{{ welcomeMessage }}</div>
                  <div class='user-dept'>
                    <span>{{ user.workDescribe ? user.workDescribe : $t('common.workDescribe') }}</span>
                  </div>
                  <div class='user-login-info'>
                    {{ $t('common.lastLoginTime') }}：
                    <span
                      id='last-login-time'
                    >{{ user.lastLoginTime ? user.lastLoginTime : $t('common.firstLogin') }}</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :xs='24' :sm='12'>
              <div class='user-visits'>
                <el-row style='margin-bottom: .7rem'>
                  <el-col :span='4' :offset='4'>{{ $t('common.todayIp') }}</el-col>
                  <el-col :span='4' :offset='4'>{{ $t('common.todayVisit') }}</el-col>
                  <el-col :span='4' :offset='4'>{{ $t('common.TotalVisit') }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span='4' :offset='4' class='num'>
                    <el-link type='primary'>
                      <countTo :start-val='0' :end-val='todayIp' :duration='3000' />
                    </el-link>
                  </el-col>
                  <el-col :span='4' :offset='4' class='num'>
                    <el-link type='primary'>
                      <countTo :start-val='0' :end-val='todayVisit' :duration='3000' />
                    </el-link>
                  </el-col>
                  <el-col :span='4' :offset='4' class='num'>
                    <el-link type='primary'>
                      <countTo :start-val='0' :end-val='totalVisit' :duration='3000' />
                    </el-link>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter='10'>
      <el-col :xs='24' :sm='12'>
        <div class='app-container'>
          <div id='visit-count-chart' style='width: 100%;height: 20rem' />
        </div>
      </el-col>
      <el-col :xs='24' :sm='12'>
        <div class='app-container project-wrapper'>
          <div class='project-header'>
            <el-link
              type='primary'
              href='https://www.kancloud.cn/zuihou/zuihou-admin-cloud'
              target='_blank'
              style='float: right;'
            >{{ $t('common.docDetails') }}</el-link>
          </div>
          <table>
            <tr>
              <td>
                <div class='project-avatar-wrapper'>
                  <el-avatar class='project-avatar'>{{ projects[0].avatar }}</el-avatar>
                </div>
                <div class='project-detail'>
                  <div class='project-name'>{{ projects[0].name }}</div>
                  <div class='project-desc'>
                    <p>{{ projects[0].des }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class='project-avatar-wrapper'>
                  <el-avatar class='project-avatar'>{{ projects[1].avatar }}</el-avatar>
                </div>
                <div class='project-detail'>
                  <div class='project-name'>{{ projects[1].name }}</div>
                  <div class='project-desc'>
                    <p>{{ projects[1].des }}</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class='project-avatar-wrapper'>
                  <el-avatar class='project-avatar'>{{ projects[2].avatar }}</el-avatar>
                </div>
                <div class='project-detail'>
                  <div class='project-name'>{{ projects[2].name }}</div>
                  <div class='project-desc'>
                    <p>{{ projects[2].des }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class='project-avatar-wrapper'>
                  <el-avatar class='project-avatar'>{{ projects[3].avatar }}</el-avatar>
                </div>
                <div class='project-detail'>
                  <div class='project-name'>{{ projects[3].name }}</div>
                  <div class='project-desc'>
                    <p>{{ projects[3].des }}</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class='project-avatar-wrapper'>
                  <el-avatar class='project-avatar'>{{ projects[4].avatar }}</el-avatar>
                </div>
                <div class='project-detail'>
                  <div class='project-name'>{{ projects[4].name }}</div>
                  <div class='project-desc'>
                    <p>{{ projects[4].des }}</p>
                  </div>
                </div>
              </td>
              <td>
                <div class='project-avatar-wrapper'>
                  <el-avatar class='project-avatar'>{{ projects[5].avatar }}</el-avatar>
                </div>
                <div class='project-detail'>
                  <div class='project-name'>{{ projects[5].name }}</div>
                  <div class='project-desc'>
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
import dashboardApi from '@/api/Dashboard.js'

export default {
  name: 'Dashboard',
  components: { countTo },
  mixins: [resize],
  data () {
    return {
      welcomeMessage: '',
      todayIp: 0,
      todayVisit: 0,
      totalVisit: 0,
      chart: null,
      projects: [
        {
          name: 'SpringBoot',
          des: 'Spring Boot 2.1.2',
          avatar: 'F'
        },
        {
          name: 'SpringCloud',
          des: 'Spring Cloud Greenwich.RELEASE',
          avatar: 'F'
        },
        {
          name: 'Spring Cloud alibaba',
          des: 'SpringCloudAlibaba2.1.0.RELEASE & nacos & seata & Sentinel',
          avatar: 'S'
        },
        {
          name: 'Mybatis-Plus',
          des: 'Mybatis-plus 3.2.0：Mybatis 增强组件',
          avatar: 'F'
        },
        {
          name: 'J2cache',
          des: 'J2cache2.7.8: 二级缓存框架',
          avatar: 'F'
        },
        {
          name: '文件存储API',
          des: '封装文件接口，实现本地存储、阿里云、FastDFS存储的配置化',
          avatar: 'F'
        }
      ]
    }
  },
  computed: {
    user () {
      return this.$store.state.account.user
    },
    avatar () {
      // return require(`@/assets/avatar/${this.user.photo}`)
      return require(`@/assets/avatar/default.jpg`)
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
        debugger
        const data = r.data
        this.todayIp = data.todayIp
        this.totalVisit = data.totalVisitCount
        this.todayVisit = data.todayVisitCount
        const tenVisitCount = []
        const dateArr = []
        const tenUserVisitCount = []

        for (const index in data.lastTenVisitCount) {
          for (const key in data.lastTenVisitCount[index]) {
            dateArr.push(key)
            tenVisitCount.push(data.lastTenVisitCount[index][key])
            tenUserVisitCount.push(data.lastTenUserVisitCount[index][key])
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
        margin: 0.5rem 1rem;
        border-radius: 50%;
      }
    }
    .user-info {
      display: inline-block;
      vertical-align: middle;
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
