import type { App } from 'vue';
import { registerJVxeTable } from '/@/components/JVxeTable';

export async function registerThirdComp(app: App) {
  // 注册 JVxeTable 组件
  registerJVxeTable(app);
}
