<template>
  <div style="padding:30px;">
    我是菜单1-2

    下面开始表演我有那些权限：

    <el-button class="filter-item" plain type="danger"
               v-has-permission="['authority:parameter:add', 'authority:parameter:e2dit','authority:parameter:delete']">
      has 我有这里的所有权限1
    </el-button>
    <el-button class="filter-item" plain type="danger"
               v-has-permission="['authority:user:add', 'authority:parameter:add']">
      has 我有这里的所有权限2
    </el-button>

    <el-button class="filter-item" plain type="danger"
               v-has-any-permission="['authority:123:add', 'authority:parameter:edit','authority:1234:delete']">
      has any 我有这里的任意权限1
    </el-button>
    <el-button class="filter-item" plain type="danger" v-has-any-permission="['authority:user:add']">
      has any 我有这里的任意权限2
    </el-button>

    <el-button class="filter-item" plain type="danger"
               v-has-no-permission="['authority:user:add', 'authority:4:edit','authority:5:delete']">
      has no 我没有这里的所有权限1
    </el-button>
    <el-button class="filter-item" plain type="danger" v-has-no-permission="['authority:user:add']">
      has no 我没有这里的所有权限2
    </el-button>


    <el-button class="filter-item" plain type="danger" v-has-role="['admin']">
      has role 1
    </el-button>
    <el-button class="filter-item" plain type="danger" v-has-role="['ROLE_SUPER_ADMIN']">
      has role 2
    </el-button>
    <el-button class="filter-item" plain type="danger" v-has-any-role="['ROLE_SUPER_AdMIN']">
      has any role 1
    </el-button>
    <el-button class="filter-item" plain type="danger" v-has-any-role="['SUPER_ADMIN']">
      has any role 2
    </el-button>
    <el-button class="filter-item" plain type="danger" v-has-no-role="['ROLE_SUPer_ADMIN']">
      has no role 1
    </el-button>
    <el-button class="filter-item" plain type="danger" v-has-no-role="['SUPER_ADMIN']">
      has no role 2
    </el-button>


  </div>
</template>
