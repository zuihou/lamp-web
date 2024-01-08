interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
  name: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'parentId',
  name: 'name',
};

// 获取配置。  Object.assign 从一个或多个源对象复制到目标对象
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

/**
 * 将list集合转换为tree型集合
 * @param list
 * @param config
 */
export function listToTree<T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] {
  const conf = getConfig(config) as TreeHelperConfig;
  const nodeMap = new Map();
  const result: T[] = [];
  const { id, children, pid } = conf;

  for (const node of list) {
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent[children] : result).push(node);
  }
  return result;
}

/**
 * 将tree集合转换为list型集合
 * @param tree
 * @param config
 */
export function treeToList<T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T {
  config = getConfig(config);
  const { children } = config;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}

/**
 * 根据 key 在Tree结构集合中 查询节点
 * @param key 唯一键
 * @param tree 树列表
 */
export function findNodeByKey(key: any, tree: any[], config: Partial<TreeHelperConfig> = {}) {
  const conf = getConfig(config) as TreeHelperConfig;
  const { id, name, children } = conf;
  if (key === '0') {
    return { [id]: '0', [name]: '根节点' };
  }
  if (!key) {
    return { [id]: key, [name]: '根节点' };
  }

  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    if (item[id] === key) {
      return item;
    }
    if (item[children]) {
      const res = findNodeByKey(key, item[children]);
      if (res) {
        return res;
      }
    }
  }
  return null;
}

/**
 * 在tree结构中根据func回调查找节点
 * @param tree
 * @param func
 * @param config
 */
export function findNode<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T | null {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  for (const node of list) {
    if (func(node)) return node;
    node[children!] && list.push(...node[children!]);
  }
  return null;
}

/**
 * 在tree结构中根据func回调查找节点
 * @param tree
 * @param func
 * @param config
 */
export function findNodeAll<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  const result: T[] = [];
  for (const node of list) {
    func(node) && result.push(node);
    node[children!] && list.push(...node[children!]);
  }
  return result;
}

export function findPath<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T | T[] | null {
  config = getConfig(config);
  const path: T[] = [];
  const list = [...tree];
  const visitedSet = new Set();
  const { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}

export function findPathAll(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) {
  config = getConfig(config);
  const path: any[] = [];
  const list = [...tree];
  const result: any[] = [];
  const visitedSet = new Set(),
    { children } = config;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      func(node) && result.push([...path]);
    }
  }
  return result;
}

export function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  // Partial 将 T 中的所有属性设为可选
  config: Partial<TreeHelperConfig> = {},
): T[] {
  // 获取配置
  config = getConfig(config);
  const children = config.children as string;

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        // 递归调用 对含有children项  进行再次调用自身函数 listFilter
        node[children] = node[children] && listFilter(node[children]);
        // 执行传入的回调 func 进行过滤
        return func(node) || (node[children] && node[children].length);
      });
  }

  return listFilter(tree);
}

export function forEach<T = any>(
  tree: T[],
  func: (n: T) => any,
  config: Partial<TreeHelperConfig> = {},
): void {
  config = getConfig(config);
  const list: any[] = [...tree];
  const { children } = config;
  for (let i = 0; i < list.length; i++) {
    //func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (func(list[i])) {
      return;
    }
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children]);
  }
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMapEach(
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn },
) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number) =>
        treeMapEach(i, {
          children,
          conversion,
        }),
      ),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}

// 根据父id查找子节点的id
export function findChildrenByParentId<T = string | number, N = Recordable>(
  nodeKey: T,
  treeData: N[] = [],
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const keys: T[] = [];
  config = getConfig(config);
  const { children: childrenField, id: keyField } = config;
  if (!keyField || !childrenField) return keys;
  for (let index = 0; index < treeData.length; index++) {
    const node = treeData[index];
    const children = node[childrenField];
    if (nodeKey === node[keyField]) {
      keys.push(node[keyField]!);
      if (children && children.length) {
        keys.push(...(findAllKeys(children, config) as T[]));
      }
    } else {
      if (children && children.length) {
        keys.push(...findChildrenByParentId(nodeKey, children));
      }
    }
  }
  return keys;
}

export function findAllKeys<N = Recordable>(treeData: N[], config: Partial<TreeHelperConfig> = {}) {
  const keys: any[] = [];
  config = getConfig(config);
  const { children: childrenField, id: keyField } = config;
  if (!keyField || !childrenField) return keys;

  for (let index = 0; index < treeData.length; index++) {
    const node = treeData[index];
    keys.push(node[keyField]!);
    const children = node[childrenField];
    if (children && children.length) {
      keys.push(...(findAllKeys(children) as any[]));
    }
  }
  return keys as any[];
}

// 根据父id查找子节点
export function getById<T = string | number, N = Recordable>(
  nodeKey: T,
  treeData: N[],
  config: Partial<TreeHelperConfig> = {},
): N {
  config = getConfig(config);
  const { children: childrenField, id: keyField } = config;
  if (!keyField || !childrenField) return {} as N;
  const list: N[] = [...treeData];
  for (let i = 0; i < list.length; i++) {
    //func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (nodeKey === list[i][keyField]) {
      return list[i];
    }
    childrenField && list[i][childrenField] && list.splice(i + 1, 0, ...list[i][childrenField]);
  }
  return {} as N;
}

// 遍历树结构
export function eachTree(treeDatas: any[], callBack: Fn, parentNode = {}) {
  treeDatas.forEach((element) => {
    const newNode = callBack(element, parentNode) || element;
    if (element.children) {
      eachTree(element.children, callBack, newNode);
    }
  });
}
