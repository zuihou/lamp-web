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

  export default defineComponent({
    name: '服务器监控',
    components: { PageWrapper, Description, BasicTable },
    setup() {
      const loadingRef = ref(false);

      const [registerCpu, { setDescProps: setCpu }] = useDescription({
        title: 'CPU',
        schema: cpuSchema,
      });
      const [registerMem, { setDescProps: setMem }] = useDescription({
        title: '内存',
        schema: memSchema,
      });
      const [registerServer, { setDescProps: setSys }] = useDescription({
        title: '服务器',
        schema: sysSchema,
      });
      const [registerJvm, { setDescProps: setJvm }] = useDescription({
        title: '虚拟机',
        schema: jvmSchema,
      });
      const [registerTable, { setTableData }] = useTable({
        title: '磁盘',
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
