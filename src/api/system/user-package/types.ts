// /**
//  * 登录用户信息
//  */
// export interface UserInfo {
//   userId?: number;
//   username?: string;
//   nickname?: string;
//   avatar?: string;
//   roles: string[];
//   perms: string[];
// }

/**
 * 用户查询对象类型
 */
export interface PkgDetailQuery extends PageQuery {
  keywords?: string;
  status?: number;
  pkgId?: number;
}

/**
 * dtail分页对象
 */
export interface PkgDetailPageVO {
  /**
   * 用户头像地址
   */
  id?: number;

  /**
   * pkgId
   */
  pkgId?: number;

  /**
   * pkgName
   */
  pkgName?: string;

  /**
   * pkgId
   */
  itemId?: number;

  /**
   * pkgName
   */
  itemName?: string;

  /**
   * 所属用户名
   */
  username?: string;

  /**
   * comment
   */
  comment?: string;

  /**
   * 创建时间
   */
  createTime?: Date;

  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;
}

/**
 * 用户表单类型
 */
export interface PkgDetailForm {
  /**
   * 用户头像地址
   */
  id?: number;

  /**
   * pkgId
   */
  pkgId?: number;

  /**
   * pkgName
   */
  pkgName?: string;

  /**
   * pkgId
   */
  itemId?: number;

  /**
   * pkgName
   */
  itemName?: string;

  /**
   * itemPrice
   */
  itemPrice?: number;

  /**
   * 所属用户名
   */
  username?: string;

  /**
   * comment
   */
  comment?: string;

  /**
   * 创建时间
   */
  createTime?: Date;

  /**
   * 用户状态(1:启用;0:禁用)
   */
  status?: number;
}
