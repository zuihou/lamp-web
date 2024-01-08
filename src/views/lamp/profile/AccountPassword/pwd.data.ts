import { FormSchema } from '/@/components/Form';

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'oldPassword',
    label: '当前密码',
    component: 'InputPassword',
    componentProps: {
      autocomplete: 'off',
      placeholder: '当前密码',
    },
  },
  {
    field: 'password',
    label: '新密码',
    component: 'StrengthMeter',
    componentProps: {
      autocomplete: 'off',
      placeholder: '新密码',
    },
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',
    componentProps: {
      autocomplete: 'off',
      placeholder: '确认密码',
    },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject('确认密码不能为空');
            }
            if (value !== values.password) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
