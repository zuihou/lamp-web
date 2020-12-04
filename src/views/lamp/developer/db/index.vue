<template>
  <el-tabs @tab-click="handleClick" v-model="activeName">
    <el-tab-pane label="权限服务" name="first">
      <i-frame :src="authorityDruid" @refresh="authorityRefresh" ref="authorityDruid" />
    </el-tab-pane>
    <el-tab-pane label="文件服务" name="second">
      <i-frame :src="fileDruid" @refresh="fileRefresh" ref="fileDruid" />
    </el-tab-pane>
    <el-tab-pane label="消息服务" name="third">
      <i-frame :src="msgDruid" @refresh="msgRefresh" ref="msgDruid" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import iFrame from '@/components/iFrame'
import { druid } from '@/settings'

export default {
  components: { iFrame },
  data () {
    return {
      authorityDruid: '',
      fileDruid: '',
      msgDruid: '',
      activeName: 'first'
    }
  },
  computed: {

  },
  mounted () {
    setTimeout(() => {
      this.$notify.info({
        title: this.$t('common.tips'),
        message: this.$t('tips.iframeGrant'),
        duration: 5000
      })
    }, 1000)

    this.authorityDruid = this.druidUrl("authority")
    this.$refs.authorityDruid.url = this.authorityDruid

    this.fileDruid = this.druidUrl("file")
    this.$refs.fileDruid.url = this.fileDruid

    this.msgDruid = this.druidUrl("msg")
    this.$refs.msgDruid.url = this.msgDruid
  },
  methods: {
    authorityRefresh (u) {
      this.authorityDruid = u
    },
    fileRefresh (u) {
      this.fileDruid = u
    },
    msgRefresh (u) {
      this.msgDruid = u
    },
    handleClick (tab, event) {
      console.log(tab, event);
    },
    druidUrl (service) {
      if (druid[service]) {
        return druid[service][process.env.NODE_ENV]
      } else {
        return service
      }
    }
  }
}
</script>
