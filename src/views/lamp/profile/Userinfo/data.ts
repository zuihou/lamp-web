import { FormSchema } from '/@/components/Form/index';
import { dictComponentProps } from '/@/utils/lamp/common';
import { DictEnum } from '/@/enums/commonEnum';

// 基础设置 form
export const userInfoSchemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'ID',
    colProps: { span: 18 },
    show: false,
  },
  {
    field: 'username',
    component: 'Input',
    label: '账号',
    colProps: { span: 18 },
    dynamicDisabled: () => {
      return true;
    },
  },
  {
    field: 'email',
    component: 'Input',
    label: '邮箱',
    colProps: { span: 18 },
    dynamicDisabled: () => {
      return true;
    },
  },
  {
    field: 'mobile',
    component: 'Input',
    label: '手机',
    colProps: { span: 18 },
    dynamicDisabled: () => {
      return true;
    },
  },
  {
    field: 'idCard',
    component: 'Input',
    label: '身份证号',
    colProps: { span: 18 },
  },
  {
    field: 'nickName',
    component: 'Input',
    label: '昵称',
    colProps: { span: 18 },
  },
  {
    field: 'sex',
    component: 'ApiSelect',
    label: '性别',
    colProps: { span: 18 },
    componentProps: {
      ...dictComponentProps(DictEnum.SEX),
    },
  },
  {
    field: 'nation',
    component: 'ApiSelect',
    label: '民族',
    colProps: { span: 18 },
    componentProps: {
      ...dictComponentProps(DictEnum.NATION),
    },
  },
  {
    field: 'education',
    component: 'ApiSelect',
    label: '学历',
    colProps: { span: 18 },
    componentProps: {
      ...dictComponentProps(DictEnum.EDUCATION),
    },
  },
  {
    field: 'workDescribe',
    component: 'InputTextArea',
    label: '个人简介',
    colProps: { span: 18 },
  },
];
