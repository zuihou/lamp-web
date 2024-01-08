<template>
  <Avatar v-bind="$attrs" :src="realSrc">
    {{ props.errorTxt }}
  </Avatar>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { propTypes } from '/@/utils/propTypes';
  import { asyncFindUrlById, asyncFindDefUrlById } from '/@/api/lamp/file/upload';

  export default defineComponent({
    name: 'AvatarPreview',
    components: {
      Avatar,
    },
    props: {
      src: propTypes.string.def(''),
      fileId: propTypes.string.def(''),
      errorTxt: propTypes.string.def(''),
      isDef: propTypes.bool.def(false),
    },
    setup(props) {
      const attrs = useAttrs();
      const realSrc = ref<string>('');

      watch(
        () => props.src,
        () => {
          if (props.src && props.src.startsWith('http')) {
            realSrc.value = props.src;
          } else if (props.src && props.src.startsWith('data:')) {
            realSrc.value = props.src;
          }
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
        const api = props.isDef ? asyncFindDefUrlById : asyncFindUrlById;
        api(props.fileId).then((res) => {
          if (res.code === 0) {
            realSrc.value = res.data as string;
          }
        });
      }

      return { attrs, realSrc, props };
    },
  });
</script>
