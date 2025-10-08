<template>
  <PageWrapper v-loading="loadingRef">
    <Description class="mt-4" @register="registerCpu" />
    <Description class="mt-4" @register="registerMem" />
    <Description class="mt-4" @register="registerServer" />
    <Description class="mt-4" @register="registerJvm" />
    <BasicTable class="mt-4" @register="registerTable" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Description, useDescription } from '/@/components/Description/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { columns, cpuSchema, jvmSchema, memSchema, sysSchema } from './server.data';
  import { get } from '/@/api/devOperation/developer/defServer';
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: '服务器监控',
    components: { PageWrapper, Description, BasicTable },
    setup() {
      const { t } = useI18n();
      const loadingRef = ref(false);

      const [registerCpu, { setDescProps: setCpu }] = useDescription({
        title: 'CPU',
        schema: cpuSchema,
      });
      const [registerMem, { setDescProps: setMem }] = useDescription({
        title: t('devOperation.developer.srever.memory.title'),
        schema: memSchema,
      });
      const [registerServer, { setDescProps: setSys }] = useDescription({
        title: t('devOperation.developer.srever.server.title'),
        schema: sysSchema,
      });
      const [registerJvm, { setDescProps: setJvm }] = useDescription({
        title: t('devOperation.developer.srever.jvm.title'),
        schema: jvmSchema,
      });
      const [registerTable, { setTableData }] = useTable({
        title: t('devOperation.developer.srever.disk.title'),
        columns,
        rowKey: 'dirName',
        pagination: false,
        showIndexColumn: false,
        scroll: { y: 300 },
      });

      onMounted(async () => {
        loadingRef.value = true;
        try {
          const obj = await get();
          setCpu({ data: obj.cpu });
          setMem({ data: obj.mem });
          setJvm({ data: obj.jvm });
          setSys({ data: obj.sys });
          setTableData(obj.sysFiles);
        } finally {
          loadingRef.value = false;
        }
      });
      return {
        t,
        registerCpu,
        registerMem,
        registerServer,
        registerJvm,
        registerTable,
        loadingRef,
      };
    },
  });
</script>
