import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/users/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}

export function fetchList(params) {
  return request({
    url: '/users/page',
    method: 'get',
    params
  })
}

export function addUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}


export function editUser(userNum, data) {
  return request({
    url: `/users/${userNum}`,
    method: 'put',
    data
  })
}


export function fetchUser(param) {
  return request({
    url: `/users/${param}`,
    method: 'get'
  })
}

export function removeUser(data) {
  console.log(data, '$$$$')
  return request({
    url: '/users',
    method: 'delete',
    data
  })
}

export function fetchOrgList() {
  return request({
    url: '/orgs/list',
    method: 'get'
  })
}


export function fetchUserRole(userNum) {
  return request({
    url: `/users/roles/${userNum}`,
    method: 'get'
  })
}


export function assignUserRole(userNum, data) {
  return request({
    url: `/users/roles/${userNum}`,
    method: 'post',
    data
  })
}