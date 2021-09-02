<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert :closable="false" title="注意: 只允许为第三级分类提供相关参数" type="warning" show-icon></el-alert>

      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择分类的级联选择框 -->
          <el-cascader
            v-model="selectedCates"
            :options="cates"
            clearable
            :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name', children: 'children'}"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- activeTabName: 被激活页签的名称，默认第一个 -->
      <el-tabs v-model="activeTabName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisivale=true"
          >添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <!-- slot-scope="scope" -->
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisivale=true"
          >添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template>
                <!-- slot-scope="scope" -->
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!--  @closed="addCateDialogClosed" -->
    <el-dialog
      :title="'添加' + titleText"
      :visible="addDialogVisivale"
      width="40%"
      @close="addDialogClose"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisivale=false">取消</el-button>
        <el-button @click="addParams" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCates();
  },
  methods: {
    async getCates() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.cates = res.data;
      console.log(this.cates);
    },
    handleChange() {
      this.getCateProperties();
    },
    async getCateProperties() {
      if (this.selectedCates.length !== 3) {
        // 选中的不是三级分类
        this.selectedCates = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeTabName }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品属性失败");
      }

      if (this.activeTabName === "many") {
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      } else {
        this.onlyTableData = res.data;
        console.log(this.onlyTableData);
      }
      console.log(res);
    },
    handleClick() {
      this.getCateProperties();
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeTabName
          }
        );

        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addDialogVisivale = false;
        this.getCateProperties();
      });
    }
  },
  data() {
    return {
      selectedCates: [],
      cates: [],
      activeTabName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialogVisivale: false,
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      }
    };
  },
  /*
      模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。
      在模板中放入太多的逻辑会让模板过重且难以维护。
      计算属性只要函数体中依赖的内容发生变化，那么就会进行重新计算
  */
  computed: {
    isBtnDisabled() {
      if (this.selectedCates.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectedCates.length === 3) {
        return this.selectedCates[2];
      }
      return null;
    },
    titleText() {
      return this.activeTabName === "many" ? "动态参数" : "静态属性";
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
</style>
