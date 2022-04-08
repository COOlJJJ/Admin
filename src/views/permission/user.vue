<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- gutter列间距 row行 col列 :span列宽 -->
      <el-row :gutter="20" style="margin-bottom: 30px">
        <el-col :span="7">
          <!-- placeholder 默认提示 @clear绑定获取用户信息事件-->
          <el-input
            @clear="getUserList"
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
          >
            <el-button
              @click="getUserList"
              icon="el-icon-search"
              slot="append"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible = true" type="primary"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 border边框线 stripe斑马线 type="index"索引列-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="账号" prop="account"></el-table-column>
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <!-- <el-table-column label="电话" prop="mobile_phone"></el-table-column> -->
        <el-table-column label="角色" prop="roles"></el-table-column>
        <el-table-column label="备注" prop="reMark"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 slot-scope接收作用域数据 .row接收当前行数据 -->
          <template slot-scope="scope">
            <!-- switch开关 v-model双向绑定数据 Num不支持貌似有Bug 使用string类型 -->
            <el-switch
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChanged(scope.row)"
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              @click="showEditDialog(scope.row)"
              icon="el-icon-edit"
              size="mini"
              type="primary"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              @click="removeUserById(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
              type="danger"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              :enterable="false"
              content="分配角色"
              effect="dark"
              placement="top-start"
            >
              <el-button
                @click="showGiveRoleDialog(scope.row)"
                icon="el-icon-setting"
                size="mini"
                type="warning"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- @size-change事件绑定  layout界面组件 取当前页和每页显示条数来取对应的数据-->
      <div style="margin-top: 20px">
        <el-pagination
          :current-page="queryInfo.pagenum"
          :page-size="queryInfo.pagesize"
          :page-sizes="[1, 2, 5, 10]"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 这是下拉框选择组件 v-model双向绑定数据将选中的值保存 label显示的名称 value记录真正的值 一般key和value使用ID -->
    <!-- <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>-->
    <!-- 联级子菜单 options数据源  Id值绑定 props配置对象 v-model数据应该是个数组-->
    <!-- <el-cascader
    expandTrigger: 'hover' 
      :options="options"
      :props="cateProps"
      @change="handleChange"
      v-model="value"
    ></el-cascader>-->

    <!-- 添加用户的对话框 visible.sync控制显示和隐藏的Bool -->
    <el-dialog
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
      title="添加用户"
      width="35%"
    >
      <!-- 内容主体区域 ：model绑定addForm中 v-model绑定表单的数据项=》addForm prop验证规则的属性-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        label-width="70px"
        ref="addFormRef"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="addForm.account"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 slot="footer" 可以理解为内容插槽 被设置Dom的位置 footer为底部-->
      <span class="dialog-footer" slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addUser" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      title="修改用户"
      width="35%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
        ref="editFormRef"
      >
        <el-form-item label="账号" prop="account">
          <el-input disabled v-model="editForm.account"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <!-- <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱" prop="email">
          <el-input disabled v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button @click="editUser()" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配用户角色的对话框 -->
    <el-dialog
      :visible.sync="giveDialogVisible"
      @close="giveDialogClosed"
      title="分配角色"
      width="35%"
    >
      <el-form :model="giveForm" label-width="100px" ref="giveFormRef">
        <el-form-item label="当前账号:">
          <span>{{ giveForm.account }}</span>
        </el-form-item>
        <el-form-item label="当前用户:">
          <span>{{ giveForm.username }}</span>
        </el-form-item>
        <el-form-item label="当前角色:">
          <span>{{ giveForm.roles }} </span>
        </el-form-item>
        <el-form-item label="分配新角色:">
          <el-select
            multiple
            v-model="giveForm.newrole"
            collapse-tags
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in rolelist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="giveDialogVisible = false">取 消</el-button>
        <el-button @click="giveRole()" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getUserList, addUser, editUser, changeStatus, deleteUser, giveRoles } from '@/api/user'
import { getRoleList } from '@/api/role'
import { param } from '@/utils'


