import { useMessage } from '/@/hooks/web/useMessage';
import componentSetting, { SORT_FIELD } from '/@/settings/componentSetting';
import { isArray, isFunction, isString } from '/@/utils/is';
import { DictEnum, EnumEnum } from '/@/enums/commonEnum';
import { asyncFindDictList, asyncFindEnumList } from '/@/api/lamp/common/general';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
const { createMessage } = useMessage();

const PAGE_PARAMS = Object.values(componentSetting.table.fetchSetting);

export const handleSearchInfoByCreateTime = (data: Recordable) => {
  const temp = { ...data };
  for (const k in data) {
    delete data[k];
  }
  data.model = temp;
  if (temp.createTimeRange) {
    data.extra = {
      createTime_st: temp.createTimeRange[0],
      createTime_ed: temp.createTimeRange[1],
    };
  }
  delete data.model['createTimeRange'];
  return data;
};

export const handleFetchParams = (data: Recordable) => {
  const tempData = { model: {}, extra: {} };
  const model = {};
  for (const key in data) {
    if (PAGE_PARAMS.includes(key)) {
      tempData[key] = data[key];
      if (key === SORT_FIELD && isArray(data[SORT_FIELD])) {
        if (data[SORT_FIELD][0] === 'echoMap') {
          tempData[key] = data[SORT_FIELD][1];
        } else {
          tempData[key] = data[SORT_FIELD][0];
        }
      }
    } else if (key.endsWith(',desc')) {
      model[key.split(',desc')[0]] = data[key];
    } else if (key.startsWith('echoMap,')) {
      const tempK = key.split('echoMap,')[1];
      model[tempK.split(',')[0]] = data[key];
    } else if (key === 'createTimeRange') {
    } else {
      model[key] = data[key];
    }
  }
  if (data?.createTimeRange) {
    tempData.extra = {
      createdTime_st: data.createTimeRange[0],
      createdTime_ed: data.createTimeRange[1],
    };
  }
  tempData.model = model;
  return tempData;
};

export const blobToObj = (data) => {
  return new Promise((resolve) => {
    if (data?.type == 'application/json') {
      const reader = new FileReader();
      reader.readAsText(data, 'utf-8');
      reader.onload = function (e) {
        try {
          const parseObj = JSON.parse(e.target?.result as string);
          resolve(parseObj);
        } catch (error) {
          resolve({
            code: -1,
            msg: '获取失败',
          });
        }
      };
    }
  });
};

/**
 * 下载方法
 * @param response
 */
export const downloadFile = (response) => {
  const res = response.data;
  const type = res.type;
  if (type.includes('application/json')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.readyState === 2) {
        const data = JSON.parse(e.target?.result as string);
        createMessage.warning(data.msg);
      }
    };
    reader.readAsText(res);
  } else {
    const disposition = response?.headers?.['content-disposition'];
    let fileName = '下载文件.zip';
    if (disposition) {
      const respcds = disposition.split(';');
      for (let i = 0; i < respcds.length; i++) {
        const header = respcds[i];
        if (header !== null && header !== '') {
          const headerValue = header.split('=');
          if (headerValue !== null && headerValue.length > 0) {
            if (headerValue[0].trim().toLowerCase() === 'filename') {
              fileName = decodeURI(headerValue[1]);
              break;
            }
          }
        }
      }
    }
    //处理引号
    if (
      (fileName.startsWith("'") || fileName.startsWith('"')) &&
      (fileName.endsWith("'") || fileName.endsWith('"'))
    ) {
      fileName = fileName.substring(1, fileName.length - 1);
    }

    const blob = new Blob([res]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
};

/**
 * 根据 条件回调 查找节点
 * @param list 树列表
 * @param func 条件回调
 * @param resultFunc 返回值回调
 */
export function findNodeByFunction(list: any[], func: Fn, resultFunc: Fn) {
  if (!isFunction(func)) {
    console.error('func 参数不是一个函数');
    return [];
  }
  if (!list || !isArray(list)) {
    return [];
  }
  let nodeList: any[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (func(item)) {
      nodeList.push(resultFunc(item));
    }
    if (item.children && item.children.length > 0) {
      const childrenNodes = findNodeByFunction(item.children, func, resultFunc);
      nodeList = [...nodeList, ...childrenNodes];
    }
  }
  return nodeList;
}

/**
 * 校验手机号格式
 * @param mobile
 */
export function validMobile(mobile) {
  const reg = /^0?1[0-9]{10}$/;
  return reg.test(mobile);
}

// 格式化文件大小 单位：B、KB、MB、GB
export const formatFileSize = (value) => {
  if (null == value || value == '') {
    return '0 M';
  }
  const unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const srcSize = parseFloat(value);
  const index = Math.floor(Math.log(srcSize) / Math.log(1024));
  const size = srcSize / Math.pow(1024, index);
  if (unitArr[index]) {
    return size.toFixed(2) + unitArr[index];
  }
  return '文件太大';
};

export const enumAllComponentProps = (
  type: DictEnum | string,
  extendFirst = true,
  excludes?: string | string[],
) => {
  return enumComponentProps(
    type,
    extendFirst,
    { label: '所有', text: '所有', value: null },
    excludes,
  );
};

export const enumComponentProps = (
  type: EnumEnum | string,
  extendFirst = true,
  extend?: any,
  excludes?: string | string[],
) => {
  if (excludes && isString(excludes)) {
    excludes = [excludes];
  }
  return {
    api: asyncFindEnumList,
    params: { type, extendFirst, extend, excludes },
    resultField: 'data',
    showSearch: true,
    filterOption: (input: string, option: any) => {
      return option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    },
  };
};

export const dictAllComponentProps = (
  type: DictEnum | string,
  extendFirst = true,
  excludes?: string | string[],
) => {
  return dictComponentProps(
    type,
    extendFirst,
    { label: '所有', text: '所有', value: null },
    excludes,
  );
};

export const dictComponentProps = (
  type: DictEnum | string,
  extendFirst = true,
  extend?: any,
  excludes?: string | string[],
) => {
  if (excludes && isString(excludes)) {
    excludes = [excludes];
  }
  return {
    api: asyncFindDictList,
    params: { type, extend, extendFirst, excludes },
    resultField: 'data',
    showSearch: true,
    filterOption: (input: string, option: any) => {
      return option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;
    },
  };
};

export const stateComponentProps = (all?: boolean) => {
  if (all) {
    return {
      options: [
        { label: '所有', value: null },
        { label: t('lamp.common.enable'), value: true },
        { label: t('lamp.common.disable'), value: false },
      ],
    };
  } else {
    return {
      options: [
        { label: t('lamp.common.enable'), value: true },
        { label: t('lamp.common.disable'), value: false },
      ],
    };
  }
};

export const yesNoComponentProps = (all = false) => {
  if (all) {
    return {
      options: [
        { label: '所有', value: null },
        { label: t('lamp.common.yes'), value: true },
        { label: t('lamp.common.no'), value: false },
      ],
    };
  } else {
    return {
      options: [
        { label: t('lamp.common.yes'), value: true },
        { label: t('lamp.common.no'), value: false },
      ],
    };
  }
};

export const stateFilters = () => {
  return [
    { text: t('lamp.common.enable'), value: 'true' },
    { text: t('lamp.common.disable'), value: 'false' },
  ];
};

export const yesNoFilters = () => {
  return [
    { text: t('lamp.common.yes'), value: 'true' },
    { text: t('lamp.common.no'), value: 'false' },
  ];
};
