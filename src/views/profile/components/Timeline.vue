<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item :key="index" :timestamp="item.createTime" placement="top" v-for="(item,index) of timeline">
        <el-card>
          <p>
            <el-icon class="el-icon-link" />
            {{ $t('table.loginLog.requestIp') }}：{{ item.requestIp }}
          </p>
          <p>
            <el-icon class="el-icon-location-outline" />
            {{ $t('table.loginLog.location') }}：{{ item.location }}
          </p>
          <p>
            <el-icon class="el-icon-bangzhu" />
            {{ $t('table.loginLog.browser') }}：{{ item.browser }}
          </p>
          <p>
            <el-icon class="el-icon-monitor" />
            {{ $t('table.loginLog.operatingSystem') }}：{{ item.operatingSystem }}
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import loginLogApi from '@/api/LoginLog.js'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {

        }
      }
    }
  },
  data () {
    return {
      timeline: []
    }
  },
  mounted () {
    this.getTimeLine()
  },
  methods: {
    getTimeLine () {
      loginLogApi.page({ current: 1, size: 10, model:{userId: this.user.id} })
        .then((response) => {
          const res = response.data
          this.timeline = res.data.records
        })

    }
  }
}
</script>
<style lang="scss" scoped>
.el-card.is-always-shadow {
  box-shadow: none;
}
.el-card {
  border: 1px solid #f1f1f1;
  border-radius: 2px;
}
</style>
