<template>
  <BasicModal
    :maskClosable="false"
    :title="type === 'xml' ? '查看配置' : '查看流程图'"
    defaultFullscreen
    showFooter
    v-bind="$attrs"
    width="80%"
    @ok="handleSubmit"
    @register="registerModal"
  >
    <pre v-if="type === 'xml'">
      <code class="hljs" v-html="buildXml()"></code>
    </pre>
    <Image v-else :src="img" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { Image } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getDiagram, getXml } from '/@/api/basic/activiti/deployment';
  import hljs from 'highlight.js/lib/core';
  import xml from 'highlight.js/lib/languages/xml';
  import 'highlight.js/styles/github-dark-dimmed.css';

  hljs.registerLanguage('xml', xml);

  export default defineComponent({
    name: 'DeploymentView',
    components: { BasicModal, Image },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const { createMessage } = useMessage();
      const formState = reactive({
        type: '',
        xml: '',
        img: '',
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        formState.type = data?.type;

        const record = { ...data?.record };
        if (formState.type === 'xml') {
          formState.xml = await getXml(record.id);
        } else {
          const res = await getDiagram(record.id).catch((e) => {
            if (e.toString().indexOf('429') !== -1) {
              createMessage.error('获取流程图过于频繁，请1分钟后再试');
            } else {
              createMessage.error('加载流程图失败');
            }
          });

          if (res.byteLength <= 100) {
            createMessage.error('系统维护中，请稍微再试~');
            return '';
          }
          formState.img =
            'data:image/png;base64,' +
            btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        }
      });

      function buildXml() {
        const result = hljs.highlight(formState.xml || '', {
          language: 'xml',
          ignoreIllegals: true,
        });
        return result.value || '&nbsp;';
      }

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });

          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { t, registerModal, ...toRefs(formState), handleSubmit, buildXml };
    },
  });
</script>
<style lang="less" scoped>
  pre {
    display: block;
    padding: 9.5px;
    margin: 0px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;

    code {
      margin-top: -15px;
      margin-bottom: -35px;
    }
  }
</style>
