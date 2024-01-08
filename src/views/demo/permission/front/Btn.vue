<template>
  <PageWrapper
    content="由于刷新的时候会请求用户信息接口，会根据接口重置角色信息，所以刷新后界面会恢复原样，如果不需要，可以注释 src/layout/default/index内的获取用户信息接口"
    contentBackground
    contentClass="p-4"
    title="前端权限按钮示例"
  >
    <CurrentPermissionMode />

    <p>
      当前角色: <a> {{ userStore.getRoleList }} </a>
    </p>
    <Alert class="mt-4" message="点击后请查看按钮变化" show-icon type="info" />

    <div class="mt-4">
      权限切换(请先切换权限模式为前端角色权限模式):
      <Space>
        <a-button :type="isSuper ? 'primary' : 'default'" @click="changeRole(RoleEnum.SUPER)">
          {{ RoleEnum.SUPER }}
        </a-button>
        <a-button :type="isTest ? 'primary' : 'default'" @click="changeRole(RoleEnum.TEST)">
          {{ RoleEnum.TEST }}
        </a-button>
      </Space>
    </div>
    <Divider>组件方式判断权限(有需要可以自行全局注册)</Divider>
    <Authority :value="RoleEnum.SUPER">
      <a-button class="mx-4" type="primary"> 拥有super角色权限可见</a-button>
    </Authority>

    <Authority :value="RoleEnum.TEST">
      <a-button class="mx-4" color="success"> 拥有test角色权限可见</a-button>
    </Authority>

    <Authority :value="[RoleEnum.TEST, RoleEnum.SUPER]">
      <a-button class="mx-4" color="error"> 拥有[test,super]角色权限可见</a-button>
    </Authority>

    <Divider>函数方式方式判断权限(适用于函数内部过滤)</Divider>
    <a-button v-if="hasPermission(RoleEnum.SUPER)" class="mx-4" type="primary">
      拥有super角色权限可见
    </a-button>

    <a-button v-if="hasPermission(RoleEnum.TEST)" class="mx-4" color="success">
      拥有test角色权限可见
    </a-button>

    <a-button v-if="hasPermission([RoleEnum.TEST, RoleEnum.SUPER])" class="mx-4" color="error">
      拥有[test,super]角色权限可见
    </a-button>

    <Divider>指令方式方式判断权限(该方式不能动态修改权限.)</Divider>
    <a-button v-auth="RoleEnum.SUPER" class="mx-4" type="primary"> 拥有super角色权限可见</a-button>

    <a-button v-auth="RoleEnum.TEST" class="mx-4" color="success"> 拥有test角色权限可见</a-button>

    <a-button v-auth="[RoleEnum.TEST, RoleEnum.SUPER]" class="mx-4" color="error">
      拥有[test,super]角色权限可见
    </a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { Alert, Divider, Space } from 'ant-design-vue';
  import CurrentPermissionMode from '../CurrentPermissionMode.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Authority } from '/@/components/Authority';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { Alert, PageWrapper, Space, CurrentPermissionMode, Divider, Authority },
    setup() {
      const { changeRole, hasPermission } = usePermission();
      const userStore = useUserStore();

      const isSuper = computed(
        () => userStore.getRoleList && userStore.getRoleList.includes(RoleEnum.SUPER),
      );
      const isTest = computed(
        () => userStore.getRoleList && userStore.getRoleList.includes(RoleEnum.TEST),
      );

      return {
        userStore,
        RoleEnum,
        isSuper,
        isTest,
        changeRole,
        hasPermission,
      };
    },
  });
</script>
<style lang="less" scoped>
  .demo {
    background-color: @component-background;
  }
</style>
