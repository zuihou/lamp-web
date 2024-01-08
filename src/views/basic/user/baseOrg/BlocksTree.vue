<template>
  <div class="bg-white m-4 mr-2 overflow-hidden">
    <div class="m-4">
      <Space>
        <a-button
          v-hasAnyPermission="[RoleEnum.ORG_SWITCH]"
          class="mr-2"
          type="primary"
          @click="changeDisplay()"
        >
          切换
        </a-button>
        <a-button v-hasAnyPermission="[RoleEnum.ORG_ADD]" class="mr-2" @click="handleAdd()">
          新增
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.ORG_EDIT]"
          :disabled="isEmpty(state.current.id) || isNullOrUnDef(state.current.id)"
          class="mr-2"
          @click="handleEdit()"
        >
          编辑
        </a-button>
        <a-button
          v-hasAnyPermission="[RoleEnum.ORG_DELETE]"
          :disabled="isEmpty(state.current.id) || isNullOrUnDef(state.current.id)"
          class="mr-2"
          @click="handleDelete()"
        >
          删除
        </a-button>
      </Space>
      <Space>
        <!-- 垂直展示 -->
        <Checkbox v-model:checked="isHorizontal">垂直展示</Checkbox>
        <!-- 折叠节点 -->
        <Checkbox v-model:checked="collapsable">折叠节点</Checkbox>
        <!-- 主题背景 -->
        <Select
          :default-value="labelClassName"
          size="small"
          style="width: 120px"
          @change="changeClassName"
        >
          <SelectOption
            v-for="(item, index) in labelClassNameItem"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </SelectOption>
        </Select>
      </Space>
    </div>
    <Card>
      <div style="text-align: center; overflow: auto">
        <Spin :spinning="spinning" />
        <VueBlocksTree
          v-if="!spinning"
          :collapsable="collapsable"
          :data="state.treeData"
          :horizontal="isHorizontal"
          :label-class-name="labelClassName"
          :props="treeProps"
          @node-click="nodeClick"
        />
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
  import { createApp, onMounted, reactive, ref } from 'vue'; // Composition-API
  import { Card, Checkbox, Select, Space, Spin } from 'ant-design-vue'; // antd组件
  // 引入VueBlocksTree组件
  import VueBlocksTree from 'vue3-blocks-tree';
  import 'vue3-blocks-tree/dist/vue3-blocks-tree.css';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { remove, tree } from '/@/api/basic/user/baseOrg';
  import { findNodeByKey } from '/@/utils/helper/treeHelper';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BaseOrgResultVO } from '/@/api/basic/user/model/baseOrgModel';

  const SelectOption = Select.Option;

  interface TreeResult {
    name: string;
    expand: boolean;
    key: number;
    children?: BaseOrgResultVO[];
  }

  const App = createApp({});
  // 注册VueBlocksTree组件
  let defaultOptions = { treeName: 'blocks-tree' };
  createApp(App).use(VueBlocksTree, defaultOptions);
  const emit = defineEmits(['change', 'select', 'add', 'edit', 'delete']);

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const isHorizontal = ref<boolean>(false); // 是否垂直展示
  const collapsable = ref<boolean>(false); // 折叠节点
  const spinning = ref<boolean>(false); // 加载 ...
  const labelClassName = ref<string>('bg-orange'); // 主题背景类名
  const labelClassNameItem = reactive([
    { value: 'bg-primary', label: '主题背景' },
    { value: 'bg-white', label: '洁白无瑕' },
    { value: 'bg-orange', label: '金橙' },
    { value: 'bg-gold', label: '金光灿灿' },
    { value: 'bg-gray', label: '珊瑚灰' },
    { value: 'bg-lightpink', label: '姹紫嫣红' },
    { value: 'bg-chocolate', label: '黑朱古力' },
    { value: 'bg-tomato', label: '红彤彤' },
  ]);
  const treeProps = { label: 'name', children: 'children', key: 'id' }; // 组件配置
  // const treeData = reactive<TreeResult>();
  const state = reactive({
    treeData: { name: '机构(单位/部门)树', expand: false, key: 0, children: [] } as TreeResult,
    current: {} as BaseOrgResultVO,
  });

  // 不同类型接口切换
  async function fetch() {
    spinning.value = true;
    try {
      state.treeData.children = (await tree()) as BaseOrgResultVO[];
    } finally {
      spinning.value = false;
    }
  }

  // 切换主题颜色
  function changeClassName(value) {
    labelClassName.value = value;
  }

  // 切换显示方式
  function changeDisplay() {
    emit('change', '1');
  }

  function nodeClick(e: Event, data) {
    e?.stopPropagation();
    if (data && data.id) {
      state.current = data;
      const node = findNodeByKey(data.id, state.treeData.children || []);
      const parent = findNodeByKey(node?.parentId, state.treeData.children || []);
      emit('select', parent, node);
    } else {
      state.current = { id: '', name: '根节点' };
      emit('select', { id: '', name: '根节点' });
    }
  }

  // 首次挂载
  onMounted(async () => {
    await fetch();
  });

  function handleAdd() {
    if (state.current.id) {
      emit('add', findNodeByKey(state.current.id, state.treeData.children || []));
    } else {
      emit('add', findNodeByKey('0', state.treeData.children || []));
    }
  }

  function handleEdit() {
    console.log(state.current.id);
    if (state.current.id) {
      const current = findNodeByKey(state.current.id, state.treeData.children || []);
      const parent = findNodeByKey(state.current.parentId, state.treeData.children || []);
      console.log(parent, current);
      emit('edit', parent, current);
    } else {
      createMessage.warn('请先选择节点');
    }
  }

  function handleDelete() {
    if (state.current.id) {
      batchDelete([state.current.id]);
    } else {
      createMessage.warn('请先选择节点');
    }
  }

  // 执行批量删除
  async function batchDelete(ids: string[]) {
    createConfirm({
      iconType: 'warning',
      content: `选中节点【${state.current.name}】及其子结点将被永久删除, 是否确定删除？`,
      onOk: async () => {
        try {
          await remove(ids);
          await fetch();
          createMessage.success(t('common.tips.deleteSuccess'));
        } catch (e) {}
      },
    });
  }

  defineExpose({
    fetch,
    isEmpty,
    isNullOrUnDef,
  });
</script>

<style lang="less" scoped>
  @bgColor: background-color;

  .org-tree-node-label {
    white-space: nowrap;
  }

  :deep(.bg-primary) {
    @{bgColor}: @primary-color;
  }

  :deep(.bg-white) {
    @{bgColor}: white;
  }

  :deep(.bg-orange) {
    @{bgColor}: orange;
  }

  :deep(.bg-gold) {
    @{bgColor}: gold;
  }

  :deep(.bg-gray) {
    @{bgColor}: gray;
  }

  :deep(.bg-lightpink) {
    @{bgColor}: lightpink;
  }

  :deep(.bg-chocolate) {
    @{bgColor}: chocolate;
  }

  :deep(.bg-tomato) {
    @{bgColor}: tomato;
  }
</style>
