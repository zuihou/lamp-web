<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.online.name')" class="filter-item search-item"
                v-model="queryParams.name"/>
      <el-button @click="search" class="filter-item" plain type="primary">{{ $t('table.search') }}</el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{ $t('table.reset') }}</el-button>
    </div>
    <el-table
      :data="tableData"
      :key="tableKey"
      @filter-change="filterChange"
      @selection-change="onSelectChange"
      @sort-change="sortChange"
      @cell-click="cellClick"
      border fit row-key="id"
      ref="table"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column align="center" type="selection" column-key="selectionId" width="40px" :reserve-selection="true"/>
      <el-table-column :label="$t('table.online.account')" :show-overflow-tooltip="true" align="center" prop="account"
                       width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.online.name')" :show-overflow-tooltip="true" align="left"
                       width="100px" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.online.token')" :show-overflow-tooltip="true" align="center"
                       prop="token">
        <template slot-scope="scope">
          <span>{{ scope.row.token }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.online.clientId')" :show-overflow-tooltip="true" align="center"
                       width="100px" prop="clientId">
        <template slot-scope="scope">
          <span>{{ scope.row.clientId }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.online.location')" :show-overflow-tooltip="true" align="center"
                       width="170px" prop="location">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.online.loginIp')" :show-overflow-tooltip="true" align="center"
                       prop="loginIp" sortable="custom" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.loginIp }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.online.loginTime')" :show-overflow-tooltip="true" align="center"
                       prop="consumingTime" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.operation')" column-key="operation" align="center"
                       class-name="small-padding fixed-width"
                       width="110px">
        <template slot-scope="{row}">
          <i @click="onDelete(row)" class="el-icon-delete table-operation" style="color: #87d068;"
             v-has-permission="['authority:online:delete']"/>
          <el-link class="no-perm" v-has-no-permission="['authority:online:delete']">
            {{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import onlineApi from '@/api/Online.js'

export default {
  name: 'OnlineList',
  directives: {},
  components: {},
  filters: {},
  data() {
    return {
      tableKey: 0,
      loading: false,
      selection: [],
      queryParams: {
        name: ''
      },
      tableData: [],
    }
  },
  computed: {},
  mounted() {
    this.fetch()
  },
  methods: {
    onSelectChange(selection) {
      this.selection = selection
    },
    fetch() {
      this.loading = true;
      onlineApi.list(this.queryParams).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.tableData = res.data;
        }
      }).finally(() => this.loading = false);
    },
    clearSelections() {
      this.$refs.table.clearSelection()
    },
    search() {
      this.fetch({
        ...this.queryParams
      })
    },
    reset() {
      this.queryParams = { name: ''}
      this.$refs.table.clearSort()
      this.$refs.table.clearFilter()
      this.search()
    },
    sortChange(val) {
      this.search();
    },
    filterChange(filters) {
      // for (const key in filters) {
      //   if (key.includes('.')) {
      //     const val = {};
      //     val[key.split('.')[1]] = filters[key][0];
      //     this.queryParams.model[key.split('.')[0]] = val;
      //   } else {
      //     this.queryParams.model[key] = filters[key][0]
      //   }
      // }
      this.search()
    },
    cellClick(row, column) {
      if (column['columnKey'] !== "selectionId") {
        return;
      }
      let flag = false;
      this.selection.forEach((item) => {
        if (item.id === row.id) {
          flag = true;
          this.$refs.table.toggleRowSelection(row);
        }
      })

      if (!flag) {
        this.$refs.table.toggleRowSelection(row, true);
      }
    },
    onDelete(row) {
      const param = {
        userId: row.userId,
        userToken: row.token,
        clientId: row.clientId,
      }
      onlineApi.t(param).then(response => {
        const res = response.data;
        if (res.isSuccess) {
          this.$message({
            message: "操作成功",
            type: 'success'
          });
          this.search();
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          });
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
