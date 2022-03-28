1.侧边栏和路由是绑定在一起的,所以只需要在@/router/index.js 配置对应的路由即可,侧边栏就能动态的生成了。
2.侧边栏和路由是绑定的，权限这一块的思路就是，通过获取当前用户的权限去对比路由表,生成当前用户具有的权限可访问的路由表.
  可以理解为后端只需要返回一个Role 前端根据配置好的路由表就可以动态地展示侧边栏了
  而传统的思路是后端直接动态的返回侧边栏渲染
3.对于权限控制 前端不做可视化配置 直接在代码中控制权限与路由表  后端Api使用JWT特性控制接口权限
4.TypeError: Cannot read property 'version' of undefined  解决  npm install eslint
5.Syntax Error: TypeError: eslint.CLIEngine is not a constructor 删除package.json中 "@vue/cli-plugin-eslint": "4.4.4",
6.C:\Program Files\Git\cmd\git.EXE ls-remote -h -t ssh://git@github.com/sohee-lee7/Squire.git 删除package-lock.json中带有GitHub的链接地址 因为网络不通导致