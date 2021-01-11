<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible.sync="isVisible" :width="width" top="50px">
    <el-form ref="form" :model="datasourceConfig" :rules="rules" label-position="right" label-width="130px">
      <el-form-item :label="$t('table.datasourceConfig.name')" prop="name">
        <el-tooltip class="item" content="建议命名规则为：租户编码-描述" effect="dark" placement="right-start">
          <el-input v-model="datasourceConfig.name" placeholder="名称" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('table.datasourceConfig.username')" placeholder="数据库账号" prop="username">
        <el-tooltip class="item" content="数据库账号，不建议使用root和超级管理员账号" effect="dark" placement="right-start">
          <el-input v-model="datasourceConfig.username" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('table.datasourceConfig.password')" prop="数据库密码">
        <el-input v-model="datasourceConfig.password" />
      </el-form-item>
      <el-form-item :label="$t('table.datasourceConfig.url')" prop="url" placeholder="连接信息">
        <el-tooltip class="item" content="确保租户服务和数据库ip网络互通;数据库命名规范参考：lamp_base_{TENANT}, lamp_base要和lamp.database.tenantDatabasePrefix保持一致" effect="dark" placement="right-start">
          <el-input v-model="datasourceConfig.url" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('table.datasourceConfig.driverClassName')" prop="驱动名">
        <el-tooltip class="item" content="目前只支持mysql" effect="dark" placement="right-start">
          <el-input v-model="datasourceConfig.driverClassName" />
        </el-tooltip>
      </el-form-item>
      <aside style="word-wrap: break-word">
        名称：建议命名规则为：租户编码-描述 <br>
        账号: 不建议使用root和超管账号，使用最小权限的账号<br>
        密码：明文密码<br>
        驱动：目前只支持mysql，配置成 com.mysql.cj.jdbc.Driver 即可<br>
        链接：确保租户服务和链接中的数据库ip网络互通;<br>
        链接中的数据库命名规范建议：lamp_base_{TENANT}, lamp_base要和lamp.database.tenantDatabasePrefix保持一致，否则删除租户时，无法删除库
      </aside>
      <aside style="word-wrap: break-word">
        eg: 1111 租户需要配置2个链接<br>
        名称：1111-基础服务<br>
        链接：jdbc:mysql://127.0.0.1:3306/lamp_base_1111?serverTimezone=CTT&characterEncoding=utf8&useUnicode=true&useSSL=false&autoReconnect=true&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true<br>

        名称：1111-扩展服务<br>
        链接：jdbc:mysql://127.0.0.1:3306/lamp_extend_1111?serverTimezone=CTT&characterEncoding=utf8&useUnicode=true&useSSL=false&autoReconnect=true&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true<br>

        其中:<br>
        1111-基础服务：用于 认证服务数据源、权限服务数据源、文件服务数据源数据源， 所以这些服务的配置文件中需要配置 lamp.database.tenantDatabasePrefix = lamp_base<br>
        1111-扩展服务：用于 消息服务、网关服务数据源， 所以这些服务的配置文件中需要配置 lamp.database.tenantDatabasePrefix = lamp_extend
      </aside>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button plain type="warning" @click="isVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button plain type="primary" @click="submitForm">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import datasourceConfigApi from '@/api/DatasourceConfig.js'
import globalUserApi from "@/api/GlobalUser";

export default {
  name: 'DatasourceConfigEdit',
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
  data () {
    return {
      type: 'add',
      datasourceConfig: this.initDatasourceConfig(),
      screenWidth: 0,
      width: this.initWidth(),
      roles: [],
      rules: {
        name: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' }
        ],
        username: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' }
        ],
        url: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              debugger
              if(value.indexOf('lamp_base_') > 0 || value.indexOf('lamp_extend_') > 0) {
                callback()
              } else {
                callback('数据库必须包含 lamp_base 或者 lamp_extend ')
              }
            }, trigger: 'blur'
          }
        ],
        driverClassName: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' }
        ]
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
        this.reset()
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
    initDatasourceConfig () {
      return {
        id: '',
        name: '1111-基础服务',
        username: '',
        password: '',
        driverClassName: 'com.mysql.cj.jdbc.Driver',
        url: 'jdbc:mysql://127.0.0.1:3306/lamp_base_1111?serverTimezone=CTT&characterEncoding=utf8&useUnicode=true&useSSL=false&autoReconnect=true&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true'
      }
    },
    initWidth () {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '45%'
      } else {
        return '800px'
      }
    },
    setDatasourceConfig (val) {
      this.datasourceConfig = { ...val }
      if (this.type === 'copy') {
        this.datasourceConfig.id = null
      }
    },
    close () {
      this.$emit('close')
    },
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type === 'edit') {
            this.update()
          } else {
            this.save()
          }
        } else {
          return false
        }
      })
    },
    save () {
      datasourceConfigApi.save(this.datasourceConfig)
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.isVisible = false
            this.$message({
              message: this.$t('tips.createSuccess'),
              type: 'success'
            })
            this.$emit('success')
          }
        }).finally(() => {
          return true
        })
    },
    update () {
      datasourceConfigApi.update(this.datasourceConfig)
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.isVisible = false
            this.$message({
              message: this.$t('tips.updateSuccess'),
              type: 'success'
            })
            this.$emit('success')
          }
        }).finally(() => {
          return true
        })
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.datasourceConfig = this.initDatasourceConfig()
    }
  }
}
</script>
<style lang="scss" >

</style>
