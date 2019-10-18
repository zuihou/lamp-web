<template>
  <div v-loading="loading" :style="'height:'+ height">
    <div class="app-container" style="width: 100%;height: 100%">
      <el-row style="margin: 5px 0">
        <el-input v-model="url" :placeholder="$t('common.pleaseInputUrl')" style="width: 50%" />
        &nbsp;
        <el-button type="success" plain @click="refresh">{{ $t('table.refresh') }}</el-button>
        <el-button type="info" plain @click="openInNewPage">{{ $t('table.openInNewPage') }}</el-button>
      </el-row>
      <iframe :src="src" frameborder="no" style="width: 100%;height: 91%" scrolling="auto" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 87.7 + 'px',
      loading: true,
      url: this.src
    }
  },
  mounted: function() {
    setTimeout(() => {
      this.loading = false
    }, 500)
    window.onresize = () => {
      this.height = document.documentElement.clientHeight - 87.7 + 'px'
    }
  },
  methods: {
    refresh() {
      this.$emit('refresh', this.url)
    },
    openInNewPage() {
      window.open(this.url, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
  .app-container {
    margin: 0;
    padding: 5px;
  }
</style>
