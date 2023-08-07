
import request from '@/util/request'
import type { RoleResponseData, RoleData, MenuResponseData } from './type'

enum API {
  ALLROLE_URL = '/api/sys/role/list',
  ADDROLE_URL = '/api/sys/role/add',
  UPDATEROLE_URL = '/api/sys/role/update',
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  REMOVEROLE_URL = '/api/sys/role/delete',
}

export const reqAllRoleList = (current: number, pageSize: number, name: string) =>
  request.get<any, any>(API.ALLROLE_URL, { params: { current, pageSize, name } });

export const reqAddOrUpdateRole = (data: any) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)

export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )

export const reqRemoveRole = (data: any) =>
  request.post<any, any>(API.REMOVEROLE_URL, data)
