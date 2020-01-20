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
      :model="area"
      :rules="rules"
      label-position="right"
      label-width="100px"
      ref="form"
    >
      <el-form-item :label="$t('table.area.parentId')" prop="parentName">
        <el-input v-model="area.parentName" />
      </el-form-item>
      <el-form-item :label="$t('table.area.code')" prop="code">
        <el-input v-model="area.code" />
      </el-form-item>
      <el-form-item :label="$t('table.area.name')" prop="name">
        <el-input v-model="area.name" />
      </el-form-item>
      <el-form-item :label="$t('table.area.level')" prop="level">
        <el-input v-model="area.level" />
      </el-form-item>
      <el-form-item :label="$t('table.area.longitude')" prop="longitude">
        <el-input v-model="area.longitude" />
      </el-form-item>
      <el-form-item :label="$t('table.area.latitude')" prop="latitude">
        <el-input v-model="area.latitude" />
      </el-form-item>

      <el-form-item :label="$t('table.area.sortValue')" prop="sortValue">
        <el-input v-model="area.sortValue" />
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
import areaApi from "@/api/Area.js";

export default {
  name: "AreaEdit",
  components: {},
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
      area: this.initArea(),
      screenWidth: 0,
      width: this.initWidth(),
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
              if (!this.area.id) {
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
        code: {
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
    initArea() {
      return {
        id: "",
        code: "",
        name: "",
        fullName: "",
        sortValue: 0,
        longitude: "",
        latitude: "",
        level: 0,
        parentCode: "",
        parentId: ""
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
    setArea(val) {
      const vm = this;
      if (val) {
        vm.area = { ...val };
      }
    },
    close() {
      this.$emit("close");
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.area = this.initArea();
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
      areaApi.save(this.area).then(response => {
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
      areaApi.update(this.area).then(response => {
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
