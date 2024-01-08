<template>
  <div>
    <Tooltip :mouseEnterDelay="0.5" placement="bottom" title="切换机构">
      <span @click="handleSwitch">
        <SwapOutlined />
      </span>
    </Tooltip>
    <SwitchCompany @register="registerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { SwapOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import SwitchCompany from './SwitchCompany.vue';

  export default defineComponent({
    name: 'CompanyList',
    components: { Tooltip, SwapOutlined, SwitchCompany },
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
