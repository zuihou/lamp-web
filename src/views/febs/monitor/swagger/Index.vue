<template>
  <i-frame
    :src="swagger_ui"
    @refresh="refresh"
  />
</template>
<script>
import iFrame from '@/components/iFrame'
import { swaggerUrl } from '@/settings'

export default {
  components: { iFrame },
  data() {
    return {
      swagger_ui: swaggerUrl
    }
  },
  methods: {
    refresh(u) {
      this.swagger_ui = u
    }
  }
}
</script>
