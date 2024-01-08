<template>
  <BasicDrawer
    :maskClosable="false"
    :title="t(`common.title.${type}`)"
    showFooter
    v-bind="$attrs"
    width="70%"
    @ok="handleSubmit"
    @register="registerDrawer"
  >
    <BasicTitle span line style="margin-bottom: 1rem">字典</BasicTitle>
    <BasicForm @register="registerForm" />
    <BasicTitle span line>字典条目</BasicTitle>
    <DictItemModal ref="dictItemRef" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, h, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTitle } from '/@/components/Basic';
  import { ActionEnum, VALIDATE_API } from '/@/enums/commonEnum';
  import { Api, save, update } from '/@/api/devOperation/system/defDict';
  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { customFormSchemaRules, editFormSchema } from './defDict.data';
  import DictItemModal from './defDictItem/index.vue';

  export default defineComponent({
    name: '编辑字典',
    components: { BasicDrawer, BasicForm, BasicTitle, DictItemModal },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const type = ref<ActionEnum>(ActionEnum.ADD);
      const dictItemRef = ref<any>(null);
      const { createMessage, notification } = useMessage();
      const [registerForm, { setFieldsValue, resetFields, updateSchema, validate, resetSchema }] =
        useForm({
          labelWidth: 100,
          schemas: editFormSchema(type),
          showActionButtonGroup: false,
          actionColOptions: {
            span: 23,
          },
          baseColProps: { span: 12 },
        });

      function getDictItemRef() {
        return unref(dictItemRef);
      }

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetSchema(editFormSchema(type));
        await resetFields();
        await getDictItemRef().reset();
        setDrawerProps({ confirmLoading: false });
        type.value = data?.type;

        if (unref(type) !== ActionEnum.ADD) {
          // 赋值
          const record = { ...data?.record };
          await setFieldsValue({ ...record });

          getDictItemRef().load(data?.type, record.id);
        } else {
          getDictItemRef().load(data?.type);
        }

        if (unref(type) !== ActionEnum.VIEW) {
          let validateApi = Api[VALIDATE_API[unref(type)]];
          await getValidateRules(validateApi, customFormSchemaRules(type)).then(async (rules) => {
            rules && rules.length > 0 && (await updateSchema(rules));
          });
        }
      });

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });
          const params = await validate();
          const errMap = await getDictItemRef().fullValidate();
          if (errMap) {
            let msgStr = '';
            Object.values(errMap).forEach((errList: any) => {
              errList.forEach((params: any) => {
                const { rowIndex, column, rules } = params;
                rules.forEach((rule: any) => {
                  msgStr += `第 ${rowIndex + 1} 行 ${column.title} 校验错误：${rule.message} <br/>`;
                });
              });
            });
            notification.warn({
              message: '校验失败',
              description: () => {
                return h('div', { innerHTML: msgStr }, []);
              },
              duration: 5,
            });
            return;
          }

          const { insertRecords, removeRecords, updateRecords } = getDictItemRef().getRecordset();
          params.insertList = insertRecords;
          params.updateList = updateRecords;
          params.deleteList = removeRecords.map((item) => item.id);

          if (unref(type) !== ActionEnum.VIEW) {
            if (unref(type) === ActionEnum.EDIT) {
              await update(params);
            } else {
              params.id = null;
              await save(params);
            }
            createMessage.success(t(`common.tips.${type.value}Success`));
          }
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { t, dictItemRef, registerDrawer, registerForm, type, handleSubmit };
    },
  });
</script>
