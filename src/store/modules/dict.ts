import { defineStore } from 'pinia';
import { findDictItemByType as fetchDict } from '/@/api/lamp/common/general';
import { DefDictItemResultVO } from '/@/api/devOperation/system/model/defDictItemModel';
import { store } from '/@/store';
import { isEmptyOrUnDef, isNullOrUnDef } from '/@/utils/is';
import { DictDataTypeEnum } from '/@/enums/biz/tenant';
import { i18n } from '/@/locales/setupI18n';

type NestedObject = {
  [key: string]: NestedObject | null | string;
};

interface DictState {
  dictData: Record<string, DefDictItemResultVO[]>; // 字典数据
  dictMap: Record<string, Record<string, DefDictItemResultVO>>; // 字典数据
  registeredTypes: string[]; // 注册的字典类型
}

export const useDictStore = defineStore('app-dict', {
  state: (): DictState => ({
    registeredTypes: [],
    dictData: {},
    dictMap: {},
  }),
  getters: {
    // 获取指定类型的字典项列表数据
    getDictItemList: (state) => (type: string) => {
      return state.dictData[type] || [];
    },

    /**
     * 按照下拉框options格式返回
     * @param state
     * @returns 返回可以提供给select、radiogroup等组件直接使用的字典项列表
     */
    getDictItemOptionList: (state) => (type: string, locale?: string, disableInvalid?: boolean) => {
      const dictItemList = state.dictData[type] || [];
      return dictItemList.map((item) => {
        let label = item.name;
        let value: boolean | number | string = item.key as string;
        if (item.dataType === DictDataTypeEnum.INTEGER) {
          value = Number.isNaN(value) ? (item.key as string) : Number(value);
        } else if (item.dataType === DictDataTypeEnum.BOOLEAN) {
          value = ['1', 1, true, 'true'].includes(value);
        } else {
          value = String(value);
        }
        if (isEmptyOrUnDef(locale)) {
          locale = (i18n.global.locale as any).value;
        }

        if (!isEmptyOrUnDef(item.i18nJson) && !isEmptyOrUnDef(locale)) {
          try {
            const i18nJson = JSON.parse(item.i18nJson);
            label = i18nJson[locale];
            if (isEmptyOrUnDef(label)) {
              label = item.name;
            }
          } catch {}
        }
        return {
          label,
          value,
          disabled: disableInvalid ? false : !item.state,
          ...item,
        };
      });
    },

    // 获取指定类型和字典项key，获取字典项对象
    getDictItem: (state) => (type: string, uniqKey: string) => {
      return state.dictMap[type]?.[uniqKey];
    },

    // 检查字典是否已加载
    isLoaded: (state) => (type: string) => {
      return !!state.dictData[type] && state.dictData[type].length > 0;
    },
  },
  actions: {
    extractValues(obj: NestedObject): string[] {
      const result: string[] = [];

      for (const key in obj) {
        const value = obj[key];

        // 排除 null 和非对象类型
        if (!isNullOrUnDef(value)) {
          if (typeof value === 'object') {
            result.push(...this.extractValues(value));
          } else {
            result.push(value.toString());
          }
        }
      }

      return result;
    },
    // 注册字典类型
    registerDictType(obj: NestedObject) {
      this.registerDictTypes(this.extractValues(obj));
    },

    registerDictTypes(types: string | string[]) {
      const typeList = Array.isArray(types) ? types : [types];

      typeList.forEach((type) => {
        if (!this.registeredTypes.includes(type)) {
          this.registeredTypes.push(type);
        }
      });
    },

    // 批量加载所有注册的字典
    loadAllRegisteredDict() {
      if (this.registeredTypes.length === 0) return;

      try {
        // 使用传入的函数获取字典数据
        fetchDict(this.registeredTypes).then((res) => {
          this.dictData = res;

          const map: Record<string, Record<string, DefDictItemResultVO>> = {};
          for (const type in res) {
            const itemList = res[type];
            if (!itemList) {
              continue;
            }

            const itemMap: Record<string, DefDictItemResultVO> = {};
            for (const item of itemList) {
              itemMap[item.key as string] = item;
            }

            map[type] = itemMap;
          }

          this.dictMap = map;
        });
      } catch (error) {
        console.error(`加载字典失败:`, error);
      }
    },
  },
});

// Need to be used outside the setup
export function useDictStoreWithOut() {
  return useDictStore(store);
}
