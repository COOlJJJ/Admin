<template>
  <div class="dashboard-container">
    <!-- <component> + is 的骚操作
      只要在data里弄个变量，给变量赋值就能动态的切换组件。这个其实在某些场景还是非常好用的安利一下。
      根据当前角色切换不同的Dashboard
      -->
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
