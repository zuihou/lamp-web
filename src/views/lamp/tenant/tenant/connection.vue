<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible.sync="isVisible"
             :width="width" top="50px">
    <el-form ref="form" :model="tenant" :rules="rules" label-position="right" label-width="130px">
      <el-form-item label="租户编码" prop="tenant">
        <el-input v-model="tenant.tenant" disabled/>
      </el-form-item>
      <el-form-item label="连接类型" prop="connectType">
        <el-tooltip class="item" content="本地表示使用默认物理数据库，远程表示自己指定其他物理数据库" effect="dark" placement="right-start">
          <el-radio-group v-model="tenant.connectType" @change="connectTypeChange">
            <el-radio label="LOCAL">本地</el-radio>
            <el-radio label="REMOTE" :disabled="connectTypeDisabled">远程</el-radio>
          </el-radio-group>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="认证服务数据源" prop="oauthDatasource">
        <el-tooltip class="item" content="建议认证、权限、文件服务共用一个数据源，消息、网关共用一个数据源" effect="dark" placement="right-start">
          <el-select
            v-model="tenant.oauthDatasource"
            placeholder="认证服务数据源"
            style="width:100%"
            filterable
            :disabled="tenant.connectType==='LOCAL'"
          >
            <el-option v-for="(item, key, index) in datasourceConfigList" :key="index" :label="item.name"
                       :value="item.id" :title="item.url">
              <span style="float: left">{{ item.name }}({{ item.driverClassName }})</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="权限服务数据源" prop="authorityDatasource">
        <el-tooltip class="item" content="建议认证、权限、文件服务共用一个数据源，消息、网关共用一个数据源" effect="dark" placement="right-start">
          <el-select
            ref="authorityDatasource"
            v-model="tenant.authorityDatasource"
            placeholder="权限服务数据源"
            style="width:100%"
            filterable
            :disabled="tenant.connectType==='LOCAL'"
          >
            <el-option v-for="(item, key, index) in datasourceConfigList" :key="index" :label="item.name"
                       :value="item.id">
              <span style="float: left">{{ item.name }}({{ item.driverClassName }})</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="文件服务数据源" prop="fileDatasource">
        <el-tooltip class="item" content="建议认证、权限、文件服务共用一个数据源，消息、网关共用一个数据源" effect="dark" placement="right-start">
          <el-select
            v-model="tenant.fileDatasource"
            placeholder="文件服务数据源"
            style="width:100%"
            filterable
            :disabled="tenant.connectType==='LOCAL'"
          >
            <el-option v-for="(item, key, index) in datasourceConfigList" :key="index" :label="item.name"
                       :value="item.id">
              <span style="float: left">{{ item.name }}({{ item.driverClassName }})</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="消息服务数据源" prop="msgDatasource">
        <el-tooltip class="item" content="建议认证、权限、文件服务共用一个数据源，消息、网关共用一个数据源" effect="dark" placement="right-start">
          <el-select
            v-model="tenant.msgDatasource"
            placeholder="消息服务数据源"
            style="width:100%"
            filterable
            :disabled="tenant.connectType==='LOCAL'"
          >
            <el-option v-for="(item, key, index) in datasourceConfigList" :key="index" :label="item.name"
                       :value="item.id">
              <span style="float: left">{{ item.name }}({{ item.driverClassName }})</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="网关服务数据源" prop="gateDatasource">
        <el-tooltip class="item" content="建议认证、权限、文件服务共用一个数据源，消息、网关共用一个数据源" effect="dark" placement="right-start">
          <el-select
            v-model="tenant.gateDatasource"
            placeholder="网关服务数据源"
            style="width:100%"
            filterable
            :disabled="tenant.connectType==='LOCAL'"
          >
            <el-option v-for="(item, key, index) in datasourceConfigList" :key="index" :label="item.name"
                       :value="item.id">
              <span style="float: left">{{ item.name }}({{ item.driverClassName }})</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
            </el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button plain type="warning" @click="isVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button plain type="primary" :disabled="confirmDisabled" @click="submitForm">{{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import tenantApi from '@/api/Tenant.js'
import datasourceConfigApi from '@/api/DatasourceConfig.js'

export default {
  name: 'TenantConnection',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      type: 'add',
      tenant: this.initTenant(),
      screenWidth: 0,
      datasourceConfigList: [],
      width: this.initWidth(),
      confirmDisabled: false,
      connectTypeDisabled: process.env.VUE_APP_IS_MULTI_TENANT_TYPE !== 'DATASOURCE',
      rules: {
        tenant: [
          {required: true, message: this.$t('rules.require'), trigger: 'blur'}
        ],
        connectType: [
          {required: true, message: this.$t('rules.require'), trigger: 'blur'}
        ],
        authorityDatasource: {
          validator: (rule, value, callback) => {
            if (this.tenant.connectType === 'REMOTE' && !value) {
              callback('请选择权限服务数据源')
            } else {
              callback()
            }
          }, trigger: 'blur'
        },
        fileDatasource: {
          validator: (rule, value, callback) => {
            if (this.tenant.connectType === 'REMOTE' && !value) {
              callback('请选择文件服务数据源')
            } else {
              callback()
            }
          }, trigger: 'blur'
        },
        msgDatasource: {
          validator: (rule, value, callback) => {
            if (this.tenant.connectType === 'REMOTE' && !value) {
              callback('请选择消息服务数据源')
            } else {
              callback()
            }
          }, trigger: 'blur'
        },
        oauthDatasource: {
          validator: (rule, value, callback) => {
            if (this.tenant.connectType === 'REMOTE' && !value) {
              callback('请选择认证服务数据源')
            } else {
              callback()
            }
          }, trigger: 'blur'
        },
        gateDatasource: {
          validator: (rule, value, callback) => {
            if (this.tenant.connectType === 'REMOTE' && !value) {
              callback('请选择网关服务数据源')
            } else {
              callback()
            }
          }, trigger: 'blur'
        }
      }
    }
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set() {
        this.close()
        this.reset()
      }
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
    this.loadDatasourceConfigList()
  },
  methods: {
    loadDatasourceConfigList() {
      if(process.env.VUE_APP_IS_MULTI_TENANT_TYPE === "DATASOURCE"){
        datasourceConfigApi.query()
          .then((response) => {
            if (response.data.isSuccess) {
              this.datasourceConfigList = response.data.data
            }
          })
      }
    },
    initTenant() {
      return {
        id: '',
        connectType: 'LOCAL',
        tenant: '',
        authorityDatasource: null,
        fileDatasource: null,
        msgDatasource: null,
        oauthDatasource: null,
        gateDatasource: null
      }
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '45%'
      } else {
        return '800px'
      }
    },
    setTenant(val) {
      this.tenant.id = val['id']
      this.tenant.tenant = val['code']
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirmDisabled = true
          this.initConnect()
        } else {
          return false
        }
      })
    },
    initConnect() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      tenantApi.initConnect(this.tenant)
        .then((response) => {
          const res = response.data
          if (res.isSuccess && res.data) {
            this.isVisible = false
            this.$message({
              message: this.$t('tips.createSuccess'),
              type: 'success'
            })
            this.$emit('success')
          }
        }).finally(() => {
        this.confirmDisabled = false
        loading.close();
        return true
      })
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.tenant = this.initTenant()
    },
    connectTypeChange(val) {
      if (val === 'LOCAL') {
        this.tenant.authorityDatasource = null
        this.tenant.msgDatasource = null
        this.tenant.oauthDatasource = null
        this.tenant.gateDatasource = null
        this.tenant.fileDatasource = null
      }
    }
  }
}
</script>
<style lang="scss">
</style>
