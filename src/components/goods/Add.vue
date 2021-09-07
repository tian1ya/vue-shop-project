<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="消息提示的" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addRules"
        ref="ruleFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- v-model 和 name 和 activeIndex 绑定 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="tabsBeforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <!-- prop="goods_cates" -->
            <el-form-item label="商品分类" prop="goods_cates">
              <el-cascader
                v-model="addForm.goods_cates"
                :options="cateList"
                :props="{ expandTrigger: 'hover', label:'cat_name', value:'cat_id', children:'children' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyParamsData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="v" v-for="(v,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyParamsData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals" :disabled="true"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 
              action: 图片要上传到的后台api 地址，这里发送请求并没有使用 axios 发送请求，因为会报 token 问题
                而在使用 axios 发送请求的时候拦截器会拦截并将 token 塞进去
                所以需要 headers 塞进去 token
              on-preview: 指定预览业务逻辑（点击文件列表中已上传的文件时的钩子）
              on-remove: 移除图片的操作
              file-list: 指定文件列表
              list-type： 指定当前预览组件的呈现方式，picture 表示缩略图
              on-success: 图片上传成功回调函数
            -->
            <el-upload
              :action="uploadURL"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="onSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addGoods" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="previewPathVisible" width="50%" >
      <img :src="previewPath" alt="" class="preview">
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  methods: {
    tabsBeforeLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cates.length !== 3) {
        this.$message.error("切换失败，请先选择商品分类");
        return false;
      }
      return true;
    },
    handleChange() {
      console.log(this.addForm.goods_cates);
      if (this.addForm.goods_cates.length !== 3) {
        this.addForm.goods_cates = [];
      }
    },
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.eror("获取列表失败");
      }

      this.cateList = res.data;
    },
    async tabClicked() {
      console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.eror("获取动态参数失败");
        }
        this.manyParamsData = res.data;
        this.manyParamsData.forEach(item => {
          if (item.attr_vals !== "") {
            item.attr_vals = item.attr_vals.split(" ");
          } else {
            item.attr_vals = [];
          }
        });
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.eror("获取动态参数失败");
        }
        this.onlyParamsData = res.data;
      }
    },
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      console.log(this.previewPath)
      this.previewPathVisible = true
    },
    handleRemove(file, fileList) {
      // file 将要被移除的图片信息
      /*
        file 中的信息又 name、raw、response(上传成功时候返回的那个response)
      */
      let tempPath = file.response.data.tmp_path;
      let findIndex = this.addForm.pics.findIndex(x => x.pic === tempPath);
      this.addForm.pics.splice(findIndex, 1);
      console.log(this.addForm);
    },
    onSuccess(response, file, fileList) {
      let picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    addGood () {
      console.log(this.addForm)
      // this.$refs.ruleFormRef.validate(valid => {

      // })
    }
  },
  data() {
    return {
      previewPathVisible: false,
      previewPath: "",
      pics: [],
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      onlyParamsData: [],
      manyParamsData: [],
      cateList: [],
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_cates: [],
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        pics: [],
        goods_introduce:''
      },
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_cates: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cates.length === 3) {
        return this.addForm.goods_cates[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.preview {
  width: 100%;
}
.addGoods {
  margin-top: 5px;
}
</style>
