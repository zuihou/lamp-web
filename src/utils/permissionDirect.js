// 定义一些和权限有关的 Vue指令

function containsAll(maxList, minList) {
  let newList = minList.filter((val) => {
    return maxList.indexOf(val) > -1
  })
  if (newList.length == minList.length) {
    return true;
  } else {
    return false;
  }
}

function isPermitted(allPerms, perm) {
  if (allPerms == null || allPerms.length === 0) {
    return false;
  }
  for (const p of allPerms) {
    if (p.implies(perm)) {
      return true;
    }
  }
  return false;
}

function WildcardPermission(wildcardString, caseSensitive) {
  this._init_(wildcardString, caseSensitive);
}


WildcardPermission.prototype = {
  constructor: WildcardPermission,
  WILDCARD_TOKEN: "*",
  PART_DIVIDER_TOKEN: ":",
  SUBPART_DIVIDER_TOKEN: ",",
  _init_: function (wildcardString, caseSensitive) {
    if (wildcardString == null || wildcardString.trim().length === 0) {
      throw new Error("权限编码通配符字符串不能为null或空。确保权限字符串的格式正确。");
    }
    wildcardString = wildcardString.trim();
    const parts = wildcardString.split(this.PART_DIVIDER_TOKEN);
    this.parts = [];
    for (const part of parts) {
      let subParts = part.split(this.SUBPART_DIVIDER_TOKEN);
      if (!caseSensitive) {
        let lowerSubParts = [];
        for (const subPart of subParts) {
          lowerSubParts.push(subPart.toLocaleLowerCase())
        }
        subParts = lowerSubParts;
      }
      if (subParts.length <= 0) {
        throw new Error("权限编码通配符字符串不能包含只有分隔符的部分，确保权限编码字符串的格式正确。");
      }
      this.parts.push(subParts);
    }

    if (this.parts.length <= 0) {
      throw new Error("权限编码通配符字符串不能只包含分隔符，确保权限编码字符串的格式正确。");
    }
  },

  implies: function (wp) {
    const otherParts = wp.parts;
    let i = 0;
    for (const otherPart of otherParts) {
      // 如果此权限的部分数少于其他权限，则此权限中包含的部分数之后的所有内容都将自动隐含，因此返回true
      if (this.parts.length - 1 < i) {
        return true;
      } else {
        const part = this.parts[i];
        if (!part.includes(this.WILDCARD_TOKEN) && !containsAll(part, otherPart)) {
          return false;
        }
        i++;
      }
    }

    // 如果此权限的部分多于其他部分，则仅当所有其他部分都是通配符时才暗示它
    for (; i < this.parts.length; i++) {
      const part = this.parts[i];
      if (!part.includes(this.WILDCARD_TOKEN)) {
        return false;
      }
    }
    return true;
  }
}


