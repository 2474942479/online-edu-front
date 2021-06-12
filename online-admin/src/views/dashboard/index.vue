<template>
  <div class="dashboard-container">
    <div class="dashboard-text">账户:{{ name }}</div>
    <div class="dashboard-text">
      角色:
      <span v-for="role in roles" :key="role">
        <el-tag size="medium" style="font-size:18px">{{ role }}</el-tag>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name", "roles"]),
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
