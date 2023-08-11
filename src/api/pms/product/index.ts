
import request from '@/util/request'
enum API {
    All_URL = '/api/pms/product/list',
    ADD_URL = '/api/pms/product/add',
    UPDATE_URL = '/api/pms/product/update',
    DELETE_URL = '/api/pms/product/delete',

    SKULIST_URL = '/api/pms/sku/list',
    UPDATESKU_URL = '/api/pms/sku/delete',
}


export const reqAllProduct = (current: number, pageSize: number) =>
    request.get<any, any>(API.All_URL, { params: { current, pageSize } });


export const reqAddOrUpdate = (data: any) => {
    if (data.id) {
        return request.post<any, any>(API.UPDATE_URL, data)
    } else {
        return request.post<any, any>(API.ADD_URL, data)
    }
}

export const reqRemove = (data: number) =>
    request.post<any, any>(API.DELETE_URL, data)

export const reqSku = (data: any) =>
    request.post<any, any>(API.SKULIST_URL, data)

export const reqRemoveSKU = (data: number) =>
    request.post<any, any>(API.UPDATESKU_URL, data)