<template>
  <div class="app-container">
    <el-form :model="msgsCenterInfo" :rules="rules" label-position="right" label-width="100px" ref="form" status-icon>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('table.msgs.title')" prop="msgsCenterInfoDTO.title">
            <el-input :disabled="type==='view'" :maxlength="255" v-model="msgsCenterInfo.msgsCenterInfoDTO.title" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('table.msgs.bizType')" prop="msgsCenterInfoDTO.bizType">
            <el-select :disabled="type==='view'" clearable placeholder style="width:100%" v-model="msgsCenterInfo.msgsCenterInfoDTO.bizType.code" value>
              <el-option :key="index" :label="item" :value="key" v-for="(item, key, index) in enums.MsgsBizType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('table.msgs.bizId')" prop="msgsCenterInfoDTO.bizId">
            <el-input :disabled="type==='view'" :maxlength="255" v-model="msgsCenterInfo.msgsCenterInfoDTO.bizId" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('table.msgs.msgsCenterType')" prop="msgsCenterInfoDTO.msgsCenterType">
            <el-select :disabled="type==='view'" @change="msgsCenterTypeChange" placeholder style="width:100%" v-model="msgsCenterInfo.msgsCenterInfoDTO.msgsCenterType.code" value>
              <el-option :key="index" :label="item" :value="key" v-for="(item, key, index) in enums.MsgsCenterType" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接收类型" prop="msgsCenterInfoDTO.receiveType" v-show="type!=='view'">
            <el-radio-group :disabled="type==='view' || disabledReceiveType" v-model="msgsCenterInfo.receiveType">
              <el-radio-button label="user">用户</el-radio-button>
              <el-radio-button label="role">角色</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接收用户" prop="userIdList" v-if="msgsCenterInfo.receiveType==='user'" v-show="type!=='view'">
            <el-select :disabled="type==='view' || disabledReceiveType" @change="userSelect" collapse-tags multiple placeholder style="width:100%" v-model="msgsCenterInfo.userIdList" value>
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in allUserList" />
            </el-select>
          </el-form-item>
          <el-form-item label="接收角色" prop="roleCodeList" v-else v-show="type!=='view'">
            <el-select :disabled="type==='view' || disabledReceiveType" @change="roleSelect" collapse-tags multiple placeholder style="width:100%" v-model="msgsCenterInfo.roleCodeList" value>
              <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in allRoleList" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('table.msgs.author')" prop="msgsCenterInfoDTO.author">
            <el-input :disabled="type==='view'" :maxlength="255" v-model="msgsCenterInfo.msgsCenterInfoDTO.author" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('table.msgs.handlerUrl')" prop="msgsCenterInfoDTO.handlerUrl">
            <el-input :disabled="type==='view'" :maxlength="255" v-model="msgsCenterInfo.msgsCenterInfoDTO.handlerUrl" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('table.msgs.isSingleHandle')" prop="msgsCenterInfoDTO.isSingleHandle">
            <el-radio-group :disabled="type==='view'" v-model="msgsCenterInfo.msgsCenterInfoDTO.isSingleHandle">
              <el-radio-button :label="true">{{ $t('common.yes') }}</el-radio-button>
              <el-radio-button :label="false">{{ $t('common.no') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="msgsCenterInfoDTO.content" style="margin-bottom: 30px;">
        <Tinymce :height="400" ref="content" v-model="msgsCenterInfo.msgsCenterInfoDTO.content" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button :disabled="disabled" @click="submitForm(false)" plain type="primary" v-show="type!=='view'">发送</el-button>
    </div>
  </div>
</template>
<script>
import msgsApi from '@/api/Msgs.js'
import roleApi from '@/api/Role.js'
import userApi from '@/api/User.js'
import Tinymce from '@/components/Tinymce'
import {initMsgsEnums} from '@/utils/commons.js'

export default {
  name: 'MsgsEdit',
  components: { Tinymce },
  filters: {

  },
  props: {

  },
  data () {
    return {
      allUserList: [],
      allRoleList: [],
      oldChooseUserIdList: [[]],
      oldChooseRoleIdList: [[]],
      dialog: {
        isVisible: false
      },
      type: 'add',
      msgsCenterInfo: this.initMsgsCenterInfo(),
      disabled: false,
      disabledReceiveType: false,
      enums:{
        MsgsBizType:{},
        MsgsCenterType:{}
      },
      rules: {
        "msgsCenterInfoDTO.title": [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 255, message: "长度在 1 到 255 个字符", trigger: 'blur' }
        ],
        "msgsCenterInfoDTO.content": [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 65535, message: "长度在 1 到 65535 个字符", trigger: 'blur' }
        ],
        "msgsCenterInfoDTO.msgsCenterType": { required: true, message: this.$t('rules.require'), trigger: 'change' },
        "roleCodeList": {
          validator: (rule, value, callback) => {
            if (this.msgsCenterInfo.receiveType === 'role' && this.msgsCenterInfo.msgsCenterInfoDTO.msgsCenterType.code !== 'PUBLICITY' && this.msgsCenterInfo.roleCodeList.length <= 0) {
              callback('请选择角色')
            } else {
              callback()
            }
          }, trigger: 'blur'
        },
        "userIdList": {
          validator: (rule, value, callback) => {
            if (this.msgsCenterInfo.receiveType === 'user' && this.msgsCenterInfo.msgsCenterInfoDTO.msgsCenterType.code !== 'PUBLICITY' && this.msgsCenterInfo.userIdList.length <= 0) {
              callback('请选择用户')
            } else {
              callback()
            }
          }, trigger: 'blur'
        },
        "msgsCenterInfoDTO.handlerUrl": { min: 1, max: 255, message: "长度在 1 到 255 个字符", trigger: 'blur' }
      }
    }
  },
  computed: {

  },
  watch: {
    $route () {
      if (this.$route.path === '/msgs/sendMsgs') {
        this.loadMsgs()
        this.loadUserList()
        this.loadRoleList()
      }
    }
  },
  mounted () {
    this.loadMsgs()
    this.loadUserList()
    this.loadRoleList()
    initMsgsEnums(['MsgsCenterType', 'MsgsBizType'], this.enums)
  },
  methods: {
    initMsgsCenterInfo () {
      return {
        userIdList: [],
        roleCodeList: [],
        receiveType: 'user',
        msgsCenterInfoDTO: {
          id: '',
          bizId: '',
          bizType: {
            code: ''
          },
          msgsCenterType: {
            code: ''
          },
          title: '',
          content: '',
          author: '',
          handlerUrl: '',
          handlerParams: '',
          isSingleHandle: true
        }
      }
    },
    loadMsgs () {
      const type = this.$route.query.type
      const id = this.$route.query.id
      this.type = type
      if (type === 'view') {
        msgsApi.get(id)
          .then((response) => {
            const res = response.data
            if (res.isSuccess) {
              this.msgsCenterInfo.msgsCenterInfoDTO = res.data
              if (this.msgsCenterInfo.msgsCenterInfoDTO.bizType === null) {
                this.msgsCenterInfo.msgsCenterInfoDTO.bizType = { code: '' }
              }
              if (this.msgsCenterInfo.msgsCenterInfoDTO.msgsCenterType === null) {
                this.msgsCenterInfo.msgsCenterInfoDTO.msgsCenterType = { code: '' }
              }
            }
          })
      } else {
        this.reset()
      }
    },
    loadUserList () {
      userApi.page({ current: 1, size: 10000, model: {status: true}  })
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            if (res.data.records.length > 0) {
              this.allUserList = [...[{ id: '-1', name: '全选' }], ...res.data.records]
            }
          }
        })
    },
    loadRoleList () {
      roleApi.page({ current: 1, size: 10000, model: {status: true}  })
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            if (res.data.records.length > 0) {
              this.allRoleList = [...[{ code: '-1', name: '全选' }], ...res.data.records]
            }

          }
        })
    },
    msgsCenterTypeChange (select) {
      if (select === 'PUBLICITY') {
        this.disabledReceiveType = true
      } else {
        this.disabledReceiveType = false
      }
    },
    userSelect (val) {
      //保留所有值
      let allValues = this.allUserList.map(item => item.id)

      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldChooseUserIdList.length === 1 ? [] : this.oldChooseUserIdList[1]

      // 若是全部选择
      if (val.includes('-1')) {
        this.msgsCenterInfo.userIdList = allValues
      }

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('-1') && !val.includes('-1')) {
        this.msgsCenterInfo.userIdList = []
      }

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('-1') && val.includes('-1')) {
        const index = val.indexOf('-1')
        val.splice(index, 1) // 排除全选选项
        this.msgsCenterInfo.userIdList = val
      }

      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('-1') && !val.includes('-1')) {
        if (val.length === allValues.length - 1) {
          this.msgsCenterInfo.userIdList = ['-1'].concat(val)
        }
      }

      //储存当前最后的结果 作为下次的老数据
      this.oldChooseUserIdList[1] = this.msgsCenterInfo.userIdList
    },
    roleSelect (val) {
      //保留所有值
      let allValues = this.allRoleList.map(item => item.code)

      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldChooseRoleIdList.length === 1 ? [] : this.oldChooseRoleIdList[1]

      // 若是全部选择
      if (val.includes('-1')) {
        this.msgsCenterInfo.roleCodeList = allValues
      }

      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes('-1') && !val.includes('-1')) {
        this.msgsCenterInfo.roleCodeList = []
      }

      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes('-1') && val.includes('-1')) {
        const index = val.indexOf('-1')
        val.splice(index, 1) // 排除全选选项
        this.msgsCenterInfo.roleCodeList = val
      }

      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes('-1') && !val.includes('-1')) {
        if (val.length === allValues.length - 1) {
          this.msgsCenterInfo.roleCodeList = ['-1'].concat(val)
        }
      }

      //储存当前最后的结果 作为下次的老数据
      this.oldChooseRoleIdList[1] = this.msgsCenterInfo.roleCodeList
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.msgsCenterInfo = this.initMsgsCenterInfo()
      this.disabledReceiveType = false;

      //这里报错
      // this.$nextTick(() =>
      //   this.$refs.content.setContent('')
      // )

      // 设置设置的时间短了 也报错
      setTimeout(() => {
        this.$refs.content.setContent('')
      }, 1000)
    },
    submitForm (draft) {
      const vm = this
      console.log(vm.msgsCenterInfo)

      this.$refs.form.validate((valid) => {
        if (valid) {
          vm.editSubmit(draft)
        } else {
          return false
        }
      })
    },
    editSubmit (draft) {
      const vm = this
      if (vm.type === 'edit') {
        vm.update()
      } else {
        vm.save()
      }
    },
    save () {
      const vm = this
      vm.disabled = true
      msgsApi.save(vm.msgsCenterInfo)
        .then((response) => {
          vm.disabled = false
          const res = response.data
          if (res.isSuccess) {
            vm.$message({
              message: vm.$t('tips.createSuccess'),
              type: 'success'
            })
            vm.reset()
            vm.$router.push('/msgs/myMsgs')
          }
        })
    },
    update () {
      const vm = this
      vm.disabled = true
      msgsApi.update(vm.msgs)
        .then((response) => {
          vm.disabled = false
          const res = response.data
          if (res.isSuccess) {
            vm.$message({
              message: vm.$t('tips.createSuccess'),
              type: 'success'
            })
            vm.reset()
            vm.$router.push('/msgs/myMsgs')
          }
        })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
