<template>
  <div class="m-4 ml-2 overflow-hidden bg-white appResTabs">
    <Card :title="title">
      <template #extra>
        <a-button
          class="!ml-4"
          v-if="showSaveBtn"
          type="primary"
          @click="handleSubmit"
          :loading="confirmLoading"
          v-hasAnyPermission="[RoleEnum.ROLE_BIND_RESOURCE]"
        >
          {{ t('common.saveText') }}
        </a-button>
        <span v-else>系统角色拥有全部权限</span>
      </template>

      <ApplicationTab
        v-for="item in applicationResourceList"
        :key="item.defApplication.id"
        :application="item.defApplication"
        :resourceList="item.resourceList"
        :checkedKeys="appResMap[item.defApplication.id]"
        :ref="(el) => (itemRefs[item.defApplication.id] = el)"
      />
      <Empty v-if="applicationResourceList.length === 0" />
    </Card>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, toRefs, reactive } from 'vue';
  import { Card, Empty } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { findAvailableApplicationResourceList } from '/@/api/devOperation/application/defApplication';
  import ApplicationTab from './ApplicationTab.vue';
  import { isArray } from '/@/utils/is';
  import { findResourceIdByRoleId, saveRoleResource } from '/@/api/basic/system/baseRole';
  import { BaseRoleResourceRelSaveVO } from '/@/api/basic/system/model/baseRoleModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { DataTypeEnum } from '/@/enums/biz/base';
  export default defineComponent({
    name: 'ApplicationResourceTabs',
    components: {
      Card,
      Empty,
      ApplicationTab,
    },

    emits: ['select'],
    setup() {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const itemRefs = {};

      const formData = reactive<BaseRoleResourceRelSaveVO>({
        roleId: '',
        applicationResourceMap: {},
      });

      const state = reactive({
        applicationResourceList: [] as any[],
        title: '请选择角色',
        confirmLoading: false,
        appResMap: {},
        showSaveBtn: false,
      });

      onMounted(async () => {
        state.applicationResourceList = await findAvailableApplicationResourceList();
      });

      function getData(): BaseRoleResourceRelSaveVO {
        const appResourceMap = {};

        for (const item of state.applicationResourceList) {
          const itemRef = itemRefs[item.defApplication.id];
          if (!itemRef) {
            continue;
          }
          const checkedKeys = itemRef.treeRef.getCheckedKeys();
          const checkeds = isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;

          if (itemRef.checkAll || itemRef.indeterminate) {
            appResourceMap[itemRef.application.id] = checkeds;
          } else {
            appResourceMap[itemRef.application.id] = [];
          }
        }
        formData.applicationResourceMap = appResourceMap;
        return formData;
      }

      async function fetch(role: Recordable) {
        if (role && role.id) {
          state.showSaveBtn = DataTypeEnum.SYSTEM !== role.type;
          if (formData.roleId !== (role?.id as string)) {
            state.title = `【${role.name}】拥有的应用资源`;
            formData.roleId = role.id;

            state.appResMap = await findResourceIdByRoleId(role.id);
          }
        } else {
          state.title = '请选择角色';
          formData.roleId = '';
          state.showSaveBtn = false;
          const appResourceMap = {};
          for (const item of state.applicationResourceList) {
            appResourceMap[item.defApplication.id] = [];
          }
          state.appResMap = appResourceMap;
        }
      }

      async function handleSubmit() {
        try {
          state.confirmLoading = true;
          const params = getData();
          if (state.showSaveBtn) {
            await saveRoleResource(params);

            createMessage.success('配置成功');
          } else {
            createMessage.warn('请选择角色');
          }
        } finally {
          state.confirmLoading = false;
        }
      }
      return {
        ...toRefs(state),
        t,
        fetch,
        formData,
        itemRefs,
        getData,
        handleSubmit,
        RoleEnum,
      };
    },
  });
</script>
