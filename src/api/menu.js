import request from '@/utils/request'

export function fetchList(params) {
    return request({
        url: '/menus/page',
        method: 'get',
        params
    })
}

export function fetchTree(params) {
    return request({
        url: '/menus/tree',
        method: 'get',
        params
    })
}


export function addMenu(data) {
    return request({
        url: '/menus',
        method: 'post',
        data
    })
}


export function editMenu(id, data) {
    return request({
        url: `/menus/${id}`,
        method: 'put',
        data
    })
}


export function fetchMenu(param) {
    return request({
        url: `/menus/${param}`,
        method: 'get'
    })
}

export function removeMenu(data) {
    return request({
        url: '/menus',
        method: 'delete',
        data
    })
}


export function fetchMenuList() {
    return request({
        url: '/menus/list',
        method: 'get'
    })
}