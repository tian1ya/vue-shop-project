<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item >商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialig">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格
        :data 数据源
        :columns 表格各列的配置（具体见下文：Columns Configs）
        :selection-type: 是否为多选类型表格
        slot-scope="scope" 完成子给父传数据，这里的子是每一行
        二在模板这里是 tree-table， 在这里可以获取每一行的数据了
       -->
      <tree-table
        :data="cates"
        :columns="columns"
        :selection-type='false'
        :show-index='true'
        :expand-type='false'
        index-text='#'
        border
        :show-row-hover='false'
        class="tree-table">
        <template slot="isOK" slot-scope="scope">
          <i class="el-icon-success" 
            v-if="!scope.cat_deleted" 
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-remove" v-else style="color: red;"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCatesBody.pagenum"
        :page-sizes="[2, 5, 7, 10]"
        :page-size="queryCatesBody.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCateNum">
      </el-pagination>
      <!-- 分类 -->
    </el-card>

    <el-dialog
      title="添加分类"
      :visible="addCateDialogVisivale"
      width="40%"
    >
    <!-- :before-close="handleClose" -->
      <el-form 
        :model="addCateForm" 
        :rules="addCateRules" 
        ref="addCatFormRef" 
        label-width="100px" 
        >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
          <el-cascader
            v-model="addCateKeysBody"
            :options="parentCateList"
            clearable
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children', checkStrictly: true}"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisivale=false">取消</el-button>
        <el-button type="primary" @click="addCateDialogVisivale=false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      addCateForm: {
        cat_name: '',
        cat_id: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          {required: true, message: '请输入分类名称', trigger: "blur"}
        ]
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isOK'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      cates: [],
      queryCatesBody: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      totalCateNum: 0,
      addCateDialogVisivale: false,
      parentCateList: [],
      // cateCascaderProps: {
      //   value: "cat_id",
      //   label: "cat_name",
      //   children: "children"
      // },
      addCateKeysBody: []
    }
  },
  created () {
    this.getCates()
  },
  methods: {
    handleChange () {
      console.log(this.addCateKeysBody)
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {type: 2}
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级商品列表失败')
      }
      console.log(res.data)
      this.parentCateList = res.data

    },
    showAddCateDialig () {
      this.addCateDialogVisivale = true
      this.getParentCateList()
    },
    async getCates () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryCatesBody
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.cates = res.data.result
      this.totalCateNum = res.data.total
    },
    handleSizeChange (newSize) {
      // newSize 改变
      this.queryCatesBody.pagesize = newSize
      this.getCates()
    },
    handleCurrentChange (newNumber) {
      // newNumber 改变
      this.queryCatesBody.pagenum = newNumber
      this.getCates()
    }
  }
}
</script>

<style lang="less" scoped>
  .tree-table{
    margin-top: 10px;
  }
  .expandTrigger {
    width: 100%;
    height: 100px;
  }
</style>
