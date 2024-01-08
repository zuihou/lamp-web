<template>
  <div>
    <Tooltip :mouseEnterDelay="0.5" placement="bottom" title="切换企业和机构">
      <span @click="handleSwitch">
        <SwapOutlined />
      </span>
    </Tooltip>
    <SwitchTenant @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { SwapOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import SwitchTenant from './SwitchTenant.vue';

  export default defineComponent({
    name: 'TenantCompanyList',
    components: { Tooltip, SwapOutlined, SwitchTenant },
    setup() {
      const [registerModal, { openModal }] = useModal();

      function handleSwitch() {
        openModal(true, {});
      }

      return {
        handleSwitch,
        registerModal,
      };
    },
  });
</script>
