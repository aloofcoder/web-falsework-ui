import request from '@/utils/request'

export function fetchList(params) {
    return request({
        url: '/orgs/page',
        method: 'get',
        params
    })
}

export function addOrg(data) {
    return request({
        url: '/orgs',
        method: 'post',
        data
    })
}


export function editOrg(id, data) {
    return request({
        url: `/orgs/${id}`,
        method: 'put',
        data
    })
}


export function fetchOrg(param) {
    return request({
        url: `/orgs/${param}`,
        method: 'get'
    })
}

export function removeOrg(data) {
    return request({
        url: '/orgs',
        method: 'delete',
        data
    })
}
