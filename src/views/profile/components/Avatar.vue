<template>
  <el-dialog
    class="update-avatar"
    :title="$t('common.changeAvatar')"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-tabs v-model="activeName" class="avatar-tabs">
      <el-tab-pane :label="$t('common.hthz')" name="first">
        <template v-for="(avatar, index) in hthz">
          <div :key="index" class="avatar-wrapper">
            <img :alt="$t('common.ctc')" :src="resolveAvatar(avatar)" @click="change(avatar)">
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="$t('common.al')" name="second">
        <template v-for="(avatar, index) in al">
          <div :key="index" class="avatar-wrapper">
            <img :alt="$t('common.ctc')" :src="resolveAvatar(avatar)" @click="change(avatar)">
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="$t('common.lm')" name="third">
        <template v-for="(avatar, index) in lm">
          <div :key="index" class="avatar-wrapper">
            <img :alt="$t('common.ctc')" :src="resolveAvatar(avatar)" @click="change(avatar)">
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
const hthz = [
  'default.jpg', '1d22f3e41d284f50b2c8fc32e0788698.jpeg',
  '2dd7a2d09fa94bf8b5c52e5318868b4d9.jpg', '2dd7a2d09fa94bf8b5c52e5318868b4df.jpg',
  '8f5b60ef00714a399ee544d331231820.jpeg', '17e420c250804efe904a09a33796d5a10.jpg',
  '17e420c250804efe904a09a33796d5a16.jpg', '87d8194bc9834e9f8f0228e9e530beb1.jpeg',
  '496b3ace787342f7954b7045b8b06804.jpeg', '595ba7b05f2e485eb50565a50cb6cc3c.jpeg',
  '964e40b005724165b8cf772355796c8c.jpeg', '5997fedcc7bd4cffbd350b40d1b5b987.jpg',
  '5997fedcc7bd4cffbd350b40d1b5b9824.jpg', 'a3b10296862e40edb811418d64455d00.jpeg',
  'a43456282d684e0b9319cf332f8ac468.jpeg', 'bba284ac05b041a8b8b0d1927868d5c9x.jpg',
  'c7c4ee7be3eb4e73a19887dc713505145.jpg', 'ff698bb2d25c4d218b3256b46c706ece.jpeg'
]
const al = [
  'cnrhVkzwxjPwAaCfPbdc.png', 'BiazfanxmamNRoxxVxka.png', 'gaOngJwsRYRaVAuXXcmB.png',
  'WhxKECPNujWoWEFNdnJE.png', 'ubnKSIfAJTxIgXOKlciN.png', 'jZUIxmJycoymBprLOUbT.png'
]
const lm = [
  '19034103295190235.jpg', '20180414165920.jpg', '20180414170003.jpg',
  '20180414165927.jpg', '20180414165754.jpg', '20180414165815.jpg',
  '20180414165821.jpg', '20180414165827.jpg', '20180414165834.jpg',
  '20180414165840.jpg', '20180414165846.jpg', '20180414165855.jpg',
  '20180414165909.jpg', '20180414165914.jpg', '20180414165936.jpg',
  '20180414165942.jpg', '20180414165947.jpg', '20180414165955.jpg'
]
export default {
  name: 'Avatar',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'first',
      screenWidth: 0,
      updating: false,
      width: this.initWidth(),
      hthz,
      al,
      lm
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    resolveAvatar(avatar) {
      return require(`@/assets/avatar/${avatar}`)
    },
    change(avatar) {
      if (this.updating) {
        this.$message({
          message: this.$t('tips.updating'),
          type: 'warning'
        })
        return
      }
      this.updating = true
      this.$put('system/user/avatar', {
        username: this.$store.state.account.user.username,
        avatar
      }).then(() => {
        this.$emit('success', avatar)
        this.updating = false
      }).catch((r) => {
        console.error(r)
        this.$message({
          message: this.$t('tips.updateFailed'),
          type: 'error'
        })
        this.updating = false
      })
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '55%'
      } else {
        return '820px'
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
  .update-avatar {
    padding: 0 1rem 1rem 1rem!important;
    .avatar-tabs {
      .avatar-wrapper {
        display: inline-block;
        img {
          width: 5rem;
          border-radius: 50%;
          display: inline-block;
          margin: .5rem;
          cursor: pointer;
        }
      }
    }
  }
</style>
