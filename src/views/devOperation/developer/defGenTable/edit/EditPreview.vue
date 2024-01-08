<template>
  <Tabs @change="changeTable($event)">
    <TabPane v-for="(tableVal, tableKey) in tableMap" :key="tableKey" :tab="getTableName(tableKey)">
      <RadioGroup
        v-model:value="template"
        style="margin-right: 2rem"
        @change="changeTabs(tableKey, $event)"
      >
        <RadioButton :value="TemplateEnum.BACKEND">后端</RadioButton>
        <RadioButton :value="TemplateEnum.WEB_PLUS">前端</RadioButton>
      </RadioGroup>
      <a-button preIcon="ant-design:reload-outlined" type="link" @click="reload(tableKey)">
        刷新
      </a-button>

      <Spin :spinning="spinning" size="large">
        <Tabs style="min-height: 400px">
          <TabPane v-for="(value, key) in tableVal[template]" :key="key" :tab="getKey(key)">
            <pre>
              <a-button
                preIcon="ant-design:copy-outlined" style="float: left" type="link"
                @click="handleCopy(value)">复制</a-button>
              <code class="hljs" v-html="highlightedCode(value, key)"></code>
            </pre>
          </TabPane>
        </Tabs>
      </Spin>
    </TabPane>
  </Tabs>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { Radio, Spin, Tabs } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TemplateEnum } from '/@/enums/biz/tenant';
  import { findTableList, previewCode } from '/@/api/devOperation/developer/defGenTable';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';

  import hljs from 'highlight.js/lib/core';
  import java from 'highlight.js/lib/languages/java';
  import xml from 'highlight.js/lib/languages/xml';
  import html from 'highlight.js/lib/languages/xml';
  import vue from 'highlight.js/lib/languages/xml';
  import web from 'highlight.js/lib/languages/xml';
  import javascript from 'highlight.js/lib/languages/javascript';
  import typescript from 'highlight.js/lib/languages/typescript';
  import sql from 'highlight.js/lib/languages/sql';
  // import 'highlight.js/styles/github.css';
  import 'highlight.js/styles/github-dark-dimmed.css';
  // import 'highlight.js/styles/base16/darcula.css';
  // import 'highlight.js/styles/dark.css';

  hljs.registerLanguage('java', java);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('html', html);
  hljs.registerLanguage('vue', vue);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('sql', sql);
  hljs.registerLanguage('web', web);
  hljs.registerLanguage('ts', typescript);

  export default defineComponent({
    // 若需要开启页面缓存，请将此参数跟菜单名保持一致
    name: 'DefGenTablePreview',
    components: {
      Tabs,
      TabPane: Tabs.TabPane,
      RadioButton: Radio.Button,
      RadioGroup: Radio.Group,
      Spin,
    },
    setup() {
      const { t } = useI18n();
      const tableMap = ref<any>({});
      const tableIdListRef = ref<string[]>([]);
      const tableNameMap = ref<any>({});
      const spinning = ref<boolean>(false);
      const template = ref<TemplateEnum>(TemplateEnum.BACKEND);
      const { createMessage } = useMessage();
      const { clipboardRef, copiedRef } = useCopyToClipboard();

      const load = async (tableId) => {
        let tableIdList;
        if (tableId.includes(',')) {
          tableIdList = tableId.split(',');
        } else {
          tableIdList = [tableId];
        }
        tableIdListRef.value = tableIdList;

        for (const tableId of tableIdList) {
          tableMap.value[tableId] = {};
        }

        const list = await findTableList(tableIdList);

        for (const item of list) {
          tableNameMap.value[item.id] = item.name;
        }

        await reload(tableIdList[0]);
      };

      const reload = async (tableId: string, temp?: TemplateEnum) => {
        try {
          spinning.value = true;
          temp = temp || template.value;
          tableMap.value[tableId][temp] = {};
          const map = await previewCode(tableId, temp);
          tableMap.value[tableId][temp] = map;
        } finally {
          spinning.value = false;
        }
      };

      function highlightedCode(code, key) {
        const ftlName = key.substring(key.lastIndexOf('/') + 1, key.indexOf('.ftl'));
        const language = ftlName.substring(ftlName.indexOf('.') + 1, ftlName.length);
        const result = hljs.highlight(code || '', { language, ignoreIllegals: true });
        return result.value || '&nbsp;';
      }

      function handleCopy(value) {
        if (!value) {
          createMessage.warning('当前页面无内容，无需复制。');
          return;
        }
        clipboardRef.value = value;
        if (unref(copiedRef)) {
          createMessage.success('复制成功！');
        }
      }

      async function changeTabs(tableId: string, e: ChangeEvent) {
        const template = e.target.value;

        if (tableMap.value[tableId]?.[template]) {
        } else {
          await reload(tableId, template as TemplateEnum);
        }
      }

      async function changeTable(tableId: string) {
        const temp = template.value;
        if (tableMap.value[tableId]?.[temp]) {
        } else {
          await reload(tableId, temp as TemplateEnum);
        }
      }

      function getKey(key) {
        const k = key.substring(key.lastIndexOf('/') + 1, key.indexOf('.ftl'));
        if (key.startsWith('sub-')) {
          return k + '(从表)';
        }
        return k;
      }

      function getTableName(key: string) {
        return tableNameMap.value[key];
      }

      return {
        t,
        highlightedCode,
        handleCopy,
        load,
        reload,
        changeTabs,
        TemplateEnum,
        template,
        spinning,
        getKey,
        tableMap,
        getTableName,
        tableIdListRef,
        changeTable,
      };
    },
  });
</script>
<style lang="less" scoped>
  pre {
    display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
  }
</style>
