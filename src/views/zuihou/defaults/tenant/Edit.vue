<template>
  <el-dialog
    :title='title'
    :width='width'
    top='50px'
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    :visible.sync='isVisible'
  >
    <el-form ref='form' :model='tenant' :rules='rules' label-position='right' label-width='130px'>
      <el-form-item :label='$t("table.tenant.code")' prop='code'>
        <el-tooltip class='item' effect='dark' placement='top-start' content='建议填写企业的简称'>
          <el-input v-model='tenant.code' :disabled='type === "edit"' />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label='$t("table.tenant.name")' prop='name'>
        <el-input v-model='tenant.name' />
      </el-form-item>
      <el-form-item :label='$t("table.tenant.duty")' prop='duty'>
        <el-input v-model='tenant.duty' />
      </el-form-item>
      <el-form-item :label='$t("table.tenant.expirationTime")' prop='expirationTime'>
        <el-tooltip class='item' effect='dark' placement='top-start' content='企业试用有效期, 不填表示永久有效'>
          <el-date-picker
            format='yyyy-MM-dd HH:mm:ss'
            value-format='yyyy-MM-dd HH:mm:ss'
            v-model='tenant.expirationTime'
            type='datetime'
            placeholder='企业试用有效期'
          ></el-date-picker>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label='$t("table.tenant.logo")' prop='logo'>
        <el-upload
          class='avatar-uploader'
          :headers='uploadFileHeaders'
          :data='updateFileData'
          :action='uploadFileUrl'
          :show-file-list='false'
          :on-success='handleAvatarSuccess'
          :on-error='handleAvatarError'
          :before-upload='beforeAvatarUpload'
        >
          <img v-if='tenant.logo' :src='tenant.logo' class='avatar' />
          <i v-else class='el-icon-plus avatar-uploader-icon'></i>
        </el-upload>
      </el-form-item>
      <el-form-item :label='$t("table.tenant.describe")' prop='describe'>
        <el-input type='textarea' v-model='tenant.describe'></el-input>
      </el-form-item>
      <el-form-item :label='$t("table.tenant.passwordExpire")' prop='passwordExpire'>
        <el-tooltip class='item' effect='dark' placement='top-start' content='0表示永远不过期'>
          <el-input-number
            controls-position='right'
            :min='0'
            :max='180'
            v-model='tenant.passwordExpire'
            placeholder='单位：天'
          />
        </el-tooltip>天
      </el-form-item>
      <el-form-item :label='$t("table.tenant.isMultipleLogin")' prop='isMultipleLogin'>
        <el-radio-group v-model='tenant.isMultipleLogin'>
          <el-radio :label='true'>{{ $t('common.yes') }}</el-radio>
          <el-radio :label='false'>{{ $t('common.no') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label='$t("table.tenant.passwordErrorNum")' prop='passwordErrorNum'>
        <el-tooltip
          class='item'
          effect='dark'
          placement='top-start'
          :content='passwordErrorNumTips'
        >
          <el-input-number
            :min='1'
            :max='30'
            v-model='tenant.passwordErrorNum'
            :placeholder='passwordErrorNumTips'
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item :label='$t("table.tenant.passwordErrorLockTime")' prop='passwordErrorLockTime'>
        <el-input-number
          :disabled='passwordErrorLockTimeHidden'
          :min='0'
          :max='100000000000'
          v-model='passwordErrorLockTime'
          :placeholder='passwordErrorLockTimeTips'
        />
        <el-tooltip
          class='item'
          effect='dark'
          placement='top-start'
          :content='passwordErrorLockTimeTips'
        >
          <el-select
            v-model='passwordErrorLockTimeUnit'
            placeholder='单位'
            @change='passwordErrorLockTimeUnitChange'
          >
            <el-option
              v-for='item in passwordErrorLockTimeOptions'
              :key='item.value'
              :label='item.label'
              :value='item.value'
            ></el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
    </el-form>
    <div slot='footer' class='dialog-footer'>
      <el-button type='warning' plain @click='isVisible = false'>{{ $t('common.cancel') }}</el-button>
      <el-button type='primary' plain @click='submitForm'>{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { validMobile } from '@/utils/my-validate'
import commonApi from '@/api/Common.js'
import db from '@/utils/localstorage'
import { debuglog } from 'util';
import tenantApi from '@/api/Tenant.js'

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
        bizType: 'TENANT_LOGO'
      },
      passwordErrorLockTimeHidden: true,
      passwordErrorLockTime: 0,
      passwordErrorLockTimeUnit: '0',
      passwordErrorLockTimeOptions: [
        { value: '0', label: '当天凌晨' },
        { value: 'h', label: '小时' },
        { value: 'd', label: '天' },
        { value: 'w', label: '周' },
        { value: 'm', label: '月' },
      ],
      tenant: this.initTenant(),
      screenWidth: 0,
      width: this.initWidth(),
      depts: [],
      roles: [],
      rules: {
        username: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 4, max: 10, message: this.$t('rules.range4to10'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!this.user.userId) {
                this.$get(`system/user/check/${value}`).then((r) => {
                  if (!r.data) {
                    callback(this.$t('rules.usernameExist'))
                  } else {
                    callback()
                  }
                })
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ],
        code: [{ required: true, message: this.$t('rules.require'), trigger: 'blur' },
        { min: 4, max: 10, message: this.$t('rules.range4to10'), trigger: 'blur' }]

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
      let msgs = ''
      switch (this.passwordErrorLockTimeUnit) {
        case 'h':
          msgs = `${this.passwordErrorLockTime}小时`
          break
        case 'd':
          msgs = `${this.passwordErrorLockTime}天`
          break
        case 'w':
          msgs = `${this.passwordErrorLockTime}周`
          break
        case 'm':
          msgs = `${this.passwordErrorLockTime}月`
          break
        case '0':
        default:
          msgs = `当天23:59:59`
          break
      }
      return `密码输错${this.tenant.passwordErrorNum}次数后锁定账号${msgs}`
    },
    uploadFileUrl () {
      return commonApi.uploadFile
    },
    uploadFileHeaders () {
      return {
        'token': db.get('TOKEN', ''),
        'tenant': db.get('TENANT', '')
      }
    },
    passwordErrorLockTimeComputed () {
      switch (this.passwordErrorLockTimeUnit) {
        case '0':
          return this.passwordErrorLockTime
          break
        case 'h':
        case 'd':
        case 'w':
        case 'm':
        default:
          return this.passwordErrorLockTime + this.passwordErrorLockTimeUnit
          break
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
        describe: '',
        passwordExpire: 0,
        isMultipleLogin: true,
        passwordErrorNum: 10,
        passwordErrorLockTime: '0'
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
    },
    close () {
      this.$emit('close')
    },
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.tenant.passwordErrorLockTime = this.passwordErrorLockTimeComputed
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
        .then(res => {
          debugger
          if (res.isError) {
            return
          }
          this.isVisible = false
          this.$message({
            message: this.$t('tips.createSuccess'),
            type: 'success'
          })
          this.$emit('success')
        })

    },
    update () {
      tenantApi.update(this.tenant)
        .then(res => {
          debugger
          if (res.isError) {
            return
          }
          this.isVisible = false
          this.$message({
            message: this.$t('tips.updateSuccess'),
            type: 'success'
          })
          this.$emit('success')
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
      if (res.isError) {
        this.$message.error(res.msg);
        return
      }
      let fileResult = res.data
      this.tenant.id = fileResult['bizId']
      this.tenant.logo = fileResult['url']
    },
    handleAvatarError (res, file) {
      this.$message.error(res.msg);
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
      }
      return isJPG && isLt2M;
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
