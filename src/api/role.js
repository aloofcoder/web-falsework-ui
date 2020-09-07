import request from '@/utils/request'

export function fetchList(params) {
    return request({
        url: '/roles/page',
        method: 'get',
        params
    })
}

export function addRole(data) {
    return request({
        url: '/roles',
        method: 'post',
        data
    })
}


export function editRole(roleId, data) {
    return request({
        url: `/roles/${roleId}`,
        method: 'put',
        data
    })
}


export function fetchRole(param) {
    return request({
        url: `/roles/${param}`,
        method: 'get'
    })
}

export function removeRole(data) {
    return request({
        url: '/roles',
        method: 'delete',
        data
    })
}


export function fetchRoleMenu(param) {
    return request({
        url: `/roles/menus/${param}`,
        method: 'get'
    })
}