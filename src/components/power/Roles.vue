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
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <div>{{ scope.row }}</div> -->
            <!-- 行, 一行占24个单位，一级权限给5个单位，其他19个单位给二级和三级权限, 注意这里的写法，按照需求加样式 -->
            <el-row :class="['bdbottom', indexI === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, indexI) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close='removeRightsById(scope.row, item1.id)'
                >
                  {{ item1.authName }}
                  <i class="el-icon-caret-right"></i>
                </el-tag>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for 循环渲染二级权限 -->
                <el-row
                  :class="[index2 !== 0 ? 'bdtop' : '', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close='removeRightsById(scope.row, item2.id)'
                    >
                      {{ item2.authName }}
                      <i class="el-icon-caret-right"></i>
                    </el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id" type="warning"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size='mini' type="primary" icon="el-icon-edit" @click="showEditRoleDialog(scope.row)">编辑</el-button>
            <el-button size='mini' type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)">删除</el-button>
            <el-button size='mini' type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
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
    <!-- 设置用户权限 -->
    <el-dialog
       title="分配权限"
      :visible.sync="setRightDialogVisible"
      @closed="clearRightDialogArrayWhenCloseDialog"
      width="50%"
    >
    <!--
      props 定义父子是那个属性展开的，定义显示的是那个字段 @node-click="handleNodeClick"
      node-key 每个节点唯一值那个属性名称
      default-expand-all 默认展开所有
      default-expanded-keys：默认展开的节点的 key 的数组
    -->
      <el-tree
        :data="rolesList"
        :props="treeRolesProps"
        node-key='id'
        show-checkbox
        default-expand-all
        :default-checked-keys='defKeys'
        ref="rightTreeRef"
      ></el-tree>
      <span slot='footer' class="dialog-footer">
        <el-button @click='setRightDialogVisible=false'>取 消</el-button>
      </span>
      <span slot='footer' class="dialog-footer">
        <el-button type="primary" @click='allotRights'>确 定</el-button>
      </span>
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
      setRightDialogVisible: false,
      rolesList: [], // 所有角色列表数据
      treeRolesProps: {
        children: 'children', // 这个字段为父子展开节点
        label: 'authName' // 显示这个字段
      },
      defKeys: [],
      // 讲讲分配权限的 roldId
      roleId: ''
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
    },
    async removeRightsById (role, rightId) {
      const configResult = await this.$confirm('永久删除该角色, 是否继续?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消', // 取消会抛出异常，给 catch 处理
        type: 'warning'
      }).catch(error => error)
      if (configResult !== 'confirm') {
        return this.$message.error('取消删除')
      }

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // this.getRoles() 重新发送请求获取数据，会重新渲染数据，然后页面就会重新渲染，打开的展开会重新合上
      role.children = res.data // 返回的数据就是当前角色下最新的权限
    },
    async showSetRightDialog (role) {
      // axios 发请求返回的是一个 Promise
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      // console.log(res.data)
      this.rolesList = res.data

      // 展开时候选中当前所有权限, 获取三级节点的 id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
      this.roleId = role.id
    },
    getLeafKeys (role, arr) {
      if (!role.children) {
        // 不包含 children 元素，那么就是3级权限
        return arr.push(role.id)
      }
      role.children.forEach(item => this.getLeafKeys(item, arr))
    },
    clearRightDialogArrayWhenCloseDialog () {
      this.defKeys = []
    },
    async allotRights () {
      const keys = [
        ...this.$refs.rightTreeRef.getCheckedKeys(),
        ...this.$refs.rightTreeRef.getHalfCheckedKeys()
      ]
      console.log('=========')
      console.log(keys)
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: keys.join(',')
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoles()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
