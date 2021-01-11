<template>
  <div class="app-container">
    <el-form :model="smsTask" :rules="rules" label-position="right" label-width="100px" ref="form" status-icon>
      <el-row>
        <el-col :sm="12" :xs="24" style="margin-top: 10px;">
          <el-form-item :label="$t('table.smsTask.templateId')" prop="templateId">
            <el-select :disabled="type==='view'" :multiple="false" @change="changeTemplate" filterable placeholder="请输入关键词" style="width:300px;" v-model="smsTask.templateId">
              <el-option :key="item.id" :label="item.name + '('+item.customCode+')'" :value="item.id" v-for="item in smsTemplateList" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24" style="margin-top: 10px;">
          <el-form-item :label="$t('table.smsTask.status')" prop="status" v-show="type==='view'">
            <el-tag :disabled="type==='view'" :type="smsTask.status | statusFilter">{{ smsTask.status.desc }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="$t('table.smsTask.receiver')" prop="receiver">
        <el-tag :closable="type!=='view'" :disable-transitions="false" :key="tag" @close="handleClose(tag)" v-for="tag in receiverList">{{ tag }}</el-tag>
        <el-input :disabled="type==='view'" @blur="handleInputConfirm" @keyup.enter.native="handleInputConfirm" class="input-new-tag" ref="saveTagInput" v-if="receiverVisible" v-model="receiver" />
        <el-button :disabled="type==='view'" @click="showInput" class="button-new-tag" v-else>添加</el-button>
      </el-form-item>
      <el-form-item :label="$t('table.smsTask.topic')" prop="topic">
        <el-input :disabled="type==='view'" v-model="smsTask.topic" />
      </el-form-item>
      <el-form-item :label="$t('table.smsTask.content')" prop="content2">
        <el-row class="message">
          <el-col :sm="12" :xs="24" style="margin-top: 10px;">
            <el-form-item :key="index" :label="key" prop="content" v-for="(item, key, index) in smsTask.templateParam">
              <el-input :disabled="type==='view'" :value="item" @input="(value)=>{templateCode(value,key,index)}" maxlength="255" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :xs="24" style="margin-top: 10px;">
            <el-form-item label="预览：">
              <div class="article" v-html="smsTask.content" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-row>
        <el-col :sm="12" :xs="24" style="margin-top: 10px;">
          <el-form-item label="定时发送" prop="sendTime">
            <el-radio-group :disabled="type==='view'" size="medium" v-model="timing">
              <el-radio-button :label="false">否</el-radio-button>
              <el-radio-button :label="true">是</el-radio-button>
            </el-radio-group>
            <el-date-picker
              :disabled="type==='view'"
              :picker-options="pickerOptions"
              align="right"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择发送时间"
              style="margin-left:20px"
              type="datetime"
              v-model="smsTask.sendTime"
              v-show="timing"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24" style="margin-top: 10px;">
          <el-form-item label="是否草稿" prop="draft" v-show="type==='view'">
            <el-radio-group :disabled="type==='view'" size="medium" v-model="smsTask.draft">
              <el-radio-button :label="false">否</el-radio-button>
              <el-radio-button :label="true">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer">
      <el-button :disabled="disabled" @click="submitForm(false)" plain type="primary" v-show="type!=='view'">立即发送</el-button>
      <el-button :disabled="disabled" @click="submitForm(true)" plain type="warning" v-show="type!=='view'">存草稿</el-button>
    </div>
    <aside class="tips" v-show="type!=='view'">
      模板提示：
      <p>1.长度不超过500字，单条短信超过70字后，按67字/条分多条计费；</p>
      <p>2.短信模板内容不能包含【】符号。</p>
    </aside>
    <div v-show="type==='view'">
      <send-status-index :dialog-visible="dialog.isVisible" ref="statusList" />
    </div>
  </div>
</template>
<script>
import smsTemplateApi from '@/api/SmsTemplate.js'
import smsTaskApi from '@/api/SmsTask.js'
import { validMobile } from '@/utils/my-validate'
import SendStatusIndex from './sendStatusIndex'

export default {
  name: 'SmsTaskEdit',
  components: { SendStatusIndex },
  filters: {
    statusFilter (status) {
      const map = {
        WAITING: 'danger',
        SUCCESS: 'success',
        FAIL: 'error'
      }
      return map[status] || 'success'
    }
  },
  props: {

  },
  data () {
    return {
      dialog: {
        isVisible: false
      },
      type: 'add',
      smsTask: this.initSmsTask(),
      smsTemplateList: [],
      receiverList: [],
      receiverVisible: false,
      receiver: '',
      timing: false,
      disabled: false,
      smsTemplate: '',
      content: '',
      rules: {
        topic: [
          { required: true, message: this.$t('rules.require'), trigger: 'blur' },
          { min: 1, max: 255, message: this.$t('rules.range4to10'), trigger: 'blur' }
        ],
        templateId: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        sendTime: {
          validator: (rule, value, callback) => {
            const vm = this
            if (vm.timing) {
              if (vm.smsTask.sendTime) {
                callback()
              } else {
                callback('请选择发送日期')
              }
            } else {
              callback()
            }
          }, trigger: 'change'
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '一小时后',
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 1)
            picker.$emit('pick', date)
          }
        }, {
          text: '明天',
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick (picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date);
          }
        }]
      }
    }
  },
  computed: {

  },
  watch: {
    $route () {
      if (this.$route.path === '/resources/sms/edit') {
        this.initSmsTemplateList()
        this.loadSendStatus()
      }
    }
  },
  mounted () {
    //在vue的mount阶段执行的函数都是顺序执行，不会阻塞的，所以如果希望mount阶段的函数也是阻塞的，需要额外写一个async函数，然后把需要同步执行的函数写到里面，然后在mount阶段调用这个额外写的函数
    this.initSmsTemplateList()
    this.loadSendStatus()
  },
  methods: {
    loadSendStatus () {
      const type = this.$route.query.type
      const id = this.$route.query.id
      if (type === 'view') {
        this.$refs.statusList.setTaskId(id)
      }
    },
    async loadSmsTask () {
      const type = this.$route.query.type
      const id = this.$route.query.id
      this.type = type
      if (type) {// 切换到别的页面时，无需重置表单
        // this.smsTask = this.initSmsTask()
        this.reset()
      }
      if (type === 'view') {
        this.disabled = true
      } else {
        this.disabled = false
      }

      if (id) {
        await smsTaskApi.get(id)
          .then(response => {
            const res = response.data
            this.smsTask = { ...this.smsTask, ...res.data }
            if (type !== 'edit') {
              this.smsTask.id = ''
            }
            this.changeTemplate(this.smsTask.templateId)
            this.receiverList = this.smsTask.receiver.split(",")

            if (this.smsTask.templateParams) {
              this.smsTask.templateParam = JSON.parse(this.smsTask.templateParams)
            }
            this.smsTask.content = res.data.content
            console.log('查询')
            if (this.smsTask.sendTime) {
              this.timing = true
            } else {
              this.timing = false
            }

            this.smsTemplate = this.smsTemplateList.find(item => item.id === this.smsTask.templateId)

          })
      }
    },
    changeTemplate (id) {
      const vm = this
      // vm.preSearch()
      if (id) {
        //遍历模板添加文本框
        for (const item of vm.smsTemplateList) {
          if (item.id === id) {
            let templateParam = {}
            if (typeof (item.templateParams) == 'string') {
              templateParam = JSON.parse(item.templateParams)
            } else {
              templateParam = item.templateParams
            }

            for (const prop in templateParam) {
              templateParam[prop] = ''
            }
            vm.smsTemplate = item
            if (vm.type !== 'view') {
              console.log('赋值')
              vm.smsTask.templateParam = templateParam
              // vm.smsTask.content = item.content
              this.content = item.content
            }
            break
          }
        }
        vm.changeContent()
      }
    },
    //模板文本框输入内容
    templateCode (val, key) {
      const vm = this
      vm.smsTask.templateParam[key] = val
      vm.changeContent()
    },
    //短信内容处理
    changeContent () {
      const vm = this
      if (!vm.smsTemplate) {
        return
      }
      const type = vm.smsTemplate.providerType.code
      let content = vm.smsTemplate.content

      for (const key in vm.smsTask.templateParam) {
        let strs = ''
        if (type == "TENCENT") {
          strs = '{' + key + '}'
        } else {
          strs = '${' + key + '}'
        }
        if (vm.smsTask.templateParam[key]) {
          content = content.replace(strs, vm.smsTask.templateParam[key])
        }
      }
      if (vm.type !== 'view') {
        console.log('赋值')
        vm.smsTask.content = content
      }
    },
    async initSmsTemplateList () {
      await smsTemplateApi.page({ current: 1, size: 10000, model:{}})
        .then(response => {
          const res = response.data
          if (res.isSuccess) {
            this.smsTemplateList = res.data.records
          }
        })
      await this.loadSmsTask()  // 顺序不能变
    },
    initSmsTask () {
      return {
        templateId: '',
        receiver: '',
        topic: '',
        templateParam: {},
        sendTime: null,
        content: '',
        draft: false,
        status: {
          code: '',
          desc: ''
        }
      }
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.smsTask = this.initSmsTask()
      this.receiverList = []
    },
    submitForm (draft) {
      const vm = this
      if (vm.smsTask.templateParam && Object.keys(vm.smsTask.templateParam).length > 0) {
        let flag = false
        for (const key in vm.smsTask.templateParam) {
          if (!vm.smsTask.templateParam[key]) {
            flag = true
            break
          }
        }
        if (flag) {
          vm.$message({
            message: '发送内容不能为空',
            type: 'error'
          })
          return
        }

      } else {
        vm.$message({
          message: '发送内容不能为空',
          type: 'error'
        })
        return
      }

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
      vm.smsTask.draft = draft
      vm.smsTask.receiver = vm.receiverList.join(',')
      if (!vm.timing) {
        vm.smsTask.sendTime = null
      }
      if (vm.type === 'edit') {
        vm.update()
      } else {
        vm.save()
      }
    },
    save () {
      const vm = this
      vm.disabled = true
      smsTaskApi.save(vm.smsTask)
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            vm.$message({
              message: vm.$t('tips.createSuccess'),
              type: 'success'
            })
            vm.reset()
            vm.$router.push('/resources/sms')
          }
        }).finally(()=>{
          vm.disabled = false})
    },
    update () {
      const vm = this
      vm.disabled = true
      smsTaskApi.update(vm.smsTask)
        .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            vm.$message({
              message: vm.$t('tips.createSuccess'),
              type: 'success'
            })
            vm.reset()
            vm.$router.push('/resources/sms')
          }
        }).finally(()=>vm.disabled = false)
    },
    handleClose (tag) {
      this.receiverList.splice(this.receiverList.indexOf(tag), 1)
    },
    showInput () {
      this.receiverVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      });
    },
    handleInputConfirm () {
      const vm = this
      // 正则校验
      let inputValue = vm.receiver
      if (inputValue) {
        if (!validMobile(inputValue)) {
          this.$message({
            message: '该手机号不合法',
            type: 'error'
          })
          vm.$refs.saveTagInput.focus()
          return
        }

        if (this.receiverList.indexOf(inputValue) === -1) {
          vm.receiverList.push(inputValue)
          vm.receiverVisible = false
          vm.receiver = ''
        } else {
          this.$message({
            message: '该账号已经存在',
            type: 'error'
          })
          vm.$refs.saveTagInput.focus()
        }
      } else {
        this.receiverVisible = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag {
  margin-right: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 120px;
  vertical-align: bottom;
}
.message {
  border: 1px solid #ddd;
  padding-bottom: 10px;
}
aside {
  margin-top: 10px;
  margin-bottom: 0;
}
.tips {
  border: 1px solid #ddd;
  margin-left: 18px;
}
.tips p {
  text-indent: 20px;
  padding: 0;
  margin: 0px;
}
.article {
  font-size: 12px;
  height: auto;
}
</style>
