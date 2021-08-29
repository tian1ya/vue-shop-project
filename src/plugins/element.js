import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  menu,
  submenu,
  menuItemGroup,
  menuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(menu)
Vue.use(submenu)
Vue.use(menuItemGroup)
Vue.use(menuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
// Vue.prototype.$message = Message
// 和上面的不同，这里需要做全局挂在到 Vue 的全局对象上
Vue.prototype.$message = function (msg) {
  return Message({
    message: msg,
    duration: 3000
  })
}
Vue.prototype.$message.success = function (msg) {
  return Message({
    message: msg,
    duration: 500,
    type: 'success'
  })
}
Vue.prototype.$message.error = function (msg) {
  return Message({
    message: msg,
    duration: 500,
    type: 'error'
  })
}
Vue.prototype.$confirm = MessageBox.confirm
