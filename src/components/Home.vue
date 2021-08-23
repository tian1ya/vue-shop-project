<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse"> ||| </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          :unique-opened='true'
          :collapse='isCollapse'
          :collapse-transition='false'
        ><!--active-text-color： 点击之后高亮, unique-opened: 每次只展开一个页面 -->
          <el-submenu :index='item.id.toString()' v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class = 'iconsObj[item.id.toString()]'></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="ele.id.toString()" v-for="ele in item.children" :key="ele.id">
               <template slot="title">
                <i class ="el-icon-menu"></i>
                <span>{{ ele.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命周期函数，在加载这个组件的时候就会去执行该方法
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  },
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-lock_fill',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0ch; // 情况左 padding
  align-items: center; //？？？？？？？？
  color: #ffffff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center; // ???
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 5px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center; // ??????????
  letter-spacing: 0.2px;
  cursor: pointer; // 鼠标放上去就变成了小手
}
</style>
