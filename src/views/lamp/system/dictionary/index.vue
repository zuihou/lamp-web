<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :sm="8" :xs="24">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>字典列表</span>
          </div>
          <dictionary @dictionaryClick="dictionaryClick" @resetItem="resetItem" ref="dictionary" />
        </el-card>
      </el-col>
      <el-col :sm="16" :xs="24">
        <el-card class="box-card">
          <div class="clearfix" slot="header">
            <span>[{{dictionary.label}}]字典详情</span>
          </div>
          <dictionary-item ref="dictionaryItem" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Dictionary from './dictionary'
import DictionaryItem from './dictionaryItem'

export default {
  name: 'DictionaryManage',
  components: { Dictionary, DictionaryItem },
  filters: {

  },
  data () {
    return {
      dictionary:{
        label: ''
      }
    }
  },
  computed: {

  },
  watch: {

  },
  mounted () {


  },
  methods: {
    dictionaryClick (row) {
      this.dictionary = row
      this.$refs.dictionaryItem.dictionaryClick(row)
    },
    resetItem () {
      this.$refs.dictionaryItem.dictionaryClick({ type: '###' })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card /deep/ .el-card__body {
  padding: 0px;
}
</style>
