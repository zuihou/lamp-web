<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.loginTime" placement="top">
        <el-card>
          <p><el-icon class="el-icon-link" />  {{ $t('table.loginLog.ip') }}：{{ item.ip }} </p>
          <p><el-icon class="el-icon-location-outline" />  {{ $t('table.loginLog.location') }}：{{ item.location }} </p>
          <p><el-icon class="el-icon-bangzhu" />  {{ $t('table.loginLog.browser') }}：{{ item.browser }} </p>
          <p><el-icon class="el-icon-monitor" />  {{ $t('table.loginLog.system') }}：{{ item.system }} </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      timeline: []
    }
  },
  mounted() {
    this.getTimeLine()
  },
  methods: {
    getTimeLine() {
      this.$get(`system/loginLog/${this.username}`).then((r) => {
        this.timeline = r.data.data
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
