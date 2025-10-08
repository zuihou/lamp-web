<template>
  <Form ref="formRef" :model="formData">
    <Space
      v-for="item in i18nList"
      :key="item.value"
      style="display: flex; margin-bottom: 8px"
      align="baseline"
    >
      <FormItem :label="item.label" :name="item.value">
        <Input v-model:value="formData[item.value]" @input="handleInputChange" />
      </FormItem>
    </Space>
  </Form>
</template>
<script lang="ts" setup>
  import { Form, FormItem, Space, Input } from 'ant-design-vue';
  import { onMounted, reactive, ref, watch } from 'vue';
  import { DictEnum } from '/@/enums/commonEnum';
  import { OptionsItem } from '/@/api/lamp/common/model/optionsModel';
  import { useDictStore } from '/@/store/modules/dict';

  // 接收父组件传入的value
  const props = defineProps<{
    value?: string;
    type?: string;
  }>();

  // 向父组件 emits 事件
  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'validate', callback: (valid: boolean) => void): void;
  }>();

  const i18nList = ref<OptionsItem[]>([]);
  const formData = reactive<Record<string, string | undefined>>({});
  const formRef = ref<any>(null);

  // 初始化表单数据和规则
  const initForm = (jsonStr?: string) => {
    // 清空现有数据
    // Object.keys(formData).forEach((key) => delete formData[key]);

    // 初始化表单规则
    i18nList.value.forEach((item) => {
      formData[item.value] = '';
    });

    if (jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        // 将解析后的数据赋值到表单
        Object.keys(parsed).forEach((key) => {
          formData[key] = parsed[key];
        });
      } catch (e) {
        console.error('解析JSON失败:', e);
      }
    }
  };

  // 处理输入变化
  const handleInputChange = () => {
    emit('update:value', JSON.stringify(formData));
  };

  // 暴露验证方法给父组件
  const validate = async () => {
    if (formRef.value) {
      return await formRef.value.validate();
    }
    return false;
  };

  // 监听父组件传入的value变化
  watch(
    () => props.value,
    (newVal) => {
      initForm(newVal);
    },
    { immediate: true },
  );

  // 监听语言列表变化，重新初始化表单
  watch(
    () => i18nList.value,
    () => {
      initForm(props.value);
    },
  );

  onMounted(async () => {
    try {
      const dictStore = useDictStore();
      // 获取语言列表
      const dictData = dictStore.getDictItemOptionList(DictEnum.I18N_JSON);
      i18nList.value = dictData as unknown as OptionsItem[];
    } catch (error) {
      console.error('获取语言字典失败:', error);
    }
  });

  // 提供给父组件调用的验证方法
  emit('validate', validate);
</script>
