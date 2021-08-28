<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- span 没一格子长度，gutter 指定之间的间隙 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 如果使用 clearable 属性，会疯狂的给后端发请求 -->
          <!-- <el-input clearable :clear='getUserList()' placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select"> -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- <el-button type="primary">添加用户</el-button> -->
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- {{ scope.row }} 可以拿到这一行的数据, 且这个插槽会覆盖 prop="mg_state"-->
            <el-switch v-model="scope.row.mg_state" @change='userStateChanged(scope.row)'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditUserDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加用户对话框  -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      @close='addDialogClosd'
      width="50%">
      <el-form ref="formRef" :model="addForm" :rules="addFromRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
          <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserdialogVisible"
      @close='editDialogClosd'
      width="50%">
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
          <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1\d{10}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的电话号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      editForm: {},
      userList: [],
      total: 0,
      dialogVisible: false,
      editUserdialogVisible: false,
      addForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      addFromRules: {
        username: [
          { required: true, message: '请输入用户名字', trigger: 'blur' },
          { min: 3, max: 10, message: '用户的输入名在3~10字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码在6~15字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          // { min: 6, max: 15, message: '用户邮箱在6~15字符之间', trigger: 'blur' }
          { validator: checkEmail }
        ],
        mobile: [
          { required: true, message: '请输入用户d电话', trigger: 'blur' },
          // { min: 6, max: 15, message: '用户邮箱在6~15字符之间', trigger: 'blur' }
          { validator: checkMobile }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          // { min: 6, max: 15, message: '用户邮箱在6~15字符之间', trigger: 'blur' }
          { validator: checkEmail }
        ],
        mobile: [
          { required: true, message: '请输入用户d电话', trigger: 'blur' },
          // { min: 6, max: 15, message: '用户邮箱在6~15字符之间', trigger: 'blur' }
          { validator: checkMobile }
        ]
      }
    }
  },
  created () {
    console.log('created....')
    this.getUserList()
  },
  methods: {
    async showEditUserDialog (userInfo) {
      const id = userInfo.id
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户查询失败')
      }
      console.log(res.data)
      this.editForm = res.data
      this.editUserdialogVisible = true
    },
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.message.error('获取用户列表失败')
      this.userList = res.data.users
      this.total = res.data.total
      console.log('发请求。。。。')
    },
    handleSizeChange (val) {
      // 每页 size 变化后发生变化
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      // 页码发生变化出发
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    async userStateChanged (userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userInfo.mg_stat = !userInfo.mg_state
        return this.$message.error('用户状态更新失败')
      }
      return this.$message.success('用户状态更新成功')
    },
    addDialogClosd () {
      this.$refs.formRef.resetFields()
    },
    editDialogClosd () {
      this.$refs.editFormRef.resetFields()
    },
    addUser () {
      this.$refs.formRef.validate(async valid => {
        console.log(this.addForm)
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }

        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }

        this.$message.success('添加用户成功')
        this.editUserdialogVisible = false
        this.getUserList()
      })
    },
    async removeUserById (userInfo) {
      const configResult = await this.$confirm('永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消', // 取消会抛出异常，给 catch 处理
        type: 'warning'
      }).catch(error => error)
      console.log(configResult)
      if (configResult !== 'confirm') {
        return this.$message.success('取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + userInfo.id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
