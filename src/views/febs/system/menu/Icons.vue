<template>
  <el-dialog
    :title="$t('table.menu.icon')"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-tabs v-model="activeName" style="margin-top: -1rem;">
      <el-tab-pane :label="$t('common.tab.common')" name="first">
        <ul>
          <li v-for="icon in icons.commonIcons" :key="icon">
            <span :class="{'active':activeIndex === icon}">
              <el-icon :class="icon" :title="icon" @click.native="chooseIcon(icon)" />
            </span>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane :label="$t('common.tab.directivity')" name="second">
        <ul>
          <li v-for="icon in icons.directivityIcons" :key="icon">
            <span :class="{'active':activeIndex === icon}">
              <el-icon :class="icon" :title="icon" @click.native="chooseIcon(icon)" />
            </span>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane :label="$t('common.tab.solid')" name="third">
        <ul>
          <li v-for="icon in icons.solidIcons" :key="icon">
            <span :class="{'active':activeIndex === icon}">
              <el-icon :class="icon" :title="icon" @click.native="chooseIcon(icon)" />
            </span>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane :label="$t('common.tab.food')" name="fourth">
        <ul>
          <li v-for="icon in icons.foodIcons" :key="icon">
            <span :class="{'active':activeIndex === icon}">
              <el-icon :class="icon" :title="icon" @click.native="chooseIcon(icon)" />
            </span>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain @click="isVisible = false">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" plain @click="confirm">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
