/**
 * Used to parse the .env.development proxy configuration
 */
import type { ProxyOptions } from 'vite';
import { isArray } from '/@/utils/is';

type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions>;

const httpsRE = /^https:\/\//;

/**
 * Generate proxy
 * @param list
 */
export function createProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {};
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);

    let proxyKey: string;
    let rewriteBefore: string;
    let rewriteAfter: string;

    if (isArray(prefix)) {
      [proxyKey, rewriteBefore, rewriteAfter] = prefix;
    } else {
      proxyKey = prefix;
      rewriteBefore = prefix;
      rewriteAfter = prefix;
    }
    console.log(
      '代理配置为:以前缀为[%s]开头的接口,将[%s]替换为[%s],并代理到：[%s]',
      proxyKey,
      rewriteBefore,
      rewriteAfter,
      target,
    );

    // https://github.com/http-party/node-http-proxy#options
    ret[proxyKey] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => {
        return path.replace(new RegExp(`^${rewriteBefore}`), `${rewriteAfter}`);
      },
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return ret;
}
