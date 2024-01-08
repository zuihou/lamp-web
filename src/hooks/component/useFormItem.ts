import type { UnwrapRef, Ref, WritableComputedRef, DeepReadonly } from 'vue';
import { reactive, readonly, computed, getCurrentInstance, watchEffect, unref, toRaw } from 'vue';

import { isEqual } from 'lodash-es';

export function useRuleFormItem<T extends Recordable, K extends keyof T, V = UnwrapRef<T[K]>>(
  props: T,
  key?: K,
  changeEvent?,
  emitData?: Ref<any[]>,
): [WritableComputedRef<V>, (val: V) => void, DeepReadonly<V>];

export function useRuleFormItem<T extends Recordable>(
  props: T,
  key: keyof T = 'value',
  changeEvent = 'change',
  emitData?: Ref<any[]>,
) {
  const instance = getCurrentInstance();
  const emit = instance?.emit;

  const innerState = reactive({
    value: props[key],
  });

  const defaultState = readonly(innerState);

  const setState = (val: UnwrapRef<T[keyof T]>): void => {
    innerState.value = val as T[keyof T];
  };

  watchEffect(() => {
    innerState.value = props[key];
  });

  const state: any = computed({
    get() {
      return innerState.value;
    },
    set(value) {
      if (isEqual(value, defaultState.value)) return;

      console.log('set=', value, unref(emitData));

      innerState.value = value as T[keyof T];
      /*
     ant design vue 官方文档 https://next.antdv.com/components/select-cn
     antdv 官方的select组件的change事件支持2个参数： function(value, option:Option/Array<Option>)
     即：下方代码中的 value 和 ...(toRaw(unref(emitData)) || [])
     1. nextTick 后调用 changeEvent 会导致 value 为上一次的值！
     2. 注释nextTick后调用 changeEvent 会导致 emitData 为上一次的值！
    也就是说，不管加不加nextTick都有bug，但加了nextTick产生的bug影响更大（同时影响ApiTree和ApiRadioGroup组件的表单校验），故先将nextTick注释。
    咨询了vben作者，没有得到回复，也可以参考 尝试解决

    update by 2022年3月29日15:15:02
    由于ant design vue 的 emit('update:value')方法 先于$emit('change').  所以, 本方法执行时, emitData还无数据。
    故而，注释掉 emit?.(_changeEvent, value, ...(toRaw(unref(emitData)) || [])); 事件
    改成在 handleChange 方法中调用 emit('change', value, ...args);
     */
      // emit?.(_changeEvent, value, ...(toRaw(unref(emitData)) || []));
      // nextTick(() => {
      //   emit?.(changeEvent, value, ...(toRaw(unref(emitData)) || []));
      // });
      // setTimeout(() => {
      emit?.(changeEvent, value, ...(toRaw(unref(emitData)) || []));
      // });
    },
  });

  return [state, setState, defaultState];
}
