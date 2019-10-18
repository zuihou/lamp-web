<template>
  <i-frame
    :src="zipkinUrl"
    @refresh="refresh"
  />
</template>
<script>
import iFrame from '@/components/iFrame'
import { zipkinUrl } from '@/settings'

export default {
  components: { iFrame },
  data() {
    return {
      zipkinUrl: zipkinUrl
    }
  },
  methods: {
    refresh(u) {
      this.zipkinUrl = u
    }
  }
}
</script>
