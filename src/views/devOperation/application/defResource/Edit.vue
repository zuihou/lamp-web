<template>
  <div class="m-4 ml-2 overflow-hidden bg-white">
    <a-card :title="title" :bordered="false">
      <template #extra>
        <div class="flex justify-center" v-if="type !== ActionEnum.VIEW">
          <a-button @click="resetFields">{{ t('common.resetText') }}</a-button>
          <a-button class="!ml-4" type="primary" @click="handleSubmit" :loading="confirmLoading">
            {{ t('common.saveText') }}
          </a-button>
        </div>
      </template>
      <BasicForm @register="register">
        <template #resourceApiList="{ model, field }">
          <ResourceApi v-model:value="model[field]" :type="type" />
        </template>
        <template #metaJson="{ model, field }">
          <MetaJson ref="meta" v-model:value="model[field]" :type="type" />
        </template>
      </BasicForm>

      <div class="flex justify-center" v-if="type !== ActionEnum.VIEW">
        <a-button @click="resetFields">{{ t('common.resetText') }}</a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit" :loading="confirmLoading">
          {{ t('common.saveText') }}
        </a-button>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { Card } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ActionEnum, VALIDATE_API } from '/@/enums/commonEnum';
  import MetaJson from './meta/MetaJson.vue';
  import ResourceApi from './api/ResourceApi.vue';

  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { Api, save, update, get } from '/@/api/devOperation/application/defResource';
  import { customFormSchemaRules, editFormSchema } from './defResource.data';

  export default defineComponent({
    name: 'DefResourceEdit',
    components: { BasicForm, [Card.name]: Card, MetaJson, ResourceApi },
    emits: ['success'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const type = ref<ActionEnum>(ActionEnum.VIEW);
      const confirmLoading = ref<boolean>(false);
      const title = ref<string>('未选中任何资源');
      const [
        register,
        { setFieldsValue, getFieldsValue, resetFields, resetSchema, updateSchema, validate },
      ] = useForm({
        labelWidth: 110,
        showActionButtonGroup: false,
        schemas: editFormSchema(type),
        baseColProps: { span: 24 },
        disabled: () => {
          return unref(type) === ActionEnum.VIEW;
        },
      });

      // 提交
      async function handleSubmit() {
        try {
          const params = await validate();
          confirmLoading.value = true;
          if (unref(type) === ActionEnum.EDIT) {
            await update(params);
          } else {
            await save(params);
          }
          createMessage.success(t(`common.tips.${type.value}Success`));

          type.value = ActionEnum.VIEW;
          await resetFields();
          title.value = '未选中任何资源';
          emit('success', params.applicationId);
        } finally {
          confirmLoading.value = false;
        }
      }

      async function resetForm(record: Recordable) {
        await resetFields();
        if (record?.applicationName) {
          title.value = '未选中任何资源';
        }
      }

      // 设置回显数据
      async function setData(data: Recordable) {
        await resetSchema(editFormSchema(type));
        await resetFields();
        type.value = data?.type;

        const { parent } = data;
        let resourceVO = {};
        if (unref(type) !== ActionEnum.ADD) {
          resourceVO = await get(data.record.id);
        }
        const record = { ...data.record, ...resourceVO };
        if (record?.applicationName) {
          if (unref(type) === ActionEnum.ADD) {
            title.value =
              t(`common.title.${type.value}`) +
              `【${record?.applicationName}】中【${parent?.name}】的子资源`;
          } else {
            title.value =
              t(`common.title.${type.value}`) +
              `【${record?.applicationName}】中的【${record?.name}】`;
          }
        }
        record['parentName'] = parent?.name;
        record['parentId'] = parent?.id;
        record['parentResourceType'] = parent?.resourceType;
        if (unref(type) !== ActionEnum.EDIT) {
          record.id = undefined;
        }

        await setFieldsValue({ ...record });

        if (unref(type) !== ActionEnum.VIEW) {
          let validateApi = Api[VALIDATE_API[unref(type)]];

          const rules = await getValidateRules(
            validateApi,
            customFormSchemaRules(type, getFieldsValue),
          );
          rules && rules.length > 0 && (await updateSchema(rules));
          // getValidateRules(validateApi, customFormSchemaRules(type)).then(async (rules) => {
          //   console.log(rules);
          //   rules && rules.length > 0 && (await updateSchema(rules));
          // });
        }
      }

      return {
        register,
        resetFields,
        handleSubmit,
        setData,
        t,
        title,
        confirmLoading,
        resetForm,
        type,
        ActionEnum,
      };
    },
  });
</script>
<style lang="less" scoped></style>
