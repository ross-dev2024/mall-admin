import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PkgDetailPageVO, PkgDetailQuery } from "./types";

const URL = import.meta.env.VITE_API_YOULAI_SYSTEM + "/pkg";

// /**
//  * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
//  */
// export function getUserInfoApi(): AxiosPromise<UserInfo> {
//   return request({
//     url: "${URL}/users/me",
//     method: "get",
//   });
// }

/**
 * 包裹详细
 *
 * @param queryParams
 */
export function getDetailPage(
  queryParams: PkgDetailQuery
): AxiosPromise<PageResult<PkgDetailPageVO[]>> {
  // console.log(`${URL}/pages`);
  return request({
    url: `${URL}/detail/pages`,
    method: "get",
    params: queryParams,
  });
}

// /**
//  * 获取用户表单详情
//  *
//  * @param userId
//  */
// export function getUserForm(userId: number): AxiosPromise<PkgDetailForm> {
//   return request({
//     url: "/youlai-system/api/v1/users/" + userId + "/form",
//     method: "get",
//   });
// }

/**
 * 添加item
 *
 * @param data
 */
export function addItem(data: any) {
  return request({
    url: "${URL}/detail/",
    method: "post",
    data: data,
  });
}

// /**
//  * 修改用户
//  *
//  * @param id
//  * @param data
//  */
// export function updateUser(id: number, data: PkgDetailForm) {
//   return request({
//     url: "/youlai-system/api/v1/users/" + id,
//     method: "put",
//     data: data,
//   });
// }

/**
 * 修改用户状态
 *
 * @param id
 * @param status
 */
export function updateItem(id: number, status: number) {
  return request({
    url: "/youlai-system/api/v1/users/" + id + "/status",
    method: "patch",
    params: { status: status },
  });
}

// /**
//  * 修改用户密码
//  *
//  * @param id
//  * @param password
//  */
// export function updateUserPassword(id: number, password: string) {
//   return request({
//     url: "/youlai-system/api/v1/users/" + id + "/password",
//     method: "patch",
//     params: { password: password },
//   });
// }

/**
 * 删除用户
 *
 * @param ids
 */
export function deleteItem(ids: string) {
  return request({
    url: "/youlai-system/api/v1/users/" + ids,
    method: "delete",
  });
}

// /**
//  * 下载用户导入模板
//  *
//  * @returns
//  */
// export function downloadTemplateApi() {
//   return request({
//     url: "/youlai-system/api/v1/users/template",
//     method: "get",
//     responseType: "arraybuffer",
//   });
// }

// /**
//  * 导出用户
//  *
//  * @param queryParams
//  * @returns
//  */
// export function exportUser(queryParams: UserQuery) {
//   return request({
//     url: "/youlai-system/api/v1/users/export",
//     method: "get",
//     params: queryParams,
//     responseType: "arraybuffer",
//   });
// }
//
// /**
//  * 导入用户
//  *
//  * @param file
//  */
// export function importUser(deptId: number, file: File) {
//   const formData = new FormData();
//   formData.append("file", file);
//   return request({
//     url: "/youlai-system/api/v1/users/import",
//     method: "post",
//     params: { deptId: deptId },
//     data: formData,
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// }
