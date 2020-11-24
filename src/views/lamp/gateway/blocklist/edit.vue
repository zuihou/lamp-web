<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="true" :title="title" :type="type"
             :visible.sync="isVisible" :width="width" top="50px" v-el-drag-dialog>
    <el-form :model="blockList" :rules="rules" label-position="right" label-width="100px" ref="form">
      <el-form-item :label="$t('table.blockList.ip')" prop="ip">
        <el-input type="" v-model="blockList.ip" placeholder="阻止访问ip"/>
      </el-form-item>
      <el-form-item :label="$t('table.blockList.requestUri')" prop="requestUri">
        <el-input type="" v-model="blockList.requestUri" placeholder="请求URI"/>
      </el-form-item>
      <el-form-item :label="$t('table.blockList.requestMethod')" prop="requestMethod">
        <el-select clearable placeholder="请求方法" v-model="blockList.requestMethod"
                   class="filter-item search-item">
          <el-option key="ALL" label="所有" value="ALL"/>
          <el-option key="GET" label="GET" value="GET"/>
          <el-option key="POST" label="POST" value="POST"/>
          <el-option key="DELETE" label="DELETE" value="DELETE"/>
          <el-option key="PUT" label="PUT" value="PUT"/>
        </el-select>
      </el-form-item>
      <el-form-item label="限制时间" prop="limitEnd">
        <el-time-picker
          is-range
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          v-model="blockList.limit"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="限制时间">
        </el-time-picker>
      </el-form-item>
      <el-form-item :label="$t('table.blockList.state')" prop="state">
        <el-radio-group v-model="blockList.state" size="medium">
          <el-radio-button :label="true">{{ $t("common.state.valid") }}</el-radio-button>
          <el-radio-button :label="false">{{ $t("common.state.invalid") }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">
        {{ $t("common.cancel") }}
      </el-button>
      <el-button @click="submitForm" :disabled="confirmDisabled" plain type="primary">
        {{ $t("common.confirm") }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import elDragDialog from '@/directive/el-drag-dialog'
import blockListApi from "@/api/BlockList.js";

export default {
  name: "BlockListEdit",
  directives: { elDragDialog },
  components: {  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "add"
    }
  },
  data() {
    return {
      confirmDisabled: false,
      blockList: this.initBlockList(),
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
        requestMethod: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        requestUri: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
      },
      // 枚举
      enums: {
      },
      // 字典
      dicts: {
      }
    };
  },
  computed: {
    isVisible: {
      get() {
        return this.dialogVisible;
      },
      set() {
        this.close();
        this.reset();
      }
    },
    title() {
      return this.$t("common." + this.type);
    }
  },
  watch: {},
  mounted() {
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth();
      })();
    };
  },
  methods: {
    initBlockList() {
      return {
        id: "",
        ip: '',
        requestUri: '',
        requestMethod: '',
        limitStart: '',
        limitEnd: '',
        state: true,
        limit: null
      };
    },
    initWidth() {
      this.screenWidth = document.body.clientWidth;
      if (this.screenWidth < 991) {
        return "90%";
      } else if (this.screenWidth < 1400) {
        return "45%";
      } else {
        return "800px";
      }
    },
    setBlockList(val = {}) {
      const vm = this;

      vm.dicts = val['dicts'];
      vm.enums = val['enums'];
      if (val['row']) {
        vm.blockList = { ...val['row'] };
        if(vm.blockList.limitStart != null && vm.blockList.limitEnd != null){
          vm.blockList.limit = [vm.blockList.limitStart, vm.blockList.limitEnd]
        }
      }
    },
    close() {
      this.$emit("close");
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.confirmDisabled = false;
      this.blockList = this.initBlockList();
    },
    submitForm() {
      const vm = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          vm.editSubmit();
        } else {
          return false;
        }
      });
    },
    editSubmit() {
      const vm = this;
      if (this.blockList.limit != null && this.blockList.limit.length == 2) {
        this.blockList.limitStart = this.blockList.limit[0];
        this.blockList.limitEnd = this.blockList.limit[1];
      }
      if (vm.type === "edit") {
          vm.update();
      } else {
          vm.save();
      }
    },
    save() {
      const vm = this;
      vm.confirmDisabled = true;
      blockListApi.save(this.blockList).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          vm.isVisible = false;
          vm.$message({
            message: vm.$t("tips.createSuccess"),
            type: "success"
          });
          vm.$emit("success");
        }
      }).finally(()=> vm.confirmDisabled = false);
    },
    update() {
      const vm = this;
      vm.confirmDisabled = true;
      blockListApi.update(this.blockList).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          vm.isVisible = false;
          vm.$message({
            message: this.$t("tips.updateSuccess"),
            type: "success"
          });
          vm.$emit("success");
        }
      }).finally(()=> vm.confirmDisabled = false);
    }
  }
};
</script>
<style lang="scss" scoped></style>
