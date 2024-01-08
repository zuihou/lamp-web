<template>
  <PageWrapper
    contentClass="flex"
    dense
    fixedHeight
    title="为lamp-cloud或lamp-boot项目新建新服务"
  >
    <div class="bg-white md:w-2/3 m-4 p-4 mr-2 overflow-hidden">
      <BasicForm @register="registerForm" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> 清空</a-button>
        <a-button class="!ml-4" @click="resetForm"> 重置</a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit">本地生成</a-button>
        <a-button class="!ml-4" type="primary" @click="handleDownload">远程下载</a-button>
      </div>
      <BasicTitle line span>注意事项</BasicTitle>
      <Alert message="注意事项" show-icon>
        <template #description>
          <p>
            1. {基础包}.{模块名}
            需要和【代码生成】-【修改代码配置】中{父包名}.{模块名}一致，否则生成的服务swagger文档可能无法显示（需要手动调整）
          </p>
          <p> 2. 若需要修改 groupId，需要和项目代码中的groupId中保持一致 </p>
          <p>
            3. {基础包} 需要与启动类所在的基础包一致，否则需要修改项目中
            @ComponentScan和@MapperScan中的配置
          </p>
          <p>
            4. {本地生成}
            适用于开发者本地启动项目后，直接将"代码"生成在开发者所在电脑的“输出路径”所在目录。
          </p>
          <p> 5. {远程下载} 适用于测试环境启动项目后，开发者将生成的代码下载到开发者的电脑。 </p>
        </template>
      </Alert>
    </div>

    <div class="bg-white m-4 p-4 ml-2 overflow-hidden md:w-1/3">
      <Tabs v-model:activeKey="activeKey">
        <TabPane v-for="item in tabList" :key="item.key">
          <template #tab>
            {{ item.name }}
          </template>
          <ThumbUrl :file-url="imgModules[item.key]" height="100%" width="100%" />
        </TabPane>
      </Tabs>
    </div>

    <template #extra>
      <a-button @click="resetFields"> 清空</a-button>
      <a-button @click="resetForm"> 重置</a-button>
      <a-button type="primary" @click="handleSubmit">本地生成</a-button>
      <a-button type="primary" @click="handleDownload">远程下载</a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Alert, Tabs } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';
  import ThumbUrl from '/@/components/Upload/src/ThumbUrl.vue';
  import { BasicTitle } from '/@/components/Basic';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Api, download, generator, getDef } from '/@/api/devOperation/developer/defGenProject';
  import { getValidateRules } from '/@/api/lamp/common/formValidateService';
  import { customFormSchemaRules, editFormSchema } from './genProject.data';
  import { useLoading } from '/@/components/Loading';
  import { blobToObj, downloadFile } from '/@/utils/lamp/common';

  interface TabModel {
    name: string;
    key: string;
  }

  const images = import.meta.globEager('../../../../assets/project/*.{png,jpg}');
  const imgModules = {};

  Object.keys(images).forEach((key) => {
    const mod = images[key].default || {};
    const name = key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
    imgModules[name] = mod;
  });

  export default defineComponent({
    name: '项目生成',
    components: {
      ThumbUrl,
      BasicForm,
      PageWrapper,
      Tabs,
      TabPane: Tabs.TabPane,
      BasicTitle,
      Alert,
    },
    setup() {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const activeKey = ref<string>('project_type');

      const tabList = ref<TabModel[]>([
        { key: 'project_type', name: '项目类型' },
        { key: 'project_outputDir', name: '输出路径' },
        { key: 'project_author', name: '作者' },
        { key: 'project_projectPrefix', name: '项目前缀' },
        { key: 'project_serviceName', name: '服务名' },
        { key: 'project_parent', name: '基础包' },
        { key: 'project_moduleName', name: '模块名' },
        { key: 'project_groupId', name: 'groupId' },
        { key: 'project_utilParent', name: 'util基础包' },
        { key: 'project_utilGroupId', name: 'utilGroupId' },
        { key: 'project_version', name: '版本号' },
        { key: 'project_description', name: '中文服务名' },
        { key: 'project_serverPort', name: '端口号' },
      ]);

      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '加载中...',
      });

      function changeTab(key) {
        activeKey.value = key;
      }

      const [registerForm, { setFieldsValue, updateSchema, validate, resetFields }] = useForm({
        labelWidth: 120,
        schemas: editFormSchema(changeTab),
        name: 'project',
        showActionButtonGroup: false,
        baseColProps: { span: 12 },
        actionColOptions: {
          span: 23,
        },
      });

      onMounted(async () => {
        await load();
      });

      const load = async () => {
        try {
          openFullLoading();
          const record = await getDef();
          await setFieldsValue(record);

          let validateApi = Api.Generator;
          await getValidateRules(validateApi, customFormSchemaRules()).then(async (rules) => {
            rules && rules.length > 0 && (await updateSchema(rules));
          });
        } finally {
          closeFullLoading();
        }
      };

      async function resetForm() {
        await load();
      }

      async function handleSubmit() {
        try {
          openFullLoading();
          const params = await validate();
          await generator(params);
          createMessage.success('生成成功');
        } finally {
          closeFullLoading();
        }
      }

      async function handleDownload() {
        try {
          openFullLoading();
          const params = await validate();
          const response = await download(params);
          if (response) {
            downloadFile(response);
            createMessage.success(t('common.tips.downloadSuccess'));
          } else {
            createMessage.error('下载失败，请认真检查【生成信息】是否填写完整并保存成功！');
          }
        } catch (e: any) {
          const obj = (await blobToObj(e?.response?.data)) as any;
          createMessage.error(obj.msg);
        } finally {
          closeFullLoading();
        }
      }

      return {
        t,
        activeKey,
        registerForm,
        tabList,
        imgModules,
        handleSubmit,
        resetForm,
        resetFields,
        handleDownload,
      };
    },
  });
</script>
