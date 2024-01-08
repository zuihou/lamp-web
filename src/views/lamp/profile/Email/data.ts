import { FormSchema } from '/@/components/Form';

export const formSchema = (handleSendCode: Fn): FormSchema[] => {
  return [
    {
      field: 'email',
      label: '邮箱',
      component: 'Input',
    },
    {
      field: 'templateCode',
      label: '消息模板',
      show: false,
      component: 'Input',
    },
    {
      field: 'code',
      label: '验证码',
      component: 'InputCountDown',
      componentProps: {
        sendCodeApi: handleSendCode,
      },
    },
  ];
};
