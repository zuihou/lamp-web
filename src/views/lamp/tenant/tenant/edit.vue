<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible.sync="isVisible" :width="width" top="50px">
    <el-form ref="form" :model="tenant" :rules="rules" label-position="right" label-width="130px">
      <el-form-item :label="$t('table.tenant.code')" prop="code">
        <el-tooltip class="item" content="建议填写企业的简称" effect="dark" placement="top-start">
          <el-input v-model="tenant.code" :disabled="type === 'edit'" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('table.tenant.name')" prop="name">
        <el-input v-model="tenant.name" />
      </el-form-item>
      <el-form-item :label="$t('table.tenant.duty')" prop="duty">
        <el-input v-model="tenant.duty" />
      </el-form-item>
      <el-form-item :label="$t('table.tenant.expirationTime')" prop="expirationTime">
        <el-tooltip class="item" content="企业试用有效期, 不填表示永久有效" effect="dark" placement="top-start">
          <el-date-picker v-model="tenant.expirationTime" format="yyyy-MM-dd HH:mm:ss" placeholder="企业试用有效期" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('table.tenant.logo')" prop="logo">
        <el-upload
          :action="uploadFileUrl"
          :before-upload="beforeAvatarUpload"
          :data="updateFileData"
          :headers="uploadFileHeaders"
          :on-error="handleAvatarError"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
          class="avatar-uploader"
        >
          <img v-if="tenant.logo" :src="tenant.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('table.tenant.describe')" prop="describe">
        <el-input v-model="tenant.describe" type="textarea" />
      </el-form-item>
      <!--      <el-form-item :label="$t('table.tenant.passwordExpire')" prop="passwordExpire">-->
      <!--        <el-tooltip class="item" content="0表示永远不过期" effect="dark" placement="top-start">-->
      <!--          <el-input-number v-model="tenant.passwordExpire" :max="180" :min="0" controls-position="right" placeholder="单位：天" />-->
      <!--        </el-tooltip>天-->
      <!--      </el-form-item>-->
      <!--      <el-form-item :label="$t('table.tenant.isMultipleLogin')" prop="isMultipleLogin">-->
      <!--        <el-radio-group v-model="tenant.isMultipleLogin">-->
      <!--          <el-radio :label="true">{{ $t('common.yes') }}</el-radio>-->
      <!--          <el-radio :label="false">{{ $t('common.no') }}</el-radio>-->
      <!--        </el-radio-group>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item :label="$t('table.tenant.passwordErrorNum')" prop="passwordErrorNum">-->
      <!--        <el-tooltip :content="passwordErrorNumTips" class="item" effect="dark" placement="top-start">-->
      <!--          <el-input-number v-model="tenant.passwordErrorNum" :max="30" :min="1" :placeholder="passwordErrorNumTips" />-->
      <!--        </el-tooltip>-->
      <!--      </el-form-item>-->
      <!--      <el-form-item :label="$t('table.tenant.passwordErrorLockTime')" prop="passwordErrorLockTime">-->
      <!--        <el-input-number v-model="passwordErrorLockTime" :disabled="passwordErrorLockTimeHidden" :max="100000000000" :min="0" :placeholder="passwordErrorLockTimeTips" />-->
      <!--        <el-tooltip :content="passwordErrorLockTimeTips" class="item" effect="dark" placement="top-start">-->
      <!--          <el-select v-model="passwordErrorLockTimeUnit" placeholder="单位" @change="passwordErrorLockTimeUnitChange">-->
      <!--            <el-option v-for="item in passwordErrorLockTimeOptions" :key="item.value" :label="item.label" :value="item.value" />-->
      <!--          </el-select>-->
      <!--        </el-tooltip>-->
      <!--      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button plain type="warning" @click="isVisible = false">{{ $t('common.cancel') }}</el-button>
      <el-button plain type="primary" :disabled="confirmDisabled" @click="submitForm">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import commonApi from '@/api/Common.js'
import db from '@/utils/localstorage'
import tenantApi from '@/api/Tenant.js'
import { validCode } from '@/utils/my-validate'
import { Base64 } from 'js-base64'

