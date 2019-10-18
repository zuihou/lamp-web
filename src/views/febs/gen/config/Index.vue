<template>
  <div class="app-container">
    <el-form ref="form" :model="config" :rules="rules" label-position="right" label-width="150px">
      <el-form-item :label="$t('table.gen.config.author')" prop="author">
        <el-input v-model="config.author" />
      </el-form-item>
      <el-form-item :label="$t('table.gen.config.basePackage')" prop="basePackage">
        <el-input v-model="config.basePackage" />
      </el-form-item>
      <el-form-item :label="$t('table.gen.config.entityPackage')" prop="entityPackage">
        <el-input v-model="config.entityPackage" />
      </el-form-item>
      <el-form-item :label="$t('table.gen.config.mapperPackage')" prop="mapperPackage">
        <el-input v-model="config.mapperPackage" />
      </el-form-item>
      <el-form-item :label="$t('table.gen.config.mapperXmlPackage')" prop="mapperXmlPackage">
        <el-input v-model="config.mapperXmlPackage" />
      </el-form-item>
      <el-form-item :label="$t('table.gen.config.servicePackage')" prop="servicePackage">
        <el-input v-model="config.servicePackage" />
      </el-form-item>
      <el-form-item :label="$t('table.gen.config.serviceImplPackage')" prop="serviceImplPackage">
        <el-input v-model="config.serviceImplPackage" />
      </el-form-item>
      <el-form-item :label="$t('table.gen.config.controllerPackage')" prop="controllerPackage">
        <el-input v-model="config.controllerPackage" />
      </el-form-item>
      <el-form-item :label="$t('table.gen.config.isTrim')" prop="isTrim">
        <el-radio-group v-model="config.isTrim">
          <el-radio label="1">{{ $t('common.yes') }}</el-radio>
          <el-radio label="0">{{ $t('common.no') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="config.isTrim === '1'" :label="$t('table.gen.config.trimValue')" prop="trimValue">
        <el-input v-model="config.trimValue" />
      </el-form-item>
      <el-form-item v-has-permission="['gen:config:update']">
        <el-button type="primary" plain @click="submit">{{ $t('common.edit') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'GeneratorConfig',
  data() {
    return {
      config: this.initConfig(),
      rules: {
        author: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { max: 20, message: this.$t('rules.noMoreThan20'), trigger: 'blur' }
        ],
        basePackage: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { max: 50, message: this.$t('rules.noMoreThan50'), trigger: 'blur' }
        ],
        entityPackage: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { max: 20, message: this.$t('rules.noMoreThan20'), trigger: 'blur' }
        ],
        mapperPackage: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { max: 20, message: this.$t('rules.noMoreThan20'), trigger: 'blur' }
        ],
        mapperXmlPackage: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { max: 20, message: this.$t('rules.noMoreThan20'), trigger: 'blur' }
        ],
        servicePackage: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { max: 20, message: this.$t('rules.noMoreThan20'), trigger: 'blur' }
        ],
        serviceImplPackage: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { max: 20, message: this.$t('rules.noMoreThan20'), trigger: 'blur' }
        ],
        controllerPackage: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { max: 20, message: this.$t('rules.noMoreThan20'), trigger: 'blur' }
        ],
        trimValue: [
          { validator: (rule, value, callback) => {
            if (this.config.isTrim === '1' && !value.trim().length) {
              callback(this.$t('rules.require'))
            } else {
              callback()
            }
          }, trigger: 'blur' },
          { max: 10, message: this.$t('rules.noMoreThan10'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    initConfig() {
      return {
        id: '',
        author: '',
        basePackage: '',
        entityPackage: '',
        mapperPackage: '',
        mapperXmlPackage: '',
        servicePackage: '',
        serviceImplPackage: '',
        controllerPackage: '',
        isTrim: '',
        trimValue: ''
      }
    },
    getConfig() {
      this.$get('system/generatorConfig').then((r) => {
        const data = r.data.data
        this.config = { ...data }
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$post('system/generatorConfig', { ...this.config }).then(() => {
            this.$message({
              message: this.$t('tips.updateSuccess'),
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
