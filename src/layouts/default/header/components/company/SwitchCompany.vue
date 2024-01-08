<template>
  <BasicModal
    :keyboard="true"
    :maskClosable="false"
    :min-height="300"
    okText="切换"
    title="切换机构"
    v-bind="$attrs"
    width="40%"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <Form
      ref="formRef"
      :label-col="{ style: { width: '80px' } }"
      :model="formData"
      class="p-4 enter-x"
    >
      <FormItem label="单位" name="currentCompanyId">
        <Select v-model:value="formData.currentCompanyId" @change="changeCompany">
          <SelectOption
            v-for="company in formState.companyList"
            :key="company.id"
            :label="company.name"
            :value="company.id"
          >
            {{ company.name }}
          </SelectOption>
        </Select>
      </FormItem>
      <FormItem label="部门" name="currentDeptId">
        <Select v-model:value="formData.currentDeptId">
          <SelectOption
            v-for="dept in formState.deptList"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          >
            {{ dept.name }}
          </SelectOption>
        </Select>
      </FormItem>
    </Form>
    <Alert message="注意事项">
      <template #description>
        <p>
          1.【用户】：即账号，任何人在本平台都有一个唯一的用户数据，可理解为账号，通过手机号、身份证、登录账号等唯一信息来确定唯一性
        </p>
        <p> 2.【员工】：存放用户的具体业务字段。 </p>
        <p>
          3.
          【单位】："员工"在某个"企业"下可以属于多个单位或部门；若给员工分配组织机构信息时，只为其分配了"部门"，这里会显示出该"部门"的上级单位。
        </p>
        <p> 4. 【部门】：部门必须挂在单位下，请勿将部门挂在根节点。 </p>
      </template>
    </Alert>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { Alert, Form, Select } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { findCompanyDept, findDeptByCompany } from '/@/api/lamp/common/oauth';
  import { BaseOrgResultVO } from '/@/api/basic/user/model/baseOrgModel';

  export default defineComponent({
    name: 'SwitchCompany',
    components: {
      BasicModal,
      Form,
      FormItem: Form.Item,
      Select,
      SelectOption: Select.Option,
      Alert,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage, createConfirm } = useMessage();
      const userStore = useUserStore();

      const formData = reactive({
        currentCompanyId: '',
        currentDeptId: '',
      });
      const formState = reactive({
        companyList: [] as BaseOrgResultVO[],
        deptList: [] as BaseOrgResultVO[],
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
        setModalProps({ confirmLoading: false });

        await loadOrg();
      });

      async function loadOrg() {
        const org = await findCompanyDept();
        formData.currentCompanyId = org.currentCompanyId;
        formData.currentDeptId = org.currentDeptId;
        formState.companyList = org.companyList;
        formState.deptList = org.deptList;
      }

      async function changeCompany(companyId: string) {
        formState.deptList = await findDeptByCompany(companyId);
        formData.currentDeptId = formState.deptList?.[0]?.id;
      }

      function switchCompanyConfirm() {
        createConfirm({
          iconType: 'warning',
          content: `是否确认切换机构？`,
          onOk: async () => {
            try {
              await switchCompany();
            } catch (e) {}
          },
        });
      }

      async function switchCompany() {
        const userInfo = await userStore.switchTenantAndOrg(
          formData.currentCompanyId,
          formData.currentDeptId,
        );
        if (userInfo) {
          createMessage.success('切换成功');
        }
      }

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          console.log(formData);
          switchCompanyConfirm();
          emit('success');
          closeModal();
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        registerModal,
        formData,
        formState,
        handleSubmit,
        changeCompany,
      };
    },
  });
</script>
