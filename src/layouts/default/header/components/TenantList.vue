<template>
  <div :class="[prefixCls, `${prefixCls}--${theme}`]">
    <Dropdown placement="bottomLeft" v-if="getTenantList && getTenantList.length > 0">
      <div :title="getCurrentTenant?.name" :class="[tenantNameCls]">
        {{ getTenantName(getCurrentTenant) }} <DownOutlined />
      </div>
      <template #overlay>
        <Menu
          @click="switchTenantConfirm"
          :class="[`${prefixCls}--menu`, `${prefixCls}--menu--${theme}`]"
        >
          <MenuItem
            v-for="tenant in getTenantList"
            :key="tenant.id"
            :disabled="disabledItem(tenant)"
            :title="tenant.name"
          >
            {{ getTenantName(tenant) }}

            <a-button
              type="link"
              size="small"
              v-if="!tenant.isDefault"
              @click="setDefaults(tenant, $event)"
            >
              设为默认
            </a-button>
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
    <span v-else :class="[tenantNameCls]">暂无企业</span>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';
  import { Dropdown, Menu } from 'ant-design-vue';
  import { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updateDefaultTenant } from '/@/api/lamp/common/oauth';

  export default defineComponent({
    name: 'TenantList',
    components: { Dropdown, DownOutlined, Menu, MenuItem: Menu.Item },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls, prefixVar } = useDesign('layout-tenant-list');
      const tenantNameCls = `${prefixVar}-layout-tenant-name`;

      const userStore = useUserStore();
      const { createMessage, createConfirm } = useMessage();

      // 我拥有的企业
      const getTenantList = computed(() => userStore.getUserInfo?.tenantList);
      // 当前企业id
      const currentTenantId = computed(() => userStore.getTenantId);
      // 当前企业
      const getCurrentTenant = computed(() => {
        return userStore.getUserInfo?.tenantList?.find(
          (item) => item.id === unref(currentTenantId),
        );
      });

      function getTenantName(tenant: Recordable) {
        if (!tenant) {
          return '';
        }
        const name = tenant?.name?.length > 10 ? tenant?.name?.substr(0, 10) + '...' : tenant?.name;
        const strList = [name];
        if (!tenant.state) {
          // 企业被禁用
          strList.push('(已禁用)');
        } else if (!tenant.employeeState) {
          // 员工被禁用
          strList.push('(已禁用)');
        } else if (tenant.isDefault) {
          // 默认企业
          strList.push('(默认)');
        }
        return strList.join(' ');
      }

      function disabledItem(tenant: Recordable) {
        return !tenant.state || !tenant.employeeState || unref(currentTenantId) === tenant.id;
      }
      function switchTenantConfirm({ key }: MenuInfo) {
        const tanant = userStore.getUserInfo?.tenantList?.find((item) => item.id === key);
        if (!tanant) {
          createMessage.error('无法切换该企业，请选择正常的企业');
          throw Error('无法切换该企业，请选择正常的企业');
        }
        if (!tanant.state) {
          createMessage.error('该企业已被禁用');
          throw Error('该企业已被禁用');
        }

        if (!tanant.employeeState) {
          createMessage.error('您在该公司的账号被禁用，请联系公司管理员');
          throw Error('您在该公司的账号被禁用，请联系公司管理员');
        }

        createConfirm({
          iconType: 'warning',
          content: `是否确认切换到企业： ${tanant?.name} ？`,
          onOk: async () => {
            try {
              await switchTenant(key as string);
            } catch (e) {}
          },
        });
      }

      async function switchTenant(tenantId: string) {
        const userInfo = await userStore.switchTenantAndOrg(tenantId, '', '');
        if (userInfo) {
          createMessage.success('切换成功');
        }
      }
      async function setDefaults(tenant: Recordable, e: Event) {
        e?.stopPropagation();
        e?.preventDefault();
        createConfirm({
          iconType: 'warning',
          title: `是否确认设置【${tenant?.name} 】为默认企业？`,
          content: `设置为默认企业后，下次登录将默认进入该企业！`,
          onOk: async () => {
            try {
              await updateDefaultTenant(tenant.id as string);
              userStore.getUserInfoAction();
            } catch (e) {}
          },
        });
      }

      return {
        prefixCls,
        tenantNameCls,
        switchTenantConfirm,
        getTenantName,
        getTenantList,
        getCurrentTenant,
        disabledItem,
        setDefaults,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-tenant-list';
  @tenantName-cls: ~'@{namespace}-layout-tenant-name';
  @tenantList-item-normal-color: rgba(0, 0, 0, 0.85);

  .@{prefix-cls} {
    display: flex;
    padding: 0 8px;
    align-items: center;

    &--light {
      .@{tenantName-cls} {
        color: @tenantList-item-normal-color;
      }
    }

    &--dark {
      .@{tenantName-cls} {
        color: rgb(255 255 255 / 60%);
      }
    }
  }
</style>
