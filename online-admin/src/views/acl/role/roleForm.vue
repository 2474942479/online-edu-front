<template>
  <div style="margin: 20px 20px">
    <el-tree
      :data="rolePermission"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps"
    ></el-tree>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="save" style="margin-left: 50%">保存</el-button>
  </div>
</template>
<script>
import menu from "@/api/acl/menu";

export default {
  data() {
    return {
      saveBtnDisabled: false,
      rolePermission: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      roleId: "",
      rolePermissionDTO: {
        roleId: "",
        permissionIds: "",
      },
    };
  },
  // 监听器
  watch: {
    $route(to, from) {
      this.init();
    },
  },

  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.roleId = this.$route.params.id;
        this.fetchDataById(this.roleId);
      }
    },

    fetchDataById(roleId) {
      menu.getRolePermission(roleId).then((response) => {
        this.rolePermission = response.data;
        var jsonList = JSON.parse(JSON.stringify(this.rolePermission));
        var list = [];
        this.getJsonToList(list, jsonList[0]["children"]);
        this.setCheckedKeys(list);
      });
    },
    //把json数据转成string再转成对象，根据Key获取value数据
    getJsonToList(list, jsonList) {
      //遍历这个集合对象，获取key的值
      for (var i = 0; i < jsonList.length; i++) {
        if (jsonList[i]["selected"] == true && (jsonList[i]["level"] == 4 || jsonList[i]["level"] == 3)) {
          list.push(jsonList[i]["id"]);
        }

        if (jsonList[i]["children"] != null) {
          this.getJsonToList(list, jsonList[i]["children"]);
        }
      }
    },

    setCheckedKeys(list) {
      this.$refs.tree.setCheckedKeys(list);
    },

    save() {
      this.saveBtnDisabled = true;
      this.rolePermissionDTO.roleId = this.roleId;
      this.rolePermissionDTO.permissionIds =  
        this.$refs.tree.getHalfCheckedKeys().join(",") +
        "," +
        this.$refs.tree.getCheckedKeys().join(",");

      menu
        .assignRolePermission(this.rolePermissionDTO)
        .then((response) => {
          this.$message({
            type: "success",
            message: "保存成功",
          });
          this.$router.push({ path: "/acl/role/list" });
        })
        .catch(() => (this.saveBtnDisabled = false));
    },
  },
};
</script>
