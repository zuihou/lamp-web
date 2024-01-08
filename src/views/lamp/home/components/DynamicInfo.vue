<template>
  <Card :title="getTitle" v-bind="$attrs">
    <template #extra>
      <a-button href="https://www.oschina.net/p/lamp-cloud" size="small" type="link">更多</a-button>
    </template>
    <List :data-source="dynamicInfoItems" item-layout="horizontal">
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta>
            <template #description>
              {{ item.date }}
            </template>
            <!-- eslint-disable-next-line -->
            <template #title> {{ item.name }} <span v-html="item.desc"> </span></template>
            <template #avatar>
              <Progress type="circle" :percent="item.percent" :width="40" />
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </Card>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { Card, List, Progress } from 'ant-design-vue';
  import { dynamicInfoItems } from './data';
  import { useGlobSetting } from '/@/hooks/setting';

  const ListItem = List.Item;
  const ListItemMeta = List.Item.Meta;

  const globSetting = useGlobSetting();
  const getTitle = computed(() => `最新动态(${globSetting.multiTenantType})`);
</script>
