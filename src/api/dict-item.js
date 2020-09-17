import request from '@/utils/request'

export function fetchList(params) {
    return request({
        url: '/dictItems/page',
        method: 'get',
        params
    })
}

export function addDictItem(data) {
    return request({
        url: '/dictItems',
        method: 'post',
        data
    })
}


export function editDictItem(id, data) {
    return request({
        url: `/dictItems/${id}`,
        method: 'put',
        data
    })
}


export function fetchDictItem(param) {
    return request({
        url: `/dictItems/${param}`,
        method: 'get'
    })
}

export function removeDictItem(data) {
    return request({
        url: '/dictItems',
        method: 'delete',
        data
    })
}
