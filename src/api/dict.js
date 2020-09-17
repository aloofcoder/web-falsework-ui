import request from '@/utils/request'

export function fetchList(params) {
    return request({
        url: '/dicts/page',
        method: 'get',
        params
    })
}

export function addDict(data) {
    return request({
        url: '/dicts',
        method: 'post',
        data
    })
}


export function editDict(id, data) {
    return request({
        url: `/dicts/${id}`,
        method: 'put',
        data
    })
}


export function fetchDict(param) {
    return request({
        url: `/dicts/${param}`,
        method: 'get'
    })
}

export function removeDict(data) {
    return request({
        url: '/dicts',
        method: 'delete',
        data
    })
}


export function fetchDictList(params) {
    return request({
        url: '/dicts/list',
        method: 'get',
        params
    })
}