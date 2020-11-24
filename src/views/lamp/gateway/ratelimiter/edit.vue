<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="true" :title="title" :type="type"
             :visible.sync="isVisible" :width="width" top="50px" v-el-drag-dialog>
    <el-form :model="rateLimiter" :rules="rules" label-position="right" label-width="100px" ref="form">
      <el-form-item :label="$t('table.rateLimiter.count')" prop="count">
        <el-input type="" v-model="rateLimiter.count" placeholder="次数" oninput="value=value.replace(/[^\d]/g,'')"/>
      </el-form-item>
      <el-form-item :label="$t('table.rateLimiter.intervalSec')" prop="intervalSec">
        <el-input type="" v-model="rateLimiter.intervalSec" oninput="value=value.replace(/[^\d]/g,'')" placeholder="时间周期，单位：秒"/>
      </el-form-item>
      <el-form-item :label="$t('table.rateLimiter.requestUri')" prop="requestUri">
        <el-input type="" v-model="rateLimiter.requestUri" placeholder="请求URI"/>
      </el-form-item>
      <el-form-item :label="$t('table.rateLimiter.requestMethod')" prop="requestMethod">
        <el-select clearable placeholder="请求方法" v-model="rateLimiter.requestMethod"
                   class="filter-item search-item">
          <el-option key="ALL" label="所有" value="ALL"/>
          <el-option key="GET" label="GET" value="GET"/>
          <el-option key="POST" label="POST" value="POST"/>
          <el-option key="DELETE" label="DELETE" value="DELETE"/>
          <el-option key="PUT" label="PUT" value="PUT"/>
        </el-select>
      </el-form-item>
      <el-form-item label="限制时间" prop="limitStart">
        <el-time-picker
          is-range
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          v-model="rateLimiter.limit"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="限制时间">
        </el-time-picker>
      </el-form-item>
      <el-form-item :label="$t('table.rateLimiter.state')" prop="state">
        <el-radio-group v-model="rateLimiter.state" size="medium">
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
import rateLimiterApi from "@/api/RateLimiter.js";

export default {
  name: "RateLimiterEdit",
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
      rateLimiter: this.initRateLimiter(),
      screenWidth: 0,
      width: this.initWidth(),
      rules: {
        requestMethod: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        requestUri: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        intervalSec: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
        count: { required: true, message: this.$t('rules.require'), trigger: 'blur' },
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
    initRateLimiter() {
      return {
        id: "",
        count: null,
        requestUri: '',
        requestMethod: '',
        limitStart: '',
        limitEnd: '',
        limit:'',
        state: true,
        intervalSec: 0,
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
    setRateLimiter(val = {}) {
      const vm = this;
      vm.dicts = val['dicts'];
      vm.enums = val['enums'];
      if (val['row']) {

        vm.rateLimiter = { ...val['row'] };
        if(vm.rateLimiter.limitStart != null && vm.rateLimiter.limitEnd != null){
          vm.rateLimiter.limit = [vm.rateLimiter.limitStart, vm.rateLimiter.limitEnd]
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
      this.rateLimiter = this.initRateLimiter();
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
      if (this.rateLimiter.limit != null && this.rateLimiter.limit.length == 2) {
        this.rateLimiter.limitStart = this.rateLimiter.limit[0];
        this.rateLimiter.limitEnd = this.rateLimiter.limit[1];
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
      rateLimiterApi.save(this.rateLimiter).then(response => {
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
      rateLimiterApi.update(this.rateLimiter).then(response => {
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