// 必须包含列出的所有权限，元素才显示
export const hasPermission = {
  install(Vue) {
    Vue.directive('hasPermission', {
      bind(el, binding, vnode) {
        // 拥有的所有权限
        const authorityResource = vnode.context.$store.state.account.authorityResource;
        const enabled = authorityResource.enabled;
        if (!enabled) {
          return
        }
        let flag = true
        const allPermissions = authorityResource.resourceList;
        const caseSensitive = authorityResource.caseSensitive;
        // 待校验权限 一定要是数组
        const permissions = binding.value

        if (permissions != null && permissions.length > 0) {
          // 转换拥有的权限
          const allPerms = []
          for (const p of allPermissions) {
            allPerms.push(new WildcardPermission(p, caseSensitive));
          }

          for (const strPerm of permissions) {
            const perm = new WildcardPermission(strPerm, caseSensitive);
            if (!isPermitted(allPerms, perm)) {
              flag = false;
            }
          }
        }

        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 当不包含列出的权限时，渲染该元素
export const hasNoPermission = {
  install(Vue) {
    Vue.directive('hasNoPermission', {
      bind(el, binding, vnode) {
        const authorityResource = vnode.context.$store.state.account.authorityResource;
        const enabled = true
        if (!enabled) {
          return
        }
        const allPermissions = authorityResource.resourceList;
        const caseSensitive = authorityResource.caseSensitive;
        const permissions = binding.value

        let flag = true
        if (permissions != null && permissions.length > 0) {
          // 转换拥有的权限
          const allPerms = []
          for (const p of allPermissions) {
            allPerms.push(new WildcardPermission(p, caseSensitive));
          }

          for (const strPerm of permissions) {
            const perm = new WildcardPermission(strPerm, caseSensitive);
            if (isPermitted(allPerms, perm)) {
              flag = false;
            }
          }
        }

        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 只要包含列出的任意一个权限，元素就会显示
export const hasAnyPermission = {
  install(Vue) {
    Vue.directive('hasAnyPermission', {
      bind(el, binding, vnode) {
        const authorityResource = vnode.context.$store.state.account.authorityResource;
        const enabled = authorityResource.enabled;
        if (!enabled) {
          return
        }
        let flag = false
        const allPermissions = authorityResource.resourceList;
        const caseSensitive = authorityResource.caseSensitive;
        const permissions = binding.value

        if (permissions != null && permissions.length > 0) {
          // 转换拥有的权限
          const allPerms = []
          for (const p of allPermissions) {
            allPerms.push(new WildcardPermission(p, caseSensitive));
          }

          for (const strPerm of permissions) {
            const perm = new WildcardPermission(strPerm, caseSensitive);
            if (isPermitted(allPerms, perm)) {
              flag = true;
            }
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 必须包含列出的角色权限，元素才显示
export const hasRole = {
  install (Vue) {
    Vue.directive('hasRole', {
      bind (el, binding, vnode) {
        const authorityResource = vnode.context.$store.state.account.authorityResource;
        const enabled = authorityResource.enabled;
        if (!enabled) {
          return
        }
        const caseSensitive = authorityResource.caseSensitive;
        let allRoles = authorityResource.roleList;
        let roles = binding.value
        if(!caseSensitive) {
          roles = roles.map(item=> item.toLocaleLowerCase())
          allRoles = allRoles.map(item=> item.toLocaleLowerCase())
        }

        let flag = true
        for (const v of roles) {
          if (!allRoles.includes(v)) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 当不包含列出的角色时，渲染该元素
export const hasNoRole = {
  install (Vue) {
    Vue.directive('hasNoRole', {
      bind (el, binding, vnode) {
        const authorityResource = vnode.context.$store.state.account.authorityResource;
        const enabled = authorityResource.enabled;
        if (!enabled) {
          return
        }
        const caseSensitive = authorityResource.caseSensitive;
        let allRoles = authorityResource.roleList;
        let roles = binding.value
        if(!caseSensitive) {
          roles = roles.map(item=> item.toLocaleLowerCase())
          allRoles = allRoles.map(item=> item.toLocaleLowerCase())
        }

        let flag = true
        for (const v of roles) {
          if (allRoles.includes(v)) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}


// 只要包含列出的任意一个角色，元素就会显示
export const hasAnyRole = {
  install(Vue) {
    Vue.directive('hasAnyRole', {
      bind(el, binding, vnode) {
        const authorityResource = vnode.context.$store.state.account.authorityResource;
        const enabled = authorityResource.enabled;
        if (!enabled) {
          return
        }
        const caseSensitive = authorityResource.caseSensitive;
        let allRoles = authorityResource.roleList;
        let roles = binding.value
        if(!caseSensitive) {
          roles = roles.map(item=> item.toLocaleLowerCase())
          allRoles = allRoles.map(item=> item.toLocaleLowerCase())
        }

        let flag = false
        for (const v of roles) {
          if (allRoles.includes(v)) {
            flag = true
          }
        }

        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}
