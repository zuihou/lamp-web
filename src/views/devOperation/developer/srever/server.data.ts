import { DescItem } from '/@/components/Description';
import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const cpuSchema: DescItem[] = [
  {
    field: 'cpuNum',
    label: t('devOperation.developer.srever.cpu.cpuNum'),
  },
  // {
  //   field: 'total',
  //   label: '总使用率',
  // },
  {
    field: 'sys',
    label: t('devOperation.developer.srever.cpu.sys'),
  },
  {
    field: 'used',
    label: t('devOperation.developer.srever.cpu.used'),
  },
  {
    field: 'wait',
    label: t('devOperation.developer.srever.cpu.wait'),
  },
  {
    field: 'free',
    label: t('devOperation.developer.srever.cpu.free'),
  },
];
export const memSchema: DescItem[] = [
  {
    field: 'total',
    label: t('devOperation.developer.srever.memory.total'),
  },
  {
    field: 'used',
    label: t('devOperation.developer.srever.memory.used'),
  },
  {
    field: 'free',
    label: t('devOperation.developer.srever.memory.free'),
  },
  {
    field: 'usage',
    label: t('devOperation.developer.srever.memory.usage'),
  },
];

export const jvmSchema: DescItem[] = [
  {
    field: 'total',
    label: t('devOperation.developer.srever.jvm.total'),
  },
  {
    field: 'max',
    label: t('devOperation.developer.srever.jvm.max'),
  },
  {
    field: 'free',
    label: t('devOperation.developer.srever.jvm.free'),
  },
  {
    field: 'usage',
    label: t('devOperation.developer.srever.jvm.usage'),
  },
  {
    field: 'name',
    label: t('devOperation.developer.srever.jvm.name'),
  },
  {
    field: 'version',
    label: t('devOperation.developer.srever.jvm.version'),
  },
  {
    field: 'startTime',
    label: t('devOperation.developer.srever.jvm.startTime'),
  },
  {
    field: 'runTime',
    label: t('devOperation.developer.srever.jvm.runTime'),
  },
  {
    field: 'home',
    label: t('devOperation.developer.srever.jvm.home'),
  },
  {
    field: 'inputArgs',
    label: t('devOperation.developer.srever.jvm.inputArgs'),
  },
];

export const sysSchema: DescItem[] = [
  {
    field: 'computerName',
    label: t('devOperation.developer.srever.server.computerName'),
  },
  {
    field: 'computerIp',
    label: t('devOperation.developer.srever.server.computerIp'),
  },
  {
    field: 'userDir',
    label: t('devOperation.developer.srever.server.userDir'),
  },
  {
    field: 'osName',
    label: t('devOperation.developer.srever.server.osName'),
  },
  {
    field: 'osArch',
    label: t('devOperation.developer.srever.server.osArch'),
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('devOperation.developer.srever.disk.dirName'),
    dataIndex: 'dirName',
  },
  {
    title: t('devOperation.developer.srever.disk.sysTypeName'),
    dataIndex: 'sysTypeName',
  },
  {
    title: t('devOperation.developer.srever.disk.typeName'),
    dataIndex: 'typeName',
  },
  {
    title: t('devOperation.developer.srever.disk.total'),
    dataIndex: 'total',
  },
  {
    title: t('devOperation.developer.srever.disk.free'),
    dataIndex: 'free',
  },
  {
    title: t('devOperation.developer.srever.disk.used'),
    dataIndex: 'used',
  },
  {
    title: t('devOperation.developer.srever.disk.usage'),
    dataIndex: 'usage',
  },
];
