<template>
  <span class="thumb">
    <template v-if="props.fileType === 'IMAGE'">
      <Image
        :src="realSrc"
        :width="props.width"
        :height="props.height"
        :fallback="props.fallback"
        :preview="props.preview"
        :placeholder="props.placeholder"
        :style="props.imageStyle"
      />
    </template>
    <template v-else>
      <a href="javascript:;" @click="onView(realSrc, $event)">{{ props.originalFileName }}</a>
    </template>
  </span>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';
  import { defineComponent, ref, watch } from 'vue';
  import { Image } from 'ant-design-vue';
  import { Base64 } from 'js-base64';
  import { propTypes } from '/@/utils/propTypes';
  import { asyncFindDefUrlById, asyncFindUrlById } from '/@/api/lamp/file/upload';
  import { errImg } from '/@/utils/file/base64Conver';
  import { useGlobSetting } from '/@/hooks/setting';

  export default defineComponent({
    components: { Image },
    props: {
      fileUrl: propTypes.string.def(''),
      fileId: propTypes.string.def(''),
      width: propTypes.oneOfType([propTypes.number.def(104), propTypes.string.def('104')]),
      height: propTypes.oneOfType([propTypes.number.def(104), propTypes.string.def('104')]),
      fileType: propTypes.string.def('IMAGE'),
      imageStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
      originalFileName: propTypes.string.def('未知文件'),
      preview: propTypes.bool.def(true),
      placeholder: propTypes.bool.def(false),
      fallback: propTypes.string.def(errImg),
      // 是否从默认库 查询附件. 若传了api，优先从传入的api中查询；没有传递api，则根据此参数，从内置接口查询
      isDef: propTypes.bool.def(false),
      api: {
        type: Function as PropType<PromiseFn>,
        default: null,
        required: false,
      },
    },
    setup(props) {
      const realSrc = ref<string>('');
      const { previewUrlPrefix } = useGlobSetting();

      watch(
        () => props.fileUrl,
        () => {
          realSrc.value = props.fileUrl;
        },
        { immediate: true },
      );

      watch(
        () => props.fileId,
        () => {
          if (props.fileId) {
            realSrc.value = '';
            loadSrc();
          }
        },
        { immediate: true },
      );

      function loadSrc() {
        if (!props.fileId) {
          return;
        }

        const api = props.api ?? (props.isDef ? asyncFindDefUrlById : asyncFindUrlById);
        api(props.fileId).then((res) => {
          if (res.code === 0) {
            realSrc.value = res.data as string;
          }
        });
      }
      function onView(realSrc: string, e: Event) {
        e?.stopPropagation();
        e?.preventDefault();
        if (realSrc) {
          window.open(previewUrlPrefix + encodeURIComponent(Base64.encode(realSrc)));
        }
      }

      return { realSrc, errImg, props, onView };
    },
  });
</script>
<style lang="less" scoped>
  .thumb {
    img {
      position: static;
      display: block;
      object-fit: cover;
      //max-height: 104px;
      margin: 0 auto;
    }
  }
</style>
