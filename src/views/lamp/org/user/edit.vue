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
      :model="user"
      :rules="rules"
      label-position="right"
      label-width="100px"
      ref="form"
    >
      <el-form-item :label="$t('table.user.account')" prop="account">
        <el-input
          :readonly="type === 'add' ? false : 'readonly'"
          v-model="user.account"
        />
      </el-form-item>
      <el-form-item :label="$t('table.user.name')" prop="name">
        <el-input v-model="user.name"/>
      </el-form-item>
      <el-form-item
        :label="$t('table.user.password')"
        prop="password"
        v-show="type === 'add'"
      >
        <el-tooltip
          :content="$t('tips.defaultPassword')"
          class="item"
          effect="dark"
          placement="top-start"
        >
          <el-input type="password" value="123456"/>
        </el-tooltip>
      </el-form-item>
      <el-form-item :label="$t('table.user.avatar')" prop="avatar">
        <imgUpload
          :accept="accept"
          :acceptSize="2 * 1024 * 1024"
          :auto-upload="true"
          :data="user.avatar"
          :file-list="imgFileList"
          :show-file-list="false"
          @setId="setIdAndSubmit"
          list-type="picture-card"
          ref="imgFileRef"
        >
          <i class="el-icon-plus"/>
        </imgUpload>
      </el-form-item>
      <el-form-item :label="$t('table.user.orgId')" prop="orgId">
        <treeselect
          :clear-value-text="$t('common.clear')"
          :load-options="loadListOptions"
          :multiple="false"
          :options="orgList"
          :searchable="true"
          placeholder=" "
          style="width:100%"
          v-model="user.org.key"
        />
      </el-form-item>
      <el-form-item :label="$t('table.user.stationId')" prop="stationId">
        <el-select
          filterable
          placeholder="请输入关键词"
          v-model="user.station.key"
        >
          <el-option
            :key="item.id"
            :label="item.name"
            :value="item.id"
            v-for="item in stationList"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.email')" prop="email">
        <el-input v-model="user.email"/>
      </el-form-item>
      <el-form-item :label="$t('table.user.mobile')" prop="mobile">
        <el-input v-model="user.mobile"/>
      </el-form-item>
      <el-form-item :label="$t('table.user.sex')" prop="sex">
        <el-select placeholder style="width:100%" v-model="user.sex.code" value>
          <el-option :key="index" :label="item" :value="key" v-for="(item, key, index) in enums.Sex"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.nation')" prop="nation">
        <el-select style="width:100%" :placeholder="$t('table.user.nation')" v-model="user.nation.key" value>
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item, key, index) in dicts.NATION"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.education')" prop="education">
        <el-select style="width:100%" :placeholder="$t('table.user.education')" v-model="user.education.key" value>
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item, key, index) in dicts.EDUCATION"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.positionStatus')" prop="positionStatus">
        <el-select style="width:100%" :placeholder="$t('table.user.positionStatus')" v-model="user.positionStatus.key"
                   value>
          <el-option :key="index" :label="item.name" :value="item.code" v-for="(item, key, index) in dicts.POSITION_STATUS"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.user.state')" prop="state">
        <el-radio-group v-model="user.state">
          <el-radio :label="true">{{ $t("common.state.valid") }}</el-radio>
          <el-radio :label="false">{{ $t("common.state.invalid") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('table.user.workDescribe')" prop="workDescribe">
        <el-input v-model="user.workDescribe"/>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">{{
          $t("common.cancel")
        }}
      </el-button>
      <el-button @click="submitForm" plain type="primary">{{
          $t("common.confirm")
        }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import {validMobile} from "@/utils/my-validate";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import imgUpload from "@/components/lamp/imgUpload";
import userApi from "@/api/User.js";
import stationApi from "@/api/Station.js";

export default {
  name: "UserEdit",
  components: {Treeselect, imgUpload},
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
      accept: "image/jpeg, image/gif, image/png",
      remoteStationLoading: false,
      user: this.initUser(),
      screenWidth: 0,
      width: this.initWidth(),
      orgList: [],
      stationList: [],
      imgFileList: [],
      imgFileData: {
        bizId: "",
        bizType: "USER_AVATAR"
      },
      // 图片文件总数
      imgFileTotal: 0,
      // 上传成功数
      successNum: 0,
      enums: {
        Sex: {}
      },
      dicts: {
        NATION: [],
        POSITION_STATUS: [],
        EDUCATION: [],
      },
      rules: {
        account: [
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
              if (!this.user.id) {

                callback();
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        email: {
          type: "email",
          message: this.$t("rules.email"),
          trigger: "blur"
        },
        mobile: {
          validator: (rule, value, callback) => {
            if (value !== "" && !validMobile(value)) {
              callback(this.$t("rules.mobile"));
            } else {
              callback();
            }
          },
          trigger: "blur"
        },
        sex: {
          required: true,
          message: this.$t("rules.require"),
          trigger: "change"
        },
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
    myAvatar(avatar) {
      if (!avatar) {
        return require(`@/assets/avatar/default.jpg`);
      } else {
        if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
          return avatar;
        } else {
          return require(`@/assets/avatar/${avatar}`);
        }
      }
    },
    initUser() {
      return {
        id: "",
        account: "",
        name: "",
        org: {
          key: null
        },
        station: {key: null},
        email: "",
        mobile: "",
        sex: {
          code: "N"
        },
        nation: {
          key: ""
        },
        education: {
          key: ""
        },
        positionStatus: {
          key: ""
        },
        state: true,
        avatar: "",
        workDescribe: "",
        password: "123456"
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

    loadListOptions({callback}) {
      callback();
    },
    loadStation() {
      stationApi.page({
        size: 10000,
        model: {state: true}
      }).then(response => {
        const res = response.data;
        this.stationList = res.data.records;
      });
    },
    setIdAndSubmit(bizId, url) {
      const vm = this;
      vm.successNum += 1;
      vm.imgFileData.bizId = bizId;
      vm.user.avatar = url;
      vm.user.id = bizId;

      if (vm.successNum === vm.imgFileTotal) {
        vm.$store.state.hasLoading = false;
      }
    },
    setUser(val, orgs, dicts, enums) {
      const vm = this;
      if (val) {
        vm.user = {...vm.user,...val};
        if(!vm.user.sex){
          vm.user.sex = {code: ''}
        }
      }
      vm.dicts = dicts;
      vm.enums = enums;

      vm.orgList = orgs;
      vm.imgFileData.bizId = vm.user["id"];
      vm.$nextTick(() => {
        vm.$refs.imgFileRef.init({
          bizId: vm.user["id"],
          bizType: vm.imgFileData.bizType,
          imageUrl: vm.myAvatar(vm.user["avatar"]),
          isSingle: true,
          isDetail: false
        });
      });
      vm.loadStation();
    },
    close() {
      this.$emit("close");
    },
    reset() {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.user = this.initUser();
      this.imgFileData.bizId = "";
      this.$refs.imgFileRef.init({
        bizId: "",
        bizType: "",
        imageUrl: "",
        isSingle: true,
        isDetail: false
      });
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
      userApi.save(this.user).then(response => {
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
      userApi.update(this.user).then(response => {
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
