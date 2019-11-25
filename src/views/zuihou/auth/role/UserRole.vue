<template>
  <el-dialog
    :title="title"
    :width="width"
    top="50px"
    :close-on-click-modal="false"
    :visible.sync="isVisible"
  >
    <el-form
      ref="form"
      :model="userRole"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item
        label="用户"
        prop="userIdList"
      >
        <el-transfer
          v-model="userRole.userIdList"
          style="text-align: left; display: inline-block"
          :props="{
            key: &quot;id&quot;,
            label: &quot;name&quot;
          }"
          :render-content="renderFunc"
          :titles="[&quot;全部用户&quot;, &quot;已选用户&quot;]"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="用户名"
          :right-default-checked="userRole.userIdList"
          :data="userList"
        />
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
        :disabled="disabled"
        @click="submitForm"
      >
        {{ $t('common.confirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import roleApi from '@/api/Role.js'
import userApi from '@/api/User.js'

export default {
  name: 'UserRoleEdit',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      userRole: this.initUserRole(),
      screenWidth: 0,
      width: this.initWidth(),
      userList: [],
      userIdList: [],
      disabled: false,
      rules: {

      },
      renderFunc (h, option) {
        // return <span title='option.account - {option.name}'>{option.account} - {option.name}</span>
        return h("span", {
          "attrs": {
            "title": option.account + " - " + option.name
          }
        }, [option.account, " - ", option.name])
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
    title () {
      return '分配角色成员'
    }
  },
  watch: {

  },
  mounted () {
    this.initUserList()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initUserRole () {
      return {
        roleId: '',
        userIdList: []
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
    initUserList () {
      userApi.findUserPage({ current: 1, size: 100000, status: true })
        .then((response) => {
          const res = response.data

          this.userList = res.data.records
        }).catch(() => {
          this.$message({
            message: this.$t('tips.getDataFail'),
            type: 'error'
          })
        })
    },
    setUserRole (val) {
      const vm = this
      vm.userRole.roleId = val.id
      vm.disabled = val.readonly
      roleApi.findUserIdByRoleId(val.id)
        .then((response) => {
          const res = response.data
          vm.userRole.userIdList = res.data
        })

    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.userRole = this.initUserRole()
      this.disabled = false
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
      console.log(this.userRole)

      roleApi.saveUserRole(this.userRole)
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
    filterMethod (query, item) {
      return item.name.indexOf(query) > -1 || item.account.indexOf(query) > -1
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
