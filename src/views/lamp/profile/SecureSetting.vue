<template>
  <CollapseContainer :canExpan="false" title="安全设置">
    <List>
      <ListItem>
        <ListItemMeta>
          <template #title>
            密码
            <div class="extra" @click="handleExtra('1')"> 修改</div>
          </template>
          <template #description>
            <div> 登录系统时需要的密码</div>
          </template>
        </ListItemMeta>
      </ListItem>
      <ListItem>
        <ListItemMeta>
          <template #title>
            手机号
            <div class="extra" @click="handleExtra('2')"> 修改</div>
          </template>
          <template #description>
            <div> 登录系统的手机号</div>
          </template>
        </ListItemMeta>
      </ListItem>
      <ListItem>
        <ListItemMeta>
          <template #title>
            邮箱
            <div class="extra" @click="handleExtra('3')"> 修改</div>
          </template>
          <template #description>
            <div> 登录系统的邮箱</div>
          </template>
        </ListItemMeta>
      </ListItem>
    </List>
    <UpdatePasswordModal @register="registerModal" @success="handleUpdatePasswordSuccess" />
    <UpdateEmailModal @register="registerEmailModal" @success="handleUpdatePasswordSuccess" />
    <UpdateMobileModal @register="registerMobileModal" @success="handleUpdatePasswordSuccess" />
  </CollapseContainer>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { List } from 'ant-design-vue';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import UpdatePasswordModal from './AccountPassword/index.vue';
  import UpdateMobileModal from './Mobile/index.vue';
  import UpdateEmailModal from './Email/index.vue';

  export default defineComponent({
    name: 'SecureSetting',
    components: {
      CollapseContainer,
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
      UpdatePasswordModal,
      UpdateMobileModal,
      UpdateEmailModal,
    },
    setup() {
      const [registerModal, { openModal }] = useModal();
      const [registerEmailModal, { openModal: openEmailModal }] = useModal();
      const [registerMobileModal, { openModal: openMobileModal }] = useModal();
      const { createMessage } = useMessage();

      function handleExtra(key: string, e: Event) {
        e?.stopPropagation();
        e?.preventDefault();
        if ('1' === key) {
          openModal(true, {});
        } else if ('2' === key) {
          openMobileModal(true, {});
        } else if ('3' === key) {
          openEmailModal(true, {});
        } else {
          createMessage.warn('敬请期待~');
        }
      }

      function handleUpdatePasswordSuccess() {}

      return {
        registerModal,
        registerEmailModal,
        registerMobileModal,
        handleExtra,
        handleUpdatePasswordSuccess,
      };
    },
  });
</script>
<style lang="less" scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
    font-weight: normal;
    color: #1890ff;
    cursor: pointer;
  }
</style>
