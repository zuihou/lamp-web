<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="isVisible"
  >
    <el-form ref="form" :model="client" :rules="rules" label-position="right" label-width="165px">
      <el-form-item label="clientId" prop="clientId">
        <el-input v-model="client.clientId" :readonly="type === 'add' ? false : 'readonly'" />
      </el-form-item>
      <el-form-item label="clientSecret" prop="clientSecret">
        <el-input v-model="client.clientSecret" :readonly="type === 'add' ? false : 'readonly'" />
      </el-form-item>
      <el-form-item label="scope" prop="scope">
        <el-input v-model="client.scope" />
      </el-form-item>
      <el-form-item label="authorizedGrantTypes" prop="authorizedGrantTypes">
        <el-select v-model="client.authorizedGrantTypes" multiple value="" placeholder="" style="width:100%">
          <el-option
            v-for="item in grantTypes"
            :key="item.type"
            :label="item.type"
            :value="item.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="webServerRedirectUri" prop="webServerRedirectUri">
        <el-input v-model="client.webServerRedirectUri" />
      </el-form-item>
      <el-form-item label="accessTokenValidity" prop="accessTokenValidity">
        <el-input v-model="client.accessTokenValidity" />
      </el-form-item>
      <el-form-item label="refreshTokenValidity" prop="refreshTokenValidity">
        <el-input v-model="client.refreshTokenValidity" />
      </el-form-item>
      <el-form-item label="autoapprove" prop="autoapprove">
        <el-select v-model="client.autoapprove" placeholder="" value="" style="width:100%">
          <el-option label="true" value="1" />
          <el-option label="false" value="0" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="warning" plain @click="isVisible = false">
        {{ $t('common.cancel') }}
      </el-button>
      <el-button type="primary" plain @click="submitForm">
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { isIntegerGreaterThanZero, validURL } from '@/utils/my-validate'

export default {
  name: 'ClientEdit',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      screenWidth: 0,
      width: this.initWidth(),
      client: this.initClient(),
      rules: {
        clientId: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 3, max: 20, message: this.$t('rules.range3to20'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (this.type === 'add') {
              this.$get(`auth/client/check/${value}`).then((r) => {
                if (!r.data) {
                  callback(this.$t('rules.clientIdExist'))
                } else {
                  callback()
                }
              })
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        scope: [
          { max: 100, message: this.$t('rules.noMoreThan100'), trigger: 'blur' },
          { required: true, message: this.$t('rules.require'), trigger: 'blur' }
        ],
        webServerRedirectUri: { validator: (rule, value, callback) => {
          if (value !== '' && value != null && !validURL(value)) {
            callback(new Error(this.$t('rules.invalidURL')))
          } else {
            callback()
          }
        }, trigger: 'blur' },
        clientSecret: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 6, max: 20, message: this.$t('rules.range6to20'), trigger: 'blur' }
        ],
        accessTokenValidity: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (!isIntegerGreaterThanZero(value)) {
              callback(new Error(this.$t('rules.invalidInteger')))
            } else if (value.toString().length > 11) {
              callback(new Error(this.$t('rules.noMoreThan11')))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        refreshTokenValidity: [
          { validator: (rule, value, callback) => {
            if (value === null || value === '') {
              callback()
            } else if (!isIntegerGreaterThanZero(value)) {
              callback(new Error(this.$t('rules.invalidInteger')))
            } else if (value.toString().length > 11) {
              callback(new Error(this.$t('rules.noMoreThan11')))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        authorizedGrantTypes: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
      },
      grantTypes: [
        { type: 'refresh_token' },
        { type: 'authorization_code' },
        { type: 'client_credentials' },
        { type: 'password' },
        { type: 'implicit' }
      ]
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
  },
  methods: {
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
    initClient() {
      return {
        clientId: '',
        resourceIds: '',
        clientSecret: '',
        scope: '',
        authorizedGrantTypes: '',
        webServerRedirectUri: '',
        accessTokenValidity: null,
        refreshTokenValidity: null,
        autoapprove: ''
      }
    },
    setClient(val) {
      this.client = { ...val }
      let authorizedGrantTypes = []
      if (this.client.authorizedGrantTypes && typeof this.client.authorizedGrantTypes === 'string') {
        authorizedGrantTypes = this.client.authorizedGrantTypes.split(',')
        this.client.authorizedGrantTypes = authorizedGrantTypes
      }
      this.client.clientSecret = '******'
      this.client.autoapprove = this.client.autoapprove !== null ? this.client.autoapprove + '' : ''
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            // create
            this.client.authorizedGrantTypes = this.client.authorizedGrantTypes.join(',')
            this.$post('auth/client', { ...this.client }).then(() => {
              this.isVisible = false
              this.$message({
                message: this.$t('tips.createSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          } else {
            // update
            this.client.authorizedGrantTypes = this.client.authorizedGrantTypes.join(',')
            this.$put('auth/client', { ...this.client }).then(() => {
              this.isVisible = false
              this.$message({
                message: this.$t('tips.updateSuccess'),
                type: 'success'
              })
              this.$emit('success')
            })
          }
        } else {
          return false
        }
      })
    },
    close() {
      this.$emit('close')
    },
    reset() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.client = this.initClient()
    }
  }
}
</script>
