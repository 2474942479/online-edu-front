<template>
  <div class="app-container">
    <el-form ref="user" :model="user" :rules="validateRules" label-width="120px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username"/>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input v-model="user.nickName"/>
      </el-form-item>
       <el-form-item v-if="!user.id" label="用户密码" prop="password">
        <el-input v-model="user.password"/>
      </el-form-item>
     
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import userApi from '@/api/acl/user'

const defaultForm = {
  username: '',
  nickName: '',
  password: ''
}

const validatePass = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('密码不能小于6位'))
  } else {
    callback()
  }
}

export default {
  data() {
    return {
      user: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用,
      validateRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名必须输入' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      }
    }
  },

  // 监听器
  watch: {
    $route(to, from) {
      this.init()
    },
    'user.username': {
      handler() {
        this.saveBtnDisabled = false
      },
      deep: true
    }
  },

  // 生命周期方法（在路由切换，组件不变的情况下不会被调用）
  created() {
    this.init()
  },

  methods: {

    // 表单初始化
    init() {
      // debugger
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.fetchDataById(id)
      } else {
        // 对象拓展运算符：拷贝对象，而不是赋值对象的引用
        this.user = { ...defaultForm }
      }
    },

    saveOrUpdate() {
      this.$refs.user.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          if (!this.user.id) {
            this.saveData()
          } else {
            this.updateData()
          }
        }
      })
    },

   
    saveData() {
      userApi.saveOrUpdateUserInfo(this.user).then(response => {
        // debugger
        if (response.success) {
          this.$message({
            type: 'success',
            message: "添加成功"
          })
          this.$router.push({ path: '/acl/user/list' })
        }
      })
    },

    updateData() { 
      this.user.password = null
      userApi.saveOrUpdateUserInfo(this.user).then(response => {
        if (response.success) {
          this.$message({
            type: 'success',
            message: "修改成功"
          })
          this.$router.push({ path: '/acl/user/list' })
        }
      })
    },

    // 根据id查询记录
    fetchDataById(id) {
      userApi.getById(id).then(response => {
        // debugger
        this.user = response.data
      })
    }

  }
}
</script>
