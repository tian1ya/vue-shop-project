<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogViaible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roles" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand"></el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size='mini' type="primary" icon="el-icon-edit" @click="showEditRoleDialog(scope.row)">编辑</el-button>
            <el-button size='mini' type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
            <el-button size='mini' type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogViaible"
      @close='addRoleDialigClosed'
      width="50%"
    >
      <el-form ref="addRoleRef" :model="addRole" :rules="addRoleRules" label-width="70px">
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="addRoleEntity.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addRoleEntity.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogViaible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="更新角色"
      :visible.sync="editRoleDialogVisible"
      @closed='editRoleDialogVisibleClosed'
      width="50%"
    >
      <el-form ref="editRoleForm" :model="editRoleEntity" :rules="addRoleRules" label-width="70px">
        <el-form-item label='名称' prop="roleName">
          <el-input v-model="editRoleEntity.name"></el-input>
        </el-form-item>
        <el-form-item label='描述' prop="roleDesc">
          <el-input v-model="editRoleEntity.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户框 -->
    <el-dialog
       title="更新角色"
      :visible.sync="deleteRoleDialogVisible"
      @closed='deleteRoleDialogVisibleClosed'
      width="50%"
    >
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roles: [],
      addRoleDialogViaible: false,
      addRoleEntity: {
        name: '',
        desc: ''
      },
      editRoleEntity: {
        id: '',
        name: '',
        desc: ''
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blue' },
          { min: 1, max: 10, trigger: 'blue' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blue' }
        ]
      },
      editRoleDialogVisible: false,
      deleteRoleDialogVisible: false
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    async getRoles () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      }
      console.log(res.data)
      this.roles = res.data
    },
    addRoleDialigClosed () {
      this.$refs.addRoleRef.resetFields()
    },
    async addRole () {
      const { data: res } = await this.$http.post('roles', {
        roleName: this.addRoleEntity.name,
        roleDesc: this.addRoleEntity.desc
      })
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('添加角色失败')
      }
      this.$message.success('添加角色成功')
      this.addRoleDialogViaible = false
      this.getRoles()
    },
    editRoleDialogVisibleClosed () {
      this.$refs.editRoleForm.resetFields()
    },
    showEditRoleDialog (roleInfo) {
      this.editRoleEntity.name = roleInfo.roleName
      this.editRoleEntity.desc = roleInfo.roleDesc
      this.editRoleEntity.id = roleInfo.id
      this.editRoleDialogVisible = true
    },
    async updateRole () {
      const { data: res } = await this.$http.put('roles/' + this.editRoleEntity.id, {
        roleName: this.editRoleEntity.name,
        roleDesc: this.editRoleEntity.desc
      })
      console.log(res)
      if (res.meta.status !== 201) {
        this.$message.error('更新失败')
      }

      this.$message.success('更新成功')
      this.getRoles()
      this.editRoleDialogVisible = false
    },
    async deleteRole (roleInfo) {
      console.log(roleInfo)
      const configResult = await this.$confirm('永久删除该角色, 是否继续?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消', // 取消会抛出异常，给 catch 处理
        type: 'warning'
      }).catch(error => error)

      console.log(configResult)
      if (configResult !== 'confirm') {
        return this.$message.success('取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + roleInfo.id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getRoles()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
