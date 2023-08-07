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
    ADDUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update',
    ALLROLEURL = '/admin/acl/user/toAssign/',
    SETROLE_url = '/admin/acl/user/doAssignRole',
    DELETEUSER_URL = '/admin/acl/user/remove/',
    DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

export const reqUserInfo = (current: number, pageSize: number, username: string) =>
    request.get<any, any>(API.ALLUSER_URL, { params: { current, pageSize, username } });

export const reqAddOrUpdateUser = (data: User) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATEUSER_URL, data)
    } else {
        return request.post<any, any>(API.ADDUSER_URL, data)
    }
}
export const reqAllRole = (userId: number) =>
    request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)

export const reqSetUserRole = (data: SetRoleData) =>
    request.post<any, any>(API.SETROLE_url, data)

export const reqRemoveUser = (userId: number) =>
    request.delete<any, any>(API.DELETEUSER_URL + userId)

export const reqSelectUser = (idList: number[]) =>
    request.delete(API.DELETEALLUSER_URL, { data: idList })
