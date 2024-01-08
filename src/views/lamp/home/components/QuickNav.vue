<template>
  <Card title="演示环境" v-bind="$attrs">
    <template v-for="item in navItems" :key="item">
      <CardGrid>
        <a target="_blank" :href="item.href">
          <span class="flex flex-col items-center">
            <Icon :icon="item.icon" :color="item.color" size="20" />
            <span class="text-md mt-2">{{ item.title }}</span>
          </span>
        </a>
      </CardGrid>
    </template>
  </Card>
</template>
<script lang="ts" setup>
  import { Card, CardGrid } from 'ant-design-vue';
  import { navItems } from './data';
  import { Icon } from '/@/components/Icon';
</script>
