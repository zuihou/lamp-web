<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.optLog.userName')" class="filter-item search-item"
                v-model="queryParams.model.userName"/>
      <el-input :placeholder="$t('table.optLog.requestIp')" class="filter-item search-item"
                v-model="queryParams.model.requestIp"/>
      <el-date-picker
        :range-separator="null"
        :start-placeholder="$t('table.createTime')"
        class="filter-item search-item date-range-item"
        format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        v-model="queryParams.timeRange"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button @click="search" class="filter-item" plain type="primary">{{ $t('table.search') }}</el-button>
      <el-button @click="reset" class="filter-item" plain type="warning">{{ $t('table.reset') }}</el-button>
      <el-dropdown class="filter-item" trigger="click" v-has-any-permission="['authority:optLog:delete','authority:optLog:export']">
        <el-button>
          {{ $t('table.more') }}
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="batchDelete" v-has-permission="['authority:optLog:delete']">{{ $t('table.delete') }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel" v-has-permission="['authority:optLog:export']">{{ $t('table.export') }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="exportExcelPreview" v-has-permission="['authority:optLog:export']">
            {{ $t("table.exportPreview") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="filter-item" trigger="click" v-has-any-permission="['authority:optLog:delete']">
        <el-button>
          清理日志
          <i class="el-icon-arrow-down el-icon--right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="clear(1)" >
            保留一个月
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(2)" >
            保留三个月
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(3)" >
            保留六个月
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(4)" >
            保留一年
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(5)" >
            保留一千条
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(6)" >
            保留一万条
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(7)" >
            保留三万条
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(8)" >
            保留十万条
          </el-dropdown-item>
          <el-dropdown-item @click.native="clear(9)" >
            清空所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      :data="tableData.records"
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
      <el-table-column align="center" type="selection" width="40px" :reserve-selection="true"/>
      <el-table-column :label="$t('table.optLog.userName')" :show-overflow-tooltip="true" align="center" prop="userName"
                       width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.optLog.requestUri')" :show-overflow-tooltip="true" align="left"
                       min-width="120px" prop="requestUri">
        <template slot-scope="scope">
          <span>{{ scope.row.requestUri }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :filter-multiple="false"
        :filters="httpMethodFilters"
        :label="$t('table.optLog.httpMethod')"
        :show-overflow-tooltip="true"
        align="center"
        column-key="httpMethod"
        prop="httpMethod"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.httpMethod.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.optLog.requestIp')" :show-overflow-tooltip="true" align="center"
                       prop="requestIp" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.requestIp }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.optLog.description')" :show-overflow-tooltip="true" align="center"
                       min-width="100px" prop="description">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column :filter-multiple="false" :filters="typeFilters" :label="$t('table.optLog.type')"
                       :show-overflow-tooltip="true" align="center" column-key="type" prop="type" width="80px">
        <template slot-scope="scope">
          <span>
            <el-badge :type="(scope.row.type && scope.row.type.code == 'OPT')? 'success':'danger' " class="item"
                      is-dot/>
            {{ scope.row.type.desc }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.optLog.actionMethod')" :show-overflow-tooltip="true" align="center"
                       min-width="120px" prop="actionMethod">
        <template slot-scope="scope">
          <span>{{ scope.row.classPath + '.' + scope.row.actionMethod }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.optLog.startTime')" :show-overflow-tooltip="true" align="center"
                       prop="startTime" sortable="custom" width="170px">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.optLog.consumingTime')" :show-overflow-tooltip="true" align="center"
                       prop="consumingTime" width="110px">
        <template slot-scope="{row}">
          <el-tag :type="row.consumingTime | timeFilter">{{ transTime(row.consumingTime) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :formatter="uaForamt" label="终端 | 浏览器" prop="ua" width="120"/>
      <el-table-column :label="$t('table.operation')" column-key="operation" align="center" class-name="small-padding fixed-width"
                       width="110px">
        <template slot-scope="{row}">
          <i @click="singleDelete(row)" class="el-icon-delete table-operation" style="color: #f50;"
             v-has-permission="['authority:optLog:delete']"/>
          <i @click="onView(row)" class="el-icon-view table-operation" style="color: #87d068;"
             v-has-permission="['authority:optLog:view']"/>
          <el-link class="no-perm" v-has-no-permission="['authority:optLog:delete','authority:optLog:view']">{{ $t('tips.noPermission') }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :limit.sync="queryParams.size" :page.sync="queryParams.current" :total="Number(tableData.total)"
                @pagination="fetch" v-show="tableData.total>0"/>

    <el-drawer :before-close="closeDrawer" :visible.sync="drawer" direction="rtl" v-model="currentRow">
      <div class="clearfix" slot="title">
        <el-badge :type="(currentRow.type && currentRow.type.code == 'OPT')? 'success':'danger' " class="item" is-dot/>
        {{ currentRow.type ? currentRow.type.desc : '' }}
        {{ currentRow.requestUri }}
      </div>
      <el-scrollbar style="height: 100%;">
        <el-card class="box-card">
          <div class="box-item">
            <span class="field-label">执行方法:</span>
            <aside>{{ currentRow.classPath + '.' + currentRow.actionMethod + '()' }}</aside>
          </div>

          <div class="box-item">
            <span class="field-label">请求参数:</span>
            <aside style>{{ currentRow.params }}</aside>
          </div>

          <div class="box-item">
            <span class="field-label">响应信息:</span>
            <aside style>
              <pre style="white-space: pre-wrap;">{{ currentRow.result ? JSON.stringify(JSON.parse(currentRow.result), null, 4) : '' }}</pre>
            </aside>
          </div>
          <div class="box-item" v-if="currentRow.type && currentRow.type['code']==='EX'">
            <span class="field-label">错误信息:</span>
            <aside>{{ currentRow.exDetail }}</aside>
          </div>
        </el-card>
      </el-scrollbar>
    </el-drawer>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      title="预览"
      width="80%"
      top="50px"
      :visible.sync="preview.isVisible"
      v-el-drag-dialog
    >
      <el-scrollbar>
        <div v-html="preview.context"></div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
  import Pagination from '@/components/Pagination'
  import {readUserAgent} from '@/utils/utils'
  import optLogApi from '@/api/OptLog.js'
  import {convertEnum} from '@/utils/utils'
  import elDragDialog from '@/directive/el-drag-dialog'
  import { downloadFile, initEnums, initQueryParams } from '@/utils/commons'

  export default {
    name: 'OptLog',
    directives: { elDragDialog },
    components: {Pagination},
    filters: {
      timeFilter(time) {
        if (time < 500) {
          return 'success'
        } else if (time < 1000) {
          return ''
        } else if (time < 1500) {
          return 'warning'
        } else {
          return 'danger'
        }
      }
    },
    data() {
      return {
        tableKey: 0,
        loading: false,
        preview: {
          isVisible: false,
          context: ''
        },
        queryParams: initQueryParams({
          model: {
            type: {
              key: null
            },
            httpMethod: {
              key: null
            }
          },
          sort: 'createTime'
        }),
        selection: [],
        tableData: {},
        enums: {
          LogType: {},
          HttpMethod: {},
        },
        drawer: false,
        currentRow: {}
      }
    },
    computed: {
      typeFilters() {
        return convertEnum(this.enums.LogType)
      },
      httpMethodFilters() {
        return convertEnum(this.enums.HttpMethod)
      }
    },
    mounted() {
      initEnums(['LogType', 'HttpMethod'], this.enums)
      this.fetch()
    },
    methods: {
      onSelectChange(selection) {
        this.selection = selection
      },
      exportExcelPreview() {
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }
        this.queryParams.extra.fileName = '导出操作日志';
        optLogApi.preview(this.queryParams).then(response => {
          const res = response.data;
          this.preview.isVisible = true;
          this.preview.context = res.data;
        });
      },
      exportExcel() {
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }
        this.queryParams.extra.fileName = '导出操作日志';
        optLogApi.export(this.queryParams).then(response => {
          downloadFile(response);
        });
      },
      fetch(params = {}) {
        this.loading = true;
        if (this.queryParams.timeRange) {
          this.queryParams.extra.createTime_st = this.queryParams.timeRange[0];
          this.queryParams.extra.createTime_ed = this.queryParams.timeRange[1];
        }

        this.queryParams.current = params.current ? params.current : this.queryParams.current;
        this.queryParams.size = params.size ? params.size : this.queryParams.size;

        optLogApi.page(this.queryParams).then(response => {
          const res = response.data;
          if (res.isSuccess) {
            this.tableData = res.data;
          }
        }).finally(() => this.loading = false);
      },
      clear(type) {
        this.$confirm('确认要清除日志吗？', this.$t("common.tips"), {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        })
          .then(() => {
            optLogApi.clear({type: type}).then(response => {
              const res = response.data;
              if (res.isSuccess) {
                this.$message({
                  message: this.$t("tips.deleteSuccess"),
                  type: "success"
                });
              }

              this.search();
            });

          })
          .catch(() => {
          });
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
          const logIds = this.selection.map(item => item.id)
          this.delete(logIds)
        }).catch(() => {
          this.clearSelections()
        })
      },
      clearSelections() {
        this.$refs.table.clearSelection()
      },
      delete(logIds) {
        optLogApi.delete({ids: logIds})
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
      search() {
        this.fetch({
          ...this.queryParams
        })
      },
      reset() {
        this.queryParams = initQueryParams({
          model: {
            type: {
              key: null
            },
            httpMethod: {
              key: null
            }
          }
        });
        this.$refs.table.clearSort()
        this.$refs.table.clearFilter()
        this.search()
      },
      transTime(time) {
        return `${time} ms`
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
      cellClick (row, column) {
        if (column['columnKey'] === "operation") {
          return;
        }
        let flag = false;
        this.selection.forEach((item)=>{
          if(item.id === row.id) {
            flag = true;
            this.$refs.table.toggleRowSelection(row);
          }
        })

        if(!flag){
          this.$refs.table.toggleRowSelection(row, true);
        }
      },
      onView(row) {
        optLogApi.get(row.id) .then((response) => {
          const res = response.data
          if (res.isSuccess) {
            this.currentRow = res.data
            this.drawer = true
          }
        })
      },
      closeDrawer(done) {
        done()
        this.currentRow = {}
      },
      uaForamt(row) {
        let ua = readUserAgent(row.ua)
        return ua.terminal + '  |  ' + ua.browser
      }

    }
  }
</script>
<style lang="scss" scoped>
  .item {
    margin-top: 7px;
  }

  .drawer-item {
    margin-top: 6px;
  }

  .box-item {
    margin-top: 15px;

    aside {
      word-wrap: break-word;
      margin-top: 15px;
    }

    pre {
      white-space: pre-wrap;
      font-size: 0.8em;
      line-height: 1.5em;
    }
  }
</style>
