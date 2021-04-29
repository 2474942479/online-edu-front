<template>
  <div class="app-container" >
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom:30px;" />

    <el-tree
      empty-text="尚无课程分类信息，请添加"
      ref="tree"
      :data="data"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import subject from "@/api/edu/subject";

export default {
  data() {
    return {
      filterText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "title",
      }
    }
  },

  created() {
    this.getSubject();
  },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },

  methods: {
    getSubject() {
      subject.getAllList().then((response) => {
        this.data = response.data;
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
  },
};
</script>

