<template>
  <BasicModal
    :keyboard="true"
    :maskClosable="false"
    :min-height="300"
    title="切换企业和组织"
    v-bind="$attrs"
    okText="切换"
    width="40%"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <div class="md:flex enter-y">
      <div class="md:w-1/2">
        <Card :bodyStyle="{ padding: 0 }" size="small" title="企业">
          <RadioGroup v-model:value="formData.tenant" style="width: 100%" @change="changeTenant">
            <div class="pl-2">
              <List :data-source="formState.tenantList">
                <template #renderItem="{ item }">
                  <ListItem style="cursor: pointer">
                    <Radio :value="item.id" :disabled="disabledItem(item)">
                      {{ getTenantName(item) }}
                    </Radio>
                    <template #actions>
                      <a
                        key="more"
                        href="javascript:void(0)"
                        v-if="!item.isDefault"
                        @click="setDefaults(item, $event)"
                      >
                        设为默认
                      </a>
                    </template>
                  </ListItem>
                </template>
              </List>
            </div>
          </RadioGroup>
        </Card>
      </div>
      <div class="md:w-1/2">
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
      </div>
    </div>
    <Alert message="注意事项">
      <template #description>
        <p>
          1.【用户】：即账号，任何人在本平台都有一个唯一的用户数据，可理解为账号，通过手机号、身份证、登录账号等唯一信息来确定唯一性
        </p>
        <p>
          2.【员工】：用户属于某个租户，他就是这个租户的员工，一个用户可以属于多个租户，用户和员工是一对多关系。
          一个用户属于多个租户时，在用户表有1条数据，在员工表有多条数据。
        </p>
        <p>
          3.
          【企业】：即租户；1个用户可以属于多个企业，当用户属于多个企业，登录系统时，会进入默认企业。
        </p>
        <p>
          4.
          【单位】："员工"在某个"企业"下可以属于多个单位或部门；若给员工分配组织机构信息时，只为其分配了"部门"，这里会显示出该"部门"的上级单位。
        </p>
        <p> 5. 【部门】：部门必须挂在单位下，请勿将部门挂在根节点。 </p>
      </template>
    </Alert>
  </BasicModal>
</template>
<script lang="ts">
  import { computed, defineComponent, reactive } from 'vue';
  import { Alert, Card, Form, List, Radio, RadioGroup, Select } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import {
    findCompanyDept,
    findDeptByCompany,
    updateDefaultTenant,
  } from '/@/api/lamp/common/oauth';
  import { BaseOrgResultVO } from '/@/api/basic/user/model/baseOrgModel';
  import { Tenant } from '/@/api/devOperation/tenant/model/tenantModel';

  export default defineComponent({
    name: 'SwitchTenant',
    components: {
      BasicModal,
      Form,
      FormItem: Form.Item,
      Select,
      SelectOption: Select.Option,
      Card,
      List,
      ListItem: List.Item,
      Radio,
      RadioGroup,
      Alert,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage, createConfirm } = useMessage();
      const userStore = useUserStore();

      const formData = reactive({
        tenant: '',
        currentCompanyId: '',
        currentDeptId: '',
      });
      const formState = reactive({
        companyList: [] as BaseOrgResultVO[],
        deptList: [] as BaseOrgResultVO[],
        tenantList: [] as Tenant[],
      });

      // 当前企业id
      const currentTenantId = computed(() => userStore.getTenantId);

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
        setModalProps({ confirmLoading: false });

        formData.tenant = userStore.getTenantId;
        await loadOrgByTenant(userStore.getTenantId);
      });

      async function loadOrgByTenant(tenantId: string) {
        const org = await findCompanyDept(tenantId);
        formData.currentCompanyId = org.currentCompanyId;
        formData.currentDeptId = org.currentDeptId;
        formState.companyList = org.companyList;
        formState.deptList = org.deptList;
        formState.tenantList = org.tenantList;
      }

      async function changeTenant(e: ChangeEvent) {
        await loadOrgByTenant(e.target.value);
        formData.currentCompanyId = formState.companyList?.[0]?.id;
        formData.currentDeptId = formState.deptList?.[0]?.id;
      }

      async function changeCompany(companyId: string) {
        formState.deptList = await findDeptByCompany(companyId, formData.tenant);
        formData.currentDeptId = formState.deptList?.[0]?.id;
      }

      function disabledItem(tenant: Recordable) {
        return !tenant.state || !tenant.employeeState;
      }

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

      function switchTenantConfirm() {
        const tenant = formState.tenantList?.find((item) => item.id === formData.tenant);
        if (!tenant) {
          createMessage.error('无法切换该企业，请选择正常的企业');
          throw Error('无法切换该企业，请选择正常的企业');
        }
        if (!tenant.state) {
          createMessage.error('该企业已被禁用');
          throw Error('该企业已被禁用');
        }

        if (!tenant.employeeState) {
          createMessage.error('您在该公司的账号被禁用，请联系公司管理员');
          throw Error('您在该公司的账号被禁用，请联系公司管理员');
        }

        createConfirm({
          iconType: 'warning',
          content: `是否确认切换到企业： ${tenant?.name} ？`,
          onOk: async () => {
            try {
              await switchTenant();
            } catch (e) {}
          },
        });
      }

      async function switchTenant() {
        const userInfo = await userStore.switchTenantAndOrg(
          formData.currentCompanyId,
          formData.currentDeptId,
          formData.tenant,
        );
        if (userInfo) {
          createMessage.success('切换成功');
        }
      }

      async function setDefaults(tenant: Recordable, e: Event) {
        e?.stopPropagation();
        e?.preventDefault();
        createConfirm({
          iconType: 'warning',
          title: `是否确认修改【${tenant?.name} 】为默认企业？`,
          content: `修改会立即生效，设置为默认企业后，下次登录将默认进入该企业！`,
          onOk: async () => {
            try {
              await updateDefaultTenant(tenant.id as string);
              userStore.getUserInfoAction();
            } catch (e) {}
          },
        });
      }

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });
          console.log(formData);
          switchTenantConfirm();
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
        currentTenantId,
        getTenantName,
        switchTenantConfirm,
        setDefaults,
        handleSubmit,
        disabledItem,
        changeTenant,
        changeCompany,
      };
    },
  });
</script>
