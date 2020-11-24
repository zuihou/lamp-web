<template>
  <el-dialog :title="$t('common.view')" :visible.sync="isVisible" :width="width" class="user-view">
    <el-row :gutter="10">
      <el-col :sm="24" :xs="24">
        <div class="img-wrapper">
          <el-avatar :key="user.avatar" :src="user.avatar" fit="fill">
            <el-avatar>{{ user.name | userAvatarFilter }}</el-avatar>
          </el-avatar>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-user" />
          <span>{{ $t('table.user.account') +'：' }}</span>
          {{ user.account }}
        </div>
      </el-col>
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-suitcase" />
          <span>{{ $t('table.user.name') +'：' }}</span>
          {{ user.name }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-user" />
          <span>{{ $t('table.user.email') +'：' }}</span>
          {{ user.email }}
        </div>
      </el-col>
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-suitcase" />
          <span>{{ $t('table.user.mobile') +'：' }}</span>
          {{ user.mobile }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-trophy" />
          <span>{{ $t('table.user.orgId') +'：' }}</span>
          {{ user.org && user.org.data ? user.org.data.label : '' }}
        </div>
      </el-col>
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-phone-outline" />
          <span>{{ $t('table.user.stationId') +'：' }}</span>
          {{ user.station ? user.station.data: '' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-star-off" />
          <span>{{ $t('table.user.sex') +'：' }}</span>
          {{ user.sex.desc }}
        </div>
      </el-col>
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-bangzhu" />
          <span>{{ $t('table.user.state') +'：' }}</span>
          {{ user.state ? $t('common.state.valid') : $t('common.state.invalid') }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-time" />
          <span>{{ $t('table.user.createTime') +'：' }}</span>
          {{ user.createTime }}
        </div>
      </el-col>
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-brush" />
          <span>{{ $t('table.user.updateTime') +'：' }}</span>
          {{ user.updateTime }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-date" />
          <span>{{ $t('table.user.lastLoginTime') +'：' }}</span>
          {{ user.lastLoginTime ? user.lastLoginTime: $t('tips.neverLogin') }}
        </div>
      </el-col>
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-date" />
          <span>{{ $t('table.user.passwordExpireTime') +'：' }}</span>
          {{ user.passwordExpireTime }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-date" />
          <span>{{ $t('table.user.passwordErrorLastTime') +'：' }}</span>
          {{ user.passwordErrorLastTime }}
        </div>
      </el-col>
      <el-col :sm="12" :xs="24">
        <div class="view-item">
          <i class="el-icon-date" />
          <span>{{ $t('table.user.passwordErrorNum') +'：' }}</span>
          {{ user.passwordErrorNum }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :sm="24" :xs="24">
        <div class="view-item">
          <i class="el-icon-document" />
          <span>{{ $t('table.user.workDescribe') +'：' }}</span>
          {{ user.workDescribe ? user.workDescribe: $t('tips.nothing') }}
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>

export default {
  name: 'UserView',
  filters: {
    userAvatarFilter (name) {
      return name ? name.charAt(0) : '无'
    },
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      screenWidth: 0,
      width: this.initWidth(),
      user: {
        sex: {
          desc: ''
        }
      }
    }
  },
  computed: {
    isVisible: {
      get () {
        return this.dialogVisible
      },
      set () {
        this.close()
      }
    }
  },
  mounted () {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initWidth () {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 550) {
        return '95%'
      } else if (this.screenWidth < 990) {
        return '580px'
      } else if (this.screenWidth < 1400) {
        return '600px'
      } else {
        return '650px'
      }
    },
    setUser (val) {
      this.user = { ...val }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.user-view {
  .img-wrapper {
    text-align: center;
    margin-top: -1.5rem;
    margin-bottom: 10px;
    img {
      width: 4rem;
      border-radius: 50%;
    }
  }
  .view-item {
    margin: 7px;
    i {
      font-size: 0.97rem;
    }
    span {
      margin-left: 5px;
    }
  }
}
</style>
