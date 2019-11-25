<template>
  <el-dialog
    :title="title"
    :type="type"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :visible.sync="isVisible"
  >
    <el-form
      ref="form"
      :model="user"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item
        :label="$t(&quot;table.user.account&quot;)"
        prop="account"
      >
        <el-input
          v-model="user.account"
          :readonly="type === &quot;add&quot; ? false : &quot;readonly&quot;"
        />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.user.name&quot;)"
        prop="name"
      >
        <el-input v-model="user.name" />
      </el-form-item>
      <el-form-item
        v-show="type === &quot;add&quot;"
        :label="$t(&quot;table.user.password&quot;)"
        prop="password"
      >
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t(&quot;tips.defaultPassword&quot;)"
          placement="top-start"
        >
          <el-input
            value="123456"
            type="password"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.user.avatar&quot;)"
        prop="avatar"
      >
        <imgUpload
          ref="imgFileRef"
          list-type="picture-card"
          :data="user.avatar"
          :file-list="imgFileList"
          :show-file-list="false"
          :auto-upload="true"
          @setId="setIdAndSubmit"
        >
          <i class="el-icon-plus" />
        </imgUpload>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.user.orgId&quot;)"
        prop="orgId"
      >
        <treeselect
          v-model="user.orgId"
          :multiple="false"
          :options="orgList"
          :load-options="loadListOptions"
          :clear-value-text="$t(&quot;common.clear&quot;)"
          :searchable="true"
          placeholder=" "
          style="width:100%"
        />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.user.stationId&quot;)"
        prop="orgId"
      >
        <el-select
          v-model="user.stationId"
          :multiple="false"
          filterable
          placeholder="请输入关键词"
          :loading="remoteStationLoading"
        >
          <el-option
            v-for="item in stationList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.user.email&quot;)"
        prop="email"
      >
        <el-input v-model="user.email" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.user.mobile&quot;)"
        prop="mobile"
      >
        <el-input v-model="user.mobile" />
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.user.sex&quot;)"
        prop="sex"
      >
        <el-select
          v-model="user.sex.code"
          value
          placeholder
          style="width:100%"
        >
          <el-option
            v-for="(item, key, index) in enums.Sex"
            :key="index"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.user.status&quot;)"
        prop="status"
      >
        <el-radio-group v-model="user.status">
          <el-radio :label="true">
            {{ $t('common.status.valid') }}
          </el-radio>
          <el-radio :label="false">
            {{ $t('common.status.invalid') }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t(&quot;table.user.workDescribe&quot;)"
        prop="workDescribe"
      >
        <el-input v-model="user.workDescribe" />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="warning"
        plain
        @click="isVisible = false"
      >
        {{ $t('common.cancel') }}
      </el-button>
      <el-button
        type="primary"
        plain
        @click="submitForm"
      >
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { validMobile } from '@/utils/my-validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import imgUpload from "@/components/zuihou/imgUpload"
import userApi from '@/api/User.js'
import orgApi from '@/api/Org.js'
import stationApi from '@/api/Station.js'

export default {
  name: 'UserEdit',
  components: { Treeselect, imgUpload },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      remoteStationLoading: false,
      user: this.initUser(),
      screenWidth: 0,
      width: this.initWidth(),
      orgList: [],
      stationList: [],
      imgFileList: [],
      imgFileData: {
        bizId: '',
        bizType: 'USER_AVATAR'
      },
      // 图片文件总数
      imgFileTotal: 0,
      // 上传成功数
      successNum: 0,
      rules: {
        username: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 4, max: 10, message: this.$t('rules.range4to10'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!this.user.userId) {
                this.$get(`system/user/check/${value}`)
                  .then((response) => {
                    const res = response.data
                    if (!res.data) {
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
        email: { type: 'email', message: this.$t('rules.email'), trigger: 'blur' },
        mobile: {
          validator: (rule, value, callback) => {
            if (value !== '' && !validMobile(value)) {
              callback(this.$t('rules.mobile'))
            } else {
              callback()
            }
          }, trigger: 'blur'
        },
        roleId: { required: true, message: this.$t('rules.require'), trigger: 'change' },
        sex: { required: true, message: this.$t('rules.require'), trigger: 'change' },
        status: { required: true, message: this.$t('rules.require'), trigger: 'blur' }
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
    enums () {
      return this.$store.state.common.enums
    },
    title () {
      return this.type === 'add' ? this.$t('common.add') : this.$t('common.edit')
    }
  },
  watch: {
    // 监听deptId
    'user.orgId': 'orgSelect'
  },
  mounted () {
    this.initOrg()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initUser () {
      return {
        id: '',
        account: '',
        name: '',
        orgId: null,
        stationId: null,
        email: '',
        mobile: '',
        sex: {
          code: 'N'
        },
        status: true,
        avatar: '',
        workDescribe: '',
        password: '123456'
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
    initOrg () {
      orgApi.allTree({ status: true })
        .then((response) => {
          const res = response.data
          this.orgList = res.data
        })
    },
    loadListOptions ({ callback }) {
      callback()
    },
    orgSelect (node) {
      this.loadStation(node)
    },
    loadStation (orgId) {
      if (orgId) {
        stationApi.findPage({ orgId: orgId, status: true })
          .then((response) => {
            const res = response.data
            this.stationList = res.data.records
          })
      } else {
        this.stationList = []
      }
    },
    setIdAndSubmit (bizId, url) {
      const vm = this
      vm.successNum += 1
      vm.imgFileData.bizId = bizId
      vm.user.avatar = url
      vm.user.id = bizId

      if (vm.successNum === vm.imgFileTotal) {
        vm.$store.state.hasLoading = false
      }
    },
    setUser (val) {
      const vm = this
      if (val) {
        vm.user = { ...val }
      }
      vm.imgFileData.bizId = vm.user['id']
      vm.$nextTick(() => {
        vm.$refs.imgFileRef.init({
          bizId: vm.user['id'],
          bizType: vm.imgFileData.bizType,
          imageUrl: vm.user['avatar'],
          isSingle: true,
          isDetail: false
        });
      })
    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.user = this.initUser()
      this.imgFileData.bizId = ''
      this.$refs.imgFileRef.init({
        bizId: '',
        bizType: '',
        imageUrl: '',
        isSingle: true,
        isDetail: false
      })
    },
    submitForm () {
      const vm = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          vm.editSubmit()
        } else {
          return false
        }
      })
    },
    editSubmit () {
      const vm = this
      if (vm.type === 'add') {
        vm.save()
      } else {
        vm.update()
      }
    },
    save () {
      const vm = this
      userApi.save(this.user)
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            vm.isVisible = false
            vm.$message({
              message: vm.$t('tips.createSuccess'),
              type: 'success'
            })
            vm.$emit('success')
          }
        })
    },
    update () {
      userApi.update(this.user)
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
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
