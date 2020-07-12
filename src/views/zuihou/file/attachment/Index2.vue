<!-- 一个上传事例文件 -->
<template>
  <div>
    <!-- 将上传组件全局注册 -->
    <!-- vue版 大文件上传，还在开发中。。。 -->
    <global-uploader></global-uploader>
    <el-button @click="upload">上传</el-button>
  </div>
</template>

<script>
  import Bus from '../../../../components/zuihou/js/bus';
  import globalUploader from '@/components/zuihou/globalUploader.vue'

  export default {
    components: {
      globalUploader
    },
    data() {
      return {}
    },
    mounted() {
      // 文件选择后的回调
      Bus.$on('fileAdded', () => {
        console.log('文件已选择')
      });

      // 文件上传成功的回调
      Bus.$on('fileSuccess', () => {
        console.log('文件上传成功')
      });
    },
    computed: {},
    methods: {
      upload() {
        // 打开文件选择框
        Bus.$emit('openUploader', {
          id: '1111'  // 传入的参数
        })
      }
    },
    destroyed() {
      Bus.$off('fileAdded');
      Bus.$off('fileSuccess');
    },
  }
</script>

<style scoped lang="scss">

</style>