export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (regEmail.test(value)) {
        // 合法
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '', //查询参数
        pagenum: 1, //当前页数
        pagesize: 5 //当前每页显示条数
      },
      userlist: [],
      rolelist: [],
      total: 0,
      // 控制是否显示添加用户对话框
      addDialogVisible: false,
      // 控制是否显示修改用户对话框
      editDialogVisible: false,
      //控制是否显示分配用户角色对话框
      giveDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        account: '',
        username: '',
        password: '',
        email: '',
        remark: ''
      },
      // 修改用户的表单数据
      editForm: {
        account: '',
        userid: '',
        username: '',
        email: '',
        remark: ''
      },
      //给用户分配角色
      giveForm: {
        userid: '',
        account: '',
        username: '',
        roles: '',
        newrole: []
      },
      // 级联器配置对象
      // cateProps: {
      //   value: 'cat_id', 
      //   label: 'cat_name',
      //   children: 'children'
      // },
      // 添加用户表单的验证规则对象
      addFormRules: {
        // 验证用户名是否合法
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        //  验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        // mobile: [
        //   {
        //     required: true,
        //     message: '请输入手机号',
        //     trigger: 'blur'
        //   },
        //   {
        //     validator: checkMobile,
        //     trigger: 'blur'
        //   }
        // ]
      },
      // 编辑信息验证规则
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        // mobile: [
        //   {
        //     required: true,
        //     message: '请输入手机号',
        //     trigger: 'blur'
        //   },
        //   {
        //     validator: checkMobile,
        //     trigger: 'blur'
        //   }
        // ]
      }
    }
  },
  created() {
    this.getUserList()
    this.getRoleList()
  },
  methods: {
    //获取角色列表信息
    async getRoleList() {
      const res = await getRoleList()
      this.rolelist = res.response
    },
    //获取用户信息
    async getUserList() {
      const res = await getUserList(this.queryInfo)
      this.userlist = res.response.userList
      this.total = res.response.totalpage
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList() //最新数据
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList() //最新数据
    },
    //监听 switch开关状态的改变
    async userStateChanged(userinfo) {
      const res = await changeStatus(
        {
          //这是get请求传参方法 其中参数还是动态的 需要用反引号 
          userid: `${userinfo.id}`, //使用反引号 动态参数拼接
          status: `${userinfo.status}`
        }
      )
      if (res.status == 201) {
        // userinfo.status = !userinfo.status //失败的话就返回之前的结果 用于bool
        if (userinfo.status == '1') {
          userinfo.status = '0'
        } else {
          userinfo.status = '1'
        }
        return this.$message.error('更新用户状态失败!')
      }
      this.$message.success('更新用户状态成功!')
    },
    // 监听添加用户对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields() //表单重置
    },
    // 监听添加用户对话框关闭事件
    giveDialogClosed() {
      this.giveForm.newrole = 0
    },
    // 点击按钮,添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) {
          return
        }
        //发起添加用户的网路请求 post请求返回promise对象 简化promise操作 解构data属性重命名为Res
        console.log(this.addForm);
        const res = await addUser(this.addForm)
        this.$message.success('添加成功')

        //隐藏添加用户对话框
        this.addDialogVisible = false
        //刷新列表 重新调用getUserList
        this.getUserList()
      })
    },
    // 显示编辑用户对话框 这边直接使用页面的本地数据 请求数据库可以保证数据的时效性
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editForm.userid = row.id
      this.editForm.account = row.account
      this.editForm.username = row.userName
      this.editForm.email = row.email
      this.editForm.remark = row.reMark
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUser() {
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) {
          return
        }
        const res = await editUser(this.editForm)
        this.$message.success('修改成功')
        //隐藏添加用户对话框
        this.editDialogVisible = false
        //刷新列表 重新调用getUserList
        this.getUserList()
      })
    },
    // 根据用户删除对应的用户 弹框全局可用
    async removeUserById(id) {
      const result = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      // 如果用户点击确认贼返回字符串 confirm
      // cancel 取消删除
      if (result !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      //发起修改用户的网路请求 post请求返回promise对象 简化promise操作 解构data属性重命名为Res
      const res = await deleteUser(id)
      this.$message.success('删除成功')
      //刷新列表 重新调用getUserList
      this.getUserList()
    },
    //显示分配角色对话框
    showGiveRoleDialog(row) {
      this.giveForm.userid = row.id
      this.giveForm.account = row.account
      this.giveForm.username = row.userName
      this.giveForm.roles = row.roles
      this.giveDialogVisible = true
    },
    //分配角色
    async giveRole() {
      const res = await giveRoles({ userid: this.giveForm.userid, newrole: this.giveForm.newrole })
      this.$message.success('分配角色成功')
      this.getUserList()
      //关闭对话框
      this.giveDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>