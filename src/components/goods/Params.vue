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
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  v-for="(item, index) in props.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, props)"
                >{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                >
                  <!-- handleInputConfirm enter 键弹起触发 -->
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(props.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>shanchu
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
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  v-for="(item, index) in props.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, props)"
                >{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                >
                  <!-- handleInputConfirm enter 键弹起触发 -->
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(props.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  @click="removeParams(scope.row)"
                  icon="el-icon-delete"
                  size="mini"
                >删除</el-button>
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

    <el-dialog
      :title="'修改' + titleText"
      :visible="showEditDialogVisiable"
      width="40%"
      @close="editDialogClose"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialogVisiable=false">取消</el-button>
        <el-button @click="editParams" type="primary">确定</el-button>
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
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }

      // 内容合法，需要做后续的处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 新加的参数发起请求送到数据苦里面
    },
    handleClose(index, props) {
      // 从 propes 中找到 index 对应的选项，然后删除
      this.$message.success("删除标签成功");
    },
    showInput(row) {
      row.inputVisible = true;
      // 文本框自动获得焦点
      // nextTick: 方法作用，当页面上的元素被重新渲染之后，才会会回调
      // 函数中的方法
      // this.$refs.saveTagInput.$refs.input.focus(); 元素获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm,
            attr_sel: this.activeTabName
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("更新参数失败");
        }
        this.$message.success("更新参数成功");
      });
      this.showEditDialogVisiable = false;
      this.getCateProperties();
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    async showEditDialog(row) {
      let attrId = row.attr_id;
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          params: {
            attr_sel: this.activeTabName
          }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }

      console.log(res);
      this.editForm = res.data;
      this.showEditDialogVisiable = true;
    },
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
        this.manyTableData = [];
        this.onlyTableData = [];
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
      res.data.forEach(ele => {
        if (ele.attr_vals !== "") ele.attr_vals = ele.attr_vals.split(" ");
        //每一行数据又一个自己的数据绑定
        ele.inputVisible = false;
        ele.inputValue = "";
      });

      if (this.activeTabName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
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

        if (res.meta.status !== 200) {
          return this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addDialogVisivale = false;
        this.getCateProperties();
      });
    },
    async removeParams(row) {
      const configmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        // .then(() => {
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   });
        // })
        .catch(error => error);

      if (configmResult !== "confirm") {
        return this.$message.success("已取消删除");
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${row.attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败");
      }
      this.addDialogVisivale = false;
      this.getCateProperties();
      this.$message.success("删除参数成功");
    }
  },
  data() {
    return {
      editForm: {
        attr_name: ""
      },
      showEditDialogVisiable: false,
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
      },
      editFormRules: {
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
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
