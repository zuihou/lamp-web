<template>
  <el-dialog
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :title="title"
    :type="type"
    :visible.sync="isVisible"
    :width="width"
    top="50px"
  >
    <el-form
      :model="station"
      :rules="rules"
      label-position="right"
      label-width="100px"
      ref="form"
    >
      <el-form-item :label="$t('table.station.name')" prop="name">
        <el-input v-model="station.name" />
      </el-form-item>
      <el-form-item :label="$t('table.station.orgId')" prop="orgId">
        <treeselect
          :clear-value-text="$t('common.clear')"
          :load-options="loadListOptions"
          :multiple="false"
          :options="orgList"
          :searchable="true"
          placeholder=" "
          style="width:100%"
          v-model="station.org.key"
        />
      </el-form-item>
      <el-form-item :label="$t('table.station.state')" prop="state">
        <el-radio-group v-model="station.state">
          <el-radio :label="true">{{ $t("common.state.valid") }}</el-radio>
          <el-radio :label="false">{{ $t("common.state.invalid") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('table.station.describe')" prop="describe">
        <el-input v-model="station.describe" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{
        $t("common.cancel")
      }}</el-button>
      <el-button @click="submitForm" plain type="primary">{{
        $t("common.confirm")
      }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import stationApi from "@/api/Station.js";

export default {
  name: "StationEdit",
  components: { Treeselect },
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
      remoteStationLoading: false,
      station: this.initStation(),
      screenWidth: 0,
      width: this.initWidth(),
      orgList: [],
      stationList: [],
      rules: {
        name: [
          {
            required: true,
            message: this.$t("rules.require"),
            trigger: "blur"
          },
          {
            min: 1,
            max: 255,
            message: this.$t("rules.range4to10"),
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (!this.station.id) {
                // this.$get(`system/user/check/${value}`).then((r) => {
                //   if (!r.data) {
                //     callback(this.$t('rules.usernameExist'))
                //   } else {
                //     callback()
                //   }
                // })
              } else {
                // callback()
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        state: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "blur"
        }
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
      return this.type === "add"
        ? this.$t("common.add")
        : this.$t("common.edit");
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
    initStation() {
      return {
        id: "",
        name: "",
        org: {
          key: null,
          data: null
        },
        state: true,
        describe: ""
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
    loadListOptions({ callback }) {
      callback();
    },
    setStation(val, orgs) {
      const vm = this;
      vm.orgList = orgs;
      if (val) {
        vm.station = { ...val };
      }
    },
    close() {
      this.$emit("close");
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.station = this.initStation();
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
      if (vm.type === "add") {
        vm.save();
      } else {
        vm.update();
      }
    },
    save() {
      const vm = this;
      stationApi.save(this.station).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          vm.isVisible = false;
          vm.$message({
            message: vm.$t("tips.createSuccess"),
            type: "success"
          });
          vm.$emit("success");
        }
      });
    },
    update() {
      stationApi.update(this.station).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.isVisible = false;
          this.$message({
            message: this.$t("tips.updateSuccess"),
            type: "success"
          });
          this.$emit("success");
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
