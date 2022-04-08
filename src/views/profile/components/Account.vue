<template>
  <el-form>
    <el-form-item label="Name">
      <el-input v-model.trim="user.name" disabled />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email" disabled />
    </el-form-item>
    <el-form-item label="New Password">
      <el-input type="password" v-model.trim="submituser.password" />
    </el-form-item>
    <el-form-item label="Confirm Password">
      <el-input type="password" v-model.trim="submituser.confpassword" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { changePassword } from '@/api/user'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          userid: '',
        }
      }
    }
  },
  data() {
    return {
      submituser: {
        userid: 0,
        password: '',
        password: ''
      }
    }
  },
  methods: {
    async submit() {
      if (this.submituser.password != this.submituser.confpassword) {
        return this.$message({
          message: 'check password again',
          type: 'error',
          duration: 5 * 1000
        })
      }
      this.submituser.userid = this.user.userid
      const res = await changePassword(this.submituser)
      if (res.status == 200) {
        this.submituser = {}
        this.$message({
          message: 'User password has been updated successfully',
          type: 'success',
          duration: 5 * 1000
        })
      } else {
        this.$message({
          message: 'Some thing wrong',
          type: 'error',
          duration: 5 * 1000
        })
      }

    }
  }
}
</script>
