
/* 
1、messagee、MessageBox不需要使用Vue.use注册
但需挂载到Vue.prototype(Vue原型对象上)
*/

import Vue from 'vue';
import { Aside, Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Dialog, Form, FormItem, Header, Input, Main, Menu, MenuItem, MenuItemGroup, Message, MessageBox, Pagination, Row, Submenu, Switch, Table, TableColumn, Tooltip, Tag, Tree, Select, Option, Cascader, Alert, Tabs, TabPane } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
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
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm