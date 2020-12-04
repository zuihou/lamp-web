<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <div class="right-menu-item" style="color:red;width:500px;">
          {{tips}}
        </div>
        <search id="header-search" class="right-menu-item" placeholder="搜索菜单"/>
        <screenfull id="screenfull" class="right-menu-item hover-effect"/>
        <lang-select class="right-menu-item hover-effect"/>
        <el-popover
          placement="bottom"
          width="400"
          class="right-menu-item hover-effect"
          trigger="click">
          <div class="avue-notice">
            <div class="msg-title-content">
              <div class="msg-title">消息</div>
              <div class="msg-title-icon">
                <el-switch v-model="msgRefresh" @change="msgRefreshChange" title="是否自动刷新消息" active-color="#13ce66"
                           inactive-color="#ff4949"></el-switch>
              </div>
            </div>
            <div v-for="item in tableData.records" :key="item.id" class="avue-notice__item">
              <div class="avue-notice__content">
                <a href="javascript:;" @click="view(item)">
                  <div class="avue-notice__title">
                    <div class="avue-notice__name">{{ item.title }}</div>
                    <span class="avue-notice__tag"><el-tag size="small" effect="plain"
                                                           :type="item.msgType ? item.msgType['code'] : '' | msgTypeFilter">{{ item.msgType ? item.msgType['desc'] : ''
                      }}</el-tag></span>
                  </div>
                  <div class="avue-notice__subtitle">{{ item.createTime }}</div>
                </a>
              </div>
            </div>
            <div class="avue-notice__more">
              <router-link :to="{path:'/resources/msg'}">点击查看更多<i class="el-icon-more"/></router-link>
            </div>
          </div>
          <el-badge :value="tableData.total" :max="99" :hidden="tableData.total <= 0" class="badge-item"
                    slot="reference">
            <i class="el-icon-bell"/>
          </el-badge>
        </el-popover>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <!-- <img :src='avatar' class='user-avatar' alt='avatar' /> -->
          <el-avatar fit="fill" :src="avatar">
            <el-avatar>{{ name | userAvatarFilter }}</el-avatar>
          </el-avatar>
          <span class="user-name">{{ name }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>{{ $t("navbar.profile") }}</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="setting">{{
                $t("navbar.setting")
              }}</span>
          </el-dropdown-item>
          <a
            target="_blank"
            href="https://github.com/zuihou/lamp-cloud"
          >
            <el-dropdown-item>{{ $t("navbar.github") }}</el-dropdown-item>
          </a>
          <a
            target="_blank"
            href="https://www.kancloud.cn/zuihou/lamp-cloud/"
          >
            <el-dropdown-item>{{ $t("navbar.docs") }}</el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span style="display:block;" @click="deleteCache">
              {{ $t("navbar.deleteCache") }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">
              {{ $t("navbar.logOut") }}
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import LangSelect from "@/components/LangSelect";
import db from "@/utils/localstorage";
import Screenfull from "@/components/Screenfull";
import Search from "@/components/HeaderSearch";
import loginApi from "@/api/Login.js";
import msgApi from "@/api/Msg.js";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    LangSelect,
    Screenfull,
    Search
  },
  filters: {
    userAvatarFilter(name) {
      return name.charAt(0);
    },
    msgTypeFilter(status) {
      const map = {
        WAIT: "",
        NOTIFY: "success",
        PUBLICITY: "info",
        WARN: "danger"
      };
      return map[status] || "";
    },
  },
  mounted() {
    this.tipsScrolling();
    this.loadMyMsg();
    if (this.msgRefresh) {
      this.msgRefreshChange(true);
    }
  },
  data() {
    return {
      tips: ' 演示环境禁止修改、删除重要数据！请登录租户【0000】，账号【lamp_pt】查询其他租户的管理员账号后，登录其他租户测试全部功能!!! ',
      tableData: {
        total: 0,
        records: []
      },
      msgRefresh: db.get('MSG_REFRESH', false), // 消息是否自动刷新
      msgRefreshTimer: null
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.setting.sidebar;
    },
    avatar() {
      const user = this.$store.state.account.user;
      if (!user["avatar"]) {
        return require(`@/assets/avatar/default.jpg`);
      } else {
        if (
          user["avatar"].startsWith("http://") ||
          user["avatar"].startsWith("https://")
        ) {
          return user["avatar"];
        } else {
          return require(`@/assets/avatar/${user.avatar}`);
        }
      }
    },
    name() {
      return this.$store.state.account.user.name;
    },
    userId() {
      return this.$store.state.account.user.id;
    },
    device() {
      return this.$store.state.setting.device;
    }
  },
  methods: {
    tipsScrolling (){
      setInterval(() => { //ES6箭头函数
        // 截取首字符串(第一个)
        let head = this.tips.substring(0,1);
        // 截取除首字符串外所有字符串(除第一个所有)
        let foot = this.tips.substring(1);
        // 头尾拼接后赋给data => tit属性
        this.tips = foot + head;
      },1000)
    },
    loadMyMsg() {
      const params = {
        model: {}
      };
      params.size = 10;
      params.current = 1;
      params.model.isRead = false;
      msgApi.page(params, {isAlert: false}).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.tableData = res.data;
        }
      });
    },
    mark(ids, callback) {
      msgApi.mark({msgCenterIds: ids}).then(response => {
        const res = response.data;
        if (typeof callback === "function") {
          callback(ids);
        }
      });
    },
    view(row) {
      this.mark([row.id], ids => {
        this.loadMyMsg();
        this.$router.push({
          path: "/resources/msg/edit",
          query: {
            id: row.id,
            type: "view"
          }
        });
      });
    },
    msgRefreshChange(val) {
      db.save('MSG_REFRESH', val);
      if (val) {
        this.msgRefreshTimer = setInterval(() => {
          this.loadMyMsg();
        }, 15000)
      } else {
        clearInterval(this.msgRefreshTimer);
        console.log("定时拉取消息停止了！")
        this.msgRefreshTimer = null;
      }
    },
    toggleSideBar() {
      this.$store.commit("setting/toggleSidebar");
    },
    setting() {
      this.$store.commit("setting/openSettingBar", true);
    },
    logout() {
      let param = {
        token: db.get('TOKEN', ''),
        userId: db.get('USER', {id: null}).id,
        clientId: process.env.VUE_APP_CLIENT_ID,
      }
      loginApi.logout(param).finally(() => this.clean());
    },
    clean() {
      db.clear();
      location.reload();
    },
    deleteCache() {
      this.$confirm(
        this.$t("tips.confirmDeleteCache"),
        this.$t("common.tips"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        }
      ).then(() => {
        this.reloadData();
      })
        .catch(() => {
          // do nothing
        });
    },
    reloadData() {
      const param = {
        grantType: 'refresh_token',
        refreshToken: db.get('REFRESH_TOKEN', '')
      }
      loginApi.login(param).then((response) => {
        const res = response.data;
        if (res.isSuccess) {
          const data = res.data
          this.$store.commit("account/setToken", data['token']);
          this.$store.commit("account/setRefreshToken", data['refreshToken']);
          this.$store.commit("account/setExpireTime", data['expiration']);
          this.$store.commit("account/setUser", {
            id: data.userId,
            account: data.account,
            name: data.name,
            avatar: data.avatar,
            workDescribe: data.workDescribe
          });

          this.loadPermissions();
        } else {
          this.logout();
        }
      }).catch(() => {
        db.remove("EXPIRE_TIME");
        db.remove("TOKEN");
        db.remove("USER_ROUTER");
        db.remove("PERMISSIONS");

        this.logout();
      });
    },
    loadPermissions() {
      loginApi.getResource().then(response => {
        const res = response.data;
        if (res.isSuccess) {
          const authorityResource = res.data;
          const permissionsList = authorityResource.resourceList || [];
          this.$store.commit("account/setPermissions", permissionsList);
          this.$store.commit("account/setAuthorityResource", authorityResource);

          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          this.logout();
        }
      }).catch(() => {
        this.logout();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  border-bottom: 1px solid #f1f1f1;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 10px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-name {
          vertical-align: top;
          font-size: 1rem;
          margin-left: 5px;
          margin-top: -4px;
          display: inline-block;
        }

        .user-avatar {
          cursor: pointer;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          vertical-align: text-bottom;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

.el-badge {
  /deep/ .el-badge__content.is-fixed {
    top: 10px
  }
}

.msg-title-content {
  color: #303133;
  font-size: 20px;
  line-height: 1;
  margin: 12px 0px 5px 0px;
  overflow: hidden;

  .msg-title {
    margin-left: 20px;
    float: left;
  }

  .msg-title-icon {
    float: right;
    margin-right: 28px;
  }
}

.avue-notice__item {
  padding: 12px 24px;
  border-bottom: 1px solid #e8eaec;
  cursor: pointer;
  -webkit-transition: background-color .2s ease-in-out;
  transition: background-color .2s ease-in-out;
  text-align: left;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
}

.avue-notice__content {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.avue-notice__title {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #515a6e;
  margin-bottom: 4px;
  overflow: hidden
}

.avue-notice__tag {
  float: right;
  margin-top: 2px;
}

.avue-notice__name {
  line-height: 25px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 280px;
  float: left;
}

.avue-notice__subtitle {
  font-size: 12px;
  color: #808695;
}

.avue-notice__more {
  text-align: center;
  padding: 20px 0 10px
}

</style>
