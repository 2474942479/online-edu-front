<template>
  <div class="app-container">
    <el-table
      :data="menuList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" sortable align="center" width="300"></el-table-column>
      <el-table-column prop="path" label="访问路径" sortable align="center" width="300"></el-table-column>
      <el-table-column prop="component" label="组件路径" sortable align="center" width="300"></el-table-column>
      <el-table-column prop="permissionValue" align="center" label="权限值"></el-table-column>
      <el-table-column prop="icon" align="center" label="图标值"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!-- v-if="node.level == 1 || node.level == 2" v-if="node.level == 3" v-if="node.level == 4"-->
          <el-button
            v-if="(scope.row.level == 1 || scope.row.level == 2) && hasPerm('permission.add')"
            type="text"
            size="medium"
            @click="() => {dialogFormValue = '添加菜单', dialogFormVisible = true, menu.pid = scope.row.id}"
          >添加菜单</el-button>
          <el-button
            v-if="scope.row.level == 3 &&  hasPerm('permission.add')"
            type="text"
            size="medium"
            @click="() => {dialogPermissionValue = '添加功能', dialogPermissionVisible = true, permission.pid = scope.row.id}"
          >添加功能</el-button>
          <el-button
            v-if="scope.row.level == 4 &&  hasPerm('permission.update')"
            type="text"
            size="medium"
            @click="() => updateFunction(scope.row)"
          >修改</el-button>
          <el-button
            v-if="scope.row.level != 4 &&  hasPerm('permission.update')"
            type="text"
            size="medium"
            @click="() => updateMenu(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            size="medium"
            @click="() => remove(scope.row)"
            v-if="hasPerm('permission.remove')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogFormValue">
      <el-form ref="menu" :model="menu" :rules="menuValidateRules" label-width="120px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menu.name" />
        </el-form-item>
        <el-form-item label="访问路径" prop="path">
          <el-input v-model="menu.path" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menu.component" />
        </el-form-item>
        <el-form-item label="组件图标" prop="icon">
          <el-input v-model="menu.icon" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="restData()">取 消</el-button>
        <el-button type="primary" @click="appendMenu()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加功能的窗口 -->
    <el-dialog :visible.sync="dialogPermissionVisible" :title="dialogPermissionValue">
      <el-form
        ref="permission"
        :model="permission"
        :rules="permissionValidateRules"
        label-width="120px"
      >
        <el-form-item label="功能名称" prop="name">
          <el-input v-model="permission.name" />
        </el-form-item>
        <el-form-item label="访问路径">
          <el-input v-model="permission.path" />
        </el-form-item>
        <el-form-item label="组件路径">
          <el-input v-model="permission.component" />
        </el-form-item>
        <el-form-item label="功能权限值" prop="permissionValue">
          <el-input v-model="permission.permissionValue" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="restData()">取 消</el-button>
        <el-button type="primary" @click="appendFunction()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import menu from "@/api/acl/menu";

const menuForm = {
  name: "",
  pid: 0,
  path: "",
  icon:"",
  component: "",
  type: "1",
  status: "1",
};
const perForm = {
  permissionValue: "",
  type: "2",
  name: "",
  path: "",
  component: "",
  pid: 0,
  status: "1",
};

export default {
  data() {
    return {
      filterText: "",
      menuList: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      dialogFormValue: "添加菜单",
      dialogFormVisible: false,
      dialogPermissionValue: "添加功能",
      dialogPermissionVisible: false,
      menu: menuForm,
      permission: perForm,
      menuValidateRules: {
        name: [{ required: true, trigger: "blur", message: "菜单名必须输入" }],
        path: [
          { required: true, trigger: "blur", message: "菜单路径必须输入" },
        ],
        component: [
          { required: true, trigger: "blur", message: "组件名称必须输入" },
        ],
      },
      permissionValidateRules: {
        name: [
          { required: true, trigger: "blur", message: "功能名称必须输入" },
        ],
        permissionValue: [
          { required: true, trigger: "blur", message: "功能权限值必须输入" },
        ],
      },
    };
  },

  created() {
    SVGPoint;
    this.initData();
  },

  methods: {
    initData() {
      menu.getAllPermission().then((response) => {
        this.menuList = response.data;
      });
    },

    remove(data) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return menu.removeById(data.id);
        })
        .then((response) => {
          if (response.success) {
            this.initData(); // 刷新列表
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
        });
    },

    appendFunction() {
      this.$refs.permission.validate((valid) => {
        if (valid) {
          if (this.permission.id) {
            this.update(this.permission);
          } else {
            this.save(this.permission);
          }
        }
      });
    },

    appendMenu() {
      this.$refs.menu.validate((valid) => {
        if (valid) {
          if (!this.menu.id) {
            // 添加
            this.save(this.menu);
          } else {
            // 修改
            this.update(this.menu);
          }
        }
      });
    },

    save(obj) {
      menu.save(obj).then((response) => {
        this.dialogFormVisible = false;
        this.$message({
          type: "success",
          message: "添加成功",
        });
        // 刷新页面
        this.initData();
        this.restData();
      });
    },

    update(obj) {
      menu.update(obj).then((response) => {
        this.dialogFormVisible = false;
        this.$message({
          type: "success",
          message: "修改成功",
        });
        // 刷新页面
        this.initData();
        this.restData();
      });
    },

    updateMenu(data) {
      this.dialogFormValue = "修改菜单";
      this.dialogFormVisible = true;
      this.menu = data;
    },

    updateFunction(data) {
      this.dialogPermissionValue = "修改功能";
      this.dialogPermissionVisible = true;
      this.permission = data;
    },

    restData() {
      this.dialogPermissionVisible = false;
      this.dialogFormVisible = false;
      this.menu = { ...menuForm };
      this.permission = { ...perForm };
    },
  },
};
</script>
