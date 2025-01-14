/**
 * Used to parse the .env.development proxy configuration
 */
import type { ProxyOptions } from 'vite';

interface ProxyTarget {
  proxyKey: string;
  rewriteAfter: string;
  rewriteBefore: string;
  target: string;
}

type ProxyTargetList = Record<string, ProxyOptions>;

const httpsRE = /^https:\/\//;

/**
 * Generate proxy
 * @param list
 */
export function createProxy(proxyTargetList: ProxyTarget[]) {
  const ret: ProxyTargetList = {};

  for (const { proxyKey, rewriteAfter, rewriteBefore, target } of proxyTargetList) {
    const isHttps = httpsRE.test(target);

    // eslint-disable-next-line no-console
    console.log(
      '代理配置为:以前缀为[%s]开头的接口,将[%s]替换为[%s],并代理到：[%s]',
      proxyKey,
      rewriteBefore,
      rewriteAfter,
      target,
    );

    ret[proxyKey] = {
      changeOrigin: true,
      rewrite: (path) => {
        return path.replace(new RegExp(`^${rewriteBefore}`), `${rewriteAfter}`);
      },
      target,
      ws: true,
      ...(isHttps ? { secure: false } : {}),
    };
  }

  return ret;
}
