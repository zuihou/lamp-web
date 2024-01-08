import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export const ImpExcelModel = createAsyncComponent(() => import('./src/ImportExcelModel.vue'));
export const PreviewExcelModel = createAsyncComponent(() => import('./src/PreviewExcelModel.vue'));
