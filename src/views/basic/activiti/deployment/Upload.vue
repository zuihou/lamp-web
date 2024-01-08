<template>
  <BasicModal
    :maskClosable="false"
    showFooter
    title="上传"
    v-bind="$attrs"
    width="40%"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <BasicForm @register="registerForm">
      <template #file="{ model, field }">
        <Upload
          v-model:value="model[field]"
          :before-upload="beforeUpload"
          :max-count="1"
          placeholder="这里应该改成上传组件。"
          showUploadList
          @remove="removeFile"
        >
          <a-button type="primary">
            {{ t('component.upload.choose') }}
          </a-button>
        </Upload>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { Upload } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { customFormSchemaRules, uploadFormSchema } from './deployment.data';
  import { upload } from '/@/api/basic/activiti/deployment';

  export default defineComponent({
    name: 'DeploymentUpload',
    components: { BasicModal, BasicForm, Upload },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const type = ref(ActionEnum.ADD);
      const { createMessage } = useMessage();
      const fileListRef = ref<File[]>([]);

      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: uploadFormSchema,
        showActionButtonGroup: false,
        baseColProps: { span: 24 },
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        type.value = data?.type;

        const record = { ...data?.record };
        if (unref(type) === ActionEnum.EDIT) {
        } else {
          record.id = undefined;
        }

        await setFieldsValue({ ...record });

        await updateSchema(customFormSchemaRules(type));
      });

      // 上传前校验
      function beforeUpload(file: File) {
        const maxSize = 50 * 1024 * 1024; // 50M
        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
          return false;
        }

        fileListRef.value = [...unref(fileListRef), file];
        return false;
      }

      function removeFile(file: File) {
        const index = fileListRef.value.findIndex((item) => item?.uid === file.uid);
        index !== -1 && fileListRef.value.splice(index, 1);
      }

      async function handleSubmit() {
        try {
          const params = await validate();
          setModalProps({ confirmLoading: true });
          const res = await upload({
            data: params,
            file: fileListRef.value[0]
          });
          if (res?.data?.isSuccess) {
            createMessage.success('上传成功');
          }else {
            createMessage.error(res?.data?.msg);
          }
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { t, beforeUpload, removeFile, registerModal, registerForm, type, handleSubmit };
    },
  });
</script>
