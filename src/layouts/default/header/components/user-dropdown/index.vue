<template>
  <div>
    <Dropdown :overlayClassName="`${prefixCls}-dropdown-overlay`" placement="bottomLeft">
      <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
        <AvatarPreview
          :errorTxt="getUserInfo?.nickName?.substring(0, 1)"
          :fileId="getUserInfo?.avatarId"
          :isDef="true"
          :style="{ 'margin-right': '0.5rem' }"
        />
        <span :class="`${prefixCls}__info hidden md:block`">
          <span :class="`${prefixCls}__name  `" class="truncate">
            {{ getUserInfo.nickName }}
          </span>
        </span>
      </span>

      <template #overlay>
        <Menu @click="handleMenuClick">
          <MenuItem
            key="profile"
            :text="t('layout.header.dropdownProfile')"
            icon="ant-design:user-outlined"
          />
          <MenuItem
            v-if="getShowDoc"
            key="doc"
            :text="t('layout.header.dropdownItemDoc')"
            icon="ion:document-text-outline"
          />
          <MenuItem
            v-if="getShowDoc"
            key="vbenDoc"
            icon="ion:document-text-outline"
            text="前端文档"
          />
          <MenuDivider v-if="getShowDoc" />
          <MenuItem
            v-if="getUseLockPage"
            key="lock"
            :text="t('layout.header.tooltipLock')"
            icon="ion:lock-closed-outline"
          />
          <MenuItem
            key="logout"
            :text="t('layout.header.dropdownItemLoginOut')"
            icon="ion:power-outline"
          />
        </Menu>
      </template>
    </Dropdown>
    <LockAction @register="register" />
  </div>
</template>
<script lang="ts">
  // components
  import { Dropdown, Menu } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';

  import { computed, defineComponent, h, ref } from 'vue';

  import { DOC_URL, VBEN_DOC_URL } from '/@/settings/siteSetting';

  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { AvatarPreview } from '/@/components/AvatarPreview';

  import { propTypes } from '/@/utils/propTypes';
  import { openWindow } from '/@/utils';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'profile' | 'vbenDoc';

  export default defineComponent({
    name: 'UserDropdown',
    components: {
      Dropdown,
      Menu,
      AvatarPreview,
      MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
      MenuDivider: Menu.Divider,
      LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
    },
    props: {
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup() {
      const { prefixCls } = useDesign('header-user-dropdown');
      const { t } = useI18n();
      const { getShowDoc, getUseLockPage } = useHeaderSetting();
      const userStore = useUserStore();
      const { replace } = useRouter();
      const avatarUrl = ref<string>('');

      const getUserInfo = computed(() => {
        return userStore.getUserInfo;
      });

      const [register, { openModal }] = useModal();

      function handleLock() {
        openModal(true);
      }

      //  login out
      function handleLoginOut() {
        const { createConfirm } = useMessage();
        const { t } = useI18n();
        createConfirm({
          iconType: 'warning',
          title: () => h('span', t('sys.app.logoutTip')),
          content: () => h('span', t('sys.app.logoutMessage')),
          onOk: async () => {
            await userStore.logout(true);
          },
        });
      }

      // open doc
      function openDoc(flag: boolean) {
        if (flag) {
          openWindow(DOC_URL);
        } else {
          openWindow(VBEN_DOC_URL);
        }
      }

      function openProfile() {
        replace({
          name: 'profileIndex',
        });
      }

      function handleMenuClick(e: MenuInfo) {
        switch (e.key as MenuEvent) {
          case 'profile':
            openProfile();
            break;
          case 'logout':
            handleLoginOut();
            break;
          case 'doc':
            openDoc(true);
            break;
          case 'vbenDoc':
            openDoc(false);
            break;
          case 'lock':
            handleLock();
            break;
        }
      }

      return {
        prefixCls,
        t,
        getUserInfo,
        handleMenuClick,
        getShowDoc,
        avatarUrl,
        register,
        getUseLockPage,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
