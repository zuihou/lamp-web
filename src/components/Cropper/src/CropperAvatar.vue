<template>
  <div :class="getClass" :style="getStyle">
    <div :class="getCropperAvatarImageClass" :style="getImageWrapperStyle" @click="handleOpenModal">
      <div :class="`${prefixCls}-image-mask`" :style="getImageWrapperStyle">
        <Icon
          icon="ant-design:cloud-upload-outlined"
          :size="getIconWidth"
          :style="getImageWrapperStyle"
          color="#d6d6d6"
        />
      </div>
      <img v-if="realSrc" :src="realSrc" :alt="props.alt" />
    </div>
    <a-button
      :class="`${prefixCls}-upload-btn`"
      @click="handleOpenModal"
      v-if="showBtn"
      v-bind="btnProps"
    >
      {{ btnText ? btnText : t('component.cropper.selectImage') }}
    </a-button>

    <CopperModal
      @register="register"
      @upload-success="handleUploadSuccess"
      :uploadApi="uploadApi"
      :uploadParams="uploadParams"
      :src="realSrc"
      :circled="circled"
      :isDef="isDef"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, CSSProperties, unref, ref, watch, PropType } from 'vue';
  import CopperModal from './CopperModal.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import type { ButtonProps } from '/@/components/Button';
  import Icon from '/@/components/Icon';
  import { asyncFindUrlById, asyncFindDefUrlById } from '/@/api/lamp/file/upload';
  import { FileResultVO } from '/@/api/lamp/file/model/uploadModel';

  const props = {
    circled: { type: Boolean, default: true },
    width: { type: [String, Number], default: '200px' },
    value: { type: Object as PropType<FileResultVO>, default: {} },
    showBtn: { type: Boolean, default: true },
    btnProps: { type: Object as PropType<ButtonProps> },
    btnText: { type: String, default: '' },
    alt: { type: String, default: '' },
    // 是否上传到到默认库。 设置为true，文件将调用 asyncFindDefUrlById 加载异步文件
    isDef: { type: Boolean, default: false },
    uploadApi: {
      type: Function as PropType<PromiseFn>,
      default: null,
      required: false,
    },
    uploadParams: {
      type: Object as PropType<any>,
      default: {},
    },
  };

  export default defineComponent({
    name: 'CropperAvatar',
    components: { CopperModal, Icon },
    props,
    emits: ['update:value', 'change'],
    setup(props, { emit, expose }) {
      const realSrc = ref<string>('');

      const { prefixCls } = useDesign('cropper-avatar');
      const [register, { openModal, closeModal }] = useModal();
      const { createMessage } = useMessage();
      const { t } = useI18n();

      const getClass = computed(() => [prefixCls]);

      const getWidth = computed(() => `${props.width}`.replace(/px/, '') + 'px');

      const getIconWidth = computed(() => parseInt(`${props.width}`.replace(/px/, '')) / 2 + 'px');

      const getStyle = computed((): CSSProperties => ({ width: unref(getWidth) }));

      const getImageWrapperStyle = computed(
        (): CSSProperties => ({ width: unref(getWidth), height: unref(getWidth) }),
      );

      const getCropperAvatarImageClass = computed(() => {
        if (props.circled) {
          return [`${prefixCls}-image-wrapper`, `${prefixCls}-image-wrapper-circled`];
        } else {
          return [`${prefixCls}-image-wrapper`];
        }
      });

      watch(
        () => props.value,
        () => {
          realSrc.value = '';
          if (props.value && props.value.id) {
            loadSrc();
          }
        },
        { immediate: true },
      );

      function loadSrc() {
        if (!props.value.id) {
          return;
        }
        const api = props.isDef ? asyncFindDefUrlById : asyncFindUrlById;
        api(props.value.id).then((res) => {
          if (res.code === 0) {
            realSrc.value = res.data as string;
          }
        });
      }

      function handleUploadSuccess({ data }) {
        createMessage.success(t('component.cropper.uploadSuccess'));
        emit('update:value', data);
        emit('change', data);
      }

      function handleOpenModal() {
        openModal(true, { src: realSrc.value });
      }

      expose({ openModal: openModal.bind(null, true), closeModal });

      return {
        t,
        props,
        prefixCls,
        register,
        openModal: openModal as any,
        getIconWidth,
        realSrc,
        getClass,
        getImageWrapperStyle,
        getCropperAvatarImageClass,
        getStyle,
        handleUploadSuccess,
        handleOpenModal,
      };
    },
  });
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-cropper-avatar';

  .@{prefix-cls} {
    display: inline-block;
    text-align: center;

    &-image-wrapper-circled {
      border-radius: 50%;
    }

    &-image-wrapper {
      overflow: hidden;
      cursor: pointer;
      background: @component-background;
      border: 1px solid @border-color-base;

      img {
        width: 100%;
      }
    }

    &-image-mask {
      opacity: 0%;
      position: absolute;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      border: inherit;
      background: rgb(0 0 0 / 40%);
      cursor: pointer;
      transition: opacity 0.4s;

      ::v-deep(svg) {
        margin: auto;
      }
    }

    &-image-mask:hover {
      opacity: 4000%;
    }

    &-upload-btn {
      margin: 10px auto;
    }
  }
</style>
