<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <a-row :gutter="24">
      <a-col :span="14">
        <BasicForm @register="register" />
      </a-col>
      <a-col :span="10">
        <div class="change-avatar">
          <div class="mb-2"> 头像 </div>
          <CropperAvatar
            :uploadApi="uploadToDef"
            :uploadParams="{ bizType: FileBizTypeEnum.BASE_USER_AVATAR }"
            :value="avatarId"
            :isDef="true"
            btnText="更换头像"
            :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
            @change="handleUpdateAvatar"
            width="150"
          />
        </div>
      </a-col>
    </a-row>
    <Button type="primary" @click="handleSubmit"> 更新基本信息 </Button>
  </CollapseContainer>
</template>
<script lang="ts">
  import { Button, Row, Col } from 'ant-design-vue';
  import { computed, defineComponent, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';

  import { useMessage } from '/@/hooks/web/useMessage';

  import { FileBizTypeEnum } from '/@/enums/commonEnum';
  import { updateBaseInfo, updateAvatar } from '/@/api/lamp/profile/userInfo';
  import { userInfoSchemas } from './Userinfo/data';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadToDef } from '/@/api/lamp/file/upload';

  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      Button,
      ARow: Row,
      ACol: Col,
      CropperAvatar,
    },
    setup() {
      const { createMessage } = useMessage();
      const { t } = useI18n();
      const userStore = useUserStore();

      const [register, { setFieldsValue, validate }] = useForm({
        name: 'userInfoForm',
        labelWidth: 120,
        schemas: userInfoSchemas,
        showActionButtonGroup: false,
      });

      onMounted(async () => {
        const data = userStore.getUserInfo;
        setFieldsValue(data);
      });

      const avatarId = computed(() => {
        const { avatarId } = userStore.getUserInfo;
        return { id: avatarId };
      });

      async function handleUpdateAvatar(data: any) {
        const userinfo = userStore.getUserInfo;

        const params = { id: userinfo.id, appendixAvatar: data };
        await updateAvatar(params);

        const userInfo = userStore.getUserInfoAction();
        setFieldsValue(userInfo);
      }

      async function handleSubmit() {
        try {
          const params = await validate();
          await updateBaseInfo(params);

          await userStore.getUserInfoAction();

          createMessage.success(t(`common.tips.updateSuccess`));
        } finally {
        }
      }
      return {
        avatarId,
        register,
        uploadToDef,
        handleUpdateAvatar,
        handleSubmit,
        FileBizTypeEnum,
      };
    },
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
