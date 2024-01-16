<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="选择API"
    :maskClosable="false"
    @ok="handleSubmit"
    width="80%"
  >
    <Row>
      <Col :span="16">
        <div class="ml-4 mr-4">
          <BasicForm @register="registerForm" />
        </div>
      </Col>
      <Col :span="8">
        <div class="ml-4 mr-4">
          <h4>已选接口 ({{ selectedData.length }})：</h4>
          <Card
            style="margin-bottom: 0.5rem"
            hoverable
            size="small"
            v-for="api in selectedData"
            :key="api.springApplicationName + api.uri + api.requestMethod"
            :title="api.name"
          >
            <template #extra
              ><a href="javascript:void(0);" @click="delSelectedDataByCard(api)">删除</a></template
            >
            <CardMeta>
              <template #title>
                {{ t('devOperation.application.defResourceApi.springApplicationName') }}：
                {{ api.springApplicationName }} <br />
                {{ t('devOperation.application.defResourceApi.controller') }}：{{ api.controller }}
              </template>
              <template #description>
                <div
                  class="cardDesc"
                  :title="'(' + api.requestMethod + ') ' + api.uri + ' (' + api.controller + ')'"
                >
                  <Tag :color="HTTP_TAG_MAP.get(api.requestMethod)">{{ api.requestMethod }}</Tag>
                  {{ api.uri }}
                </div>
              </template>
            </CardMeta>
          </Card>
        </div>
      </Col>
    </Row>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { Row, Col, Tag, Card, CardMeta } from 'ant-design-vue';
  import { split, uniqueId } from 'lodash-es';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { findSystemApi } from '/@/api/lamp/common/general';
  import { HTTP_TAG_MAP } from '/@/enums/httpEnum';
  import { selectResourceApiFormSchema } from './defResourceApi.data';

  export default defineComponent({
    name: 'DefResourceResourceApiSelect',
    components: { BasicModal, BasicForm, Row, Col, Tag, Card, CardMeta },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const currentService = ref<string>('base'); // 当前的服务
      const currentController = ref<string>(''); // 当前的控制器类
      const serviceControllerListMap = ref<Recordable>({}); // 服务 对应的控制器类
      const apiMap = ref<Recordable>({}); //后端返回集合
      const selectedData = ref<Recordable[]>([]);
      // 选择服务
      async function handleServiceChange(value: string) {
        currentService.value = value;
        let controllerOptions: Recordable[] = [];

        apiMap.value = await findSystemApi(value);

        for (const controller in unref(apiMap)) {
          controllerOptions.push({
            value: controller,
            key: controller,
            label: controller,
          });
        }

        serviceControllerListMap.value[value] = apiMap.value;

        updateSchema([
          {
            field: 'controller',
            componentProps: {
              options: controllerOptions,
            },
          },
          {
            field: 'uri',
            componentProps: {
              options: undefined,
              'option-label-prop': 'label',
            },
          },
        ]);

        setFieldsValue({ controller: undefined, uri: undefined });
      }
      // 选择控制器
      async function handleControllerChange(value: string) {
        let uriOptions: Recordable[] = [];
        currentController.value = value;
        for (const controller in unref(apiMap)) {
          if (controller === value) {
            const map = unref(apiMap);
            const uriList = map[controller];
            for (const uri of uriList) {
              uriOptions.push({
                value: `${uri.springApplicationName}#${uri.controller}#${uri.uri}#${uri.requestMethod}#${uri.name}`,
                key: uri.springApplicationName + uri.uri + uri.requestMethod,
                label: `${uri.uri}【${uri.requestMethod}】(${uri.name})`,
              });
            }
          }
        }

        const selectedOptions = getSelectedOptions(value);
        updateSchema({
          field: 'uri',
          componentProps: {
            options: uriOptions,
          },
        });
        setFieldsValue({ uri: selectedOptions });
      }

      // 获取已经选中的uri
      function getSelectedOptions(controller: string) {
        const selectedOptions: string[] = [];
        // 已选列表
        for (const selected of unref(selectedData)) {
          // 后台返回的所有的uri
          // for (const uri of unref(serviceControllerListMap)?.[currentService.value]?.[controller]) {
          for (const uri of unref(apiMap)?.[controller]) {
            if (
              selected.springApplicationName === uri.springApplicationName &&
              selected.uri === uri.uri &&
              selected.requestMethod === uri.requestMethod
            ) {
              selectedOptions.push(
                `${uri.springApplicationName}#${uri.controller}#${uri.uri}#${uri.requestMethod}#${uri.name}`,
              );
            }
          }
        }
        return selectedOptions;
      }
      // 添加
      function addSelectedData(obj) {
        let flag = false;
        for (const selected of unref(selectedData)) {
          if (
            selected.springApplicationName === obj.springApplicationName &&
            selected.uri === obj.uri &&
            selected.requestMethod === obj.requestMethod
          ) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          selectedData.value.push(obj);
        }
      }

      async function delSelectedDataByCard(obj) {
        const uris = await getFieldsValue()?.uri;
        if (uris) {
          const index = uris.findIndex((uri) => {
            const selected = split(uri, '#');
            return (
              selected[0] === obj.springApplicationName &&
              selected[2] === obj.uri &&
              selected[3] === obj.requestMethod
            );
          });
          if (index > -1) {
            uris.splice(index, 1);
          }

          if (uris && uris.length > 0) {
            await setFieldsValue({ uri: undefined });
            await setFieldsValue({ uri: uris });
          } else {
            setFieldsValue({ uri: undefined });
          }
        }
        delSelectedData(obj);
      }

      function delSelectedData(obj) {
        let index = unref(selectedData).findIndex(
          (selected) =>
            selected.springApplicationName === obj.springApplicationName &&
            selected.uri === obj.uri &&
            selected.requestMethod === obj.requestMethod,
        );

        if (index > -1) {
          selectedData.value.splice(index, 1);
        }
      }

      // 选择 uri
      const handleUriChange = async (values: string[]) => {
        // 当前选中的值
        if (values && values.length > 0) {
          for (const value of values) {
            const valueList = split(value, '#');
            addSelectedData({
              springApplicationName: valueList[0],
              controller: valueList[1],
              uri: valueList[2],
              requestMethod: valueList[3],
              name: valueList[4],
              isInput: false,
              tempId: uniqueId(),
            });
          }
        } else {
          // 取消了所有
          const apiList = apiMap.value[currentController.value];
          for (const api of apiList) {
            delSelectedData(api);
          }
        }
      };
      // 取消 uri
      const handleUriDeselect = async (value) => {
        // 取消的数据
        const valueList = split(value, '#');
        delSelectedData({
          springApplicationName: valueList[0],
          controller: valueList[1],
          uri: valueList[2],
          requestMethod: valueList[3],
          name: valueList[4],
        });
      };

      const [registerForm, { setFieldsValue, getFieldsValue, resetFields, updateSchema }] = useForm(
        {
          // labelWidth: 80,
          layout: 'vertical',
          schemas: selectResourceApiFormSchema(
            handleServiceChange,
            handleControllerChange,
            handleUriChange,
            handleUriDeselect,
          ),
          baseColProps: { span: 24 },
          showActionButtonGroup: false,
          actionColOptions: {
            span: 23,
          },
        },
      );

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        await updateSchema([
          {
            field: 'controller',
            componentProps: {
              options: undefined,
            },
          },
          {
            field: 'uri',
            componentProps: {
              options: undefined,
            },
          },
        ]);

        setModalProps({ confirmLoading: false, minHeight: 300 });

        selectedData.value = data?.selectedData;
      });

      async function handleSubmit() {
        try {
          setModalProps({ confirmLoading: true });

          closeModal();
          emit('success', unref(selectedData));
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return {
        t,
        registerModal,
        registerForm,
        handleSubmit,
        selectedData,
        delSelectedDataByCard,
        HTTP_TAG_MAP,
      };
    },
  });
</script>
<style lang="less" scoped>
  .cardDesc {
    background: rgb(97 175 254 / 10%);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-weight: bold;
  }
</style>
