<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.keyword')" size="small" class="filter-item search-item"
                v-model="queryParams.model.label" clearable/>
      <el-button @click="search" class="filter-item" plain type="primary" size="small">{{ $t('table.search') }}</el-button>
      <el-dropdown class="filter-item" trigger="click"
                   v-has-any-permission="['authority:dictionary:delete','authority:dictionary:add']">
        <el-button size="small">
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="add" v-has-permission="['authority:dictionary:add']">
            {{ $t('table.add') }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['authority:dictionary:delete']">
            {{ $t('table.delete') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      :data="tableData.records"
      :key="tableKey"
      @filter-change="filterChange"
      @row-click="rowClick"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
      border fit row-key="id"
      ref="table"
      size="mini"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column align="center" type="selection" width="40px" :reserve-selection="true"/>
      <el-table-column :label="$t('table.dictionary.type')" :show-overflow-tooltip="true" align="center" prop="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.dictionary.label')" :show-overflow-tooltip="true" align="center" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        column-key="state"
        :filters="[{ text: $t('common.state.valid'), value: true }, { text: $t('common.state.invalid'), value: false }]"
        :label="$t('table.dictionary.state')"
        class-name="status-col"
        width="70px"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">{{ row.state ? $t('common.state.valid') :
            $t('common.state.invalid') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.operation')" align="center" class-name="small-padding fixed-width"
                       width="70px">
        <template slot-scope="{row}">
          <i @click="edit(row)" class="el-icon-edit table-operation" style="color: #2db7f5;"
             v-hasPermission="['authority:dictionary:edit']"/>
          <i @click="singleDelete(row)" class="el-icon-delete " style="color: #f50;"
             v-hasPermission="['authority:dictionary:delete']"/>
          <el-link class="no-perm" v-has-no-permission="['authority:dictionary:edit','authority:dictionary:delete']">{{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :limit.sync="queryParams.size" :page.sync="queryParams.current" :total="Number(tableData.total)"
                @pagination="fetch" v-show="tableData.total>0"/>
    <dictionary-edit :dialog-visible="dialog.isVisible" :type="dialog.type" @close="editClose" @success="editSuccess"
                     ref="edit"/>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import DictionaryEdit from './edit'
  import dictionaryApi from '@/api/Dictionary.js'
  import {initQueryParams} from '@/utils/commons'

  export default {
    name: 'DictionaryManage',
    components: {Pagination, DictionaryEdit},
    filters: {
      statusFilter(status) {
        const map = {
          false: 'danger',
          true: 'success'
        }
        return map[status] || 'success'
      }
    },
    data() {
      return {
        dialog: {
          isVisible: false,
          type: 'add'
        },
        tableKey: 0,
        queryParams: initQueryParams({}),
        selection: [],
        loading: false,
        tableData: {
          total: 0
        }
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.fetch()
    },
    methods: {
      editClose() {
        this.dialog.isVisible = false
      },
      editSuccess() {
        this.search()
      },
      onSelectChange(selection) {
        this.selection = selection
      },
      search() {
        this.fetch({
          ...this.queryParams
        })
        this.$emit('dictionaryClick', {id: -1})
      },
      reset() {
        this.queryParams = initQueryParams({});
        this.$refs.table.clearSort();
        this.$refs.table.clearFilter();
        this.search()
      },
      singleDelete(row) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(row, true)
        this.batchDelete()
      },
      batchDelete() {
        if (!this.selection.length) {
          this.$message({
            message: this.$t('tips.noDataSelected'),
            type: 'warning'
          })
          return
        }
        this.$confirm(this.$t('tips.confirmDelete'), this.$t('common.tips'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          const types = []
          this.selection.forEach((u) => {
            types.push(u.type)
          })
          this.delete(types)
        }).catch(() => {
          this.clearSelections()
        })
      },
      clearSelections() {
        this.$refs.table.clearSelection()
      },
      delete(types) {
        dictionaryApi.deleteType({'types': types})
          .then((response) => {
            const res = response.data
            if (res.isSuccess) {
              this.$message({
                message: this.$t('tips.deleteSuccess'),
                type: 'success'
              })
            }
            this.search()
          })
      },
      add() {
        this.dialog.type = 'add'
        this.dialog.isVisible = true
        this.$refs.edit.setDictionary(false)
      },
      edit(row) {
        this.$refs.edit.setDictionary(row)
        this.dialog.type = 'edit'
        this.dialog.isVisible = true
      },
      fetch(params = {}) {
        this.loading = true

        this.queryParams.current = params.current ? params.current : this.queryParams.current;
        this.queryParams.size = params.size ? params.size : this.queryParams.size;

        dictionaryApi.pageType(this.queryParams).then(response => {
          const res = response.data;
          if (res.isSuccess) {
            this.tableData = res.data;
          }
        }).finally(() => this.loading = false);
      },
      sortChange(val) {
        this.queryParams.sort = val.prop;
        this.queryParams.order = val.order;
        if (this.queryParams.sort) {
          this.search();
        }
      },
      filterChange(filters) {
        for (const key in filters) {
          if (key.includes('.')) {
            const val = {};
            val[key.split('.')[1]] = filters[key][0];
            this.queryParams.model[key.split('.')[0]] = val;
          } else {
            this.queryParams.model[key] = filters[key][0]
          }
        }
        this.search()
      },
      rowClick(row) {
        this.$emit('dictionaryClick', row)
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
