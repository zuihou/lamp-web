<template>
  <div>
    <el-dialog
      title="模型管理"
      :visible.sync="editVisible"
      @close="editClose">
      <el-form id="model" :model="subFormInst" label-position="left" label-width="80px" ref="form" :inline="true"  style="text-align:left">
        <el-row  style="margin: 0 auto;width:80%;">
          <el-col :span="12">
            <el-form-item label="报销类型" prop="type">
              <el-select
                :disabled="row.id != null"
                v-model="subFormInst.type"
                filterable
                allow-create
                default-first-option
                placeholder="请选择类型">
                <el-option
                  v-for="mitem in types"
                  :key="mitem"
                  :label="mitem"
                  :value="mitem">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报销说明" prop="reason">
              <el-input
                :disabled="row.id != null"
                v-model="subFormInst.reason"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报销金额" prop="reason">
              <el-input
                :disabled="row.id != null"
                v-model="subFormInst.amount"/>
            </el-form-item>
          </el-col>
        </el-row>
        <br/>
      </el-form>

      <el-table
      :data="tableData"
      :key="tableKey"
      :row-class-name="tableRowClassName"
      border fit row-key="id"
      ref="table"
      height="200"
      style="width: 760px; margin: 0 auto;"
      v-loading="loading"
      >
        <el-table-column
          :label="$t('table.ruTaskItemModel.createdBy')"
          :show-overflow-tooltip="true"
          align="center"
          prop="id"
          width="150px"
        >
          <template slot-scope="scope">
           <div style="display: flex; align-items: center;" v-if="scope.row.cuser">
              <span class="el-avatar el-avatar--circle" style="margin-right: 10px;"><img :src="scope.row.cuser.avatar"
                onerror="javascript:this.src='static/img/cnrhVkzwxjPwAaCfPbdc.1b71a9dc.png';" style="object-fit: fill;"></span>
              <span>{{ scope.row.cuser.name }}</span>
           </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.ruTaskItemModel.itemName')"
          :show-overflow-tooltip="true"
          align="center"
          prop="id"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.itemName }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.ruTaskItemModel.itemRemake')"
          :show-overflow-tooltip="true"
          align="center"
          prop="id"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.itemRemake || '---' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.ruTaskItemModel.result')"
          :show-overflow-tooltip="true"
          align="center"
          prop="id"
          width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isReady" style="color: darkgoldenrod;">等待处理...</span>
            <span v-else type="info">{{ scope.row.result ? '通过' : '驳回' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('table.ruTaskItemModel.createTime')"
          :show-overflow-tooltip="true"
          align="center"
          prop="id"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime || '---' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:80px;">
        <el-form id="model" :model="subForm" label-position="right" label-width="160px" ref="form" :inline="true"
      style="width: 760px; margin: 0 auto;">
        <el-row  style="margin: 0 auto">
          <el-col >

            <el-form-item label="事项备注" prop="reason">
              <el-input
                :disabled="subForm.id != null"
                v-model="subForm.itemRemake"/>
            </el-form-item>


            <el-form-item
            v-show="!isSubmit"label="是否批准" prop="result">
              <el-switch
                :disabled="subForm.id != null"
                v-model="subForm.result"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  style="margin: 0 auto">
          <el-col style="text-align: center;">
            <el-form-item size="large" align="center">
              <el-button @click="editClose" plain type="warning">{{ $t('common.cancel') }}</el-button>
              <el-button v-show="!subForm.id" @click="submitForm" plain type="primary">{{ $t('common.confirm') }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <br/>

      </el-form>
    </div>

    </el-dialog>
  </div>
</template>
<script>

import activitiApi from "@/api/Activiti.js";
function subFormInst(){
  return {
    startTime: '',
    endTime: '',
    whenLong: '',
    type: '',
    reason: ''
  }
}
function subForm(){
  return {
    id: null,
    itemName: '',
    itemContent: '',
    itemRemake: '',
    result: true,
    bizId: '',
    taskId: '',
    instId: '',
    tenantCode: '',
    module: 'reimbursement',
  }
}
export default {
  name: 'ModelEdit',
  props: {
    type: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      editVisible: false,
      types: ["市内交通费","长途出差费"],
      subForm: subForm(),
      subFormInst: subFormInst(),
      row: {},
      tableKey: 'id',
      tableData: [],
      loading: false,
      isSubmit: false
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {
  },
  methods: {
    open(row) {
      this.editVisible = true
      if (!row) {
        return
      }
      this.row = row
      this.subForm.bizId = this.row.biz.data.id
      this.subForm.taskId = this.row.id
      this.subForm.instId = this.row.inst.data.id
      this.subForm.tenantCode = this.row.tenantCode
      this.subForm.itemName = this.row.name

      if (this.row.taskDefKey === 'BX1') {
        this.isSubmit = true
      }
      this.getDetail()
      this.getList()
      this.getDetailInst()
    },
    editClose() {
      this.$parent.editClose()
      this.row = {}
      this.subForm = subForm()
      this.formItemList = []
      this.formList = []
      this.formKey = null
      this.editVisible = false
    },

    getList() {
      const vm = this
      if (!vm.row.id) {
        return
      }
      vm.loading = true
      const instId = vm.row.inst.data.id;
      activitiApi.getItemList({ instId: instId}).then(response => {
        const res = response.data;
        if (res.code === 0 && res.data) {
          vm.tableData = res.data
          vm.getReadyTaskByInst(instId)
        }
      }).finally();
    },

    getDetail() {
      const vm = this
      if (!vm.row.id) {
        return
      }
      activitiApi.getItemDetail({ taskId: vm.row.id}).then(response => {
        const res = response.data;
        if (res.code === 0 && res.data) {
          vm.subForm.id = res.data.id
          vm.subForm.itemName = res.data.itemName
          vm.subForm.itemContent = res.data.itemContent
          vm.subForm.itemRemake = res.data.itemRemake
          vm.subForm.result = res.data.result
        }
      }).finally();
    },
    getDetailInst() {
      const vm = this
      if (!vm.row.id) {
        return
      }
      activitiApi.getDetailInstReimbursement({ id: vm.row.biz.data.id}).then(response => {
        const res = response.data;
        if (res.code === 0) {
          vm.subFormInst = res.data
        }
      }).finally();
    },
    getReadyTaskByInst(instId) {
      const vm = this
      activitiApi.getReadyTaskByInst({ instId: instId}).then(response => {
        const res = response.data;
        if (res.code === 0 && res.data) {
          if (res.data) {
            let list = res.data
            list.forEach(data => {
              data.isReady = true
              data.itemName = data.name
              vm.tableData.unshift(data)
            })
          }
        }
      }).finally(() => this.loading = false);
    },
    submitForm() {
      const vm = this
      activitiApi.saveItem( vm.subForm ).then(response => {
        const res = response.data;
          if (res.isSuccess) {
            vm.$message({
              message: vm.$t("tips.createSuccess"),
              type: 'success'
            });
            vm.getList()
            vm.editClose()
          } else {
            vm.$message({
              message: response.msg,
              type: 'error'
            });
          }
      }).finally(() => vm.loading = false);
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 0) {
        if (row.isReady) {
          return 'warning-row';
        } else {
          return 'success-row';
        }
      }

      return '';
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
