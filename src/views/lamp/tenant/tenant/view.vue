<template>
  <el-dialog
    :title="$t(&quot;common.view&quot;)"
    :width="width"
    :visible.sync="isVisible"
    class="tenant-view"
  >
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="img-wrapper">
          <img :src="tenant.logo">
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-user" />
          <span>{{ $t('table.tenant.code') +'：' }}</span>
          {{ tenant.code }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-suitcase" />
          <span>{{ $t('table.tenant.name') +'：' }}</span>
          {{ tenant.name }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-trophy" />
          <span>{{ $t('table.tenant.type') +'：' }}</span>
          {{ tenant.type.desc }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-phone-outline" />
          <span>{{ $t('table.tenant.status') +'：' }}</span>
          {{ tenant.status.desc }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-star-off" />
          <span>{{ $t('table.tenant.duty') +'：' }}</span>
          {{ tenant.duty }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-bangzhu" />
          <span>{{ $t('table.tenant.expirationTime') +'：' }}</span>
          {{ tenant.expirationTime ? tenant.expirationTime : '永久' }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-time" />
          <span>{{ $t('table.createTime') +'：' }}</span>
          {{ tenant.createTime }}
        </div>
      </el-col>
      <el-col :xs="24" :sm="12">
        <div class="view-item">
          <i class="el-icon-brush" />
          <span>{{ $t('table.updateTime') +'：' }}</span>
          {{ tenant.updateTime }}
        </div>
      </el-col>
    </el-row>
    <!--    <el-row :gutter='10'>-->
    <!--      <el-col :xs='24' :sm='12'>-->
    <!--        <div class='view-item'>-->
    <!--          <i class='el-icon-date' />-->
    <!--          <span>{{ $t('table.tenant.isMultipleLogin') +'：' }}</span>-->
    <!--          {{ tenant.isMultipleLogin ? '是' : '否'}}-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs='24' :sm='12'>-->
    <!--        <div class='view-item'>-->
    <!--          <i class='el-icon-document' />-->
    <!--          <span>{{ $t('table.tenant.passwordExpire') +'：' }}</span>-->
    <!--          {{ tenant.passwordExpire == '0' ? '永久有效' :tenant.passwordExpire}}-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <!--    <el-row :gutter='10'>-->
    <!--      <el-col :xs='24' :sm='12'>-->
    <!--        <div class='view-item'>-->
    <!--          <i class='el-icon-document' />-->
    <!--          <span>{{ $t('table.tenant.passwordErrorNum') +'：' }}</span>-->
    <!--          {{ tenant.passwordErrorNum}}-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs='24' :sm='12'>-->
    <!--        <div class='view-item'>-->
    <!--          <i class='el-icon-date' />-->
    <!--          <span>{{ $t('table.tenant.passwordErrorLockTime') +'：' }}</span>-->
    <!--          {{ tenant.passwordErrorLockTime | passwordErrorLockTimeFilter }}-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24">
        <div class="view-item">
          <i class="el-icon-date" />
          <span>{{ $t('table.tenant.describe') +'：' }}</span>
          {{ tenant.describe }}
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'TenantView',
  filters: {
    passwordErrorLockTimeFilter (time) {
      if (time === '0') {
        return '当天23点59分'
      }
      return time
    }
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
      tenant: {
        type: {
          desc: ''
        },
        status: {
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
    setTenant (val) {
      this.tenant = { ...val }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.tenant-view {
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
