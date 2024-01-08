<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    width="30%"
    :maskClosable="false"
    title="续期"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #resourceIdList="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          :checkedKeys="checkedKeys"
          :expandedKeys="checkedKeys"
          checkable
          checkStrictly
          toolbar
          search
          highlight
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionEnum } from '/@/enums/commonEnum';
  import { isArray } from '/@/utils/is';
  import { Api, renewal, detail } from '/@/api/devOperation/application/defTenantApplicationRel';
  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { customFormSchemaRules, editFormSchema } from './defTenantApplicationRel.data';

  export default defineComponent({
    name: 'DefTenantApplicationRelEdit',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const type = ref<ActionEnum>(ActionEnum.ADD);
      const { createMessage } = useMessage();
      const treeData = ref<TreeItem[]>([]);
      const checkedKeys = ref<string[]>([]);
      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate, resetSchema }] =
        useForm({
          labelWidth: 100,
          schemas: editFormSchema(type),
          showActionButtonGroup: false,
          baseColProps: { span: 24 },
          actionColOptions: {
            span: 23,
          },
        });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        try {
          setDrawerProps({ confirmLoading: true });
          await resetSchema(editFormSchema(type));
          await resetFields();
          type.value = data?.type;

          const record = await detail(data?.record.id);
          treeData.value = record.resourceList as TreeItem[];
          checkedKeys.value = record.checkedList as string[];
          await setFieldsValue({ ...record });

          let validateApi = Api.Renewal;
          getValidateRules(validateApi, customFormSchemaRules(type)).then(async (rules) => {
            rules && rules.length > 0 && (await updateSchema(rules));
          });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      });

      async function handleSubmit() {
        try {
          const params = await validate();
          setDrawerProps({ confirmLoading: true });

          const checkedKeys = params.resourceIdList;
          const resourceIdList = (
            isArray(checkedKeys) ? checkedKeys : checkedKeys?.checked
          ) as string[];
          params.resourceIdList = resourceIdList;
          await renewal(params);

          createMessage.success('续期成功');
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { t, registerDrawer, registerForm, type, handleSubmit, treeData, checkedKeys };
    },
  });
</script>