export default {
  name: 'TenantEdit',
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
      updateFileData: {
        bizType: 'TENANT_LOGO',
        bizId: ''
      },
      passwordErrorLockTimeHidden: true,
      passwordErrorLockTime: 0,
      passwordErrorLockTimeUnit: '0',
      passwordErrorLockTimeOptions: [
        { value: '0', label: '当天凌晨' },
        { value: 'h', label: '小时' },
        { value: 'd', label: '天' },
        { value: 'w', label: '周' },
        { value: 'm', label: '月' }
      ],
      tenant: this.initTenant(),
      screenWidth: 0,
      width: this.initWidth(),
      confirmDisabled: false,
      roles: [],
      rules: {
        code: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 4, max: 10, message: this.$t('rules.range4to10'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (this.type === 'add') {
                if (!validCode(value)) {
                  callback('企业编码只能是字母、数字或_')
                } else {
                  tenantApi.check(value)
                    .then((response) => {
                      const res = response.data
                      if (res.data) {
                        callback('编码已经存在')
                      } else {
                        callback()
                      }
                    })
                }
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
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
    },
    passwordErrorNumTips () {
      return `密码输错${this.tenant.passwordErrorNum}次数后锁定账号`
    },
    passwordErrorLockTimeTips () {
      let msg = ''
      switch (this.passwordErrorLockTimeUnit) {
        case 'h':
          msg = `${this.passwordErrorLockTime}小时`
          break
        case 'd':
          msg = `${this.passwordErrorLockTime}天`
          break
        case 'w':
          msg = `${this.passwordErrorLockTime}周`
          break
        case 'm':
          msg = `${this.passwordErrorLockTime}月`
          break
        case '0':
        default:
          msg = `当天23:59:59`
          break
      }
      return `密码输错${this.tenant.passwordErrorNum}次数后锁定账号${msg}`
    },
    uploadFileUrl () {
      return commonApi.uploadFile
    },
    uploadFileHeaders () {
      return {
        token: 'Bearer ' + db.get("TOKEN", ""),
        tenant: db.get("TENANT", "") || "",
        Authorization: `Basic ${Base64.encode(`${process.env.VUE_APP_CLIENT_ID}:${process.env.VUE_APP_CLIENT_SECRET}`)}`
      }
    },
    passwordErrorLockTimeComputed () {
      switch (this.passwordErrorLockTimeUnit) {
        case '0':
          return this.passwordErrorLockTime
        case 'h':
        case 'd':
        case 'w':
        case 'm':
        default:
          return this.passwordErrorLockTime + this.passwordErrorLockTimeUnit
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
    initTenant () {
      return {
        id: '',
        code: '',
        name: '',
        duty: '',
        expirationTime: null,
        logo: '',
        describe: ''
        // passwordExpire: 0,
        // isMultipleLogin: true,
        // passwordErrorNum: 10,
        // passwordErrorLockTime: '0'
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
    setTenant (val) {
      this.tenant = { ...val }
      this.updateFileData.bizId = this.tenant.id
    },
    close () {
      this.$emit('close')
    },
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.tenant.passwordErrorLockTime = this.passwordErrorLockTimeComputed
          this.confirmDisabled = true
          if (this.type === 'add') {
            this.save()
          } else {
            this.update()
          }
        } else {
          return false
        }
      })
    },
    save () {
      tenantApi.save(this.tenant)
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
          this.confirmDisabled = false
          return true
        })
    },
    update () {
      tenantApi.update(this.tenant)
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
          this.confirmDisabled = false
          return true
        })
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.tenant = this.initTenant()
    },
    passwordErrorLockTimeUnitChange (unit) {
      console.log(unit)
      if (unit === '0') {
        this.tenant.passwordErrorLockTime = 0
        this.passwordErrorLockTimeHidden = true
      } else {
        this.passwordErrorLockTimeHidden = false
      }
    },
    handleAvatarSuccess (res, file) {
      if (!res.isSuccess) {
        this.$message.error(res.msg)
        return
      }
      const fileResult = res.data
      this.tenant.logo = fileResult['url']
    },
    handleAvatarError (res, file) {
      this.$message.error(res.msg)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    }

  }
}
</script>
<style lang="scss" >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
