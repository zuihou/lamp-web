import { DescItem } from '/@/components/Description';
import { BasicColumn } from '/@/components/Table';

export const cpuSchema: DescItem[] = [
  {
    field: 'cpuNum',
    label: 'CPU核',
  },
  // {
  //   field: 'total',
  //   label: '总使用率',
  // },
  {
    field: 'sys',
    label: '系统使用率（%）',
  },
  {
    field: 'used',
    label: '用户使用率（%）',
  },
  {
    field: 'wait',
    label: '当前等待率（%）',
  },
  {
    field: 'free',
    label: '当前空闲率（%）',
  },
];
export const memSchema: DescItem[] = [
  {
    field: 'total',
    label: '内存总量（G）',
  },
  {
    field: 'used',
    label: '已用内存（G）',
  },
  {
    field: 'free',
    label: '剩余内存（G）',
  },
  {
    field: 'usage',
    label: '使用率（%）',
  },
];

export const jvmSchema: DescItem[] = [
  {
    field: 'total',
    label: '占用的内存总数(M)',
  },
  {
    field: 'max',
    label: '最大可用内存总数(M)',
  },
  {
    field: 'free',
    label: 'JVM空闲内存(M)',
  },
  {
    field: 'usage',
    label: '使用率（%）',
  },
  {
    field: 'name',
    label: 'Jvm名称',
  },
  {
    field: 'version',
    label: 'JDK版本',
  },
  {
    field: 'startTime',
    label: '启动时间',
  },
  {
    field: 'runTime',
    label: '运行时长',
  },
  {
    field: 'home',
    label: 'JDK路径',
  },
  {
    field: 'inputArgs',
    label: '运行参数',
  },
];

export const sysSchema: DescItem[] = [
  {
    field: 'computerName',
    label: '服务器名称',
  },
  {
    field: 'computerIp',
    label: '服务器Ip',
  },
  {
    field: 'userDir',
    label: '项目路径',
  },
  {
    field: 'osName',
    label: '操作系统',
  },
  {
    field: 'osArch',
    label: '系统架构',
  },
];

export const columns: BasicColumn[] = [
  {
    title: '盘符路径',
    dataIndex: 'dirName',
  },
  {
    title: '盘符类型',
    dataIndex: 'sysTypeName',
  },
  {
    title: '文件类型',
    dataIndex: 'typeName',
  },
  {
    title: '总大小',
    dataIndex: 'total',
  },
  {
    title: '剩余大小',
    dataIndex: 'free',
  },
  {
    title: '已经使用量',
    dataIndex: 'used',
  },
  {
    title: '资源的使用率',
    dataIndex: 'usage',
  },
];
