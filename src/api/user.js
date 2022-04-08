import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/Login/Login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/Login/GetUserInfo',
    method: 'get',
    params: { token }
  })
}

export function getUserList(queryinfo) {
  return request({
    url: '/User/GetUserList',
    method: 'get',
    params: { ...queryinfo }
  })
}

export function addUser(data) {
  return request({
    url: '/User/AddUser',
    method: 'post',
    data,
  })
}

export function editUser(data) {
  return request({
    url: '/User/EditUser',
    method: 'post',
    data,
  })
}
export function changeStatus(status) {
  return request({
    url: '/User/ChangeStatus',
    method: 'get',
    params: { ...status },
  })
}

export function deleteUser(userid) {
  return request({
    url: '/User/DeleteUser',
    method: 'get',
    params: { userid },
  })
}

export function giveRoles(data) {
  return request({
    url: '/User/GiveRoles',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/User/UpdatePassword',
    method: 'post',
    data
  })
}