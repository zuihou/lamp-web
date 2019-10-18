<template>
  <i-frame
    :src="springBootAdmin"
    @refresh="refresh"
  />
</template>
<script>
import iFrame from '@/components/iFrame'
import { springBootAdminUrl } from '@/settings'

export default {
  components: { iFrame },
  data() {
    return {
      springBootAdmin: springBootAdminUrl
    }
  },
  mounted() {
    setTimeout(() => {
      this.$notify.info({
        title: this.$t('common.tips'),
        message: this.$t('tips.iframeGrant'),
        duration: 5000
      })
    }, 1000)
  },
  methods: {
    refresh(u) {
      this.springBootAdmin = u
    }
  }
}
</script>
