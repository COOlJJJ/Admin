import request from '@/utils/request'

//角色名
export function getRoleList() {
  return request({
    url: '/Role/GetAllRoles',
    method: 'get'
  })
}

//角色列表  
export function getRoles() {
  return request({
    url: '/Role/GetRoles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/Role/AddRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: `/Role/UpdateRole`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/Role/DeleteRole`,
    method: 'get',
    params: { id }
  })
}
