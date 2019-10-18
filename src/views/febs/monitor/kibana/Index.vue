<template>
  <i-frame
    :src="kibanaUrl"
    @refresh="refresh"
  />
</template>
<script>
import iFrame from '@/components/iFrame'
import { kibanaUrl } from '@/settings'

export default {
  components: { iFrame },
  data() {
    return {
      kibanaUrl: kibanaUrl
    }
  },
  methods: {
    refresh(u) {
      this.kibanaUrl = u
    }
  }
}
</script>
