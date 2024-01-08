<template>
  <div :class="[prefixCls, { fullscreen }]">
    <Upload
      name="file"
      multiple
      @change="handleChange"
      :action="actionUrl"
      :showUploadList="false"
      :headers="headers"
      :data="props.uploadParams"
      accept=".jpg,.jpeg,.gif,.png,.webp"
    >
      <a-button type="primary" v-bind="{ ...getButtonProps }">
        {{ t('component.upload.imgUpload') }}
      </a-button>
    </Upload>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { Base64 } from 'js-base64';
  import { Upload } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getTenantId, getToken, getApplicationId } from '/@/utils/auth';
  import { MultiTenantTypeEnum } from '/@/enums/biz/tenant';

  export default defineComponent({
    name: 'TinymceImageUpload',
    components: { Upload },
    props: {
      fullscreen: {
        type: Boolean,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      uploadParams: {
        type: Object as PropType<any>,
        default: () => {},
      },
    },
    emits: ['uploading', 'done', 'error'],
    setup(props, { emit }) {
      let uploading = false;

      const {
        uploadUrl,
        apiUrl,
        multiTenantType,
        clientId,
        clientSecret,
        tokenKey,
        tenantIdKey,
        applicationIdKey,
        authorizationKey,
      } = useGlobSetting();
      const actionUrl = apiUrl + uploadUrl;
      const { t } = useI18n();
      const { prefixCls } = useDesign('tinymce-img-upload');
      const { createMessage } = useMessage();

      const getButtonProps = computed(() => {
        const { disabled } = props;
        return {
          disabled,
        };
      });

      function handleChange(info: Recordable) {
        const file = info.file;
        const status = file?.status;
        const fileId = file?.response?.data?.id;
        const name = file?.name;
        const isSuccess = file?.response?.isSuccess;
        if (status === 'uploading') {
          if (!uploading) {
            emit('uploading', name);
            uploading = true;
          }
        } else if (status === 'done') {
          emit('done', name, fileId);
          uploading = false;
        } else if (status === 'error') {
          createMessage.error('文件服务异常，上传图片失败!');
          emit('error');
          uploading = false;
        } else if (file?.response && !isSuccess) {
          createMessage.error('上传图片失败!');
          emit('error');
          uploading = false;
        }
      }

      const headers = {};
      // 增加token
      const token = getToken();
      if (token) {
        headers[tokenKey] = `${token}`;
      }
      // 增加租户编码
      if (multiTenantType !== MultiTenantTypeEnum.NONE) {
        headers[tenantIdKey] = getTenantId();
      }
      // 添加客户端信息
      headers[applicationIdKey] = getApplicationId();
      headers[authorizationKey] = `${Base64.encode(`${clientId}:${clientSecret}`)}`;

      return {
        prefixCls,
        handleChange,
        actionUrl,
        t,
        headers,
        getButtonProps,
        props,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-tinymce-img-upload';

  .@{prefix-cls} {
    position: absolute;
    top: 4px;
    right: 10px;
    z-index: 20;

    &.fullscreen {
      position: fixed;
      z-index: 10000;
    }
  }
</style>
