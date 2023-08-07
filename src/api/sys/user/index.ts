import request from '@/util/request'
import type {
    UserResponseData,
    User,
    AllRoleResponseData,
    SetRoleData,
    ListParams
} from './type'

enum API {
    ALLUSER_URL = '/api/sys/user/list',
    ADDUSER_URL = '/api/sys/user/add',
    UPDATEUSER_URL = '/api/sys/user/update',
    ALLROLEURL = '/api/sys/role/list',
    SETROLE_url = '/admin/acl/user/doAssignRole',
    DELETEUSER_URL = '/api/sys/user/delete',
    DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
    ALLROLEBYUSER_URl = '/api/sys/role/byUserList'

}

export const reqUserInfo = (current: number, pageSize: number, username: string, phone: string, nickname: string, status: string, gender: string) =>
    request.get<any, any>(API.ALLUSER_URL, { params: { current, pageSize, username, phone, nickname, status, gender } });

export const reqAddOrUpdateUser = (data: User) => {
    if (data.id) {
        return request.post<any, any>(API.UPDATEUSER_URL, data)
    } else {
        return request.post<any, any>(API.ADDUSER_URL, data)
    }
}
export const reqAllRole = () =>
    request.get<any, any>(API.ALLROLEURL)

export const reqSetUserRole = (data: SetRoleData) =>
    request.post<any, any>(API.SETROLE_url, data)

export const reqRemoveUser = (data: number) =>
    request.post<any, any>(API.DELETEUSER_URL, data)

export const reqSelectUser = (idList: number[]) =>
    request.delete(API.DELETEALLUSER_URL, { data: idList })

export const reqMenuListByUser = (data: any) =>
    request.post<any, any>(API.ALLROLEBYUSER_URl, data)