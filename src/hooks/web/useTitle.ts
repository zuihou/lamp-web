import { watch, unref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useTitle as usePageTitle } from '@vueuse/core';
import { useGlobSetting } from '/@/hooks/setting';
import { useRouter } from 'vue-router';
import { useLocaleStore } from '/@/store/modules/locale';
import { useUserStore } from '/@/store/modules/user';

import { REDIRECT_NAME } from '/@/router/constant';

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useTitle() {
  const { title } = useGlobSetting();
  const { t } = useI18n();
  const { currentRoute } = useRouter();
  const localeStore = useLocaleStore();
  const userStore = useUserStore();
  const pageTitle = usePageTitle();

  function computeTitle() {
    const route = unref(currentRoute);

    if (route.name === REDIRECT_NAME) {
      return;
    }
    let appTitle = userStore.getUserInfo?.defApplication?.name;

    appTitle = appTitle ?? title;
    const tTitle = t(route?.meta?.title as string);
    pageTitle.value = tTitle ? ` ${tTitle} - ${appTitle} ` : `${appTitle}`;
  }

  watch(
    [
      () => currentRoute.value.path,
      () => localeStore.getLocale,
      () => userStore.getUserInfo?.defApplication?.name,
    ],
    () => computeTitle(),
    {
      immediate: true,
    },
  );
}
