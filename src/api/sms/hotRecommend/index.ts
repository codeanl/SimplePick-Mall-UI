import request from '@/util/request'
enum API {
    ALLhotRecommend_URL = '/api/sms/hotRecommend/list',
    DELETEhotRecommend_URL = '/api/sms/hotRecommend/delete',
    ADD_URL = '/api/sms/hotRecommend/add',
    UPDATE_URL = '/api/sms/hotRecommend/update',
}
export const reqhotRecommendList = (current: number, pageSize: number, status: string) =>
    request.get<any, any>(API.ALLhotRecommend_URL, { params: { current, pageSize, status } });

export const reqhotRecommendDel = (data: number) =>
    request.post<any, any>(API.DELETEhotRecommend_URL, data)

export const reqUpdate = (data: any) => {
    return request.post<any, any>(API.UPDATE_URL, data)
}
export const reqAdd = (data: any) => {
    return request.post<any, any>(API.ADD_URL, data)
}