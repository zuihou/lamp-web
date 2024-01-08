<template>
  <BasicForm @register="registerForm" />
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { get } from '/@/api/devOperation/tenant/tenant';
  import { listByBizId } from '/@/api/lamp/file/upload';
  import { editFormSchema } from '../tenant.data';
  import { ActionEnum, FileBizTypeEnum, ServicePrefixEnum } from '/@/enums/commonEnum';

  export default defineComponent({
    name: 'TenantView',
    components: { BasicForm },
    emits: ['success', 'register'],
    setup(_) {
      const { t } = useI18n();
      const { currentRoute } = useRouter();

      const [registerForm, { setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: editFormSchema(ref<ActionEnum>(ActionEnum.VIEW)),
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
        readonly: true,
      });

      onMounted(() => {
        const { params } = currentRoute.value;
        const id = params.id;
        load({ id });
      });

      const load = async (data: Recordable) => {
        const record = await get(data?.id);
        const area: string[] = [];
        if (record.provinceId) {
          area.push(record.provinceId);
        }
        if (record.cityId) {
          area.push(record.cityId);
        }
        if (record.districtId) {
          area.push(record.districtId);
        }
        record.area = area;

        const logos = await listByBizId({
          prefix: ServicePrefixEnum.TENANT,
          bizId: data?.id,
          bizType: FileBizTypeEnum.DEF_TENANT_LOGO,
          isDef: true,
        });
        record.logos = logos;
        setFieldsValue({ ...record });
      };

      async function handleSubmit() {}

      return { t, registerForm, handleSubmit };
    },
  });
</script>
