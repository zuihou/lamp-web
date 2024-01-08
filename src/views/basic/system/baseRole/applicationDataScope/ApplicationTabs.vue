<template>
  <div class="m-4 ml-2 overflow-hidden bg-white appResTabs">
    <Card :title="title">
      <template #extra>
        <BasicHelp
          class="mr-2"
          :text="[
            '同一个菜单或视图下的数据权限，只建议授权一个',
            '若同时给角色授权多个同级别的数据权限，会取sortValue最小的',
            '若员工没有某页面的任何数据权限，则使用默认数据权限',
          ]"
          showIndex
          placement="left"
        />
        <a-button
          class="!ml-4"
          type="primary"
          @click="handleSubmit"
          :loading="confirmLoading"
          v-hasAnyPermission="[RoleEnum.ROLE_BIND_RESOURCE]"
        >
          {{ t('common.saveText') }}
        </a-button>
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
  import ApplicationTab from './ApplicationTab.vue';
  import { isArray } from '/@/utils/is';
  import { findAvailableApplicationDataScopeList } from '/@/api/devOperation/application/defApplication';
  import { findResourceDataScopeIdByRoleId, saveRoleResource } from '/@/api/basic/system/baseRole';
  import { BaseRoleResourceRelSaveVO } from '/@/api/basic/system/model/baseRoleModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { BasicHelp } from '/@/components/Basic';
  export default defineComponent({
    name: 'ApplicationDataScopeTabs',
    components: {
      Card,
      Empty,
      ApplicationTab,
      BasicHelp,
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
      });

      onMounted(async () => {
        state.applicationResourceList = await findAvailableApplicationDataScopeList();
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
          if (formData.roleId !== (role?.id as string)) {
            state.title = `【${role.name}】拥有的数据权限`;
            formData.roleId = role.id;

            state.appResMap = await findResourceDataScopeIdByRoleId(role.id);
          }
        } else {
          state.title = '请选择角色';
          formData.roleId = '';
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

          await saveRoleResource(params);

          createMessage.success('配置成功');
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
