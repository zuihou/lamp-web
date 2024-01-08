import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LogoutParams, LoginResultModel, GetUserInfoModel } from './model/userModel';
import { ContentTypeEnum } from '/@/enums/httpEnum';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  getEmployeeById = '/oauth/anyone/getEmployeeById',
  Login = '/oauth/anyTenant/login',
  Logout = '/oauth/anyUser/logout',
  LoadCaptcha = '/oauth/anyTenant/captcha',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
      withTenant: false,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfoById(employeeId?: string) {
  return defHttp.get<GetUserInfoModel>(
    {
      url: Api.getEmployeeById,
      params: { employeeId },
    },
    { errorMessageMode: 'none' },
  );
}

/**
 * @description: 加载验证码
 */
export function loadCaptcha(key: String) {
  return defHttp.request(
    {
      url: Api.LoadCaptcha,
      method: 'GET',
      responseType: 'arraybuffer',
      params: { key: key },
    },
    { isTransformResponse: false },
  );
}

/**
 * @description: user logout api
 */
export function doLogout(params: LogoutParams) {
  return defHttp.post<boolean>({
    url: Api.Logout,
    params,
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
