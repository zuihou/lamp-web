<template>
  <PageWrapper title="代码编辑器组件示例" contentFullHeight fixedHeight contentBackground>
    <template #extra>
      <a-space size="middle">
        <a-button @click="showData" type="primary">获取数据</a-button>
        <RadioGroup button-style="solid" v-model:value="modeValue" @change="handleModeChange">
          <RadioButton value="application/json"> json数据 </RadioButton>
          <RadioButton value="htmlmixed"> html代码 </RadioButton>
          <RadioButton value="javascript"> javascript代码 </RadioButton>
        </RadioGroup>
      </a-space>
    </template>
    <codemirror
      v-model="value"
      :autofocus="true"
      :extensions="scriptExtensions"
      :indent-with-tab="true"
      :style="{ height: '200px' }"
      :tab-size="2"
      placeholder="groovy 脚本"
    />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, h, ref, unref } from 'vue';
  import { JsonPreview, MODE } from '/@/components/CodeEditor';
  import { Codemirror } from 'vue-codemirror';
  import { java } from '@codemirror/lang-java';
  import { json } from '@codemirror/lang-json';
  import { javascript } from '@codemirror/lang-javascript';
  import { oneDark } from '@codemirror/theme-one-dark';

  import { PageWrapper } from '/@/components/Page';
  import { Modal, Radio, Space } from 'ant-design-vue';

  const jsonData =
    '{"name":"BeJson","url":"http://www.xxx.com","page":88,"isNonProfit":true,"address":{"street":"科技园路.","city":"江苏苏州","country":"中国"},"links":[{"name":"Google","url":"http://www.xxx.com"},{"name":"Baidu","url":"http://www.xxx.com"},{"name":"SoSo","url":"http://www.xxx.com"}]}';

  const jsData = `
      (() => {
        var htmlRoot = document.getElementById('htmlRoot');
        var theme = window.localStorage.getItem('__APP__DARK__MODE__');
        if (htmlRoot && theme) {
          htmlRoot.setAttribute('data-theme', theme);
          theme = htmlRoot = null;
        }
      })();
  `;

  const htmlData = `
     <!DOCTYPE html>
<html lang="en" id="htmlRoot">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="renderer" content="webkit" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0"
    />
    <title><%= title %></title>
    <link rel="icon" href="/favicon.ico" />
  </head>
  <body>
    <div id="app">
    </div>
  </body>
</html>
  `;
  export default defineComponent({
    components: {
      Codemirror,
      PageWrapper,
      RadioButton: Radio.Button,
      RadioGroup: Radio.Group,
      ASpace: Space,
    },
    setup() {
      const modeValue = ref<MODE>(MODE.JSON);
      const value = ref(JSON.stringify(JSON.parse(jsonData), null, 2));
      const scriptExtensions = [java(), javascript(), json(), oneDark];

      function handleModeChange(e: ChangeEvent) {
        const mode = e.target.value;
        if (mode === MODE.JSON) {
          value.value = JSON.stringify(JSON.parse(jsonData), null, 2);
          return;
        }
        if (mode === MODE.HTML) {
          value.value = htmlData;
          return;
        }
        if (mode === MODE.JS) {
          value.value = jsData;
          return;
        }
      }

      function showData() {
        if (unref(modeValue) === 'application/json') {
          Modal.info({
            title: '编辑器当前值',
            content: h(JsonPreview, { data: JSON.parse(value.value) }),
          });
        } else {
          Modal.info({ title: '编辑器当前值', content: value.value });
        }
      }

      return { value, scriptExtensions, modeValue, handleModeChange, showData };
    },
  });
</script>
