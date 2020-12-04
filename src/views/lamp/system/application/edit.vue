<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="true" :title="title" :type="type"
             :visible.sync="isVisible" :width="width" top="50px">
    <el-form :model="application" :rules="rules" label-position="right" label-width="100px" ref="form">
      <el-form-item :label="$t('table.application.clientId')" prop="clientId" v-show="type!=='add' ">
        <el-input :disabled="type==='view' || type==='edit' " v-model="application.clientId"/>
      </el-form-item>
      <el-form-item :label="$t('table.application.clientSecret')" prop="clientSecret" v-show="type!=='add' ">
        <el-input :disabled="type==='view' || type==='edit' " v-model="application.clientSecret"/>
      </el-form-item>
      <el-form-item :label="$t('table.application.name')" prop="name">
        <el-input :disabled="type==='view'" v-model="application.name"/>
      </el-form-item>
      <el-form-item :label="$t('table.application.website')" prop="website">
        <el-input :disabled="type==='view'" v-model="application.website"/>
      </el-form-item>
      <el-form-item :label="$t('table.application.icon')" prop="icon">
        <el-input :disabled="type==='icon'" v-model="application.icon"/>
      </el-form-item>
      <el-form-item :label="$t('table.application.appType')" prop="appType">
        <el-radio-group border="true" size="small" v-model="application.appType.code">
          <el-radio-button :key="index" :label="key" :value="key"
                           v-for="(item, key, index) in enums.ApplicationAppTypeEnum">{{ item }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('table.application.state')" prop="state">
        <el-radio-group border="true" size="small" v-model="application.state">
          <el-radio-button :label="true">{{ $t('common.state.valid') }}</el-radio-button>
          <el-radio-button :label="false">{{ $t('common.state.invalid') }}</el-radio-button>
        </el-radio-group>
        <aside class="tips">禁用：提示"请求地址,禁止访问!";</aside>
      </el-form-item>
      <el-form-item :label="$t('table.application.describe')" prop="describe">
        <el-input v-model="application.describe"/>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{ $t('common.cancel') }}</el-button>
      <el-button @click="submitForm" plain type="primary">{{ $t('common.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import applicationApi from '@/api/Application.js'
  import {initEnums} from '@/utils/commons.js'

  export default {
    name: 'ApplicationEdit',
    components: {},
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
    data() {
      return {
        remoteApplicationLoading: false,
        application: this.initApplication(),
        screenWidth: 0,
        width: this.initWidth(),
        orgList: [],
        enums: {ApplicationAppTypeEnum: {}},
        applicationList: [],
        rules: {
          name: [
            {required: true, message: this.$t('rules.require'), trigger: 'blur'},
            {min: 1, max: 255, message: this.$t('rules.range4to10'), trigger: 'blur'}
          ],
          state: {required: true, message: this.$t('rules.require'), trigger: 'blur'}

        },
        serviceList: [
          {id: "lamp-authority-server", name: "权限服务"},
          {id: "lamp-file-server", name: "文件服务"},
          {id: "lamp-msg-server", name: "消息服务"},
          {id: "lamp-demo-server", name: "演示服务"},
          {id: "lamp-order-server", name: "订单服务"},
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
      },
      title() {
        return this.type === 'add' ? this.$t('common.add') : this.$t('common.edit')
      }
    },
    watch: {},
    mounted() {
      initEnums(['ApplicationAppTypeEnum'], this.enums)
      window.onresize = () => {
        return (() => {
          this.width = this.initWidth()
        })()
      }
    },
    methods: {
      initApplication() {
        return {
          id: '',
          clientId: '',
          clientSecret: '',
          website: '',
          name: '',
          icon: '',
          appType: {code: 'SERVER'},
          describe: '',
          state: true,
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
      loadListOptions({callback}) {
        callback()
      },
      setApplication(val, orgs) {
        const vm = this
        vm.orgList = orgs
        if (val) {
          vm.application = {...val}
        }
      },
      close() {
        this.$emit('close')
      },
      reset() {
        // 先清除校验，再清除表单，不然有奇怪的bug
        this.$refs.form.clearValidate()
        this.$refs.form.resetFields()
        this.application = this.initApplication()
      },
      submitForm() {
        const vm = this
        this.$refs.form.validate((valid) => {
          if (valid) {
            vm.editSubmit()
          } else {
            return false
          }
        })
      },
      editSubmit() {
        const vm = this
        if (vm.type === 'add') {
          vm.save()
        } else {
          vm.update()
        }
      },
      save() {
        const vm = this
        applicationApi.save(this.application)
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
      update() {
        applicationApi.update(this.application)
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
  .tips {
    margin-bottom: 0;
    padding: 0px 10px;
  }
</style>
