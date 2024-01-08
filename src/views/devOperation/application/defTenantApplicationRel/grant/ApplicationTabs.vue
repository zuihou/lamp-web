<template>
  <div class="bg-white m-4 ml-2 p-4 overflow-hidden">
    <Form class="enter-x" ref="formRef" :labelCol="{ span: 2 }">
      <FormItem label="有效期">
        <DatePicker
          v-model:value="formData.expirationTime"
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="有效期"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          :showTime="{ defaultValue: dateUtil('00:00:00', 'HH:mm:ss') }"
          :disabled-date="disabledDate"
        />
      </FormItem>
      <FormItem label="应用-资源">
        <ApplicationTab
          v-for="item in applicationResourceList"
          :key="item.defApplication.id"
          :application="item.defApplication"
          :resourceList="item.resourceList"
          :ref="(el) => (itemRefs[item.defApplication.id] = el)"
        />
        <Empty v-if="applicationResourceList.length === 0" />
      </FormItem>
    </Form>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, toRefs, reactive } from 'vue';
  import { DatePicker, Form, Empty } from 'ant-design-vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { findApplicationResourceList } from '/@/api/devOperation/application/defApplication';
  import ApplicationTab from './ApplicationTab.vue';
  import { isArray } from '/@/utils/is';
  export default defineComponent({
    name: 'ApplicationTabs',
    components: {
      DatePicker,
      ApplicationTab,
      Form,
      Empty,
      FormItem: Form.Item,
    },

    emits: ['select'],
    setup() {
      const { t } = useI18n();
      const itemRefs = {};

      const formData = reactive<Recordable>({
        expirationTime: '',
        applicationResourceMap: {},
      });

      const state = reactive({
        applicationResourceList: [] as any[],
      });

      onMounted(async () => {
        state.applicationResourceList = await findApplicationResourceList();
      });

      function getData() {
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
          }
        }
        formData.applicationResourceMap = appResourceMap;
        return formData;
      }

      const disabledDate = (current) => {
        return current && current < dateUtil().endOf('day');
      };

      return {
        ...toRefs(state),
        t,
        dateUtil,
        disabledDate,
        formData,
        itemRefs,
        getData,
      };
    },
  });
</script>
<style scoped>
  .appResource {
    border: 1px solid #d9d9d9;
  }
</style>