const commonIcons = [
  'el-icon-eleme', 'el-icon-delete', 'el-icon-setting', 'el-icon-user', 'el-icon-phone-outline',
  'el-icon-more-outline', 'el-icon-star-off', 'el-icon-goods', 'el-icon-warning-outline', 'el-icon-zoom-in',
  'el-icon-zoom-out', 'el-icon-remove-outline', 'el-icon-circle-plus-outline', 'el-icon-circle-check', 'el-icon-circle-close',
  'el-icon-help', 'el-icon-minus', 'el-icon-plus', 'el-icon-check', 'el-icon-close', 'el-icon-picture-outline',
  'el-icon-picture-outline-round', 'el-icon-upload2', 'el-icon-download', 'el-icon-camera', 'el-icon-video-camera',
  'el-icon-bell', 'el-icon-video-pause', 'el-icon-video-play', 'el-icon-refresh', 'el-icon-refresh-right', 'el-icon-refresh-left',
  'el-icon-finished', 'el-icon-loading', 'el-icon-view', 'el-icon-c-scale-to-original', 'el-icon-date', 'el-icon-edit',
  'el-icon-edit-outline', 'el-icon-folder', 'el-icon-folder-opened', 'el-icon-folder-add', 'el-icon-folder-remove', 'el-icon-folder-delete',
  'el-icon-folder-checked', 'el-icon-tickets', 'el-icon-document-remove', 'el-icon-document-delete', 'el-icon-document-copy',
  'el-icon-document-checked', 'el-icon-document', 'el-icon-document-add', 'el-icon-printer', 'el-icon-paperclip',
  'el-icon-takeaway-box', 'el-icon-search', 'el-icon-monitor', 'el-icon-attract',
  'el-icon-mobile',
  'el-icon-scissors',
  'el-icon-umbrella',
  'el-icon-headset',
  'el-icon-brush',
  'el-icon-mouse',
  'el-icon-coordinate',
  'el-icon-magic-stick',
  'el-icon-reading',
  'el-icon-data-line',
  'el-icon-data-board',
  'el-icon-pie-chart',
  'el-icon-data-analysis',
  'el-icon-collection-tag',
  'el-icon-film',
  'el-icon-suitcase',
  'el-icon-suitcase-1',
  'el-icon-receiving',
  'el-icon-collection',
  'el-icon-files',
  'el-icon-notebook-1',
  'el-icon-notebook-2',
  'el-icon-toilet-paper',
  'el-icon-office-building',
  'el-icon-school',
  'el-icon-table-lamp',
  'el-icon-house',
  'el-icon-no-smoking',
  'el-icon-smoking',
  'el-icon-shopping-cart-full',
  'el-icon-shopping-cart-1',
  'el-icon-shopping-cart-2',
  'el-icon-shopping-bag-1',
  'el-icon-shopping-bag-2',
  'el-icon-sold-out',
  'el-icon-sell',
  'el-icon-present',
  'el-icon-box',
  'el-icon-bank-card',
  'el-icon-money',
  'el-icon-coin',
  'el-icon-wallet',
  'el-icon-discount',
  'el-icon-price-tag',
  'el-icon-news',
  'el-icon-guide',
  'el-icon-male',
  'el-icon-female',
  'el-icon-thumb',
  'el-icon-cpu',
  'el-icon-link',
  'el-icon-connection',
  'el-icon-open',
  'el-icon-turn-off',
  'el-icon-set-up',
  'el-icon-chat-round',
  'el-icon-chat-line-round',
  'el-icon-chat-square',
  'el-icon-chat-dot-round',
  'el-icon-chat-dot-square',
  'el-icon-chat-line-square',
  'el-icon-message',
  'el-icon-postcard',
  'el-icon-position',
  'el-icon-turn-off-microphone',
  'el-icon-microphone',
  'el-icon-close-notification',
  'el-icon-bangzhu',
  'el-icon-time',
  'el-icon-odometer',
  'el-icon-crop',
  'el-icon-aim',
  'el-icon-switch-button',
  'el-icon-full-screen',
  'el-icon-copy-document',
  'el-icon-mic',
  'el-icon-stopwatch',
  'el-icon-medal-1',
  'el-icon-medal',
  'el-icon-trophy',
  'el-icon-trophy-1',
  'el-icon-first-aid-kit',
  'el-icon-discover',
  'el-icon-place',
  'el-icon-location-outline',
  'el-icon-location-information',
  'el-icon-add-location',
  'el-icon-delete-location',
  'el-icon-map-location',
  'el-icon-alarm-clock',
  'el-icon-timer',
  'el-icon-watch-1',
  'el-icon-watch',
  'el-icon-lock',
  'el-icon-unlock',
  'el-icon-key',
  'el-icon-service',
  'el-icon-mobile-phone',
  'el-icon-bicycle',
  'el-icon-truck',
  'el-icon-ship',
  'el-icon-basketball',
  'el-icon-football',
  'el-icon-soccer',
  'el-icon-baseball'
]
const directivityIcons = [
  'el-icon-d-caret',
  'el-icon-caret-left',
  'el-icon-caret-right',
  'el-icon-caret-bottom',
  'el-icon-caret-top',
  'el-icon-bottom-left',
  'el-icon-bottom-right',
  'el-icon-back',
  'el-icon-right',
  'el-icon-bottom',
  'el-icon-top',
  'el-icon-top-left',
  'el-icon-top-right',
  'el-icon-arrow-left',
  'el-icon-arrow-right',
  'el-icon-arrow-down',
  'el-icon-arrow-up',
  'el-icon-d-arrow-left',
  'el-icon-d-arrow-right',
  'el-icon-sort',
  'el-icon-sort-up',
  'el-icon-sort-down',
  'el-icon-rank'
]
const solidIcons = [
  'el-icon-question',
  'el-icon-info',
  'el-icon-remove',
  'el-icon-circle-plus',
  'el-icon-success',
  'el-icon-error',
  'el-icon-platform-eleme',
  'el-icon-delete-solid',
  'el-icon-s-tools',
  'el-icon-user-solid',
  'el-icon-phone',
  'el-icon-star-on',
  'el-icon-s-goods',
  'el-icon-warning',
  'el-icon-s-help',
  'el-icon-picture',
  'el-icon-upload',
  'el-icon-camera-solid',
  'el-icon-video-camera-solid',
  'el-icon-message-solid',
  'el-icon-s-cooperation',
  'el-icon-s-order',
  'el-icon-s-platform',
  'el-icon-s-fold',
  'el-icon-s-unfold',
  'el-icon-s-operation',
  'el-icon-s-promotion',
  'el-icon-s-home',
  'el-icon-s-release',
  'el-icon-s-ticket',
  'el-icon-s-management',
  'el-icon-s-open',
  'el-icon-s-shop',
  'el-icon-s-marketing',
  'el-icon-s-flag',
  'el-icon-s-comment',
  'el-icon-s-finance',
  'el-icon-s-claim',
  'el-icon-s-custom',
  'el-icon-s-opportunity',
  'el-icon-s-data',
  'el-icon-s-check',
  'el-icon-s-grid',
  'el-icon-menu',
  'el-icon-share',
  'el-icon-d-caret',
  'el-icon-caret-left',
  'el-icon-caret-right',
  'el-icon-caret-bottom',
  'el-icon-caret-top',
  'el-icon-location'
]
const foodIcons = [
  'el-icon-dish',
  'el-icon-dish-1',
  'el-icon-food',
  'el-icon-chicken',
  'el-icon-fork-spoon',
  'el-icon-knife-fork',
  'el-icon-burger',
  'el-icon-tableware',
  'el-icon-sugar',
  'el-icon-dessert',
  'el-icon-ice-cream',
  'el-icon-hot-water',
  'el-icon-water-cup',
  'el-icon-coffee-cup',
  'el-icon-cold-drink',
  'el-icon-goblet',
  'el-icon-goblet-full',
  'el-icon-goblet-square',
  'el-icon-goblet-square-full',
  'el-icon-refrigerator',
  'el-icon-grape',
  'el-icon-watermelon',
  'el-icon-cherry',
  'el-icon-apple',
  'el-icon-pear',
  'el-icon-orange',
  'el-icon-coffee',
  'el-icon-ice-tea',
  'el-icon-ice-drink',
  'el-icon-milk-tea',
  'el-icon-potato-strips',
  'el-icon-lollipop',
  'el-icon-ice-cream-square',
  'el-icon-ice-cream-round'
]
export default {
  name: 'Icons',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      icons: {
        commonIcons,
        directivityIcons,
        solidIcons,
        foodIcons
      },
      activeIndex: '',
      choosedIcon: '',
      activeName: 'first',
      screenWidth: 0,
      width: this.initWidth()
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
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '60%'
      } else {
        return '800px'
      }
    },
    close() {
      this.$emit('close')
      this.activeName = 'first'
      this.choosedIcon = this.activeIndex = ''
    },
    chooseIcon(icon) {
      this.activeIndex = icon
      this.choosedIcon = icon
      this.$message({
        message: this.$t('tips.choose') + icon,
        type: 'success'
      })
    },
    confirm() {
      if (!this.choosedIcon) {
        this.$message({
          message: this.$t('tips.chooseNothing'),
          type: 'warning'
        })
        return
      }
      this.$emit('choose', this.choosedIcon)
      this.activeName = 'first'
      this.choosedIcon = this.activeIndex = ''
    }
  }
}
</script>
<style lang="scss" scoped>
  ul {
    overflow-y: auto;
    padding-left: .5rem;
    margin-top: -.8rem;
    span.active {
      i {
        border-radius: 2px;
        border-color: #4a4a48;
        background-color: #4a4a48;
        color: #fff;
        transition: all .3s;
      }
    }
    i {
      font-size: 1.5rem;
      border: 1px solid #f1f1f1;
      padding: .2rem;
      margin: .3rem;
      cursor: pointer;
      &:hover {
        border-radius: 2px;
        border-color: #4a4a48;
        background-color: #4a4a48;
        color: #fff;
        transition: all .3s;
      }
    }
    li {
      list-style: none;
      float: left;
      width: 40px;
      text-align: center;
      cursor: pointer;
      color: #555;
      transition: color .3s ease-in-out,background-color .3s ease-in-out;
      position: relative;
      margin: 3px 0;
      border-radius: 4px;
      background-color: #fff;
      overflow: hidden;
      padding: 10px 0 0;
    }
  }
</style>
