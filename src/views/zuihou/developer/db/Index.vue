<template>
  <el-tabs
    v-model="activeName"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="权限服务"
      name="first"
    >
      <i-frame
        ref="authorityDruid"
        :src="authorityDruid"
        @refresh="authorityRefresh"
      />
    </el-tab-pane>
    <el-tab-pane
      label="文件服务"
      name="second"
    >
      <i-frame
        ref="fileDruid"
        :src="fileDruid"
        @refresh="fileRefresh"
      />
    </el-tab-pane>
    <el-tab-pane
      label="消息服务"
      name="third"
    >
      <i-frame
        ref="msgsDruid"
        :src="msgsDruid"
        @refresh="msgsRefresh"
      />
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
      msgsDruid: '',
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

    this.msgsDruid = this.druidUrl("msgs")
    this.$refs.msgsDruid.url = this.msgsDruid
  },
  methods: {
    authorityRefresh (u) {
      this.authorityDruid = u
    },
    fileRefresh (u) {
      this.fileDruid = u
    },
    msgsRefresh (u) {
      this.msgsDruid = u
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
